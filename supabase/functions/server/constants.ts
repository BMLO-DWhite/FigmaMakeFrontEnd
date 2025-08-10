// Backend-Dev Constants and Types
// Created: 7/30/25
// CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE'
};
// Feature mapping constants
export const FEATURE_MAPPING = {
  'co_branding': 'Co-Branding',
  'documents': 'Document management',
  'notes': 'Notes Module',
  'ems_response': 'EMS Response Report',
  'custom_fields': 'Custom Fields'
};
export const LABEL_TO_KEY_MAPPING = {
  'Co-Branding': 'co_branding',
  'Document management': 'documents',
  'Notes Module': 'notes',
  'EMS Response Report': 'ems_response',
  'Custom Fields': 'custom_fields'
};