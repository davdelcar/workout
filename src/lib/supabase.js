import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yywwjurxrkeajyjmdbas.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5d3dqdXJ4cmtlYWp5am1kYmFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NzYwNzIsImV4cCI6MjA1OTI1MjA3Mn0.Yja31p73pNkb6pwR8zxEmLSzhcEImlx7Y_MBRVNX3Ig'

export const supabase = createClient(supabaseUrl, supabaseKey)
