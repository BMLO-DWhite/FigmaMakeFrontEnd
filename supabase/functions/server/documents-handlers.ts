import { jsonResponse, parseBody, supabase } from './helpers.ts';

export async function handleGetDocuments(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    let query = supabase
      .from('documents')
      .select(`
        *,
        users!created_by(id, first_name, last_name, email),
        companies!company_id(id, name),
        editions!edition_id(id, name),
        document_tag_assignments(
          id,
          document_tags!tag_id(id, name, color)
        )
      `);

    // Apply filters
    if (searchParams.get('created_by')) {
      query = query.eq('created_by', searchParams.get('created_by'));
    }
    if (searchParams.get('company_id')) {
      query = query.eq('company_id', searchParams.get('company_id'));
    }
    if (searchParams.get('edition_id')) {
      query = query.eq('edition_id', searchParams.get('edition_id'));
    }
    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status'));
    }
    if (searchParams.get('file_type')) {
      query = query.eq('file_type', searchParams.get('file_type'));
    }
    if (searchParams.get('search')) {
      const searchTerm = searchParams.get('search');
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching documents:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error in handleGetDocuments:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleGetDocument(documentId) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        users!created_by(id, first_name, last_name, email, phone),
        companies!company_id(id, name),
        editions!edition_id(id, name),
        document_tag_assignments(
          id,
          document_tags!tag_id(id, name, color, description)
        )
      `)
      .eq('id', documentId)
      .single();

    if (error) {
      console.error('Error fetching document:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    if (!data) {
      return jsonResponse({ success: false, error: 'Document not found' }, 404);
    }

    return jsonResponse({ success: true, data });
  } catch (error) {
    console.error('Error in handleGetDocument:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleUploadDocument(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { 
      title, 
      description, 
      file_url, 
      file_type, 
      file_size,
      created_by, 
      company_id, 
      edition_id,
      expiration_date,
      requires_pin,
      pin_hash,
      view_pin_hash,
      accessible_by_delegates,
      delegate_permissions,
      metadata,
      tags 
    } = body;

    if (!title || !file_url || !created_by || !edition_id) {
      return jsonResponse({ 
        success: false, 
        error: 'title, file_url, created_by, and edition_id are required' 
      }, 400);
    }

    const { data: document, error: documentError } = await supabase
      .from('documents')
      .insert({
        title,
        description,
        file_url,
        file_type,
        file_size,
        created_by,
        company_id,
        edition_id,
        expiration_date,
        requires_pin: requires_pin || false,
        pin_hash,
        view_pin_hash,
        accessible_by_delegates: accessible_by_delegates !== false,
        delegate_permissions: delegate_permissions || {},
        status: 'active',
        metadata: metadata || {}
      })
      .select()
      .single();

    if (documentError) {
      console.error('Error creating document:', documentError);
      return jsonResponse({ success: false, error: documentError.message }, 500);
    }

    if (tags && tags.length > 0) {
      const tagAssignments = tags.map(tagId => ({
        document_id: document.id,
        tag_id: tagId,
        assigned_by: created_by
      }));

      const { error: tagsError } = await supabase
        .from('document_tag_assignments')
        .insert(tagAssignments);

      if (tagsError) {
        console.error('Error assigning tags to document:', tagsError);
      }
    }

    return jsonResponse({ success: true, data: document }, 201);
  } catch (error) {
    console.error('Error in handleUploadDocument:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleUpdateDocument(documentId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { 
      title, 
      description, 
      expiration_date,
      requires_pin,
      pin_hash,
      view_pin_hash,
      accessible_by_delegates,
      delegate_permissions,
      status,
      metadata 
    } = body;

    const { data, error } = await supabase
      .from('documents')
      .update({
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(expiration_date !== undefined && { expiration_date }),
        ...(requires_pin !== undefined && { requires_pin }),
        ...(pin_hash !== undefined && { pin_hash }),
        ...(view_pin_hash !== undefined && { view_pin_hash }),
        ...(accessible_by_delegates !== undefined && { accessible_by_delegates }),
        ...(delegate_permissions && { delegate_permissions }),
        ...(status && { status }),
        ...(metadata && { metadata })
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating document:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    if (!data) {
      return jsonResponse({ success: false, error: 'Document not found' }, 404);
    }

    return jsonResponse({ success: true, data });
  } catch (error) {
    console.error('Error in handleUpdateDocument:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleDeleteDocument(documentId) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)
      .select()
      .single();

    if (error) {
      console.error('Error deleting document:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    if (!data) {
      return jsonResponse({ success: false, error: 'Document not found' }, 404);
    }

    return jsonResponse({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error in handleDeleteDocument:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleDownloadDocument(documentId, request) {
  try {
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (documentError || !document) {
      return jsonResponse({ success: false, error: 'Document not found' }, 404);
    }

    if (document.requires_pin) {
      const body = await parseBody(request);
      const { pin } = body || {};
      
      if (!pin) {
        return jsonResponse({ 
          success: false, 
          error: 'PIN required to access this document' 
        }, 401);
      }

    }

    if (document.expiration_date && new Date(document.expiration_date) < new Date()) {
      return jsonResponse({ 
        success: false, 
        error: 'Document has expired' 
      }, 410);
    }

    return jsonResponse({ 
      success: true, 
      data: {
        download_url: document.file_url,
        filename: document.title,
        file_type: document.file_type,
        file_size: document.file_size
      }
    });
  } catch (error) {
    console.error('Error in handleDownloadDocument:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleShareDocument(documentId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { delegate_ids, permissions, message } = body;

    if (!delegate_ids || !Array.isArray(delegate_ids) || delegate_ids.length === 0) {
      return jsonResponse({ 
        success: false, 
        error: 'delegate_ids array is required' 
      }, 400);
    }

    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (documentError || !document) {
      return jsonResponse({ success: false, error: 'Document not found' }, 404);
    }

    const updatedPermissions = { ...document.delegate_permissions };
    delegate_ids.forEach(delegateId => {
      updatedPermissions[delegateId] = {
        can_view: permissions?.can_view !== false,
        can_download: permissions?.can_download !== false,
        shared_at: new Date().toISOString(),
        message: message || null
      };
    });

    const { data, error } = await supabase
      .from('documents')
      .update({
        delegate_permissions: updatedPermissions,
        accessible_by_delegates: true
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) {
      console.error('Error sharing document:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({ 
      success: true, 
      data,
      message: `Document shared with ${delegate_ids.length} delegate(s)`
    });
  } catch (error) {
    console.error('Error in handleShareDocument:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleGetDocumentTags(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    let query = supabase
      .from('document_tags')
      .select(`
        *,
        users!created_by(id, first_name, last_name),
        editions!edition_id(id, name)
      `);

    // Apply filters
    if (searchParams.get('edition_id')) {
      query = query.eq('edition_id', searchParams.get('edition_id'));
    }
    if (searchParams.get('scope')) {
      query = query.eq('scope', searchParams.get('scope'));
    }

    query = query.order('name', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching document tags:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error in handleGetDocumentTags:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleCreateDocumentTag(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { name, description, color, scope, edition_id, created_by } = body;

    if (!name || !edition_id || !created_by) {
      return jsonResponse({ 
        success: false, 
        error: 'name, edition_id, and created_by are required' 
      }, 400);
    }

    const { data, error } = await supabase
      .from('document_tags')
      .insert({
        name,
        description,
        color: color || '#3B82F6',
        scope: scope || 'edition',
        edition_id,
        created_by
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating document tag:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({ success: true, data }, 201);
  } catch (error) {
    console.error('Error in handleCreateDocumentTag:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleUpdateDocumentTag(tagId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { name, description, color } = body;

    const { data, error } = await supabase
      .from('document_tags')
      .update({
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(color && { color })
      })
      .eq('id', tagId)
      .select()
      .single();

    if (error) {
      console.error('Error updating document tag:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    if (!data) {
      return jsonResponse({ success: false, error: 'Document tag not found' }, 404);
    }

    return jsonResponse({ success: true, data });
  } catch (error) {
    console.error('Error in handleUpdateDocumentTag:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleDeleteDocumentTag(tagId) {
  try {
    const { data, error } = await supabase
      .from('document_tags')
      .delete()
      .eq('id', tagId)
      .select()
      .single();

    if (error) {
      console.error('Error deleting document tag:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    if (!data) {
      return jsonResponse({ success: false, error: 'Document tag not found' }, 404);
    }

    return jsonResponse({ success: true, message: 'Document tag deleted successfully' });
  } catch (error) {
    console.error('Error in handleDeleteDocumentTag:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleAssignDocumentTags(documentId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { tag_ids, assigned_by } = body;

    if (!tag_ids || !Array.isArray(tag_ids) || !assigned_by) {
      return jsonResponse({ 
        success: false, 
        error: 'tag_ids array and assigned_by are required' 
      }, 400);
    }

    await supabase
      .from('document_tag_assignments')
      .delete()
      .eq('document_id', documentId);

    if (tag_ids.length > 0) {
      const assignments = tag_ids.map(tagId => ({
        document_id: documentId,
        tag_id: tagId,
        assigned_by
      }));

      const { data, error } = await supabase
        .from('document_tag_assignments')
        .insert(assignments)
        .select(`
          *,
          document_tags(id, name, color)
        `);

      if (error) {
        console.error('Error assigning document tags:', error);
        return jsonResponse({ success: false, error: error.message }, 500);
      }

      return jsonResponse({ success: true, data });
    }

    return jsonResponse({ success: true, data: [] });
  } catch (error) {
    console.error('Error in handleAssignDocumentTags:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleRemoveDocumentTag(documentId, tagId) {
  try {
    const { data, error } = await supabase
      .from('document_tag_assignments')
      .delete()
      .eq('document_id', documentId)
      .eq('tag_id', tagId)
      .select()
      .single();

    if (error) {
      console.error('Error removing document tag:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    if (!data) {
      return jsonResponse({ success: false, error: 'Tag assignment not found' }, 404);
    }

    return jsonResponse({ success: true, message: 'Tag removed from document successfully' });
  } catch (error) {
    console.error('Error in handleRemoveDocumentTag:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}