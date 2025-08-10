import { jsonResponse, parseBody, supabase } from './helpers.ts';
export async function handleGetNotes(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('notes').select(`
        *,
        users!created_by(id, first_name, last_name, email),
        companies!company_id(id, name),
        editions!edition_id(id, name),
        note_tag_assignments(
          id,
          note_tags!tag_id(id, name, color)
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
    if (searchParams.get('is_private')) {
      query = query.eq('is_private', searchParams.get('is_private') === 'true');
    }
    if (searchParams.get('search')) {
      const searchTerm = searchParams.get('search');
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1).order('created_at', {
      ascending: false
    });
    const { data, error, count } = await query;
    if (error) {
      console.error('Error fetching notes:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
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
    console.error('Error in handleGetNotes:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetNote(noteId) {
  try {
    const { data, error } = await supabase.from('notes').select(`
        *,
        users!created_by(id, first_name, last_name, email, phone),
        companies!company_id(id, name),
        editions!edition_id(id, name),
        note_tag_assignments(
          id,
          note_tags!tag_id(id, name, color, description)
        )
      `).eq('id', noteId).single();
    if (error) {
      console.error('Error fetching note:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Note not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleGetNote:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleCreateNote(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { title, content, is_private, requires_pin, pin_hash, created_by, company_id, edition_id, accessible_by_delegates, delegate_permissions, metadata, tags } = body;
    if (!title || !content || !created_by || !edition_id) {
      return jsonResponse({
        success: false,
        error: 'title, content, created_by, and edition_id are required'
      }, 400);
    }
    const { data: note, error: noteError } = await supabase.from('notes').insert({
      title,
      content,
      is_private: is_private || false,
      requires_pin: requires_pin || false,
      pin_hash,
      created_by,
      company_id,
      edition_id,
      accessible_by_delegates: accessible_by_delegates !== false,
      delegate_permissions: delegate_permissions || {},
      status: 'active',
      metadata: metadata || {}
    }).select().single();
    if (noteError) {
      console.error('Error creating note:', noteError);
      return jsonResponse({
        success: false,
        error: noteError.message
      }, 500);
    }
    if (tags && tags.length > 0) {
      const tagAssignments = tags.map((tagId)=>({
          note_id: note.id,
          tag_id: tagId,
          assigned_by: created_by
        }));
      const { error: tagsError } = await supabase.from('note_tag_assignments').insert(tagAssignments);
      if (tagsError) {
        console.error('Error assigning tags to note:', tagsError);
      }
    }
    return jsonResponse({
      success: true,
      data: note
    }, 201);
  } catch (error) {
    console.error('Error in handleCreateNote:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateNote(noteId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { title, content, is_private, requires_pin, pin_hash, accessible_by_delegates, delegate_permissions, status, metadata } = body;
    const { data, error } = await supabase.from('notes').update({
      ...title && {
        title
      },
      ...content && {
        content
      },
      ...is_private !== undefined && {
        is_private
      },
      ...requires_pin !== undefined && {
        requires_pin
      },
      ...pin_hash !== undefined && {
        pin_hash
      },
      ...accessible_by_delegates !== undefined && {
        accessible_by_delegates
      },
      ...delegate_permissions && {
        delegate_permissions
      },
      ...status && {
        status
      },
      ...metadata && {
        metadata
      }
    }).eq('id', noteId).select().single();
    if (error) {
      console.error('Error updating note:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Note not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateNote:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleDeleteNote(noteId) {
  try {
    const { data, error } = await supabase.from('notes').delete().eq('id', noteId).select().single();
    if (error) {
      console.error('Error deleting note:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Note not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Error in handleDeleteNote:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleShareNote(noteId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { delegate_ids, permissions, message } = body;
    if (!delegate_ids || !Array.isArray(delegate_ids) || delegate_ids.length === 0) {
      return jsonResponse({
        success: false,
        error: 'delegate_ids array is required'
      }, 400);
    }
    const { data: note, error: noteError } = await supabase.from('notes').select('*').eq('id', noteId).single();
    if (noteError || !note) {
      return jsonResponse({
        success: false,
        error: 'Note not found'
      }, 404);
    }
    const updatedPermissions = {
      ...note.delegate_permissions
    };
    delegate_ids.forEach((delegateId)=>{
      updatedPermissions[delegateId] = {
        can_view: permissions?.can_view !== false,
        can_edit: permissions?.can_edit || false,
        shared_at: new Date().toISOString(),
        message: message || null
      };
    });
    const { data, error } = await supabase.from('notes').update({
      delegate_permissions: updatedPermissions,
      accessible_by_delegates: true
    }).eq('id', noteId).select().single();
    if (error) {
      console.error('Error sharing note:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    return jsonResponse({
      success: true,
      data,
      message: `Note shared with ${delegate_ids.length} delegate(s)`
    });
  } catch (error) {
    console.error('Error in handleShareNote:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetNoteTags(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('note_tags').select(`
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
    query = query.order('name', {
      ascending: true
    });
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching note tags:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    return jsonResponse({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error in handleGetNoteTags:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleCreateNoteTag(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { name, description, color, scope, edition_id, created_by } = body;
    if (!name || !edition_id || !created_by) {
      return jsonResponse({
        success: false,
        error: 'name, edition_id, and created_by are required'
      }, 400);
    }
    const { data, error } = await supabase.from('note_tags').insert({
      name,
      description,
      color: color || '#10B981',
      scope: scope || 'edition',
      edition_id,
      created_by
    }).select().single();
    if (error) {
      console.error('Error creating note tag:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    return jsonResponse({
      success: true,
      data
    }, 201);
  } catch (error) {
    console.error('Error in handleCreateNoteTag:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateNoteTag(tagId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { name, description, color } = body;
    const { data, error } = await supabase.from('note_tags').update({
      ...name && {
        name
      },
      ...description !== undefined && {
        description
      },
      ...color && {
        color
      }
    }).eq('id', tagId).select().single();
    if (error) {
      console.error('Error updating note tag:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Note tag not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateNoteTag:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleDeleteNoteTag(tagId) {
  try {
    const { data, error } = await supabase.from('note_tags').delete().eq('id', tagId).select().single();
    if (error) {
      console.error('Error deleting note tag:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Note tag not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      message: 'Note tag deleted successfully'
    });
  } catch (error) {
    console.error('Error in handleDeleteNoteTag:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleAssignNoteTags(noteId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { tag_ids, assigned_by } = body;
    if (!tag_ids || !Array.isArray(tag_ids) || !assigned_by) {
      return jsonResponse({
        success: false,
        error: 'tag_ids array and assigned_by are required'
      }, 400);
    }
    await supabase.from('note_tag_assignments').delete().eq('note_id', noteId);
    if (tag_ids.length > 0) {
      const assignments = tag_ids.map((tagId)=>({
          note_id: noteId,
          tag_id: tagId,
          assigned_by
        }));
      const { data, error } = await supabase.from('note_tag_assignments').insert(assignments).select(`
          *,
          note_tags(id, name, color)
        `);
      if (error) {
        console.error('Error assigning note tags:', error);
        return jsonResponse({
          success: false,
          error: error.message
        }, 500);
      }
      return jsonResponse({
        success: true,
        data
      });
    }
    return jsonResponse({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Error in handleAssignNoteTags:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleRemoveNoteTag(noteId, tagId) {
  try {
    const { data, error } = await supabase.from('note_tag_assignments').delete().eq('note_id', noteId).eq('tag_id', tagId).select().single();
    if (error) {
      console.error('Error removing note tag:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Tag assignment not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      message: 'Tag removed from note successfully'
    });
  } catch (error) {
    console.error('Error in handleRemoveNoteTag:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetNotesByTag(tagId, request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('note_tag_assignments').select(`
        notes(
          *,
          users!created_by(id, first_name, last_name, email),
          companies!company_id(id, name),
          editions!edition_id(id, name)
        )
      `).eq('tag_id', tagId);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;
    if (error) {
      console.error('Error fetching notes by tag:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    const notes = data?.map((item)=>item.notes).filter((note)=>note) || [];
    return jsonResponse({
      success: true,
      data: notes,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error in handleGetNotesByTag:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}