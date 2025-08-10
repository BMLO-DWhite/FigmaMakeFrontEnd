// Backend-Dev Helper Functions
// Created: July 29, 2025 - 11:00 PM EST
// Updated: 7/30/25
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from './constants.ts';
// Initialize and export Supabase client
export const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
// Helper function to create JSON responses with CORS
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}
// Helper function to parse clean route from Supabase function path
export function parseRoute(url) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  // Remove /functions/v1/function-name prefix to get clean route
  const cleanPath = pathname.replace(/^\/functions\/v1\/[^\/]+/, '') || '/';
  return cleanPath;
}
// Helper function to parse request body
export async function parseBody(request) {
  try {
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await request.json();
    }
    return null;
  } catch (error) {
    console.error('❌ Error parsing request body:', error);
    return null;
  }
}
// Helper function to format user response
export function formatUserResponse(user) {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    profileImageUrl: user.profile_image_url,
    role: user.role,
    editionId: user.edition_id,
    companyId: user.company_id,
    channelId: user.channel_id,
    lastLogin: user.last_login,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    status: user.status,
    isCurrent: user.is_current
  };
}