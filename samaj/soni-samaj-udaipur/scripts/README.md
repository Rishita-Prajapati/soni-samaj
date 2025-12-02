# Soni Samaj Udaipur Database Scripts

## Overview
This folder contains all SQL scripts for setting up the complete database system for Soni Samaj Udaipur website.

## Files Description

### 1. `01_main_tables.sql`
- Creates all main tables: members, messages, events, birthday_events, wishes, deleted_records
- Sets up proper relationships and constraints
- Creates necessary indexes for performance

### 2. `02_security_policies.sql`
- Enables Row Level Security (RLS) on all tables
- Creates policies for public access (registration, contact form)
- Creates admin-only policies for management functions

### 3. `03_functions_triggers.sql`
- Auto-update timestamp triggers
- Auto-create birthday events when member is approved
- Soft delete functionality with archive

### 4. `04_helper_functions.sql`
- Get today's birthdays
- Get upcoming birthdays
- Member statistics
- Approve member function
- Cleanup old deleted records

### 5. `05_complete_setup.sql`
- Runs all scripts in correct order
- Verifies setup completion
- Creates initial admin functions

## Setup Instructions

### Option 1: Run Complete Setup
```sql
-- In Supabase SQL Editor, run:
\i 05_complete_setup.sql
```

### Option 2: Run Individual Scripts
```sql
-- Run in order:
\i 01_main_tables.sql
\i 02_security_policies.sql
\i 03_functions_triggers.sql
\i 04_helper_functions.sql
```

## Key Features

### 1. Member Registration
- Users register through frontend form
- Data automatically stored in `members` table
- Admin can approve/reject from admin panel
- Birthday events auto-created on approval

### 2. Event Management
- Admin creates events (badhai, shok, news) from admin panel
- Events stored in `events` table
- Public can view published events

### 3. Contact Messages
- Contact form submissions stored in `messages` table
- Admin can read/delete messages from admin panel

### 4. Birthday System
- Automatic birthday event creation from member data
- No manual birthday entry needed
- Functions to get today's and upcoming birthdays

### 5. Soft Delete System
- Deleted records archived in `deleted_records` table
- Can recover deleted data if needed
- Auto-cleanup of old deleted records

### 6. Security
- Row Level Security enabled
- Public can only insert (register/contact)
- Admin has full access to manage data
- Proper data isolation

## Database Schema

### Members Table
- Stores all registration data
- Auto-creates birthday events on approval
- Soft delete support

### Events Table
- Stores badhai, shok, news events
- Admin managed
- Public readable when published

### Messages Table
- Contact form submissions
- Admin can mark as read/delete

### Birthday Events Table
- Auto-populated from member data
- No manual entry needed

### Deleted Records Table
- Archive of all deleted data
- Audit trail for deletions

## Usage Examples

### Get Today's Birthdays
```sql
SELECT * FROM get_todays_birthdays();
```

### Get Member Statistics
```sql
SELECT * FROM get_member_stats();
```

### Approve Member
```sql
SELECT approve_member(123);
```

## Notes
- No mock data included - only real data
- All operations are real-time
- Proper error handling in functions
- Optimized for performance with indexes