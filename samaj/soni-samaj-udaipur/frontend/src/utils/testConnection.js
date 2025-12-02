// Test Supabase connection
import { supabase } from '../supabase/config';

export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase
      .from('system_settings')
      .select('setting_key')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (error) {
    return false;
  }
};

// Run test on import (for debugging)
// Real-time Supabase connection utility
// ...existing code...
// Remove all test/debug code. Use only in production or real environment.
