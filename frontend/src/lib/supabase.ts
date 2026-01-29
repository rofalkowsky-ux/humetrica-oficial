import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acxpuzizkaxwauivynco.supabase.co';
const supabaseAnonKey = 'sb_publishable_RIqA8P7q1NeCxd2NOAONTQ_A81id906';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);