import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// You can use environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ibkglvvibihuymfinglu.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlia2dsdnZpYmlodXltZmluZ2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTAwMjksImV4cCI6MjA3MzgyNjAyOX0.OnW1bMrLuK5WVfEnpNUNnFUVpohZEf2B4SOPo02pUac'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  EMPLOYEES: 'employees',
  INCOME: 'income',
  EXPENSES: 'expenses',
  INVENTORY: 'inventory',
  USERS: 'users',
  PAYMENTS: 'payments'
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error, operation = 'operation') {
  console.error(`Supabase ${operation} error:`, error)
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    data: null
  }
}

// Helper function to handle successful responses
export function handleSupabaseSuccess(data, operation = 'operation') {
  console.log(`Supabase ${operation} success:`, data)
  return {
    success: true,
    error: null,
    data: data
  }
}
