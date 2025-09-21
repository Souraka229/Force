import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://rvkurtvyxwcehapzhirm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2a3VydHZ5eHdjZWhhcHpoaXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NTM0MTAsImV4cCI6MjA3NDAyOTQxMH0.3h_JEBWAwLNODRzh-ysd9fg0IwgviiQQGgTN-A4pxKA'

export const supabase = createClient(supabaseUrl, supabaseKey)
