import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://haiakjmaiclzjdvczxpu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhaWFram1haWNsempkdmN6eHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTM1MzUsImV4cCI6MjA3NDYyOTUzNX0.MTqMfUpOO4joWSh0LGzKfT81xyOlnbUvY_2O21GmlGU';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Database table names
export const TABLES = {
  MEMBERS: 'members',
  MESSAGES: 'messages',
  EVENTS: 'events',
  BIRTHDAY_EVENTS: 'birthday_events',
  WISHES: 'wishes',
  DELETED_RECORDS: 'deleted_records'
};

// Storage bucket names
export const STORAGE_BUCKETS = {
  PROFILES: 'profiles',
  EVENTS: 'events',
  SANGATHAN: 'sangathan',
  NEWS: 'news',
  DOCUMENTS: 'documents'
};

// Utility functions
export const utils = {
  formatDate: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN');
  },
  
  formatDateTime: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('en-IN');
  },
  
  generateSlug: (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
};

export default supabase;