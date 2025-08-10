import { jsonResponse, parseBody, supabase } from './helpers.ts';
export async function handleGetDelegates(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('delegates').select(`
        *,
        users!user_id(id, first_name, last_name, email),
        delegated_by_user:delegated_by_user_id(id, first_name, last_name, email),
        delegated_by_admin:delegated_by_company_admin_id(id, first_name, last_name, email),
        companies!company_id(id, name),
        editions!edition_id(id, name)
      `);
    // Apply filters
    if (searchParams.get('user_id')) {
      query = query.eq('user_id', searchParams.get('user_id'));
    }
    if (searchParams.get('delegated_by_user_id')) {
      query = query.eq('delegated_by_user_id', searchParams.get('delegated_by_user_id'));
    }
    if (searchParams.get('delegated_by_company_admin_id')) {
      query = query.eq('delegated_by_company_admin_id', searchParams.get('delegated_by_company_admin_id'));
    }
    if (searchParams.get('company_id')) {
      query = query.eq('company_id', searchParams.get('company_id'));
    }
    if (searchParams.get('edition_id')) {
      query = query.eq('edition_id', searchParams.get('edition_id'));
    }
    if (searchParams.get('type')) {
      query = query.eq('type', searchParams.get('type'));
    }
    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status'));
    }
    if (searchParams.get('access_level')) {
      query = query.eq('access_level', searchParams.get('access_level'));
    }
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1).order('created_at', {
      ascending: false
    });
    const { data, error, count } = await query;
    if (error) {
      console.error('Error fetching delegates:', error);
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
    console.error('Error in handleGetDelegates:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetDelegate(delegateId) {
  try {
    const { data, error } = await supabase.from('delegates').select(`
        *,
        users!user_id(id, first_name, last_name, email, phone),
        delegated_by_user:delegated_by_user_id(id, first_name, last_name, email, phone),
        delegated_by_admin:delegated_by_company_admin_id(id, first_name, last_name, email, phone),
        companies!company_id(id, name),
        editions!edition_id(id, name)
      `).eq('id', delegateId).single();
    if (error) {
      console.error('Error fetching delegate:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Delegate not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleGetDelegate:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleCreateDelegation(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { user_id, delegated_by_user_id, delegated_by_company_admin_id, company_id, edition_id, type, access_level, permissions, expiration_date, notes } = body;
    if (!user_id || !edition_id || !type) {
      return jsonResponse({
        success: false,
        error: 'user_id, edition_id, and type are required'
      }, 400);
    }
    if (type === 'user-delegate' && !delegated_by_user_id) {
      return jsonResponse({
        success: false,
        error: 'delegated_by_user_id is required for user-delegate type'
      }, 400);
    }
    if (type === 'company-delegate' && (!delegated_by_company_admin_id || !company_id)) {
      return jsonResponse({
        success: false,
        error: 'delegated_by_company_admin_id and company_id are required for company-delegate type'
      }, 400);
    }
    const { data, error } = await supabase.from('delegates').insert({
      user_id,
      delegated_by_user_id,
      delegated_by_company_admin_id,
      company_id,
      edition_id,
      type,
      access_level: access_level || 'limited',
      permissions: permissions || {},
      expiration_date,
      status: 'active',
      notes
    }).select().single();
    if (error) {
      console.error('Error creating delegation:', error);
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
    console.error('Error in handleCreateDelegation:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateDelegation(delegateId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { access_level, permissions, expiration_date, status, notes } = body;
    const { data, error } = await supabase.from('delegates').update({
      ...access_level && {
        access_level
      },
      ...permissions && {
        permissions
      },
      ...expiration_date !== undefined && {
        expiration_date
      },
      ...status && {
        status
      },
      ...notes !== undefined && {
        notes
      }
    }).eq('id', delegateId).select().single();
    if (error) {
      console.error('Error updating delegation:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Delegation not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateDelegation:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleRemoveDelegation(delegateId) {
  try {
    const { data, error } = await supabase.from('delegates').delete().eq('id', delegateId).select().single();
    if (error) {
      console.error('Error removing delegation:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Delegation not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      message: 'Delegation removed successfully'
    });
  } catch (error) {
    console.error('Error in handleRemoveDelegation:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetFamilyDelegations(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const userId = searchParams.get('user_id');
    if (!userId) {
      return jsonResponse({
        success: false,
        error: 'user_id parameter is required'
      }, 400);
    }
    const { data: asDelegator, error: delegatorError } = await supabase.from('delegates').select(`
        *,
        users!user_id(id, first_name, last_name, email, phone),
        editions!edition_id(id, name)
      `).eq('delegated_by_user_id', userId).eq('type', 'user-delegate').eq('status', 'active');
    if (delegatorError) {
      console.error('Error fetching delegator relationships:', delegatorError);
      return jsonResponse({
        success: false,
        error: delegatorError.message
      }, 500);
    }
    const { data: asDelegate, error: delegateError } = await supabase.from('delegates').select(`
        *,
        delegated_by_user:delegated_by_user_id(id, first_name, last_name, email, phone),
        editions!edition_id(id, name)
      `).eq('user_id', userId).eq('type', 'user-delegate').eq('status', 'active');
    if (delegateError) {
      console.error('Error fetching delegate relationships:', delegateError);
      return jsonResponse({
        success: false,
        error: delegateError.message
      }, 500);
    }
    return jsonResponse({
      success: true,
      data: {
        as_delegator: asDelegator || [],
        as_delegate: asDelegate || []
      }
    });
  } catch (error) {
    console.error('Error in handleGetFamilyDelegations:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetCompanyDelegations(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const companyId = searchParams.get('company_id');
    const adminId = searchParams.get('admin_id');
    if (!companyId && !adminId) {
      return jsonResponse({
        success: false,
        error: 'Either company_id or admin_id parameter is required'
      }, 400);
    }
    let query = supabase.from('delegates').select(`
        *,
        users!user_id(id, first_name, last_name, email, phone),
        delegated_by_admin:delegated_by_company_admin_id(id, first_name, last_name, email, phone),
        companies!company_id(id, name),
        editions!edition_id(id, name)
      `).eq('type', 'company-delegate').eq('status', 'active');
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    if (adminId) {
      query = query.eq('delegated_by_company_admin_id', adminId);
    }
    const { data, error } = await query.order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('Error fetching company delegations:', error);
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
    console.error('Error in handleGetCompanyDelegations:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateDelegationPermissions(delegateId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { permissions } = body;
    if (!permissions || typeof permissions !== 'object') {
      return jsonResponse({
        success: false,
        error: 'permissions object is required'
      }, 400);
    }
    const { data, error } = await supabase.from('delegates').update({
      permissions
    }).eq('id', delegateId).select().single();
    if (error) {
      console.error('Error updating delegation permissions:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Delegation not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateDelegationPermissions:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleCheckDelegationPermission(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const delegatorId = searchParams.get('delegator_id');
    const targetUserId = searchParams.get('target_user_id');
    const delegationType = searchParams.get('type') || 'user-delegate';
    if (!delegatorId || !targetUserId) {
      return jsonResponse({
        success: false,
        error: 'delegator_id and target_user_id parameters are required'
      }, 400);
    }
    const { data: existingDelegation, error: checkError } = await supabase.from('delegates').select('*').eq('user_id', targetUserId).eq(delegationType === 'user-delegate' ? 'delegated_by_user_id' : 'delegated_by_company_admin_id', delegatorId).eq('type', delegationType).eq('status', 'active').single();
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing delegation:', checkError);
      return jsonResponse({
        success: false,
        error: checkError.message
      }, 500);
    }
    const canDelegate = !existingDelegation;
    const reason = existingDelegation ? 'Delegation already exists' : 'Can create delegation';
    return jsonResponse({
      success: true,
      data: {
        can_delegate: canDelegate,
        reason,
        existing_delegation: existingDelegation || null
      }
    });
  } catch (error) {
    console.error('Error in handleCheckDelegationPermission:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetDelegationStats(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const editionId = searchParams.get('edition_id');
    const companyId = searchParams.get('company_id');
    let baseQuery = supabase.from('delegates').select('*', {
      count: 'exact',
      head: true
    });
    if (editionId) {
      baseQuery = baseQuery.eq('edition_id', editionId);
    }
    if (companyId) {
      baseQuery = baseQuery.eq('company_id', companyId);
    }
    const { count: totalDelegations, error: totalError } = await baseQuery;
    if (totalError) {
      console.error('Error fetching total delegations:', totalError);
      return jsonResponse({
        success: false,
        error: totalError.message
      }, 500);
    }
    const { count: activeDelegations, error: activeError } = await baseQuery.eq('status', 'active');
    if (activeError) {
      console.error('Error fetching active delegations:', activeError);
      return jsonResponse({
        success: false,
        error: activeError.message
      }, 500);
    }
    const { count: userDelegations, error: userError } = await baseQuery.eq('type', 'user-delegate');
    if (userError) {
      console.error('Error fetching user delegations:', userError);
      return jsonResponse({
        success: false,
        error: userError.message
      }, 500);
    }
    const { count: companyDelegations, error: companyError } = await baseQuery.eq('type', 'company-delegate');
    if (companyError) {
      console.error('Error fetching company delegations:', companyError);
      return jsonResponse({
        success: false,
        error: companyError.message
      }, 500);
    }
    return jsonResponse({
      success: true,
      data: {
        total_delegations: totalDelegations || 0,
        active_delegations: activeDelegations || 0,
        user_delegations: userDelegations || 0,
        company_delegations: companyDelegations || 0,
        inactive_delegations: (totalDelegations || 0) - (activeDelegations || 0)
      }
    });
  } catch (error) {
    console.error('Error in handleGetDelegationStats:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleBulkCreateDelegations(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { delegations } = body;
    if (!delegations || !Array.isArray(delegations) || delegations.length === 0) {
      return jsonResponse({
        success: false,
        error: 'delegations array is required'
      }, 400);
    }
    for (const delegation of delegations){
      if (!delegation.user_id || !delegation.edition_id || !delegation.type) {
        return jsonResponse({
          success: false,
          error: 'Each delegation must have user_id, edition_id, and type'
        }, 400);
      }
    }
    const { data, error } = await supabase.from('delegates').insert(delegations.map((d)=>({
        ...d,
        status: d.status || 'active',
        access_level: d.access_level || 'limited',
        permissions: d.permissions || {}
      }))).select();
    if (error) {
      console.error('Error bulk creating delegations:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    return jsonResponse({
      success: true,
      data,
      message: `Successfully created ${data?.length || 0} delegations`
    }, 201);
  } catch (error) {
    console.error('Error in handleBulkCreateDelegations:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}