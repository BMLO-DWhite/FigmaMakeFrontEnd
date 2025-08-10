// Scan ID 365 Backend - Complete Version with Corrected Routing
// Updated: July 31, 2025 - Fixed routing and added user management
// Purpose: Full backend API with all modules loaded
// Import all handlers from organized modules
import { corsHeaders } from './constants.ts';
import { handleHealth, handleGetSession, handlePing, handleDebug, handleTest, handleSqlSchema } from './basic-handlers.ts';
import { handleLogin, handleLogout, handleGetProfile, handleUpdateProfile, handleTestCredentials, handleGetUsers, handleCreateUser, handleUpdateUser, handleDeleteUser } from './auth-handlers.ts';
import { handleGetEditions, handleCreateEdition, handleUpdateEdition, handleDeleteEdition, handleGetEditionStats, handleGetEditionAdmins, handleCreateEditionAdmin, handleGetCoBranding, handleSaveCoBranding, handleUploadLogo } from './edition-handlers.ts';
import { handleGetEditionAdminMetrics, handleGetCompaniesByEdition, handleGetAdminUsers, handleGetCompanyTitles, handleGetCompanyTypes, handleGetAuditLogs, handleGetAuditLogsStats, handleGetSettings, handleSaveSettings, handleUploadSettingsLogo, handleGetSuperAdmins, handleCreateSuperAdmin, handleUpdateSuperAdmin, handleDeleteSuperAdmin, handleGetDashboardMetrics, handleGetCompanies } from './dashboard-handlers.ts';
import { handleGetSafetyIds, handleGetSafetyId, handleCreateSafetyId, handleUpdateSafetyId, handleDeleteSafetyId, handleAssignSafetyId, handleBulkCreateSafetyIds, handleSearchSafetyIds, handleGetSafetyIdOrders, handleCreateSafetyIdOrder, handleUpdateSafetyIdOrder, handleGetSafetyIdPrintBatches, handleCreateSafetyIdPrintBatch, handleGeneratePrintBatchCsv } from './safety-id-handlers.ts';
import { handleGetTransactions, handleGetTransaction, handleCreateTransaction, handleUpdateTransaction, handleProcessRefund, handleGetTransactionLineItems, handleGetSubscriptions, handleGetSubscription, handleCreateSubscription, handleUpdateSubscription, handleCancelSubscription, handleGetSubscriptionHistory, handleGetAffiliateCommissions, handleCreateAffiliateCommission, handleGetAffiliateProfiles, handleCreateAffiliateProfile, handleGetRetailers, handleCreateRetailer, handleUpdateRetailer } from './financial-handlers.ts';
import { handleGetDocuments, handleGetDocument, handleUploadDocument, handleUpdateDocument, handleDeleteDocument, handleDownloadDocument, handleShareDocument, handleGetDocumentTags, handleCreateDocumentTag, handleUpdateDocumentTag, handleDeleteDocumentTag, handleAssignDocumentTags, handleRemoveDocumentTag } from './documents-handlers.ts';
import { handleGetNotes, handleGetNote, handleCreateNote, handleUpdateNote, handleDeleteNote, handleShareNote, handleGetNoteTags, handleCreateNoteTag, handleUpdateNoteTag, handleDeleteNoteTag, handleAssignNoteTags, handleRemoveNoteTag, handleGetNotesByTag } from './notes-handlers.ts';
import { handleGetDelegates, handleGetDelegate, handleCreateDelegation, handleUpdateDelegation, handleRemoveDelegation, handleGetFamilyDelegations, handleGetCompanyDelegations, handleUpdateDelegationPermissions, handleCheckDelegationPermission, handleGetDelegationStats, handleBulkCreateDelegations } from './delegation-handlers.ts';
import { handleGetEmergencyContacts, handleGetEmergencyContact, handleCreateEmergencyContact, handleUpdateEmergencyContact, handleDeleteEmergencyContact, handleGetUserEmergencyContacts, handleLinkContactToUser, handleUpdateUserEmergencyContact, handleRemoveUserEmergencyContact, handleSetPrimaryEmergencyContact, handleSearchEmergencyContacts } from './emergency-contacts-handlers.ts';
import { handleGetUserCompanies, handleGetCompanyUsers, handleAddUserToCompany, handleUpdateUserCompanyRole, handleRemoveUserFromCompany, handleInviteUserToCompany, handleGetUserCompaniesForUser } from './user-company-handlers.ts';
import { handleGetFulfillmentOrders, handleGetFulfillmentOrder, handleCreateFulfillmentOrder, handleUpdateFulfillmentOrder, handleMarkOrderAsShipped, handleGetFulfillmentOrderItems, handleAddFulfillmentOrderItem, handleUpdateFulfillmentOrderItem, handleRemoveFulfillmentOrderItem } from './fulfillment-handlers.ts';
import { handleGetCustomFields, handleGetCustomField, handleCreateCustomField, handleUpdateCustomField, handleDeleteCustomField, handleGetPricingConfigurations, handleCreatePricingConfiguration, handleUpdatePricingConfiguration, handleGetReminderSettings, handleCreateReminderSetting, handleUpdateReminderSetting, handleGetUserNotificationPreferences, handleUpdateUserNotificationPreferences } from './configuration-handlers.ts';
Deno.serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const url = new URL(req.url);
    const method = req.method;
    // Fix path parsing - handle Supabase Edge Function URL structure
    let path = url.pathname;
    // Remove the function name from the path if it exists
    if (path.includes('/backend-dev')) {
      const parts = path.split('/backend-dev');
      path = parts.length > 1 ? parts[1] : '/';
    } else if (path.includes('/functions/v1/backend-dev')) {
      path = path.replace('/functions/v1/backend-dev', '');
    }
    // Ensure path starts with / or default to /
    if (!path || path === '') path = '/';
    if (!path.startsWith('/')) path = '/' + path;
    console.log(`� Backend API: ${method} ${path}`);
    // Route handlers using corrected routing
    // Root endpoint - welcome message
    if (path === '/' && method === 'GET') {
      return new Response(JSON.stringify({
        success: true,
        message: 'Scan ID 365 Backend API - All modules loaded successfully!',
        timestamp: new Date().toISOString(),
        availableEndpoints: [
          '/health',
          '/ping',
          '/debug',
          '/profile',
          '/auth/login',
          '/editions',
          '/companies',
          '/super-admins',
          '/settings',
          '/users',
          '/safety-ids',
          '/transactions',
          '/subscriptions',
          '/documents',
          '/notes',
          '/delegates',
          '/emergency-contacts',
          '/user-companies',
          '/fulfillment-orders',
          '/custom-fields',
          '/pricing-configurations'
        ]
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    // Health check endpoint
    if (path === '/health' && method === 'GET') {
      return await handleHealth();
    }
    // Basic endpoints
    if (path === '/session' && method === 'GET') {
      return await handleGetSession();
    }
    if (path === '/ping' && method === 'GET') {
      return await handlePing();
    }
    if (path === '/debug' && method === 'GET') {
      return await handleDebug();
    }
    if (path === '/test' && method === 'GET') {
      return await handleTest();
    }
    if (path === '/sql-schema' && method === 'GET') {
      return await handleSqlSchema();
    }
    // Authentication endpoints
    if (path === '/auth/login' && method === 'POST') {
      return await handleLogin(req);
    }
    if (path === '/auth/logout' && method === 'POST') {
      return await handleLogout();
    }
    // Profile endpoints
    if (path === '/profile' && method === 'GET') {
      return await handleGetProfile();
    }
    if (path === '/profile' && method === 'PUT') {
      return await handleUpdateProfile(req);
    }
    // Test credentials endpoint
    if (path === '/test-credentials' && method === 'POST') {
      return await handleTestCredentials(req);
    }
    // User management endpoints (NEW)
    if (path === '/users' && method === 'GET') {
      return await handleGetUsers(req);
    }
    if (path === '/users' && method === 'POST') {
      return await handleCreateUser(req);
    }
    if (path.startsWith('/users/') && method === 'PUT') {
      const userId = path.split('/')[2];
      return await handleUpdateUser(userId, req);
    }
    if (path.startsWith('/users/') && method === 'DELETE') {
      const userId = path.split('/')[2];
      return await handleDeleteUser(userId, req);
    }
    // Edition endpoints
    if (path === '/editions' && method === 'GET') {
      return await handleGetEditions();
    }
    if (path === '/editions' && method === 'POST') {
      return await handleCreateEdition(req);
    }
    if (path.startsWith('/editions/') && method === 'PUT') {
      const editionId = path.split('/')[2];
      return await handleUpdateEdition(editionId, req);
    }
    if (path.startsWith('/editions/') && method === 'DELETE') {
      const deleteEditionId = path.split('/')[2];
      return await handleDeleteEdition(deleteEditionId);
    }
    if (path.startsWith('/editions/') && path.includes('/stats') && method === 'GET') {
      const statsEditionId = path.split('/')[2];
      return await handleGetEditionStats(statsEditionId);
    }
    // Co-branding endpoints
    if (path.startsWith('/editions/') && path.includes('/co-branding') && method === 'GET') {
      const coBrandingEditionId = path.split('/')[2];
      return await handleGetCoBranding(coBrandingEditionId);
    }
    if (path.startsWith('/editions/') && path.includes('/co-branding') && method === 'POST') {
      const saveCoBrandingEditionId = path.split('/')[2];
      return await handleSaveCoBranding(saveCoBrandingEditionId, req);
    }
    // Logo upload endpoint
    if (path === '/upload-logo' && method === 'POST') {
      return await handleUploadLogo(req);
    }
    // Edition Admin endpoints
    if (path.startsWith('/edition-admins/') && method === 'GET') {
      const adminEditionId = path.split('/')[2];
      return await handleGetEditionAdmins(adminEditionId);
    }
    if (path === '/edition-admins' && method === 'POST') {
      return await handleCreateEditionAdmin(req);
    }
    // Edition Admin Dashboard endpoints
    if (path.startsWith('/edition-admin-metrics/') && method === 'GET') {
      const metricsEditionId = path.split('/')[2];
      return await handleGetEditionAdminMetrics(metricsEditionId);
    }
    if (path.startsWith('/companies/edition/') && method === 'GET') {
      const companiesEditionId = path.split('/')[3];
      return await handleGetCompaniesByEdition(companiesEditionId);
    }
    if (path === '/admin-users' && method === 'GET') {
      return await handleGetAdminUsers(url.searchParams);
    }
    if (path.startsWith('/company-titles/') && method === 'GET') {
      const titlesEditionId = path.split('/')[2];
      return await handleGetCompanyTitles(titlesEditionId);
    }
    if (path.startsWith('/company-types/') && method === 'GET') {
      const typesEditionId = path.split('/')[2];
      return await handleGetCompanyTypes(typesEditionId);
    }
    // Company endpoints with query support
    if (path === '/companies' && method === 'GET') {
      return await handleGetCompanies(url.searchParams);
    }
    // Settings endpoints
    if (path === '/settings' && method === 'GET') {
      return await handleGetSettings();
    }
    if (path === '/settings' && method === 'POST') {
      return await handleSaveSettings(req);
    }
    if (path === '/settings/logo' && method === 'POST') {
      return await handleUploadSettingsLogo(req);
    }
    // Super Admin endpoints
    if (path === '/super-admins' && method === 'GET') {
      return await handleGetSuperAdmins();
    }
    if (path === '/super-admins' && method === 'POST') {
      return await handleCreateSuperAdmin(req);
    }
    if (path.startsWith('/super-admins/') && method === 'PUT') {
      const updateAdminId = path.split('/')[2];
      return await handleUpdateSuperAdmin(updateAdminId, req);
    }
    if (path.startsWith('/super-admins/') && method === 'DELETE') {
      const deleteAdminId = path.split('/')[2];
      return await handleDeleteSuperAdmin(deleteAdminId);
    }
    // Dashboard metrics endpoint
    if (path === '/dashboard-metrics' && method === 'GET') {
      return await handleGetDashboardMetrics();
    }
    // Audit logs endpoints
    if (path === '/audit-logs' && method === 'GET') {
      return await handleGetAuditLogs(url.searchParams);
    }
    if (path === '/audit-logs/stats' && method === 'GET') {
      return await handleGetAuditLogsStats();
    }
    
    // Safety ID System endpoints
    if (path === '/safety-ids' && method === 'GET') {
      return await handleGetSafetyIds(req);
    }
    if (path === '/safety-ids' && method === 'POST') {
      return await handleCreateSafetyId(req);
    }
    if (path.startsWith('/safety-ids/') && method === 'GET') {
      const safetyIdId = path.split('/')[2];
      return await handleGetSafetyId(safetyIdId);
    }
    if (path.startsWith('/safety-ids/') && method === 'PUT') {
      const safetyIdId = path.split('/')[2];
      return await handleUpdateSafetyId(safetyIdId, req);
    }
    if (path.startsWith('/safety-ids/') && method === 'DELETE') {
      const safetyIdId = path.split('/')[2];
      return await handleDeleteSafetyId(safetyIdId);
    }
    if (path === '/safety-ids/assign' && method === 'POST') {
      return await handleAssignSafetyId(req);
    }
    if (path === '/safety-ids/bulk-create' && method === 'POST') {
      return await handleBulkCreateSafetyIds(req);
    }
    if (path === '/safety-ids/search' && method === 'GET') {
      return await handleSearchSafetyIds(req);
    }
    
    // Safety ID Orders endpoints
    if (path === '/safety-id-orders' && method === 'GET') {
      return await handleGetSafetyIdOrders(req);
    }
    if (path === '/safety-id-orders' && method === 'POST') {
      return await handleCreateSafetyIdOrder(req);
    }
    if (path.startsWith('/safety-id-orders/') && method === 'PUT') {
      const orderId = path.split('/')[2];
      return await handleUpdateSafetyIdOrder(orderId, req);
    }
    
    // Safety ID Print Batches endpoints
    if (path === '/safety-id-print-batches' && method === 'GET') {
      return await handleGetSafetyIdPrintBatches(req);
    }
    if (path === '/safety-id-print-batches' && method === 'POST') {
      return await handleCreateSafetyIdPrintBatch(req);
    }
    if (path.startsWith('/safety-id-print-batches/') && path.includes('/csv') && method === 'GET') {
      const batchId = path.split('/')[2];
      return await handleGeneratePrintBatchCsv(batchId);
    }
    
    // Financial System endpoints
    if (path === '/transactions' && method === 'GET') {
      return await handleGetTransactions(req);
    }
    if (path === '/transactions' && method === 'POST') {
      return await handleCreateTransaction(req);
    }
    if (path.startsWith('/transactions/') && method === 'GET') {
      const transactionId = path.split('/')[2];
      return await handleGetTransaction(transactionId);
    }
    if (path.startsWith('/transactions/') && method === 'PUT') {
      const transactionId = path.split('/')[2];
      return await handleUpdateTransaction(transactionId, req);
    }
    if (path.startsWith('/transactions/') && path.includes('/refund') && method === 'POST') {
      const transactionId = path.split('/')[2];
      return await handleProcessRefund(transactionId, req);
    }
    if (path.startsWith('/transactions/') && path.includes('/line-items') && method === 'GET') {
      const transactionId = path.split('/')[2];
      return await handleGetTransactionLineItems(transactionId);
    }
    
    // Subscription endpoints
    if (path === '/subscriptions' && method === 'GET') {
      return await handleGetSubscriptions(req);
    }
    if (path === '/subscriptions' && method === 'POST') {
      return await handleCreateSubscription(req);
    }
    if (path.startsWith('/subscriptions/') && method === 'GET') {
      const subscriptionId = path.split('/')[2];
      return await handleGetSubscription(subscriptionId);
    }
    if (path.startsWith('/subscriptions/') && method === 'PUT') {
      const subscriptionId = path.split('/')[2];
      return await handleUpdateSubscription(subscriptionId, req);
    }
    if (path.startsWith('/subscriptions/') && path.includes('/cancel') && method === 'POST') {
      const subscriptionId = path.split('/')[2];
      return await handleCancelSubscription(subscriptionId, req);
    }
    if (path.startsWith('/subscriptions/') && path.includes('/history') && method === 'GET') {
      const subscriptionId = path.split('/')[2];
      return await handleGetSubscriptionHistory(subscriptionId);
    }
    
    // Affiliate and Retailer endpoints
    if (path === '/affiliate-commissions' && method === 'GET') {
      return await handleGetAffiliateCommissions(req);
    }
    if (path === '/affiliate-commissions' && method === 'POST') {
      return await handleCreateAffiliateCommission(req);
    }
    if (path === '/affiliate-profiles' && method === 'GET') {
      return await handleGetAffiliateProfiles(req);
    }
    if (path === '/affiliate-profiles' && method === 'POST') {
      return await handleCreateAffiliateProfile(req);
    }
    if (path === '/retailers' && method === 'GET') {
      return await handleGetRetailers(req);
    }
    if (path === '/retailers' && method === 'POST') {
      return await handleCreateRetailer(req);
    }
    if (path.startsWith('/retailers/') && method === 'PUT') {
      const retailerId = path.split('/')[2];
      return await handleUpdateRetailer(retailerId, req);
    }
    
    // Documents System endpoints
    if (path === '/documents' && method === 'GET') {
      return await handleGetDocuments(req);
    }
    if (path === '/documents' && method === 'POST') {
      return await handleUploadDocument(req);
    }
    if (path.startsWith('/documents/') && method === 'GET') {
      const documentId = path.split('/')[2];
      return await handleGetDocument(documentId);
    }
    if (path.startsWith('/documents/') && method === 'PUT') {
      const documentId = path.split('/')[2];
      return await handleUpdateDocument(documentId, req);
    }
    if (path.startsWith('/documents/') && method === 'DELETE') {
      const documentId = path.split('/')[2];
      return await handleDeleteDocument(documentId);
    }
    if (path.startsWith('/documents/') && path.includes('/download') && method === 'GET') {
      const documentId = path.split('/')[2];
      return await handleDownloadDocument(documentId, req);
    }
    if (path.startsWith('/documents/') && path.includes('/share') && method === 'POST') {
      const documentId = path.split('/')[2];
      return await handleShareDocument(documentId, req);
    }
    
    // Document Tags endpoints
    if (path === '/document-tags' && method === 'GET') {
      return await handleGetDocumentTags(req);
    }
    if (path === '/document-tags' && method === 'POST') {
      return await handleCreateDocumentTag(req);
    }
    if (path.startsWith('/document-tags/') && method === 'PUT') {
      const tagId = path.split('/')[2];
      return await handleUpdateDocumentTag(tagId, req);
    }
    if (path.startsWith('/document-tags/') && method === 'DELETE') {
      const tagId = path.split('/')[2];
      return await handleDeleteDocumentTag(tagId);
    }
    if (path.startsWith('/documents/') && path.includes('/tags') && method === 'POST') {
      const documentId = path.split('/')[2];
      return await handleAssignDocumentTags(documentId, req);
    }
    if (path.startsWith('/documents/') && path.includes('/tags/') && method === 'DELETE') {
      const documentId = path.split('/')[2];
      const tagId = path.split('/')[4];
      return await handleRemoveDocumentTag(documentId, tagId);
    }
    
    // Notes System endpoints
    if (path === '/notes' && method === 'GET') {
      return await handleGetNotes(req);
    }
    if (path === '/notes' && method === 'POST') {
      return await handleCreateNote(req);
    }
    if (path.startsWith('/notes/') && method === 'GET') {
      const noteId = path.split('/')[2];
      return await handleGetNote(noteId);
    }
    if (path.startsWith('/notes/') && method === 'PUT') {
      const noteId = path.split('/')[2];
      return await handleUpdateNote(noteId, req);
    }
    if (path.startsWith('/notes/') && method === 'DELETE') {
      const noteId = path.split('/')[2];
      return await handleDeleteNote(noteId);
    }
    if (path.startsWith('/notes/') && path.includes('/share') && method === 'POST') {
      const noteId = path.split('/')[2];
      return await handleShareNote(noteId, req);
    }
    
    // Note Tags endpoints
    if (path === '/note-tags' && method === 'GET') {
      return await handleGetNoteTags(req);
    }
    if (path === '/note-tags' && method === 'POST') {
      return await handleCreateNoteTag(req);
    }
    if (path.startsWith('/note-tags/') && method === 'PUT') {
      const tagId = path.split('/')[2];
      return await handleUpdateNoteTag(tagId, req);
    }
    if (path.startsWith('/note-tags/') && method === 'DELETE') {
      const tagId = path.split('/')[2];
      return await handleDeleteNoteTag(tagId);
    }
    if (path.startsWith('/note-tags/') && path.includes('/notes') && method === 'GET') {
      const tagId = path.split('/')[2];
      return await handleGetNotesByTag(tagId, req);
    }
    if (path.startsWith('/notes/') && path.includes('/tags') && method === 'POST') {
      const noteId = path.split('/')[2];
      return await handleAssignNoteTags(noteId, req);
    }
    if (path.startsWith('/notes/') && path.includes('/tags/') && method === 'DELETE') {
      const noteId = path.split('/')[2];
      const tagId = path.split('/')[4];
      return await handleRemoveNoteTag(noteId, tagId);
    }
    
    // Delegation System endpoints
    if (path === '/delegates' && method === 'GET') {
      return await handleGetDelegates(req);
    }
    if (path === '/delegates' && method === 'POST') {
      return await handleCreateDelegation(req);
    }
    if (path.startsWith('/delegates/') && method === 'GET') {
      const delegateId = path.split('/')[2];
      return await handleGetDelegate(delegateId);
    }
    if (path.startsWith('/delegates/') && method === 'PUT') {
      const delegateId = path.split('/')[2];
      return await handleUpdateDelegation(delegateId, req);
    }
    if (path.startsWith('/delegates/') && method === 'DELETE') {
      const delegateId = path.split('/')[2];
      return await handleRemoveDelegation(delegateId);
    }
    if (path === '/delegates/family' && method === 'GET') {
      return await handleGetFamilyDelegations(req);
    }
    if (path === '/delegates/company' && method === 'GET') {
      return await handleGetCompanyDelegations(req);
    }
    if (path.startsWith('/delegates/') && path.includes('/permissions') && method === 'POST') {
      const delegateId = path.split('/')[2];
      return await handleUpdateDelegationPermissions(delegateId, req);
    }
    if (path === '/delegates/check-permission' && method === 'GET') {
      return await handleCheckDelegationPermission(req);
    }
    if (path === '/delegates/stats' && method === 'GET') {
      return await handleGetDelegationStats(req);
    }
    if (path === '/delegates/bulk-create' && method === 'POST') {
      return await handleBulkCreateDelegations(req);
    }
    
    // Emergency Contacts endpoints
    if (path === '/emergency-contacts' && method === 'GET') {
      return await handleGetEmergencyContacts(req);
    }
    if (path === '/emergency-contacts' && method === 'POST') {
      return await handleCreateEmergencyContact(req);
    }
    if (path.startsWith('/emergency-contacts/') && method === 'GET') {
      const contactId = path.split('/')[2];
      return await handleGetEmergencyContact(contactId);
    }
    if (path.startsWith('/emergency-contacts/') && method === 'PUT') {
      const contactId = path.split('/')[2];
      return await handleUpdateEmergencyContact(contactId, req);
    }
    if (path.startsWith('/emergency-contacts/') && method === 'DELETE') {
      const contactId = path.split('/')[2];
      return await handleDeleteEmergencyContact(contactId);
    }
    if (path === '/emergency-contacts/search' && method === 'GET') {
      return await handleSearchEmergencyContacts(req);
    }
    
    // User Emergency Contacts endpoints
    if (path === '/user-emergency-contacts' && method === 'GET') {
      return await handleGetUserEmergencyContacts(req);
    }
    if (path === '/user-emergency-contacts' && method === 'POST') {
      return await handleLinkContactToUser(req);
    }
    if (path.startsWith('/user-emergency-contacts/') && method === 'PUT') {
      const relationshipId = path.split('/')[2];
      return await handleUpdateUserEmergencyContact(relationshipId, req);
    }
    if (path.startsWith('/user-emergency-contacts/') && method === 'DELETE') {
      const relationshipId = path.split('/')[2];
      return await handleRemoveUserEmergencyContact(relationshipId);
    }
    if (path === '/user-emergency-contacts/set-primary' && method === 'POST') {
      return await handleSetPrimaryEmergencyContact(req);
    }
    
    // User-Company Relationships endpoints
    if (path === '/user-companies' && method === 'GET') {
      return await handleGetUserCompanies(req);
    }
    if (path === '/user-companies' && method === 'POST') {
      return await handleAddUserToCompany(req);
    }
    if (path.startsWith('/user-companies/') && method === 'PUT') {
      const relationshipId = path.split('/')[2];
      return await handleUpdateUserCompanyRole(relationshipId, req);
    }
    if (path.startsWith('/user-companies/') && method === 'DELETE') {
      const relationshipId = path.split('/')[2];
      return await handleRemoveUserFromCompany(relationshipId);
    }
    if (path.startsWith('/companies/') && path.includes('/users') && method === 'GET') {
      const companyId = path.split('/')[2];
      return await handleGetCompanyUsers(companyId, req);
    }
    if (path.startsWith('/companies/') && path.includes('/invite') && method === 'POST') {
      const companyId = path.split('/')[2];
      return await handleInviteUserToCompany(companyId, req);
    }
    if (path.startsWith('/users/') && path.includes('/companies') && method === 'GET') {
      const userId = path.split('/')[2];
      return await handleGetUserCompaniesForUser(userId, req);
    }
    
    // Fulfillment Orders endpoints
    if (path === '/fulfillment-orders' && method === 'GET') {
      return await handleGetFulfillmentOrders(req);
    }
    if (path === '/fulfillment-orders' && method === 'POST') {
      return await handleCreateFulfillmentOrder(req);
    }
    if (path.startsWith('/fulfillment-orders/') && method === 'GET') {
      const orderId = path.split('/')[2];
      return await handleGetFulfillmentOrder(orderId);
    }
    if (path.startsWith('/fulfillment-orders/') && method === 'PUT') {
      const orderId = path.split('/')[2];
      return await handleUpdateFulfillmentOrder(orderId, req);
    }
    if (path.startsWith('/fulfillment-orders/') && path.includes('/ship') && method === 'POST') {
      const orderId = path.split('/')[2];
      return await handleMarkOrderAsShipped(orderId, req);
    }
    if (path.startsWith('/fulfillment-orders/') && path.includes('/items') && method === 'GET') {
      const orderId = path.split('/')[2];
      return await handleGetFulfillmentOrderItems(orderId);
    }
    if (path.startsWith('/fulfillment-orders/') && path.includes('/items') && method === 'POST') {
      const orderId = path.split('/')[2];
      return await handleAddFulfillmentOrderItem(orderId, req);
    }
    if (path.startsWith('/fulfillment-order-items/') && method === 'PUT') {
      const itemId = path.split('/')[2];
      return await handleUpdateFulfillmentOrderItem(itemId, req);
    }
    if (path.startsWith('/fulfillment-order-items/') && method === 'DELETE') {
      const itemId = path.split('/')[2];
      return await handleRemoveFulfillmentOrderItem(itemId);
    }
    
    // Configuration System endpoints
    if (path === '/custom-fields' && method === 'GET') {
      return await handleGetCustomFields(req);
    }
    if (path === '/custom-fields' && method === 'POST') {
      return await handleCreateCustomField(req);
    }
    if (path.startsWith('/custom-fields/') && method === 'GET') {
      const fieldId = path.split('/')[2];
      return await handleGetCustomField(fieldId);
    }
    if (path.startsWith('/custom-fields/') && method === 'PUT') {
      const fieldId = path.split('/')[2];
      return await handleUpdateCustomField(fieldId, req);
    }
    if (path.startsWith('/custom-fields/') && method === 'DELETE') {
      const fieldId = path.split('/')[2];
      return await handleDeleteCustomField(fieldId);
    }
    
    // Pricing Configuration endpoints
    if (path === '/pricing-configurations' && method === 'GET') {
      return await handleGetPricingConfigurations(req);
    }
    if (path === '/pricing-configurations' && method === 'POST') {
      return await handleCreatePricingConfiguration(req);
    }
    if (path.startsWith('/pricing-configurations/') && method === 'PUT') {
      const configId = path.split('/')[2];
      return await handleUpdatePricingConfiguration(configId, req);
    }
    
    // Reminder Settings endpoints
    if (path === '/reminder-settings' && method === 'GET') {
      return await handleGetReminderSettings(req);
    }
    if (path === '/reminder-settings' && method === 'POST') {
      return await handleCreateReminderSetting(req);
    }
    if (path.startsWith('/reminder-settings/') && method === 'PUT') {
      const settingId = path.split('/')[2];
      return await handleUpdateReminderSetting(settingId, req);
    }
    
    // User Notification Preferences endpoints
    if (path === '/user-notification-preferences' && method === 'GET') {
      return await handleGetUserNotificationPreferences(req);
    }
    if (path === '/user-notification-preferences' && method === 'PUT') {
      return await handleUpdateUserNotificationPreferences(req);
    }
    // Fallback for unmatched routes
    console.log(`❓ Unknown endpoint: ${method} ${path}`);
    return new Response(JSON.stringify({
      success: false,
      error: `Route not found: ${method} ${path}`,
      availableEndpoints: [
        '/',
        '/health',
        '/ping',
        '/debug',
        '/profile',
        '/auth/login',
        '/editions',
        '/companies',
        '/super-admins',
        '/settings',
        '/users',
        '/safety-ids',
        '/transactions',
        '/subscriptions',
        '/documents',
        '/notes',
        '/delegates',
        '/emergency-contacts',
        '/user-companies',
        '/fulfillment-orders',
        '/custom-fields',
        '/pricing-configurations'
      ]
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Backend API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
