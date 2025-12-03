

// --- IMPORTANT SUPABASE SECURITY CONFIGURATION ---
// The login, sign-up, and payment history functionality will NOT work correctly 
// without proper Row Level Security (RLS) policies on your Supabase tables.
// If users are getting signed out, or data fails to load, it is almost 
// certainly because RLS is not configured correctly.

// Please follow these steps in your Supabase project dashboard:
// 1. Go to "Authentication" -> "Policies".
// 2. Find the 'profiles' and 'payments' tables. For each, ensure RLS is enabled.
// 3. Create the following policies:

// --- POLICY 1 (profiles): Allow users to read their OWN profile ---
//    - Table: `profiles`
//    - Policy Name: `Enable read access for own user`
//    - Operation: `SELECT`
//    - USING expression: `auth.uid() = id`

// --- POLICY 2 (profiles): Allow users to create their OWN profile on sign-up ---
//    - Table: `profiles`
//    - Policy Name: `Enable insert for own user`
//    - Operation: `INSERT`
//    - WITH CHECK expression: `auth.uid() = id`

// --- POLICY 3 (payments): Allow users to read their OWN payments ---
//    - Table: `payments`
//    - Policy Name: `Enable read access for own payments`
//    - Operation: `SELECT`
//    - USING expression: `auth.uid() = user_id`

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kmxtvuzgudwuxdzxcmxy.supabase.co';
// The user has provided the public anon key to connect to their Supabase instance.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtteHR2dXpndWR3dXhkenhjbXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjUyOTEsImV4cCI6MjA3NjA0MTI5MX0.gtHYkgMqHmjh0sn-A0FtMgOoYJnB8kdbGoQ64Tv2upA';

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL and Key must be provided.");
}

// FIX: Added explicit auth options to the Supabase client. While `autoRefreshToken`
// and `persistSession` are true by default, being explicit can prevent issues
// in some environments and makes the configuration clearer. This helps ensure that
// the client actively manages session tokens, which is crucial for preventing
// "Invalid Refresh Token" errors that occur when a session becomes stale.
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false // This is for OAuth and magic links, not used in this app
    }
});
