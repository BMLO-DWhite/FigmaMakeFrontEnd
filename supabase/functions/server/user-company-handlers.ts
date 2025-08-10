import { jsonResponse, parseBody, supabase } from './helpers.ts';
export async function handleGetUserCompanies(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('user_companies').select(`
        *,
        users!user_id(id, first_name, last_name, email, phone),
        companies!company_id(id, name, company_type, status),
        editions!edition_id(id, name)
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
    if (searchParams.get('role')) {
      query = query.eq('role', searchParams.get('role'));
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
      console.error('Error fetching user-company relationships:', error);
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
    console.error('Error in handleGetUserCompanies:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetCompanyUsers(companyId, request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('user_companies').select(`
        *,
        users!user_id(
          id, 
          first_name, 
          last_name, 
          email, 
          phone, 
          status,
          last_login,
          created_at
        ),
        editions!edition_id(id, name)
      `).eq('company_id', companyId);
    // Apply filters
    if (searchParams.get('role')) {
      query = query.eq('role', searchParams.get('role'));
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
      console.error('Error fetching company users:', error);
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
    console.error('Error in handleGetCompanyUsers:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleAddUserToCompany(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { user_id, company_id, edition_id, role, department, job_title, start_date, permissions, notes } = body;
    if (!user_id || !company_id || !edition_id || !role) {
      return jsonResponse({
        success: false,
        error: 'user_id, company_id, edition_id, and role are required'
      }, 400);
    }
    const { data: existing, error: checkError } = await supabase.from('user_companies').select('*').eq('user_id', user_id).eq('company_id', company_id).single();
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing relationship:', checkError);
      return jsonResponse({
        success: false,
        error: checkError.message
      }, 500);
    }
    if (existing) {
      return jsonResponse({
        success: false,
        error: 'User is already associated with this company'
      }, 400);
    }
    const { data, error } = await supabase.from('user_companies').insert({
      user_id,
      company_id,
      edition_id,
      role,
      department,
      job_title,
      start_date: start_date || new Date().toISOString(),
      permissions: permissions || {},
      status: 'active',
      notes
    }).select(`
        *,
        users!user_id(id, first_name, last_name, email),
        companies:company_id(id, name),
        editions!edition_id(id, name)
      `).single();
    if (error) {
      console.error('Error adding user to company:', error);
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
    console.error('Error in handleAddUserToCompany:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateUserCompanyRole(relationshipId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { role, department, job_title, permissions, status, end_date, notes } = body;
    const { data, error } = await supabase.from('user_companies').update({
      ...role && {
        role
      },
      ...department !== undefined && {
        department
      },
      ...job_title !== undefined && {
        job_title
      },
      ...permissions && {
        permissions
      },
      ...status && {
        status
      },
      ...end_date !== undefined && {
        end_date
      },
      ...notes !== undefined && {
        notes
      }
    }).eq('id', relationshipId).select(`
        *,
        users!user_id(id, first_name, last_name, email),
        companies:company_id(id, name),
        editions!edition_id(id, name)
      `).single();
    if (error) {
      console.error('Error updating user company role:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'User-company relationship not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateUserCompanyRole:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleRemoveUserFromCompany(relationshipId) {
  try {
    const { data, error } = await supabase.from('user_companies').delete().eq('id', relationshipId).select().single();
    if (error) {
      console.error('Error removing user from company:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'User-company relationship not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      message: 'User removed from company successfully'
    });
  } catch (error) {
    console.error('Error in handleRemoveUserFromCompany:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleInviteUserToCompany(companyId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { email, role, department, job_title, invited_by, invitation_message } = body;
    if (!email || !role || !invited_by) {
      return jsonResponse({
        success: false,
        error: 'email, role, and invited_by are required'
      }, 400);
    }
    // Check if user already exists
    const { data: existingUser, error: userError } = await supabase.from('users').select('id').eq('email', email).single();
    if (userError && userError.code !== 'PGRST116') {
      console.error('Error checking existing user:', userError);
      return jsonResponse({
        success: false,
        error: userError.message
      }, 500);
    }
    if (existingUser) {
      const { data: existingRelationship, error: relationshipError } = await supabase.from('user_companies').select('*').eq('user_id', existingUser.id).eq('company_id', companyId).single();
      if (relationshipError && relationshipError.code !== 'PGRST116') {
        console.error('Error checking existing relationship:', relationshipError);
        return jsonResponse({
          success: false,
          error: relationshipError.message
        }, 500);
      }
      if (existingRelationship) {
        return jsonResponse({
          success: false,
          error: 'User is already associated with this company'
        }, 400);
      }
    }
    return jsonResponse({
      success: true,
      message: `Invitation sent to ${email} for ${role} role`,
      data: {
        email,
        role,
        department,
        job_title,
        company_id: companyId,
        invited_by,
        invitation_message,
        existing_user: !!existingUser
      }
    });
  } catch (error) {
    console.error('Error in handleInviteUserToCompany:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetUserCompaniesForUser(userId, request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('user_companies').select(`
        *,
        companies!company_id(
          id, 
          name, 
          company_type, 
          status,
          address,
          city,
          state,
          zip_code,
          country,
          website
        ),
        editions!edition_id(id, name)
      `).eq('user_id', userId);
    // Apply filters
    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status'));
    }
    if (searchParams.get('role')) {
      query = query.eq('role', searchParams.get('role'));
    }
    query = query.order('created_at', {
      ascending: false
    });
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching user companies:', error);
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
    console.error('Error in handleGetUserCompaniesForUser:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}