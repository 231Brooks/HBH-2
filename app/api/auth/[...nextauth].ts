// This file is disabled to avoid conflicts with Supabase Auth
// Using Supabase Auth instead of NextAuth for this project

export default function handler() {
  return new Response('NextAuth disabled - using Supabase Auth', { status: 404 });
}
