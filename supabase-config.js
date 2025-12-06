
// REPLACE THESE WITH YOUR ACTUAL SUPABASE PROJECT VALUES
const supabaseUrl = 'https://axgbvkawxseeaonktzra.supabase.co';
const supabaseKey = 'sb_publishable_CVCoQI-ZJvqWDbhTuNQ1Wg_Tbm58g9s';

// Initialize the Supabase client
// We assume 'supabase' is available globally via the CDN script in HTML
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

export default _supabase;
