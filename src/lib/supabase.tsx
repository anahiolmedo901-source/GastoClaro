// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = 'https://xlddjiwjgorvwkxtyjlv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZGRqaXdqZ29ydndreHR5amx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNDU1NTEsImV4cCI6MjA5NjcyMTU1MX0.TF5iqfLAlObCDMG47DacJBL4jLFPcYu8RjyEct4s_rc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);