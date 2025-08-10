
import { jsonResponse, parseBody, supabase } from './helpers.ts';

export async function handleGetTransactions(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    let query = supabase
      .from('transactions')
      .select(`
        *,
        users!user_id(id, first_name, last_name, email),
        companies!company_id(id, name),
        editions!edition_id(id, name),
        transaction_line_items(*)
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
    if (searchParams.get('payment_method')) {
      query = query.eq('payment_method', searchParams.get('payment_method'));
    }

    if (searchParams.get('start_date')) {
      query = query.gte('created_at', searchParams.get('start_date'));
    }
    if (searchParams.get('end_date')) {
      query = query.lte('created_at', searchParams.get('end_date'));
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching transactions:', error);
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
    console.error('Error in handleGetTransactions:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleGetTransaction(transactionId) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        users!user_id(id, first_name, last_name, email, phone),
        companies!company_id(id, name),
        editions!edition_id(id, name),
        transaction_line_items(*),
        transaction_history(*)
      `)
      .eq('id', transactionId)
      .single();

    if (error) {
      console.error('Error fetching transaction:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    if (!data) {
      return jsonResponse({ success: false, error: 'Transaction not found' }, 404);
    }

    return jsonResponse({ success: true, data });
  } catch (error) {
    console.error('Error in handleGetTransaction:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleCreateTransaction(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { 
      user_id, 
      company_id, 
      edition_id, 
      amount, 
      currency, 
      payment_method, 
      payment_intent_id,
      description,
      metadata,
      line_items 
    } = body;

    if (!user_id || !edition_id || !amount || !currency) {
      return jsonResponse({ 
        success: false, 
        error: 'user_id, edition_id, amount, and currency are required' 
      }, 400);
    }

    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id,
        company_id,
        edition_id,
        amount,
        currency,
        payment_method,
        payment_intent_id,
        description,
        status: 'pending',
        metadata: metadata || {}
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      return jsonResponse({ success: false, error: transactionError.message }, 500);
    }

    if (line_items && line_items.length > 0) {
      const lineItemsData = line_items.map(item => ({
        transaction_id: transaction.id,
        description: item.description,
        quantity: item.quantity || 1,
        unit_price: item.unit_price,
        total_price: item.total_price || (item.quantity * item.unit_price),
        metadata: item.metadata || {}
      }));

      const { error: lineItemsError } = await supabase
        .from('transaction_line_items')
        .insert(lineItemsData);

      if (lineItemsError) {
        console.error('Error creating transaction line items:', lineItemsError);
      }
    }

    return jsonResponse({ success: true, data: transaction }, 201);
  } catch (error) {
    console.error('Error in handleCreateTransaction:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleUpdateTransaction(transactionId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { status, payment_intent_id, metadata, notes } = body;

    const { data, error } = await supabase
      .from('transactions')
      .update({
        ...(status && { status }),
        ...(payment_intent_id && { payment_intent_id }),
        ...(metadata && { metadata }),
        ...(notes && { notes })
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating transaction:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    if (!data) {
      return jsonResponse({ success: false, error: 'Transaction not found' }, 404);
    }

    return jsonResponse({ success: true, data });
  } catch (error) {
    console.error('Error in handleUpdateTransaction:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleProcessRefund(transactionId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { refund_amount, reason, refund_method } = body;

    if (!refund_amount) {
      return jsonResponse({ 
        success: false, 
        error: 'refund_amount is required' 
      }, 400);
    }

    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (fetchError || !transaction) {
      return jsonResponse({ success: false, error: 'Transaction not found' }, 404);
    }

    if (transaction.status !== 'completed') {
      return jsonResponse({ 
        success: false, 
        error: 'Can only refund completed transactions' 
      }, 400);
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({
        status: 'refunded',
        refund_amount,
        refund_reason: reason,
        refund_method,
        refunded_at: new Date().toISOString()
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) {
      console.error('Error processing refund:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({ success: true, data });
  } catch (error) {
    console.error('Error in handleProcessRefund:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleGetTransactionLineItems(transactionId) {
  try {
    const { data, error } = await supabase
      .from('transaction_line_items')
      .select('*')
      .eq('transaction_id', transactionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching transaction line items:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error in handleGetTransactionLineItems:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleGetSubscriptions(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    let query = supabase
      .from('subscriptions')
      .select(`
        *,
        users!user_id(id, first_name, last_name, email),
        companies!company_id(id, name),
        editions:edition_id(id, name)
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
    if (searchParams.get('plan_type')) {
      query = query.eq('plan_type', searchParams.get('plan_type'));
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching subscriptions:', error);
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
    console.error('Error in handleGetSubscriptions:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleGetSubscription(subscriptionId) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        users!user_id(id, first_name, last_name, email, phone),
        companies!company_id(id, name),
        editions!edition_id(id, name),
        subscription_history(*)
      `)
      .eq('id', subscriptionId)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    if (!data) {
      return jsonResponse({ success: false, error: 'Subscription not found' }, 404);
    }

    return jsonResponse({ success: true, data });
  } catch (error) {
    console.error('Error in handleGetSubscription:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleCreateSubscription(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { 
      user_id, 
      company_id, 
      edition_id, 
      plan_type, 
      billing_cycle, 
      amount, 
      currency,
      stripe_subscription_id,
      start_date,
      metadata 
    } = body;

    if (!user_id || !edition_id || !plan_type || !billing_cycle || !amount) {
      return jsonResponse({ 
        success: false, 
        error: 'user_id, edition_id, plan_type, billing_cycle, and amount are required' 
      }, 400);
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id,
        company_id,
        edition_id,
        plan_type,
        billing_cycle,
        amount,
        currency: currency || 'USD',
        stripe_subscription_id,
        start_date: start_date || new Date().toISOString(),
        status: 'active',
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({ success: true, data }, 201);
  } catch (error) {
    console.error('Error in handleCreateSubscription:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleUpdateSubscription(subscriptionId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { status, plan_type, billing_cycle, amount, metadata } = body;

    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        ...(status && { status }),
        ...(plan_type && { plan_type }),
        ...(billing_cycle && { billing_cycle }),
        ...(amount && { amount }),
        ...(metadata && { metadata })
      })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    if (!data) {
      return jsonResponse({ success: false, error: 'Subscription not found' }, 404);
    }

    return jsonResponse({ success: true, data });
  } catch (error) {
    console.error('Error in handleUpdateSubscription:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleCancelSubscription(subscriptionId, request) {
  try {
    const body = await parseBody(request);
    const { reason, cancel_at_period_end } = body || {};

    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: cancel_at_period_end ? 'canceling' : 'canceled',
        canceled_at: new Date().toISOString(),
        cancellation_reason: reason
      })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) {
      console.error('Error canceling subscription:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    if (!data) {
      return jsonResponse({ success: false, error: 'Subscription not found' }, 404);
    }

    return jsonResponse({ success: true, data });
  } catch (error) {
    console.error('Error in handleCancelSubscription:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleGetSubscriptionHistory(subscriptionId) {
  try {
    const { data, error } = await supabase
      .from('subscription_history')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscription history:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error in handleGetSubscriptionHistory:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleGetAffiliateCommissions(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    let query = supabase
      .from('affiliate_commissions')
      .select(`
        *,
        users!affiliate_user_id(id, first_name, last_name, email),
        transactions!transaction_id(id, amount, status)
      `);

    // Apply filters
    if (searchParams.get('affiliate_user_id')) {
      query = query.eq('affiliate_user_id', searchParams.get('affiliate_user_id'));
    }
    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status'));
    }

    if (searchParams.get('start_date')) {
      query = query.gte('created_at', searchParams.get('start_date'));
    }
    if (searchParams.get('end_date')) {
      query = query.lte('created_at', searchParams.get('end_date'));
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching affiliate commissions:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error in handleGetAffiliateCommissions:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleCreateAffiliateCommission(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { 
      affiliate_user_id, 
      transaction_id, 
      retailer_user_id, 
      transaction_amount,
      commission_rate, 
      commission_amount, 
      metadata 
    } = body;

    if (!affiliate_user_id || !transaction_id || !commission_amount) {
      return jsonResponse({ 
        success: false, 
        error: 'affiliate_user_id, transaction_id, and commission_amount are required' 
      }, 400);
    }

    const { data, error } = await supabase
      .from('affiliate_commissions')
      .insert({
        affiliate_user_id,
        transaction_id,
        retailer_user_id,
        transaction_amount,
        commission_rate,
        commission_amount,
        payment_status: 'pending',
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating affiliate commission:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({ success: true, data }, 201);
  } catch (error) {
    console.error('Error in handleCreateAffiliateCommission:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleGetAffiliateProfiles(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    let query = supabase
      .from('affiliate_profiles')
      .select(`
        *,
        users!user_id(id, first_name, last_name, email),
        editions:edition_id(id, name)
      `);

    // Apply filters
    if (searchParams.get('edition_id')) {
      query = query.eq('edition_id', searchParams.get('edition_id'));
    }
    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status'));
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching affiliate profiles:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error in handleGetAffiliateProfiles:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleCreateAffiliateProfile(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { 
      user_id, 
      edition_id, 
      affiliate_code, 
      commission_rate, 
      payment_details,
      metadata 
    } = body;

    if (!user_id || !edition_id || !affiliate_code || !commission_rate) {
      return jsonResponse({ 
        success: false, 
        error: 'user_id, edition_id, affiliate_code, and commission_rate are required' 
      }, 400);
    }

    const { data, error } = await supabase
      .from('affiliate_profiles')
      .insert({
        user_id,
        edition_id,
        affiliate_code,
        commission_rate,
        payment_details: payment_details || {},
        status: 'active',
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating affiliate profile:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({ success: true, data }, 201);
  } catch (error) {
    console.error('Error in handleCreateAffiliateProfile:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleGetRetailers(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    let query = supabase
      .from('retailers')
      .select(`
        *,
        users!user_id(id, first_name, last_name, email),
        editions:edition_id(id, name)
      `);

    // Apply filters
    if (searchParams.get('edition_id')) {
      query = query.eq('edition_id', searchParams.get('edition_id'));
    }
    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status'));
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching retailers:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error in handleGetRetailers:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleCreateRetailer(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { 
      user_id, 
      edition_id, 
      retailer_code, 
      commission_rate, 
      contact_info,
      metadata 
    } = body;

    if (!user_id || !edition_id || !retailer_code) {
      return jsonResponse({ 
        success: false, 
        error: 'user_id, edition_id, and retailer_code are required' 
      }, 400);
    }

    const { data, error } = await supabase
      .from('retailers')
      .insert({
        user_id,
        edition_id,
        retailer_code,
        commission_rate,
        contact_info: contact_info || {},
        status: 'active',
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating retailer:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    return jsonResponse({ success: true, data }, 201);
  } catch (error) {
    console.error('Error in handleCreateRetailer:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleUpdateRetailer(retailerId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ success: false, error: 'Request body is required' }, 400);
    }

    const { status, commission_rate, contact_info, metadata } = body;

    const { data, error } = await supabase
      .from('retailers')
      .update({
        ...(status && { status }),
        ...(commission_rate && { commission_rate }),
        ...(contact_info && { contact_info }),
        ...(metadata && { metadata })
      })
      .eq('id', retailerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating retailer:', error);
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    if (!data) {
      return jsonResponse({ success: false, error: 'Retailer not found' }, 404);
    }

    return jsonResponse({ success: true, data });
  } catch (error) {
    console.error('Error in handleUpdateRetailer:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
