// Dashboard Handlers - Added: July 30, 2025 1:30 AM EST
// Updated: 7/30/25
// Purpose: Handle dashboard metrics, settings, super admin, and company operations
import { corsHeaders } from './constants.ts';
import { supabase } from './helpers.ts';
// Get edition admin dashboard metrics - Added: July 29, 2025 11:10 PM EST
export async function handleGetEditionAdminMetrics(editionId) {
  try {
    console.log('🔍 Getting edition admin metrics for edition:', editionId);
    // Count companies in this edition
    const { count: totalCompanies } = await supabase.from('companies').select('*', {
      count: 'exact',
      head: true
    }).eq('edition_id', editionId);
    // Count active users in this edition
    const { count: totalUsers } = await supabase.from('users').select('*', {
      count: 'exact',
      head: true
    }).eq('edition_id', editionId).eq('status', 'active');
    // Count edition admins
    const { count: totalAdmins } = await supabase.from('users').select('*', {
      count: 'exact',
      head: true
    }).eq('edition_id', editionId).eq('role', 'edition-admin');
    // Count channel partners (companies with channel partner type)
    const { count: totalChannelPartners } = await supabase.from('companies').select('*, company_types!inner(*)').eq('edition_id', editionId).eq('is_channel_partner', true).then((result)=>({
        count: result.data?.length || 0
      }));
    const metrics = {
      totalCompanies: totalCompanies || 0,
      totalUsers: totalUsers || 0,
      totalAdmins: totalAdmins || 0,
      totalChannelPartners: totalChannelPartners || 0
    };
    console.log('✅ Successfully fetched edition admin metrics:', metrics);
    return new Response(JSON.stringify({
      success: true,
      data: metrics
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetEditionAdminMetrics:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch metrics'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Get companies by edition - Added: July 29, 2025 11:10 PM EST
export async function handleGetCompaniesByEdition(editionId) {
  try {
    console.log('🔍 Getting companies for edition:', editionId);
    const { data: companies, error } = await supabase.from('companies').select(`
        *,
        company_titles(name),
        company_types(name, is_default)
      `).eq('edition_id', editionId).order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('❌ Error fetching companies:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    // Map database fields to frontend format
    const formattedCompanies = companies?.map((company)=>({
        id: company.id,
        name: company.name,
        status: company.status,
        contactEmail: company.email,
        phone: company.phone,
        address: company.address,
        website: company.website,
        titleId: company.company_title_id,
        typeId: company.company_type_id,
        editionId: company.edition_id,
        createdAt: company.created_at,
        updatedAt: company.updated_at,
        createdBy: company.created_by,
        title: company.company_titles ? {
          id: company.company_title_id,
          name: company.company_titles.name,
          editionId: company.edition_id,
          isActive: true,
          createdAt: company.created_at,
          updatedAt: company.updated_at
        } : null,
        type: company.company_types ? {
          id: company.company_type_id,
          name: company.company_types.name,
          editionId: company.edition_id,
          isChannelPartner: company.company_types.is_default,
          isActive: true,
          createdAt: company.created_at,
          updatedAt: company.updated_at
        } : null
      })) || [];
    console.log('✅ Successfully fetched companies:', formattedCompanies.length);
    return new Response(JSON.stringify({
      success: true,
      data: formattedCompanies
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetCompaniesByEdition:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch companies'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Get admin users with filtering - Added: July 29, 2025 11:10 PM EST
export async function handleGetAdminUsers(searchParams) {
  try {
    console.log('🔍 Getting admin users with filters...');
    const role = searchParams.get('role');
    const editionId = searchParams.get('editionId');
    const companyId = searchParams.get('companyId');
    let query = supabase.from('users').select('*');
    // Apply filters
    if (role) {
      query = query.eq('role', role);
    }
    if (editionId) {
      query = query.eq('edition_id', editionId);
    }
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    const { data: users, error } = await query.order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('❌ Error fetching admin users:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    // Map database fields to frontend format
    const formattedUsers = users?.map((user)=>({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        profileImageUrl: user.profile_image_url,
        role: user.role,
        editionId: user.edition_id,
        companyId: user.company_id,
        channelId: user.channel_id,
        useExpirationDate: user.use_expiration_date,
        expirationDate: user.expiration_date,
        isCurrent: user.is_current,
        lastLogin: user.last_login,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        status: user.status
      })) || [];
    console.log('✅ Successfully fetched admin users:', formattedUsers.length);
    return new Response(JSON.stringify({
      success: true,
      data: formattedUsers
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetAdminUsers:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch admin users'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Get company titles for edition - Added: July 29, 2025 11:10 PM EST
export async function handleGetCompanyTitles(editionId) {
  try {
    console.log('🔍 Getting company titles for edition:', editionId);
    const { data: titles, error } = await supabase.from('company_titles').select('*').eq('edition_id', editionId).eq('is_active', true).order('name', {
      ascending: true
    });
    if (error) {
      console.error('❌ Error fetching company titles:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    // Map database fields to frontend format
    const formattedTitles = titles?.map((title)=>({
        id: title.id,
        name: title.name,
        editionId: title.edition_id,
        isActive: title.is_active,
        createdAt: title.created_at,
        updatedAt: title.updated_at
      })) || [];
    console.log('✅ Successfully fetched company titles:', formattedTitles.length);
    return new Response(JSON.stringify({
      success: true,
      data: formattedTitles
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetCompanyTitles:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch company titles'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Get company types for edition - Added: July 29, 2025 11:10 PM EST
export async function handleGetCompanyTypes(editionId) {
  try {
    console.log('🔍 Getting company types for edition:', editionId);
    const { data: types, error } = await supabase.from('company_types').select('*').eq('edition_id', editionId).eq('is_active', true).order('name', {
      ascending: true
    });
    if (error) {
      console.error('❌ Error fetching company types:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    // Map database fields to frontend format
    const formattedTypes = types?.map((type)=>({
        id: type.id,
        name: type.name,
        editionId: type.edition_id,
        isChannelPartner: type.is_channel_partner,
        isActive: type.is_active,
        createdAt: type.created_at,
        updatedAt: type.updated_at
      })) || [];
    console.log('✅ Successfully fetched company types:', formattedTypes.length);
    return new Response(JSON.stringify({
      success: true,
      data: formattedTypes
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetCompanyTypes:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch company types'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Get audit logs - Added: July 29, 2025 11:10 PM EST
export async function handleGetAuditLogs(searchParams) {
  try {
    console.log('🔍 Getting audit logs...');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    const { data: logs, error } = await supabase.from('audit_logs').select(`
        *,
        users(first_name, last_name, email)
      `).order('timestamp', {
      ascending: false
    }).range(offset, offset + limit - 1);
    if (error) {
      console.error('❌ Error fetching audit logs:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    // Map database fields to frontend format
    const formattedLogs = logs?.map((log)=>({
        id: log.id,
        userId: log.user_id,
        action: log.action,
        details: log.details,
        timestamp: log.timestamp,
        user: log.users ? {
          firstName: log.users.first_name,
          lastName: log.users.last_name,
          email: log.users.email
        } : null
      })) || [];
    console.log('✅ Successfully fetched audit logs:', formattedLogs.length);
    return new Response(JSON.stringify({
      success: true,
      data: formattedLogs
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetAuditLogs:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch audit logs'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Get audit logs stats - Added: July 29, 2025 11:10 PM EST
export async function handleGetAuditLogsStats() {
  try {
    console.log('🔍 Getting audit logs statistics...');
    const { count: totalLogs } = await supabase.from('audit_logs').select('*', {
      count: 'exact',
      head: true
    });
    // Get logs from last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const { count: last24Hours } = await supabase.from('audit_logs').select('*', {
      count: 'exact',
      head: true
    }).gte('timestamp', yesterday.toISOString());
    const stats = {
      totalLogs: totalLogs || 0,
      last24Hours: last24Hours || 0
    };
    console.log('✅ Successfully fetched audit logs stats:', stats);
    return new Response(JSON.stringify({
      success: true,
      data: stats
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetAuditLogsStats:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch audit logs stats'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Get system settings - Added: July 30, 2025 1:35 AM EST
// Purpose: Get global system settings
export async function handleGetSettings() {
  try {
    console.log('🔍 Getting system settings...');
    // For now, return default settings since we need proper settings table
    const defaultSettings = {
      logoUrl: 'https://admin.scanid365.com/assets/Logo-DAiMxAd8.svg',
      welcomeMessage: 'Welcome to Scan ID 365 Family'
    };
    console.log('✅ Successfully fetched system settings (defaults)');
    return new Response(JSON.stringify({
      success: true,
      data: defaultSettings
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetSettings:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch settings'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Save system settings - Added: July 30, 2025 1:35 AM EST
// Purpose: Save global system settings
export async function handleSaveSettings(request) {
  try {
    console.log('🔍 Saving system settings...');
    const body = await request.json();
    // For now, just return the submitted settings as if saved
    console.log('✅ System settings saved (mock):', body);
    return new Response(JSON.stringify({
      success: true,
      data: body
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleSaveSettings:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to save settings'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Upload settings logo - Added: July 30, 2025 1:35 AM EST
// Purpose: Handle logo uploads for system settings
export async function handleUploadSettingsLogo(request) {
  try {
    console.log('🔍 Processing settings logo upload...');
    // For now, return a placeholder response
    const mockResponse = {
      fileName: 'settings-logo.png',
      path: '/uploads/settings/logo.png',
      url: 'https://example.com/settings-logo.png'
    };
    console.log('✅ Settings logo upload completed (mock):', mockResponse);
    return new Response(JSON.stringify({
      success: true,
      data: mockResponse
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleUploadSettingsLogo:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to upload settings logo'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Get all super admins - Added: July 30, 2025 1:40 AM EST
// Purpose: Get all super admin users
export async function handleGetSuperAdmins() {
  try {
    console.log('🔍 Getting all super admins...');
    const { data: admins, error } = await supabase.from('users').select('*').eq('role', 'super-admin').order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('❌ Error fetching super admins:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    // Map database fields to frontend format
    const formattedAdmins = admins?.map((admin)=>({
        id: admin.id,
        firstName: admin.first_name,
        lastName: admin.last_name,
        email: admin.email,
        phone: admin.phone,
        useExpirationDate: admin.use_expiration_date || false,
        expirationDate: admin.expiration_date,
        lastLogin: admin.last_login,
        createdAt: admin.created_at,
        isCurrent: admin.is_current || false,
        profileImageUrl: admin.profile_image_url
      })) || [];
    console.log('✅ Successfully fetched super admins:', formattedAdmins.length);
    return new Response(JSON.stringify({
      success: true,
      data: formattedAdmins
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetSuperAdmins:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch super admins'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Create super admin - Added: July 30, 2025 1:40 AM EST
// Purpose: Create a new super admin user
export async function handleCreateSuperAdmin(request) {
  try {
    console.log('🔍 Creating new super admin...');
    const body = await request.json();
    const { firstName, lastName, email, phone, useExpirationDate, expirationDate } = body;
    if (!firstName || !lastName || !email) {
      return new Response(JSON.stringify({
        success: false,
        error: 'First name, last name, and email are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    const { data: admin, error } = await supabase.from('users').insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      role: 'super-admin',
      use_expiration_date: useExpirationDate || false,
      expiration_date: expirationDate,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).select().single();
    if (error) {
      console.error('❌ Error creating super admin:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    // Map database fields to frontend format
    const formattedAdmin = {
      id: admin.id,
      firstName: admin.first_name,
      lastName: admin.last_name,
      email: admin.email,
      phone: admin.phone,
      useExpirationDate: admin.use_expiration_date || false,
      expirationDate: admin.expiration_date,
      lastLogin: admin.last_login,
      createdAt: admin.created_at,
      isCurrent: admin.is_current || false,
      profileImageUrl: admin.profile_image_url
    };
    console.log('✅ Successfully created super admin:', formattedAdmin);
    return new Response(JSON.stringify({
      success: true,
      data: formattedAdmin
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleCreateSuperAdmin:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create super admin'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Update super admin - Added: July 30, 2025 1:40 AM EST
// Purpose: Update an existing super admin user
export async function handleUpdateSuperAdmin(adminId, request) {
  try {
    console.log('🔍 Updating super admin:', adminId);
    const body = await request.json();
    const { firstName, lastName, email, phone, useExpirationDate, expirationDate } = body;
    const { data: admin, error } = await supabase.from('users').update({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      use_expiration_date: useExpirationDate || false,
      expiration_date: expirationDate,
      updated_at: new Date().toISOString()
    }).eq('id', adminId).eq('role', 'super-admin').select().single();
    if (error) {
      console.error('❌ Error updating super admin:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    // Map database fields to frontend format
    const formattedAdmin = {
      id: admin.id,
      firstName: admin.first_name,
      lastName: admin.last_name,
      email: admin.email,
      phone: admin.phone,
      useExpirationDate: admin.use_expiration_date || false,
      expirationDate: admin.expiration_date,
      lastLogin: admin.last_login,
      createdAt: admin.created_at,
      isCurrent: admin.is_current || false,
      profileImageUrl: admin.profile_image_url
    };
    console.log('✅ Successfully updated super admin:', formattedAdmin);
    return new Response(JSON.stringify({
      success: true,
      data: formattedAdmin
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleUpdateSuperAdmin:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update super admin'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Delete super admin - Added: July 30, 2025 1:40 AM EST
// Purpose: Delete a super admin user
export async function handleDeleteSuperAdmin(adminId) {
  try {
    console.log('🔍 Deleting super admin:', adminId);
    const { error } = await supabase.from('users').delete().eq('id', adminId).eq('role', 'super-admin');
    if (error) {
      console.error('❌ Error deleting super admin:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    console.log('✅ Successfully deleted super admin:', adminId);
    return new Response(JSON.stringify({
      success: true
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleDeleteSuperAdmin:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to delete super admin'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Get dashboard metrics - Added: July 30, 2025 1:45 AM EST
// Purpose: Get overall system dashboard metrics
export async function handleGetDashboardMetrics() {
  try {
    console.log('🔍 Getting dashboard metrics...');
    // Count total editions
    const { count: totalEditions } = await supabase.from('editions').select('*', {
      count: 'exact',
      head: true
    });
    // Count total users
    const { count: totalUsers } = await supabase.from('users').select('*', {
      count: 'exact',
      head: true
    });
    // Count total companies
    const { count: totalCompanies } = await supabase.from('companies').select('*', {
      count: 'exact',
      head: true
    });
    // Count total super admins
    const { count: totalSuperAdmins } = await supabase.from('users').select('*', {
      count: 'exact',
      head: true
    }).eq('role', 'super-admin');
    const metrics = {
      totalEditions: totalEditions || 0,
      totalUsers: totalUsers || 0,
      totalCompanies: totalCompanies || 0,
      totalSuperAdmins: totalSuperAdmins || 0
    };
    console.log('✅ Successfully fetched dashboard metrics:', metrics);
    return new Response(JSON.stringify({
      success: true,
      data: metrics
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetDashboardMetrics:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch dashboard metrics'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Get companies (with query support) - Added: July 30, 2025 1:50 AM EST
// Purpose: Get companies with optional edition filtering
export async function handleGetCompanies(searchParams) {
  try {
    console.log('🔍 Getting companies with filters...');
    const editionId = searchParams.get('editionId');
    let query = supabase.from('companies').select(`
        *,
        company_titles(name),
        company_types(name, is_default)
      `);
    // Apply edition filter if provided
    if (editionId) {
      query = query.eq('edition_id', editionId);
    }
    const { data: companies, error } = await query.order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('❌ Error fetching companies:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    // Map database fields to frontend format
    const formattedCompanies = companies?.map((company)=>({
        id: company.id,
        name: company.name,
        status: company.status,
        contactEmail: company.email,
        phone: company.phone,
        address: company.address,
        website: company.website,
        titleId: company.company_title_id,
        typeId: company.company_type_id,
        editionId: company.edition_id,
        createdAt: company.created_at,
        updatedAt: company.updated_at,
        createdBy: company.created_by,
        title: company.company_titles ? {
          id: company.company_title_id,
          name: company.company_titles.name,
          editionId: company.edition_id,
          isActive: true,
          createdAt: company.created_at,
          updatedAt: company.updated_at
        } : null,
        type: company.company_types ? {
          id: company.company_type_id,
          name: company.company_types.name,
          editionId: company.edition_id,
          isChannelPartner: company.company_types.is_default,
          isActive: true,
          createdAt: company.created_at,
          updatedAt: company.updated_at
        } : null
      })) || [];
    console.log('✅ Successfully fetched companies:', formattedCompanies.length);
    return new Response(JSON.stringify({
      success: true,
      data: formattedCompanies
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetCompanies:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch companies'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}