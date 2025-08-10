import { jsonResponse, parseBody, supabase } from './helpers.ts';
export async function handleGetCustomFields(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('custom_fields').select(`
        *,
        editions!edition_id(id, name),
        users:created_by(id, first_name, last_name, email)
      `);
    // Apply filters
    if (searchParams.get('edition_id')) {
      query = query.eq('edition_id', searchParams.get('edition_id'));
    }
    if (searchParams.get('field_type')) {
      query = query.eq('field_type', searchParams.get('field_type'));
    }
    if (searchParams.get('scope')) {
      query = query.eq('scope', searchParams.get('scope'));
    }
    if (searchParams.get('is_required')) {
      query = query.eq('is_required', searchParams.get('is_required') === 'true');
    }
    query = query.order('display_order', {
      ascending: true
    });
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching custom fields:', error);
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
    console.error('Error in handleGetCustomFields:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetCustomField(fieldId) {
  try {
    const { data, error } = await supabase.from('custom_fields').select(`
        *,
        editions!edition_id(id, name),
        users:created_by(id, first_name, last_name, email)
      `).eq('id', fieldId).single();
    if (error) {
      console.error('Error fetching custom field:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Custom field not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleGetCustomField:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleCreateCustomField(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { field_name, field_label, field_type, edition_id, scope, is_required, default_value, validation_rules, field_options, display_order, created_by, metadata } = body;
    if (!field_name || !field_label || !field_type || !edition_id || !created_by) {
      return jsonResponse({
        success: false,
        error: 'field_name, field_label, field_type, edition_id, and created_by are required'
      }, 400);
    }
    const { data, error } = await supabase.from('custom_fields').insert({
      field_name,
      field_label,
      field_type,
      edition_id,
      scope: scope || 'user',
      is_required: is_required || false,
      default_value,
      validation_rules: validation_rules || {},
      field_options: field_options || {},
      display_order,
      created_by,
      metadata: metadata || {}
    }).select().single();
    if (error) {
      console.error('Error creating custom field:', error);
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
    console.error('Error in handleCreateCustomField:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateCustomField(fieldId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { field_label, is_required, default_value, validation_rules, field_options, display_order, metadata } = body;
    const { data, error } = await supabase.from('custom_fields').update({
      ...field_label && {
        field_label
      },
      ...is_required !== undefined && {
        is_required
      },
      ...default_value !== undefined && {
        default_value
      },
      ...validation_rules && {
        validation_rules
      },
      ...field_options && {
        field_options
      },
      ...display_order !== undefined && {
        display_order
      },
      ...metadata && {
        metadata
      }
    }).eq('id', fieldId).select().single();
    if (error) {
      console.error('Error updating custom field:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Custom field not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateCustomField:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleDeleteCustomField(fieldId) {
  try {
    const { data, error } = await supabase.from('custom_fields').delete().eq('id', fieldId).select().single();
    if (error) {
      console.error('Error deleting custom field:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Custom field not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      message: 'Custom field deleted successfully'
    });
  } catch (error) {
    console.error('Error in handleDeleteCustomField:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetPricingConfigurations(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('pricing_configurations').select(`
        *,
        editions!edition_id(id, name),
        users:created_by(id, first_name, last_name, email)
      `);
    // Apply filters
    if (searchParams.get('edition_id')) {
      query = query.eq('edition_id', searchParams.get('edition_id'));
    }
    if (searchParams.get('plan_type')) {
      query = query.eq('plan_type', searchParams.get('plan_type'));
    }
    if (searchParams.get('billing_cycle')) {
      query = query.eq('billing_cycle', searchParams.get('billing_cycle'));
    }
    if (searchParams.get('is_active')) {
      query = query.eq('is_active', searchParams.get('is_active') === 'true');
    }
    query = query.order('created_at', {
      ascending: false
    });
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching pricing configurations:', error);
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
    console.error('Error in handleGetPricingConfigurations:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleCreatePricingConfiguration(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { edition_id, plan_type, billing_cycle, base_price, currency, features, limits, created_by, metadata } = body;
    if (!edition_id || !plan_type || !billing_cycle || !base_price || !created_by) {
      return jsonResponse({
        success: false,
        error: 'edition_id, plan_type, billing_cycle, base_price, and created_by are required'
      }, 400);
    }
    const { data, error } = await supabase.from('pricing_configurations').insert({
      edition_id,
      plan_type,
      billing_cycle,
      base_price,
      currency: currency || 'USD',
      features: features || {},
      limits: limits || {},
      is_active: true,
      created_by,
      metadata: metadata || {}
    }).select().single();
    if (error) {
      console.error('Error creating pricing configuration:', error);
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
    console.error('Error in handleCreatePricingConfiguration:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdatePricingConfiguration(configId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { base_price, features, limits, is_active, metadata } = body;
    const { data, error } = await supabase.from('pricing_configurations').update({
      ...base_price && {
        base_price
      },
      ...features && {
        features
      },
      ...limits && {
        limits
      },
      ...is_active !== undefined && {
        is_active
      },
      ...metadata && {
        metadata
      }
    }).eq('id', configId).select().single();
    if (error) {
      console.error('Error updating pricing configuration:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Pricing configuration not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdatePricingConfiguration:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetReminderSettings(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('reminder_settings').select(`
        *,
        editions!edition_id(id, name),
        users!user_id(id, first_name, last_name, email)
      `);
    // Apply filters
    if (searchParams.get('user_id')) {
      query = query.eq('user_id', searchParams.get('user_id'));
    }
    if (searchParams.get('edition_id')) {
      query = query.eq('edition_id', searchParams.get('edition_id'));
    }
    if (searchParams.get('reminder_type')) {
      query = query.eq('reminder_type', searchParams.get('reminder_type'));
    }
    if (searchParams.get('is_enabled')) {
      query = query.eq('is_enabled', searchParams.get('is_enabled') === 'true');
    }
    query = query.order('created_at', {
      ascending: false
    });
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching reminder settings:', error);
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
    console.error('Error in handleGetReminderSettings:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleCreateReminderSetting(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { user_id, edition_id, reminder_type, frequency, notification_methods, settings } = body;
    if (!user_id || !edition_id || !reminder_type || !frequency) {
      return jsonResponse({
        success: false,
        error: 'user_id, edition_id, reminder_type, and frequency are required'
      }, 400);
    }
    const { data, error } = await supabase.from('reminder_settings').insert({
      user_id,
      edition_id,
      reminder_type,
      frequency,
      notification_methods: notification_methods || [
        'email'
      ],
      is_enabled: true,
      settings: settings || {}
    }).select().single();
    if (error) {
      console.error('Error creating reminder setting:', error);
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
    console.error('Error in handleCreateReminderSetting:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateReminderSetting(settingId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { frequency, notification_methods, is_enabled, settings } = body;
    const { data, error } = await supabase.from('reminder_settings').update({
      ...frequency && {
        frequency
      },
      ...notification_methods && {
        notification_methods
      },
      ...is_enabled !== undefined && {
        is_enabled
      },
      ...settings && {
        settings
      }
    }).eq('id', settingId).select().single();
    if (error) {
      console.error('Error updating reminder setting:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Reminder setting not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateReminderSetting:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetUserNotificationPreferences(request) {
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
    const { data, error } = await supabase.from('user_notification_preferences').select(`
        *,
        users!user_id(id, first_name, last_name, email)
      `).eq('user_id', userId).single();
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user notification preferences:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    return jsonResponse({
      success: true,
      data: data || null
    });
  } catch (error) {
    console.error('Error in handleGetUserNotificationPreferences:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateUserNotificationPreferences(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { user_id, email_notifications, sms_notifications, push_notifications, marketing_emails, security_alerts, preferences } = body;
    if (!user_id) {
      return jsonResponse({
        success: false,
        error: 'user_id is required'
      }, 400);
    }
    const { data: existing, error: checkError } = await supabase.from('user_notification_preferences').select('*').eq('user_id', user_id).single();
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing preferences:', checkError);
      return jsonResponse({
        success: false,
        error: checkError.message
      }, 500);
    }
    const updateData = {
      ...email_notifications !== undefined && {
        email_notifications
      },
      ...sms_notifications !== undefined && {
        sms_notifications
      },
      ...push_notifications !== undefined && {
        push_notifications
      },
      ...marketing_emails !== undefined && {
        marketing_emails
      },
      ...security_alerts !== undefined && {
        security_alerts
      },
      ...preferences && {
        preferences
      }
    };
    let data, error;
    if (existing) {
      const result = await supabase.from('user_notification_preferences').update(updateData).eq('user_id', user_id).select().single();
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase.from('user_notification_preferences').insert({
        user_id,
        email_notifications: email_notifications !== undefined ? email_notifications : true,
        sms_notifications: sms_notifications !== undefined ? sms_notifications : false,
        push_notifications: push_notifications !== undefined ? push_notifications : true,
        marketing_emails: marketing_emails !== undefined ? marketing_emails : false,
        security_alerts: security_alerts !== undefined ? security_alerts : true,
        preferences: preferences || {}
      }).select().single();
      data = result.data;
      error = result.error;
    }
    if (error) {
      console.error('Error updating user notification preferences:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateUserNotificationPreferences:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}