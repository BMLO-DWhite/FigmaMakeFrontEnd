import { jsonResponse, parseBody, supabase } from './helpers.ts';
export async function handleGetFulfillmentOrders(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let query = supabase.from('fulfillment_orders').select(`
        *,
        users!user_id(id, first_name, last_name, email),
        companies!company_id(id, name),
        editions!edition_id(id, name),
        retailers:retailer_id(id, first_name, last_name, email),
        fulfillment_order_items(*)
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
    if (searchParams.get('retailer_id')) {
      query = query.eq('retailer_id', searchParams.get('retailer_id'));
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
    query = query.range(offset, offset + limit - 1).order('created_at', {
      ascending: false
    });
    const { data, error, count } = await query;
    if (error) {
      console.error('Error fetching fulfillment orders:', error);
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
    console.error('Error in handleGetFulfillmentOrders:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetFulfillmentOrder(orderId) {
  try {
    const { data, error } = await supabase.from('fulfillment_orders').select(`
        *,
        users!user_id(id, first_name, last_name, email, phone),
        companies!company_id(id, name),
        editions!edition_id(id, name),
        retailers:retailer_id(id, first_name, last_name, email, phone),
        fulfillment_order_items(*)
      `).eq('id', orderId).single();
    if (error) {
      console.error('Error fetching fulfillment order:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Fulfillment order not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleGetFulfillmentOrder:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleCreateFulfillmentOrder(request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { order_number, user_id, company_id, edition_id, retailer_id, shipping_address, billing_address, total_amount, currency, notes, metadata, order_items } = body;
    if (!order_number || !user_id || !edition_id) {
      return jsonResponse({
        success: false,
        error: 'order_number, user_id, and edition_id are required'
      }, 400);
    }
    const { data: order, error: orderError } = await supabase.from('fulfillment_orders').insert({
      order_number,
      user_id,
      company_id,
      edition_id,
      retailer_id,
      shipping_address: shipping_address || {},
      billing_address: billing_address || {},
      total_amount,
      currency: currency || 'USD',
      status: 'pending',
      notes,
      metadata: metadata || {}
    }).select().single();
    if (orderError) {
      console.error('Error creating fulfillment order:', orderError);
      return jsonResponse({
        success: false,
        error: orderError.message
      }, 500);
    }
    if (order_items && order_items.length > 0) {
      const orderItemsData = order_items.map((item)=>({
          fulfillment_order_id: order.id,
          product_name: item.product_name,
          product_sku: item.product_sku,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price || item.quantity * item.unit_price,
          metadata: item.metadata || {}
        }));
      const { error: itemsError } = await supabase.from('fulfillment_order_items').insert(orderItemsData);
      if (itemsError) {
        console.error('Error creating fulfillment order items:', itemsError);
      }
    }
    return jsonResponse({
      success: true,
      data: order
    }, 201);
  } catch (error) {
    console.error('Error in handleCreateFulfillmentOrder:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateFulfillmentOrder(orderId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { status, shipping_address, billing_address, tracking_number, shipped_at, delivered_at, notes, metadata } = body;
    const { data, error } = await supabase.from('fulfillment_orders').update({
      ...status && {
        status
      },
      ...shipping_address && {
        shipping_address
      },
      ...billing_address && {
        billing_address
      },
      ...tracking_number && {
        tracking_number
      },
      ...shipped_at && {
        shipped_at
      },
      ...delivered_at && {
        delivered_at
      },
      ...notes !== undefined && {
        notes
      },
      ...metadata && {
        metadata
      }
    }).eq('id', orderId).select().single();
    if (error) {
      console.error('Error updating fulfillment order:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Fulfillment order not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateFulfillmentOrder:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleMarkOrderAsShipped(orderId, request) {
  try {
    const body = await parseBody(request);
    const { tracking_number, carrier, notes } = body || {};
    const { data, error } = await supabase.from('fulfillment_orders').update({
      status: 'shipped',
      shipped_at: new Date().toISOString(),
      tracking_number,
      carrier,
      notes
    }).eq('id', orderId).select().single();
    if (error) {
      console.error('Error marking order as shipped:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Fulfillment order not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleMarkOrderAsShipped:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleGetFulfillmentOrderItems(orderId) {
  try {
    const { data, error } = await supabase.from('fulfillment_order_items').select('*').eq('fulfillment_order_id', orderId).order('created_at', {
      ascending: true
    });
    if (error) {
      console.error('Error fetching fulfillment order items:', error);
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
    console.error('Error in handleGetFulfillmentOrderItems:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleAddFulfillmentOrderItem(orderId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { product_name, product_sku, quantity, unit_price, total_price, metadata } = body;
    if (!product_name || !quantity || !unit_price) {
      return jsonResponse({
        success: false,
        error: 'product_name, quantity, and unit_price are required'
      }, 400);
    }
    const { data, error } = await supabase.from('fulfillment_order_items').insert({
      fulfillment_order_id: orderId,
      product_name,
      product_sku,
      quantity,
      unit_price,
      total_price: total_price || quantity * unit_price,
      metadata: metadata || {}
    }).select().single();
    if (error) {
      console.error('Error adding fulfillment order item:', error);
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
    console.error('Error in handleAddFulfillmentOrderItem:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleUpdateFulfillmentOrderItem(itemId, request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({
        success: false,
        error: 'Request body is required'
      }, 400);
    }
    const { product_name, product_sku, quantity, unit_price, total_price, metadata } = body;
    const { data, error } = await supabase.from('fulfillment_order_items').update({
      ...product_name && {
        product_name
      },
      ...product_sku !== undefined && {
        product_sku
      },
      ...quantity && {
        quantity
      },
      ...unit_price && {
        unit_price
      },
      ...total_price && {
        total_price
      },
      ...metadata && {
        metadata
      }
    }).eq('id', itemId).select().single();
    if (error) {
      console.error('Error updating fulfillment order item:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Fulfillment order item not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in handleUpdateFulfillmentOrderItem:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}
export async function handleRemoveFulfillmentOrderItem(itemId) {
  try {
    const { data, error } = await supabase.from('fulfillment_order_items').delete().eq('id', itemId).select().single();
    if (error) {
      console.error('Error removing fulfillment order item:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    if (!data) {
      return jsonResponse({
        success: false,
        error: 'Fulfillment order item not found'
      }, 404);
    }
    return jsonResponse({
      success: true,
      message: 'Fulfillment order item removed successfully'
    });
  } catch (error) {
    console.error('Error in handleRemoveFulfillmentOrderItem:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}