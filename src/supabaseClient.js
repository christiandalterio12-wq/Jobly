import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://aedrfsluzmcljeamkrrb.supabase.co'
const supabaseKey = 'sb_publishable_nvAvsuf4CBfRYF69yZc3Ew_WYiiSP85'
export const supabase = createClient(supabaseUrl, supabaseKey)
