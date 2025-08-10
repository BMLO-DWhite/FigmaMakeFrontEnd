// Edition Handlers - Added: July 30, 2025 1:15 AM EST
// Updated: July 30, 2025 - 2:30 AM EST (Fixed to use correct table names from database-schema.sql)
// Updated: 7/30/25
// Purpose: Handle edition-related operations including co-branding
import { corsHeaders } from './constants.ts';
import { supabase } from './helpers.ts';
// Get all editions - Added: July 29, 2025 11:05 PM EST
export async function handleGetEditions() {
  try {
    console.log('🔍 Getting all editions...');
    const { data: editions, error } = await supabase.from('editions').select('*').order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('❌ Error fetching editions:', error);
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
    const formattedEditions = editions?.map((edition)=>({
        id: edition.id,
        name: edition.name,
        features: edition.features || [],
        dateCreated: edition.created_at,
        createdBy: edition.created_by,
        lastUpdate: edition.updated_at,
        status: edition.is_active ? 'active' : 'inactive'
      })) || [];
    console.log('✅ Successfully fetched editions:', formattedEditions.length);
    return new Response(JSON.stringify({
      success: true,
      data: formattedEditions
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetEditions:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch editions'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Create new edition - Added: July 29, 2025 11:05 PM EST
export async function handleCreateEdition(request) {
  try {
    console.log('🔍 Creating new edition...');
    const body = await request.json();
    const { name, features } = body;
    if (!name) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Edition name is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    const { data: edition, error } = await supabase.from('editions').insert({
      name,
      features: features || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true
    }).select().single();
    if (error) {
      console.error('❌ Error creating edition:', error);
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
    const formattedEdition = {
      id: edition.id,
      name: edition.name,
      features: edition.features || [],
      dateCreated: edition.created_at,
      createdBy: edition.created_by,
      lastUpdate: edition.updated_at,
      status: edition.is_active ? 'active' : 'inactive'
    };
    console.log('✅ Successfully created edition:', formattedEdition);
    return new Response(JSON.stringify({
      success: true,
      data: formattedEdition
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleCreateEdition:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create edition'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Update edition - Added: July 29, 2025 11:05 PM EST
export async function handleUpdateEdition(editionId, request) {
  try {
    console.log('🔍 Updating edition:', editionId);
    const body = await request.json();
    const { name, features } = body;
    const { data: edition, error } = await supabase.from('editions').update({
      name,
      features: features || [],
      updated_at: new Date().toISOString()
    }).eq('id', editionId).select().single();
    if (error) {
      console.error('❌ Error updating edition:', error);
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
    const formattedEdition = {
      id: edition.id,
      name: edition.name,
      features: edition.features || [],
      dateCreated: edition.created_at,
      createdBy: edition.created_by,
      lastUpdate: edition.updated_at,
      status: edition.is_active ? 'active' : 'inactive'
    };
    console.log('✅ Successfully updated edition:', formattedEdition);
    return new Response(JSON.stringify({
      success: true,
      data: formattedEdition
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleUpdateEdition:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update edition'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Delete edition - Added: July 29, 2025 11:05 PM EST
export async function handleDeleteEdition(editionId) {
  try {
    console.log('🔍 Deleting edition:', editionId);
    const { error } = await supabase.from('editions').delete().eq('id', editionId);
    if (error) {
      console.error('❌ Error deleting edition:', error);
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
    console.log('✅ Successfully deleted edition:', editionId);
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
    console.error('❌ Error in handleDeleteEdition:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to delete edition'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Get edition stats - Added: July 29, 2025 11:05 PM EST
export async function handleGetEditionStats(editionId) {
  try {
    console.log('🔍 Getting edition stats:', editionId);
    // Get edition details
    const { data: edition, error: editionError } = await supabase.from('editions').select('*').eq('id', editionId).single();
    if (editionError) {
      console.error('❌ Error fetching edition:', editionError);
      return new Response(JSON.stringify({
        success: false,
        error: editionError.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    // Count edition admins
    const { count: editionAdmins } = await supabase.from('users').select('*', {
      count: 'exact',
      head: true
    }).eq('role', 'edition-admin').eq('edition_id', editionId);
    // Count companies
    const { count: companies } = await supabase.from('companies').select('*', {
      count: 'exact',
      head: true
    }).eq('edition_id', editionId);
    // Count active users
    const { count: activeUsers } = await supabase.from('users').select('*', {
      count: 'exact',
      head: true
    }).eq('edition_id', editionId).eq('status', 'active');
    const stats = {
      dateCreated: edition.created_at,
      createdBy: edition.created_by || 'System',
      lastUpdate: edition.updated_at,
      editionAdmins: editionAdmins || 0,
      companies: companies || 0,
      activeUsers: activeUsers || 0
    };
    console.log('✅ Successfully fetched edition stats:', stats);
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
    console.error('❌ Error in handleGetEditionStats:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch edition stats'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Get edition admins - Added: July 29, 2025 11:05 PM EST
export async function handleGetEditionAdmins(editionId) {
  try {
    console.log('🔍 Getting edition admins for edition:', editionId);
    const { data: admins, error } = await supabase.from('users').select('*').eq('role', 'edition-admin').eq('edition_id', editionId).order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('❌ Error fetching edition admins:', error);
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
        expirationDate: admin.expiration_date,
        lastLogin: admin.last_login,
        createdAt: admin.created_at,
        editionId: admin.edition_id,
        profileImageUrl: admin.profile_image_url
      })) || [];
    console.log('✅ Successfully fetched edition admins:', formattedAdmins.length);
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
    console.error('❌ Error in handleGetEditionAdmins:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch edition admins'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Create edition admin - Added: July 29, 2025 11:05 PM EST
export async function handleCreateEditionAdmin(request) {
  try {
    console.log('🔍 Creating new edition admin...');
    const body = await request.json();
    const { firstName, lastName, email, phone, editionId, expirationDate } = body;
    if (!firstName || !lastName || !email || !editionId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'First name, last name, email, and edition ID are required'
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
      role: 'edition-admin',
      edition_id: editionId,
      expiration_date: expirationDate,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).select().single();
    if (error) {
      console.error('❌ Error creating edition admin:', error);
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
      expirationDate: admin.expiration_date,
      lastLogin: admin.last_login,
      createdAt: admin.created_at,
      editionId: admin.edition_id,
      profileImageUrl: admin.profile_image_url
    };
    console.log('✅ Successfully created edition admin:', formattedAdmin);
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
    console.error('❌ Error in handleCreateEditionAdmin:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create edition admin'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Get co-branding settings - Added: July 30, 2025 1:20 AM EST
// Updated: July 30, 2025 2:45 AM EST (Fixed to use "companyName" instead of "organizationName")
// Purpose: Get co-branding settings for an edition
export async function handleGetCoBranding(editionId) {
  try {
    console.log('🔍 Getting co-branding settings for edition:', editionId);
    const { data: coBranding, error } = await supabase.from('co_branding_settings').select('*').eq('edition_id', editionId).single();
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error fetching co-branding settings:', error);
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
    // If no settings exist, return defaults
    const defaultSettings = {
      editionId,
      companyName: '',
      brandingMode: 'none',
      primaryColor: '#294199',
      secondaryColor: '#1f2f7a',
      logoUrl: null,
      lastUpdate: new Date().toISOString()
    };
    if (!coBranding) {
      console.log('✅ No co-branding settings found, returning defaults');
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
    }
    // Map database fields to frontend format (using correct field names from schema)
    const formattedSettings = {
      editionId: coBranding.edition_id,
      companyName: coBranding.company_name || '',
      brandingMode: coBranding.branding_mode || 'none',
      primaryColor: coBranding.primary_color || '#294199',
      secondaryColor: coBranding.secondary_color || '#1f2f7a',
      logoUrl: coBranding.logo_url,
      lastUpdate: coBranding.updated_at
    };
    console.log('✅ Successfully fetched co-branding settings:', formattedSettings);
    return new Response(JSON.stringify({
      success: true,
      data: formattedSettings
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetCoBranding:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch co-branding settings'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Save co-branding settings - Added: July 30, 2025 1:20 AM EST
// Updated: July 30, 2025 2:45 AM EST (Fixed to use "companyName" instead of "organizationName")
// Purpose: Save co-branding settings for an edition
export async function handleSaveCoBranding(editionId, request) {
  try {
    console.log('🔍 Saving co-branding settings for edition:', editionId);
    const body = await request.json();
    const { companyName, brandingMode, primaryColor, secondaryColor, logoUrl } = body;
    // Check if settings already exist
    const { data: existing } = await supabase.from('co_branding_settings').select('id').eq('edition_id', editionId).single();
    // Use correct field names from database schema
    const settingsData = {
      edition_id: editionId,
      company_name: companyName || '',
      branding_mode: brandingMode || 'none',
      primary_color: primaryColor || '#294199',
      secondary_color: secondaryColor || '#1f2f7a',
      logo_url: logoUrl,
      updated_at: new Date().toISOString()
    };
    let data, error;
    if (existing) {
      // Update existing settings
      const updateResult = await supabase.from('co_branding_settings').update(settingsData).eq('edition_id', editionId).select().single();
      data = updateResult.data;
      error = updateResult.error;
    } else {
      // Create new settings
      const insertResult = await supabase.from('co_branding_settings').insert(settingsData).select().single();
      data = insertResult.data;
      error = insertResult.error;
    }
    if (error) {
      console.error('❌ Error saving co-branding settings:', error);
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
    const formattedSettings = {
      editionId: data.edition_id,
      companyName: data.company_name || '',
      brandingMode: data.branding_mode || 'none',
      primaryColor: data.primary_color || '#294199',
      secondaryColor: data.secondary_color || '#1f2f7a',
      logoUrl: data.logo_url,
      lastUpdate: data.updated_at
    };
    console.log('✅ Successfully saved co-branding settings:', formattedSettings);
    return new Response(JSON.stringify({
      success: true,
      data: formattedSettings
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Error in handleSaveCoBranding:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to save co-branding settings'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
// Upload logo file - Added: July 30, 2025 1:25 AM EST
// Purpose: Handle logo file uploads for co-branding
export async function handleUploadLogo(request) {
  try {
    console.log('🔍 Processing logo upload...');
    // For now, return a placeholder response since we need proper file upload handling
    // This would typically involve Supabase Storage
    const mockResponse = {
      fileName: 'logo.png',
      path: '/uploads/logos/logo.png',
      url: 'https://example.com/logo.png'
    };
    console.log('✅ Logo upload completed (mock):', mockResponse);
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
    console.error('❌ Error in handleUploadLogo:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to upload logo'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}