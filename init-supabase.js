
// REPLACE THESE WITH YOUR ACTUAL SUPABASE PROJECT VALUES
const supabaseUrl = 'https://axgbvkawxseeaonktzra.supabase.co';
const supabaseKey = 'sb_publishable_CVCoQI-ZJvqWDbhTuNQ1Wg_Tbm58g9s';

// Initialize the Supabase client and attach to window
// This allows other scripts to usage 'supabase' globally without imports
if (window.supabase) {
    window.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    console.log('Supabase initialized globally via init-supabase.js');
} else {
    console.error('Supabase CDN not loaded');
}
