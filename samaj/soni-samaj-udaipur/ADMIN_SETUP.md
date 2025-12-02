# Admin Panel Setup Guide

## Overview
The Soni Samaj admin panel now has secure email/password authentication with the following features:
- Secure login with email and password
- Account lockout after 5 failed attempts (15-minute lockout)
- Role-based access control
- Session management
- Clean, minimal UI

## Admin Login Credentials


### Default Super Admin Account
**Set up your real admin credentials here.**
**Role**: super_admin
**Permissions**: Full access to all features

## Creating New Admin Users

### Method 1: Using SQL (Recommended for first setup)
Run this in your Supabase SQL Editor:

```sql
-- Create auth user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  '<REAL_ADMIN_EMAIL>',
  crypt('<REAL_SECURE_PASSWORD>', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Create admin record
INSERT INTO admin_users (
  id,
  full_name,
  role,
  permissions,
  is_active
) VALUES (
  (SELECT id FROM auth.users WHERE email = '<REAL_ADMIN_EMAIL>'),
  'Super Admin',
  'super_admin',
  ARRAY['events_manage', 'members_manage', 'sangathan_manage', 'admin_manage'],
  true
);
```

### Method 2: Using JavaScript Utility
```javascript
import { createSuperAdmin } from './frontend/src/utils/createAdminUser';

// Create super admin
createSuperAdmin('<REAL_ADMIN_EMAIL>', '<REAL_SECURE_PASSWORD>', 'Super Admin')
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));
```

## Admin Panel Features

### Cleaned Up Navigation
- **Dashboard**: Overview and quick actions
- **Members**: Member management
- **Events**: Event overview
- **Badhai**: Celebration events
- **Shok News**: Condolence announcements
- **Birthdays**: Birthday events
- **News**: News articles
- **Sangthan**: Organization structure

### Security Features
- Email/password authentication
- Failed login attempt tracking
- Account lockout protection
- Role-based permissions
- Secure session management

### Removed Features
- Unnecessary placeholder pages
- Redundant navigation items
- Complex settings panels
- Unused quick actions

## Access URLs

- **Admin Login**: `/admin/login`
- **Admin Dashboard**: `/admin/dashboard`
- **Public Website**: `/`

## Security Best Practices

1. **Change Default Password**: Immediately change the default admin password
2. **Use Strong Passwords**: Minimum 12 characters with mixed case, numbers, and symbols
3. **Regular Updates**: Keep admin credentials updated
4. **Monitor Access**: Check activity logs regularly
5. **Limit Admin Users**: Only create necessary admin accounts

## Troubleshooting

### Login Issues
- Check email format (must be valid email)
- Verify password (case-sensitive)
- Wait 15 minutes if account is locked
- Check browser console for errors

### Database Issues
- Ensure Supabase connection is working
- Verify admin_users table exists
- Check RLS policies are properly set

### Environment Setup
- Verify REACT_APP_SUPABASE_URL is set
- Verify REACT_APP_SUPABASE_ANON_KEY is set
- Check .env file configuration

## Support
For technical support or issues, contact the development team or check the application logs for detailed error messages.