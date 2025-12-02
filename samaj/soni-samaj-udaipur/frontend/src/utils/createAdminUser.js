// Admin User Creation Utility
// This script helps create admin users in the system

import { supabase } from '../supabase/config';

export const createAdminUser = async (email, password, fullName = 'Admin User') => {
  try {
    // First, sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (authError) {
      throw new Error(`Auth signup failed: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('User creation failed');
    }

    // Then create the admin record in admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .insert([
        {
          id: authData.user.id,
          full_name: fullName,
          role: 'admin',
          permissions: ['events_manage', 'members_view', 'posts_manage'],
          is_active: true,
          created_by: authData.user.id
        }
      ])
      .select()
      .single();

    if (adminError) {
      // If admin record creation fails, we should clean up the auth user
      console.error('Admin record creation failed:', adminError);
      throw new Error(`Admin record creation failed: ${adminError.message}`);
    }

    return {
      success: true,
      user: authData.user,
      admin: adminData,
      message: 'Admin user created successfully'
    };

  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

export const createSuperAdmin = async (email, password, fullName = 'Super Admin') => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (authError) {
      throw new Error(`Auth signup failed: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('User creation failed');
    }

    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .insert([
        {
          id: authData.user.id,
          full_name: fullName,
          role: 'super_admin',
          permissions: ['events_manage', 'members_manage', 'sangathan_manage', 'admin_manage'],
          is_active: true,
          created_by: authData.user.id
        }
      ])
      .select()
      .single();

    if (adminError) {
      console.error('Super admin record creation failed:', adminError);
      throw new Error(`Super admin record creation failed: ${adminError.message}`);
    }

    return {
      success: true,
      user: authData.user,
      admin: adminData,
      message: 'Super admin user created successfully'
    };

  } catch (error) {
    console.error('Error creating super admin user:', error);
    throw error;
  }
};

// Usage example (run in browser console):
// import { createSuperAdmin } from './utils/createAdminUser';

//   .then(result => console.log('Success:', result))
//   .catch(error => console.error('Error:', error));