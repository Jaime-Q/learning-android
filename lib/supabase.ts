import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zoljzlwbdvhkqykpieqf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbGp6bHdiZHZoa3F5a3BpZXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDc3NTksImV4cCI6MjA3MzgyMzc1OX0.YrzSpz-1c1U2k07T2ugN-Dybgq52Xxe2HlCCpUlA4BA';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY, {
   auth: { persistSession: false },
});
