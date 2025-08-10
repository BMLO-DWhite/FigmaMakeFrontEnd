import { jsonResponse, parseBody, supabase } from './helpers.ts';
export async function handleGetEmergencyContacts(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('emergency_contacts').select('*');
    if (searchParams.get('search')) {
      const search = searchParams.get('search');
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
    }
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1).order('created_at', {
      ascending: false
    });
    const { data, error, count } = await query;
    if (error) {
      console.error('Error fetching emergency contacts:', error);
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
    console.error('Error in handleGetEmergencyContacts:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetEmergencyContact(contactId) {
  try {
    const { data, error } = await supabase.from('emergency_contacts').select('*').eq('id', contactId).single();
    if (error) {
      console.error('Error fetching emergency contact:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Emergency contact not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleGetEmergencyContact:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleCreateEmergencyContact(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { first_name, last_name, phone, email, address, city, state, zip_code, country } = body;
    if (!first_name || !last_name || !phone) {
      return jsonResponse({
        success: false,
        error: 'first_name, last_name, and phone are required'
      }, 400);
    }
    const { data, error } = await supabase.from('emergency_contacts').insert({
      first_name,
      last_name,
      phone,
      email,
      address,
      city,
      state,
      zip_code,
      country
    }).select().single();
    if (error) {
      console.error('Error creating emergency contact:', error);
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
    console.error('Error in handleCreateEmergencyContact:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateEmergencyContact(contactId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { first_name, last_name, phone, email, address, city, state, zip_code, country } = body;
    const { data, error } = await supabase.from('emergency_contacts').update({
      ...first_name && {
        first_name
      },
      ...last_name && {
        last_name
      },
      ...phone && {
        phone
      },
      ...email !== undefined && {
        email
      },
      ...address !== undefined && {
        address
      },
      ...city !== undefined && {
        city
      },
      ...state !== undefined && {
        state
      },
      ...zip_code !== undefined && {
        zip_code
      },
      ...country !== undefined && {
        country
      }
    }).eq('id', contactId).select().single();
    if (error) {
      console.error('Error updating emergency contact:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Emergency contact not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateEmergencyContact:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleDeleteEmergencyContact(contactId) {
  try {
    const { data, error } = await supabase.from('emergency_contacts').delete().eq('id', contactId).select().single();
    if (error) {
      console.error('Error deleting emergency contact:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Emergency contact not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      message: 'Emergency contact deleted successfully'
    });
  } catch (error) {
    console.error('Error in handleDeleteEmergencyContact:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetUserEmergencyContacts(request) {
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
    const { data, error } = await supabase.from('user_emergency_contacts').select(`
        *,
        emergency_contacts(
          id,
          first_name,
          last_name,
          phone,
          email,
          address,
          city,
          state,
          zip_code,
          country
        )
      `).eq('user_id', userId).order('priority_order', {
      ascending: true
    });
    if (error) {
      console.error('Error fetching user emergency contacts:', error);
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
    console.error('Error in handleGetUserEmergencyContacts:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleLinkContactToUser(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { user_id, emergency_contact_id, relationship, priority_order, is_primary, special_instructions } = body;
    if (!user_id || !emergency_contact_id) {
      return jsonResponse({
        success: false,
        error: 'user_id and emergency_contact_id are required'
      }, 400);
    }
    const { data: existing, error: checkError } = await supabase.from('user_emergency_contacts').select('*').eq('user_id', user_id).eq('emergency_contact_id', emergency_contact_id).single();
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
        error: 'Emergency contact is already linked to this user'
      }, 400);
    }
    const { data, error } = await supabase.from('user_emergency_contacts').insert({
      user_id,
      emergency_contact_id,
      relationship,
      priority_order,
      is_primary: is_primary || false,
      special_instructions
    }).select(`
        *,
        emergency_contacts(
          id,
          first_name,
          last_name,
          phone,
          email
        )
      `).single();
    if (error) {
      console.error('Error linking emergency contact to user:', error);
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
    console.error('Error in handleLinkContactToUser:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateUserEmergencyContact(relationshipId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { relationship, priority_order, is_primary, special_instructions } = body;
    const { data, error } = await supabase.from('user_emergency_contacts').update({
      ...relationship && {
        relationship
      },
      ...priority_order !== undefined && {
        priority_order
      },
      ...is_primary !== undefined && {
        is_primary
      },
      ...special_instructions !== undefined && {
        special_instructions
      }
    }).eq('id', relationshipId).select(`
        *,
        emergency_contacts(
          id,
          first_name,
          last_name,
          phone,
          email
        )
      `).single();
    if (error) {
      console.error('Error updating user emergency contact:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'User emergency contact relationship not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateUserEmergencyContact:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleRemoveUserEmergencyContact(relationshipId) {
  try {
    const { data, error } = await supabase.from('user_emergency_contacts').delete().eq('id', relationshipId).select().single();
    if (error) {
      console.error('Error removing user emergency contact:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'User emergency contact relationship not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      message: 'Emergency contact removed from user successfully'
    });
  } catch (error) {
    console.error('Error in handleRemoveUserEmergencyContact:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleSetPrimaryEmergencyContact(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { user_id, emergency_contact_id } = body;
    if (!user_id || !emergency_contact_id) {
      return jsonResponse({
        success: false,
        error: 'user_id and emergency_contact_id are required'
      }, 400);
    }
    await supabase.from('user_emergency_contacts').update({
      is_primary: false
    }).eq('user_id', user_id);
    const { data, error } = await supabase.from('user_emergency_contacts').update({
      is_primary: true
    }).eq('user_id', user_id).eq('emergency_contact_id', emergency_contact_id).select(`
        *,
        emergency_contacts(
          id,
          first_name,
          last_name,
          phone,
          email
        )
      `).single();
    if (error) {
      console.error('Error setting primary emergency contact:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Emergency contact relationship not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleSetPrimaryEmergencyContact:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleSearchEmergencyContacts(request) {
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
    const { data, error } = await supabase.from('emergency_contacts').select('*').or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`).limit(20);
    if (error) {
      console.error('Error searching emergency contacts:', error);
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
    console.error('Error in handleSearchEmergencyContacts:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}