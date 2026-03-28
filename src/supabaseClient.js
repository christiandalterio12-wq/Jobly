import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://TUO-PROGETTO.supabase.co'
const supabaseAnonKey = 'TUA-ANON-KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
