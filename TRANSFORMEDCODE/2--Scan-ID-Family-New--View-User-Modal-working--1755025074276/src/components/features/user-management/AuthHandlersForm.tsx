
import React from 'react';
import React from 'react';
import styles from './supabase/functions/server/authhandlersform.module.css';


interface AuthHandlersProps {
  
  scope: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}


export default function Supabase/functions/server/authHandlersForm(props: AuthHandlersProps) {



  // Original component logic with enhancements
  // Component state
  
  // Component effects
  
  // Event handlers
  
  return (
    <div className={styles.container}>
      
      
      {/* Original component JSX with improvements */}
      // Backend-Dev Authentication Handlers
// Created: July 29, 2025 - 11:00 PM EST
// Updated: 7/30/25
import { jsonResponse, parseBody, formatUserResponse, supabase } from './helpers.ts';
// Authentication endpoints - Added: July 29, 2025 11:00 PM EST
export async function handleLogin(request) {
  try {
    const body = await parseBody(request);
    const { email, password } = body || {};
    // Validate inputs
    if (!email || !password) {
      return jsonResponse({
        success: false,
        error: 'Email and password are required'
      }, 400);
    }
    // Simple password check for development (password is "123456" for all users)
    if (password !== '123456') {
      return jsonResponse({
        success: false,
        error: 'Invalid email or password'
      }, 401);
    }
    // Use the same query pattern as handleTestCredentials (which works!)
    const { data: users, error } = await supabase.from('users').select(`
        *,
        companies:company_id (
          id,
          name
        ),
        editions:edition_id (
          id,
          name
        )
      `).eq('email', email.toLowerCase()).eq('status', 'active');
    if (error) {
      console.error('❌ Error fetching user:', error);
      return jsonResponse({
        success: false,
        error: 'Invalid email or password'
      }, 401);
    }
    if (!users || users.length === 0) {
      return jsonResponse({
        success: false,
        error: 'Invalid email or password'
      }, 401);
    }
    const user = users[0]; // Get the first (and should be only) user
    // Update last login time
    await supabase.from('users').update({
      last_login: new Date().toISOString(),
      is_current: true
    }).eq('id', user.id);
    // Clear is_current flag for other users of the same role
    await supabase.from('users').update({
      is_current: false
    }).neq('id', user.id).eq('role', user.role);
    const loginResponse = {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        profileImageUrl: user.profile_image_url,
        role: user.role,
        editionId: user.edition_id,
        editionName: user.editions?.name || null,
        companyId: user.company_id,
        channelId: user.channel_id,
        lastLogin: user.last_login,
        createdAt: user.created_at,
        status: user.status,
        isCurrent: true,
        company: user.companies ? {
          id: user.companies.id,
          name: user.companies.name
        } : null,
        edition: user.editions ? {
          id: user.editions.id,
          name: user.editions.name
        } : null
      },
      token: 'dev-token-' + user.id
    };
    return jsonResponse({
      success: true,
      data: loginResponse
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return jsonResponse({
      success: false,
      error: 'Login failed: ' + error.message
    }, 500);
  }
}
export async function handleLogout() {
  try {
    // Clear is_current flag for current user
    await supabase.from('users').update({
      is_current: false
    }).eq('is_current', true);
    return jsonResponse({
      success: true
    });
  } catch (error) {
    console.error('❌ Logout error:', error);
    return jsonResponse({
      success: false,
      error: 'Logout failed'
    }, 500);
  }
}
// Profile endpoints - Added: July 29, 2025 11:00 PM EST
export async function handleGetProfile() {
  try {
    console.log('🔍 Checking for current user profile...');
    // First check if users table exists and has any data
    const { data: allUsers, error: allUsersError } = await supabase.from('users').select('id, email, is_current').limit(1);
    if (allUsersError) {
      console.error('❌ Database connection or table error:', allUsersError);
      return jsonResponse({
        success: false,
        error: 'Database not initialized. Please run the SQL setup scripts.'
      }, 503);
    }
    if (!allUsers || allUsers.length === 0) {
      console.log('📝 No users found in database');
      return jsonResponse({
        success: false,
        error: 'No users found. Please run the database seed scripts.'
      }, 404);
    }
    // Get current user (the one with is_current = true)
    const { data: user, error: userError } = await supabase.from('users').select('*').eq('is_current', true).single();
    if (userError || !user) {
      console.log('👤 No current user found, user should login');
      return jsonResponse({
        success: false,
        error: 'No active session found'
      }, 401);
    }
    console.log('✅ Current user found:', {
      id: user.id,
      email: user.email,
      role: user.role
    });
    const userProfile = formatUserResponse(user);
    return jsonResponse({
      success: true,
      data: userProfile
    });
  } catch (error) {
    console.error('❌ Error getting user profile:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to get user profile: ' + error.message
    }, 500);
  }
}
export async function handleUpdateProfile(request) {
  try {
    const body = await parseBody(request);
    const { firstName, lastName, email, phone } = body || {};
    if (!firstName || !lastName || !email) {
      return jsonResponse({
        success: false,
        error: 'First name, last name, and email are required'
      }, 400);
    }
    // Get current user (the one with is_current = true)
    const { data: currentUser, error: currentUserError } = await supabase.from('users').select('id').eq('is_current', true).single();
    if (currentUserError || !currentUser) {
      return jsonResponse({
        success: false,
        error: 'No active session found'
      }, 401);
    }
    // Update the current user
    const { data: user, error } = await supabase.from('users').update({
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase(),
      phone: phone || null,
      updated_at: new Date().toISOString()
    }).eq('id', currentUser.id).select().single();
    if (error) {
      console.error('❌ Error updating user profile:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    const userProfile = formatUserResponse(user);
    return jsonResponse({
      success: true,
      data: userProfile
    });
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to update user profile: ' + error.message
    }, 500);
  }
}
// Test credentials endpoint - Added: July 29, 2025 11:00 PM EST
export async function handleTestCredentials(request) {
  try {
    const body = await parseBody(request);
    const { email, password } = body || {};
    // Simple auth check - must be daniel@scanid365.com with password 123456
    if (email !== 'daniel@scanid365.com' || password !== '123456') {
      return jsonResponse({
        success: false,
        error: 'Unauthorized access to test credentials'
      }, 401);
    }
    // Get all users with their associated company and edition information
    const { data: users, error } = await supabase.from('users').select(`
        *,
        companies:company_id (
          id,
          name
        ),
        editions:edition_id (
          id,
          name
        )
      `).eq('status', 'active').order('role').order('first_name');
    if (error) {
      console.error('❌ Error fetching test credentials:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    // Format credentials for the frontend
    const credentials = (users || []).map((user)=>({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        editionId: user.edition_id,
        companyId: user.company_id,
        lastLogin: user.last_login,
        company: user.companies ? {
          id: user.companies.id,
          name: user.companies.name
        } : null,
        edition: user.editions ? {
          id: user.editions.id,
          name: user.editions.name
        } : null
      }));
    return jsonResponse({
      success: true,
      data: {
        credentials
      }
    });
  } catch (error) {
    console.error('❌ Error in test credentials endpoint:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to fetch test credentials'
    }, 500);
  }
}
// ============================================================================
// USER MANAGEMENT CRUD OPERATIONS - Added: July 31, 2025
// ============================================================================
// Helper function to validate development token
function validateDevToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      valid: false,
      error: 'Missing or invalid authorization header'
    };
  }
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  // For development: accept dev-token format
  if (token.startsWith('dev-token-')) {
    const userId = token.replace('dev-token-', '');
    return {
      valid: true,
      userId
    };
  }
  // Also accept the anon key for testing
  if (token === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnamlyYWttbGlrYXNra2VzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjUxOTAsImV4cCI6MjA2OTA0MTE5MH0.kiQmzzUepA4YRaWhwsIf3CzrzWpV5SC40Y82slzjVOY') {
    return {
      valid: true,
      userId: 'anon'
    };
  }
  return {
    valid: false,
    error: 'Invalid token format'
  };
}
// GET /users - List all users with filtering and pagination
export async function handleGetUsers(request) {
  try {
    console.log('🔍 Getting all users with company relationships...');
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    console.log('🔍 Getting users with search params:', searchParams);
    
    // First get users with basic info and edition/company references
    const { data: users, error } = await supabase.from('users').select(`
        id, first_name, last_name, email, role, status, edition_id, company_id, phone, last_login, created_at, updated_at,
        editions:edition_id (
          id,
          name
        )
      `).eq('status', 'active').order('role').order('first_name');
    
    if (error) {
      console.error('❌ Error fetching users:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }

    // Get user company relationships for all users
    const userIds = (users || []).map(user => user.id);
    let userCompaniesData = [];
    
    if (userIds.length > 0) {
      const { data: userCompanies, error: userCompaniesError } = await supabase
        .from('user_companies')
        .select(`
          user_id,
          company_id,
          role,
          companies (
            id,
            name,
            channel_id,
            channels:channel_id (
              id,
              name
            )
          )
        `)
        .in('user_id', userIds);

      if (userCompaniesError) {
        console.warn('⚠️ Error fetching user companies:', userCompaniesError);
      } else {
        userCompaniesData = userCompanies || [];
        console.log(`✅ Fetched ${userCompaniesData.length} user company relationships`);
      }
    }

    // Format users for frontend with company relationships
    const formattedUsers = (users || []).map((user) => {
      // Find all company relationships for this user
      const userCompanies = userCompaniesData
        .filter(uc => uc.user_id === user.id)
        .map(uc => ({
          companyId: uc.company_id,
          company: uc.companies ? {
            id: uc.companies.id,
            name: uc.companies.name
          } : null,
          role: uc.role,
          channelId: uc.companies?.channel_id || null,
          channel: uc.companies?.channels ? {
            id: uc.companies.channels.id,
            name: uc.companies.channels.name
          } : null
        }));

      console.log(`👤 User ${user.email} has ${userCompanies.length} company relationships`);

      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        status: user.status,
        editionId: user.edition_id,
        companyId: user.company_id,
        phone: user.phone,
        lastLogin: user.last_login,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        edition: user.editions ? {
          id: user.editions.id,
          name: user.editions.name
        } : null,
        userCompanies: userCompanies,
        // Keep legacy company field for backward compatibility
        company: userCompanies.length > 0 ? userCompanies[0].company : null
      };
    });
    
    console.log(`✅ Successfully fetched ${formattedUsers.length} users with company relationships`);
    return jsonResponse({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          page: 1,
          limit: 50,
          total: formattedUsers.length
        }
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetUsers:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to fetch users'
    }, 500);
  }
}
// POST /users - Create a new user
export async function handleCreateUser(request) {
  try {
    console.log('➕ Creating new user...');
    console.log('🔍 Creating new user');
    const userData = await request.json();
    console.log('📝 User data received:', userData);
    // Validate required fields
    if (!userData.email || !userData.firstName || !userData.lastName) {
      return jsonResponse({
        success: false,
        error: 'Missing required fields: email, firstName, lastName'
      }, 400);
    }
    // Check if user already exists
    const { data: existingUser } = await supabase.from('users').select('id, email').eq('email', userData.email.toLowerCase()).single();
    if (existingUser) {
      return jsonResponse({
        success: false,
        error: 'User with this email already exists'
      }, 409);
    }
    // Prepare user data for database
    const newUser = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email.toLowerCase(),
      role: userData.role || 'user',
      status: userData.status || 'active',
      edition_id: userData.editionId || null,
      company_id: userData.companyId || null,
      phone: userData.phone || null,
      created_at: new Date().toISOString()
    };
    const { data: createdUser, error } = await supabase.from('users').insert([
      newUser
    ]).select(`
      id, first_name, last_name, email, role, status, edition_id, company_id, phone, created_at, updated_at
    `).single();
    if (error) {
      console.error('❌ Error creating user:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }

    let companyAssignments: any[] = [];
    if (userData.company_assignments && Array.isArray(userData.company_assignments)) {
      console.log('📋 Processing company assignments:', userData.company_assignments.length);
      
      for (const assignment of userData.company_assignments) {
        const { company_id, edition_id, role, department, job_title, permissions, notes } = assignment;
        
        if (!company_id || !edition_id || !role) {
          console.warn('⚠️ Skipping invalid assignment - missing required fields:', assignment);
          continue;
        }

        const { data: existing, error: checkError } = await supabase
          .from('user_companies')
          .select('id')
          .eq('user_id', createdUser.id)
          .eq('company_id', company_id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('❌ Error checking existing relationship:', checkError);
          continue;
        }

        if (existing) {
          console.warn('⚠️ Skipping duplicate assignment for company:', company_id);
          continue;
        }

        const { data: assignmentData, error: assignmentError } = await supabase
          .from('user_companies')
          .insert({
            user_id: createdUser.id,
            company_id,
            edition_id,
            role,
            department,
            job_title,
            start_date: new Date().toISOString(),
            permissions: permissions || {},
            status: 'active',
            notes
          })
          .select(`id, user_id, company_id, edition_id, role, department, job_title, start_date, permissions, status, notes`)
          .single();

        if (assignmentError) {
          console.error('❌ Error creating company assignment:', assignmentError);
          continue;
        }

        companyAssignments.push(assignmentData);
      }
      
      console.log('✅ Successfully created', companyAssignments.length, 'company assignments');
    }
    // Format response
    const formattedUser = {
      id: createdUser.id,
      firstName: createdUser.first_name,
      lastName: createdUser.last_name,
      email: createdUser.email,
      role: createdUser.role,
      status: createdUser.status,
      editionId: createdUser.edition_id,
      companyId: createdUser.company_id,
      phone: createdUser.phone,
      createdAt: createdUser.created_at,
      updatedAt: createdUser.updated_at,
      company: null,
      edition: null,
      companyAssignments: companyAssignments.map(assignment => ({
        id: assignment.id,
        companyId: assignment.company_id,
        editionId: assignment.edition_id,
        role: assignment.role,
        department: assignment.department,
        jobTitle: assignment.job_title,
        startDate: assignment.start_date,
        permissions: assignment.permissions,
        status: assignment.status,
        notes: assignment.notes,
        company: null,
        edition: null
      }))
    };
    console.log('✅ Successfully created user:', formattedUser.id);
    return jsonResponse({
      success: true,
      data: {
        user: formattedUser
      }
    }, 201);
  } catch (error) {
    console.error('❌ Error in handleCreateUser:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to create user'
    }, 500);
  }
}
// PUT /users/:id - Update an existing user
export async function handleUpdateUser(userId, request) {
  try {
    console.log('🔍 Updating user:', userId);
    const userData = await request.json();
    console.log('📝 User update data:', userData);
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase.from('users').select('id, email').eq('id', userId).single();
    if (fetchError || !existingUser) {
      return jsonResponse({
        success: false,
        error: 'User not found'
      }, 404);
    }
    // If email is being changed, check for conflicts
    if (userData.email && userData.email.toLowerCase() !== existingUser.email) {
      const { data: emailConflict } = await supabase.from('users').select('id').eq('email', userData.email.toLowerCase()).neq('id', userId).single();
      if (emailConflict) {
        return jsonResponse({
          success: false,
          error: 'Email already in use by another user'
        }, 409);
      }
    }
    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    if (userData.firstName) updateData.first_name = userData.firstName;
    if (userData.lastName) updateData.last_name = userData.lastName;
    if (userData.email) updateData.email = userData.email.toLowerCase();
    if (userData.role) updateData.role = userData.role;
    if (userData.status) updateData.status = userData.status;
    if (userData.editionId !== undefined) updateData.edition_id = userData.editionId;
    if (userData.companyId !== undefined) updateData.company_id = userData.companyId;
    if (userData.phone !== undefined) updateData.phone = userData.phone;
    const { data: updatedUser, error } = await supabase.from('users').update(updateData).eq('id', userId).select(`
      id, first_name, last_name, email, role, status, edition_id, company_id, phone, created_at, updated_at
    `).single();
    if (error) {
      console.error('❌ Error updating user:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }

    let companyAssignments: any[] = [];
    if (userData.company_assignments && Array.isArray(userData.company_assignments)) {
      console.log('📋 Processing company assignments update:', userData.company_assignments.length);
      
      
      for (const assignment of userData.company_assignments) {
        const { company_id, edition_id, role, department, job_title, permissions, notes } = assignment;
        
        if (!company_id || !edition_id || !role) {
          console.warn('⚠️ Skipping invalid assignment - missing required fields:', assignment);
          continue;
        }

        const { data: existing, error: checkError } = await supabase
          .from('user_companies')
          .select('id')
          .eq('user_id', userId)
          .eq('company_id', company_id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('❌ Error checking existing relationship:', checkError);
          continue;
        }

        if (existing) {
          console.warn('⚠️ Skipping duplicate assignment for company:', company_id);
          continue;
        }

        const { data: assignmentData, error: assignmentError } = await supabase
          .from('user_companies')
          .insert({
            user_id: userId,
            company_id,
            edition_id,
            role,
            department,
            job_title,
            start_date: new Date().toISOString(),
            permissions: permissions || {},
            status: 'active',
            notes
          })
          .select(`id, user_id, company_id, edition_id, role, department, job_title, start_date, permissions, status, notes`)
          .single();

        if (assignmentError) {
          console.error('❌ Error creating company assignment:', assignmentError);
          continue;
        }

        companyAssignments.push(assignmentData);
      }
      
      console.log('✅ Successfully processed', companyAssignments.length, 'new company assignments');
    }
    // Format response
    const formattedUser = {
      id: updatedUser.id,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      editionId: updatedUser.edition_id,
      companyId: updatedUser.company_id,
      phone: updatedUser.phone,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
      company: null,
      edition: null,
      newCompanyAssignments: companyAssignments.map(assignment => ({
        id: assignment.id,
        companyId: assignment.company_id,
        editionId: assignment.edition_id,
        role: assignment.role,
        department: assignment.department,
        jobTitle: assignment.job_title,
        startDate: assignment.start_date,
        permissions: assignment.permissions,
        status: assignment.status,
        notes: assignment.notes,
        company: null,
        edition: null
      }))
    };
    console.log('✅ Successfully updated user:', userId);
    return jsonResponse({
      success: true,
      data: {
        user: formattedUser
      }
    });
  } catch (error) {
    console.error('❌ Error in handleUpdateUser:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to update user'
    }, 500);
  }
}
// DELETE /users/:id - Delete a user (soft delete by setting status to 'deleted')
export async function handleDeleteUser(userId, request) {
  try {
    console.log('🔍 Deleting user:', userId);
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase.from('users').select('id, email, status').eq('id', userId).single();
    if (fetchError || !existingUser) {
      return jsonResponse({
        success: false,
        error: 'User not found'
      }, 404);
    }
    if (existingUser.status === 'deleted') {
      return jsonResponse({
        success: false,
        error: 'User is already deleted'
      }, 400);
    }
    // Soft delete: set status to 'deleted' and update timestamp
    const { data: deletedUser, error } = await supabase.from('users').update({
      status: 'deleted',
      updated_at: new Date().toISOString()
    }).eq('id', userId).select('id, email, status, updated_at').single();
    if (error) {
      console.error('❌ Error deleting user:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    console.log('✅ Successfully deleted user:', userId);
    return jsonResponse({
      success: true,
      data: {
        message: 'User deleted successfully',
        user: {
          id: deletedUser.id,
          email: deletedUser.email,
          status: deletedUser.status,
          deletedAt: deletedUser.updated_at
        }
      }
    });
  } catch (error) {
    console.error('❌ Error in handleDeleteUser:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to delete user'
    }, 500);
  }
}

    </div>
  );
}
