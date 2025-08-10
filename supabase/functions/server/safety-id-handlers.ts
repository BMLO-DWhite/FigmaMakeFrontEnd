import { jsonResponse, parseBody, supabase } from './helpers.ts';
export async function handleGetSafetyIds(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('safety_ids').select(`
        *,
        users!user_id(id, first_name, last_name, email),
        editions!edition_id(id, name),
        companies!company_id(id, name)
      `);
    // Apply filters
    if (searchParams.get('user_id')) {
      query = query.eq('user_id', searchParams.get('user_id'));
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
    if (searchParams.get('rider_id')) {
      query = query.ilike('rider_id', `%${searchParams.get('rider_id')}%`);
    }
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;
    if (error) {
      console.error('Error fetching safety IDs:', error);
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
    console.error('Error in handleGetSafetyIds:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetSafetyId(safetyIdId) {
  try {
    const { data, error } = await supabase.from('safety_ids').select(`
        *,
        users!user_id(id, first_name, last_name, email, phone),
        editions!edition_id(id, name),
        companies!company_id(id, name),
        safety_id_orders:order_id(id, order_number, status)
      `).eq('id', safetyIdId).single();
    if (error) {
      console.error('Error fetching safety ID:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Safety ID not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleGetSafetyId:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleCreateSafetyId(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { rider_id, user_id, company_id, edition_id, order_id, print_batch_id, status, metadata } = body;
    if (!rider_id || !edition_id) {
      return jsonResponse({
        success: false,
        error: 'rider_id and edition_id are required'
      }, 400);
    }
    const { data, error } = await supabase.from('safety_ids').insert({
      rider_id,
      user_id,
      company_id,
      edition_id,
      order_id,
      print_batch_id,
      status: status || 'pending',
      metadata: metadata || {}
    }).select().single();
    if (error) {
      console.error('Error creating safety ID:', error);
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
    console.error('Error in handleCreateSafetyId:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateSafetyId(safetyIdId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { rider_id, user_id, company_id, status, metadata } = body;
    const { data, error } = await supabase.from('safety_ids').update({
      ...rider_id && {
        rider_id
      },
      ...user_id && {
        user_id
      },
      ...company_id && {
        company_id
      },
      ...status && {
        status
      },
      ...metadata && {
        metadata
      }
    }).eq('id', safetyIdId).select().single();
    if (error) {
      console.error('Error updating safety ID:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Safety ID not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateSafetyId:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleDeleteSafetyId(safetyIdId) {
  try {
    const { data, error } = await supabase.from('safety_ids').delete().eq('id', safetyIdId).select().single();
    if (error) {
      console.error('Error deleting safety ID:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Safety ID not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      message: 'Safety ID deleted successfully'
    });
  } catch (error) {
    console.error('Error in handleDeleteSafetyId:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleAssignSafetyId(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { safety_id, user_id } = body;
    if (!safety_id || !user_id) {
      return jsonResponse({
        success: false,
        error: 'safety_id and user_id are required'
      }, 400);
    }
    const { data, error } = await supabase.from('safety_ids').update({
      user_id,
      status: 'assigned',
      assigned_at: new Date().toISOString()
    }).eq('id', safety_id).eq('status', 'available').select().single();
    if (error) {
      console.error('Error assigning safety ID:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Safety ID not found or not available for assignment'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleAssignSafetyId:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleBulkCreateSafetyIds(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { count, edition_id, company_id, order_id, print_batch_id, prefix } = body;
    if (!count || !edition_id) {
      return jsonResponse({
        success: false,
        error: 'count and edition_id are required'
      }, 400);
    }
    const safetyIds = [];
    for(let i = 1; i <= count; i++){
      const rider_id = `${prefix || 'SID'}-${Date.now()}-${i.toString().padStart(4, '0')}`;
      safetyIds.push({
        rider_id,
        edition_id,
        company_id,
        order_id,
        print_batch_id,
        status: 'pending',
        metadata: {}
      });
    }
    const { data, error } = await supabase.from('safety_ids').insert(safetyIds).select();
    if (error) {
      console.error('Error bulk creating safety IDs:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    return jsonResponse({
      success: true,
      data,
      message: `Successfully created ${data?.length || 0} safety IDs`
    }, 201);
  } catch (error) {
    console.error('Error in handleBulkCreateSafetyIds:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleSearchSafetyIds(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const query = searchParams.get('q');
    if (!query) {
      return jsonResponse({
        success: false,
        error: 'Search query parameter "q" is required'
      }, 400);
    }
    const { data, error } = await supabase.from('safety_ids').select(`
        *,
        users!user_id(id, first_name, last_name, email),
        editions!edition_id(id, name),
        companies!company_id(id, name)
      `).or(`rider_id.ilike.%${query}%,id.eq.${query}`).limit(20);
    if (error) {
      console.error('Error searching safety IDs:', error);
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
    console.error('Error in handleSearchSafetyIds:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetSafetyIdOrders(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('safety_id_orders').select(`
        *,
        editions!edition_id(id, name),
        companies!company_id(id, name),
        users:created_by(id, first_name, last_name, email)
      `);
    // Apply filters
    if (searchParams.get('company_id')) {
      query = query.eq('company_id', searchParams.get('company_id'));
    }
    if (searchParams.get('edition_id')) {
      query = query.eq('edition_id', searchParams.get('edition_id'));
    }
    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status'));
    }
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1).order('created_at', {
      ascending: false
    });
    const { data, error, count } = await query;
    if (error) {
      console.error('Error fetching safety ID orders:', error);
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
    console.error('Error in handleGetSafetyIdOrders:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleCreateSafetyIdOrder(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { order_number, company_id, edition_id, quantity, unit_price, total_price, created_by, notes, metadata } = body;
    if (!order_number || !edition_id || !quantity) {
      return jsonResponse({
        success: false,
        error: 'order_number, edition_id, and quantity are required'
      }, 400);
    }
    const { data, error } = await supabase.from('safety_id_orders').insert({
      order_number,
      company_id,
      edition_id,
      quantity,
      unit_price,
      total_price,
      created_by,
      status: 'pending',
      notes,
      metadata: metadata || {}
    }).select().single();
    if (error) {
      console.error('Error creating safety ID order:', error);
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
    console.error('Error in handleCreateSafetyIdOrder:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateSafetyIdOrder(orderId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { status, notes, metadata } = body;
    const { data, error } = await supabase.from('safety_id_orders').update({
      ...status && {
        status
      },
      ...notes && {
        notes
      },
      ...metadata && {
        metadata
      }
    }).eq('id', orderId).select().single();
    if (error) {
      console.error('Error updating safety ID order:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Safety ID order not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateSafetyIdOrder:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetSafetyIdPrintBatches(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('safety_id_print_batches').select(`
        *,
        safety_id_orders:order_id(id, order_number),
        editions!edition_id(id, name),
        users!created_by(id, first_name, last_name, email)
      `);
    // Apply filters
    if (searchParams.get('order_id')) {
      query = query.eq('order_id', searchParams.get('order_id'));
    }
    if (searchParams.get('edition_id')) {
      query = query.eq('edition_id', searchParams.get('edition_id'));
    }
    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status'));
    }
    query = query.order('created_at', {
      ascending: false
    });
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching safety ID print batches:', error);
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
    console.error('Error in handleGetSafetyIdPrintBatches:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleCreateSafetyIdPrintBatch(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { batch_name, order_id, edition_id, quantity, created_by, print_settings, metadata } = body;
    if (!batch_name || !edition_id || !quantity) {
      return jsonResponse({
        success: false,
        error: 'batch_name, edition_id, and quantity are required'
      }, 400);
    }
    const { data, error } = await supabase.from('safety_id_print_batches').insert({
      batch_name,
      order_id,
      edition_id,
      quantity,
      created_by,
      status: 'pending',
      print_settings: print_settings || {},
      metadata: metadata || {}
    }).select().single();
    if (error) {
      console.error('Error creating safety ID print batch:', error);
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
    console.error('Error in handleCreateSafetyIdPrintBatch:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGeneratePrintBatchCsv(batchId) {
  try {
    const { data: batch, error: batchError } = await supabase.from('safety_id_print_batches').select('*').eq('id', batchId).single();
    if (batchError || !batch) {
      return jsonResponse({
        success: false,
        error: 'Print batch not found'
      }, 404);
    }
    const { data: safetyIds, error: safetyIdsError } = await supabase.from('safety_ids').select(`
        *,
        users!user_id(first_name, last_name, email, phone)
      `).eq('print_batch_id', batchId);
    if (safetyIdsError) {
      console.error('Error fetching safety IDs for batch:', safetyIdsError);
      return jsonResponse({
        success: false,
        error: safetyIdsError.message
      }, 500);
    }
    const csvHeaders = [
      'Rider ID',
      'User Name',
      'Email',
      'Phone',
      'Status',
      'Created At'
    ];
    const csvRows = safetyIds?.map((sid)=>[
        sid.rider_id,
        sid.users ? `${sid.users.first_name} ${sid.users.last_name}` : '',
        sid.users?.email || '',
        sid.users?.phone || '',
        sid.status,
        sid.created_at
      ]) || [];
    const csvContent = [
      csvHeaders,
      ...csvRows
    ].map((row)=>row.map((field)=>`"${field}"`).join(',')).join('\n');
    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="safety-ids-batch-${batch.batch_name}.csv"`,
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error in handleGeneratePrintBatchCsv:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}