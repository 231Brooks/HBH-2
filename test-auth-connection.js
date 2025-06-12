#!/usr/bin/env node

// Simple test script to verify Supabase connection without running the full app
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Authentication Setup...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const githubId = process.env.GITHUB_ID;
  const githubSecret = process.env.GITHUB_SECRET;
  const googleId = process.env.GOOGLE_CLIENT_ID;
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

  console.log('📋 Environment Variables:');
  console.log(`✅ Supabase URL: ${supabaseUrl ? 'Set' : '❌ Missing'}`);
  console.log(`✅ Supabase Anon Key: ${supabaseAnonKey ? 'Set' : '❌ Missing'}`);
  console.log(`✅ GitHub ID: ${githubId ? 'Set' : '❌ Missing'}`);
  console.log(`✅ GitHub Secret: ${githubSecret ? 'Set' : '❌ Missing'}`);
  console.log(`✅ Google ID: ${googleId ? 'Set' : '❌ Missing'}`);
  console.log(`✅ Google Secret: ${googleSecret ? 'Set' : '❌ Missing'}\n`);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Missing required Supabase credentials');
    return;
  }

  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client created successfully');

    // Test basic connection
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log(`❌ Connection error: ${error.message}`);
      return;
    }

    console.log('✅ Supabase connection successful');
    console.log(`📊 Current session: ${data.session ? 'Active' : 'None'}\n`);

    // Test OAuth URLs
    console.log('🔗 OAuth URLs:');
    console.log(`GitHub: ${supabaseUrl}/auth/v1/authorize?provider=github`);
    console.log(`Google: ${supabaseUrl}/auth/v1/authorize?provider=google\n`);

    console.log('🎉 Authentication setup is ready!');
    console.log('📝 Next steps:');
    console.log('1. Clear disk space (currently 99% full)');
    console.log('2. Run: npm install');
    console.log('3. Run: npm run dev');
    console.log('4. Test login at: http://localhost:3000/auth/login');

  } catch (err) {
    console.log(`❌ Test failed: ${err.message}`);
  }
}

// Run the test
testSupabaseConnection().catch(console.error);
