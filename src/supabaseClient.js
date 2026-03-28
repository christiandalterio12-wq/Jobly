import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "INCOLLA_QUI_PROJECT_URL";
const supabaseAnonKey = "INCOLLA_QUI_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
