// Backend-Dev Basic System Handlers
// Created: July 29, 2025 - 11:00 PM EST
// Updated: 7/30/25
import { jsonResponse, supabase } from './helpers.ts';
// Health check endpoint - Added: July 29, 2025 11:00 PM EST
export async function handleHealth() {
  try {
    // Test Supabase connection
    const { data: users, error: usersError } = await supabase.from('users').select('id').limit(1);
    const { data: editions, error: editionsError } = await supabase.from('editions').select('id').limit(1);
    let dbStatus = 'healthy';
    let dbMessage = 'Database is properly initialized';
    if (usersError || editionsError) {
      dbStatus = 'tables_missing';
      dbMessage = 'Database tables not found. Please run database-schema.sql';
    } else if (!users || users.length === 0) {
      dbStatus = 'no_data';
      dbMessage = 'Database tables exist but no data found. Please run database-seed-users.sql';
    }
    const healthResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        message: dbMessage,
        tablesExist: !usersError && !editionsError,
        hasData: users && users.length > 0
      }
    };
    return jsonResponse(healthResponse);
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return jsonResponse({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
}
// Basic endpoints - Added: July 29, 2025 11:00 PM EST
export async function handleGetSession() {
  try {
    return jsonResponse({
      success: true,
      data: {
        user: null,
        session: null
      }
    });
  } catch (error) {
    console.error('❌ Error checking session:', error);
    return jsonResponse({
      success: false,
      error: 'Session check failed'
    }, 500);
  }
}
export async function handlePing() {
  try {
    return jsonResponse({
      success: true,
      data: {
        message: 'Server is running',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Error in ping endpoint:', error);
    return jsonResponse({
      success: false,
      error: 'Ping failed'
    }, 500);
  }
}
export async function handleDebug() {
  try {
    return jsonResponse({
      success: true,
      data: {
        status: 'running',
        timestamp: new Date().toISOString(),
        environment: 'development'
      }
    });
  } catch (error) {
    console.error('❌ Error in debug endpoint:', error);
    return jsonResponse({
      success: false,
      error: 'Debug failed'
    }, 500);
  }
}
export async function handleTest() {
  try {
    return jsonResponse({
      success: true,
      data: {
        message: 'Test endpoint working',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Error in test endpoint:', error);
    return jsonResponse({
      success: false,
      error: 'Test failed'
    }, 500);
  }
}
export async function handleSqlSchema() {
  try {
    return jsonResponse({
      success: true,
      data: {
        sqlContent: '-- SQL schema available in database-schema.sql file',
        message: 'Please use the database-schema.sql file in the project root',
        instructions: [
          'Run the database-schema.sql file in your Supabase SQL editor',
          'Then run the database-seed-users.sql file',
          'Refresh the application'
        ]
      }
    });
  } catch (error) {
    console.error('❌ Error in sql-schema endpoint:', error);
    return jsonResponse({
      success: false,
      error: 'SQL schema fetch failed'
    }, 500);
  }
}