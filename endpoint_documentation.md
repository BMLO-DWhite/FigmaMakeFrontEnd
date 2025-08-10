# Safety ID 365 Backend API Endpoints

## Base URL
```
https://sgjirakmlikaskkesjic.supabase.co/functions/v1/backend-dev
```

## Authentication
- **Authorization Header**: `Bearer <token>`
- **Token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnamlyYWttbGlrYXNra2VzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjUxOTAsImV4cCI6MjA2OTA0MTE5MH0.kiQmzzUepA4YRaWhwsIf3CzrzWpV5SC40Y82slzjVOY`

---

## 🔧 System & Health Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Welcome message with available endpoints |
| `GET` | `/health` | Health check with database status |
| `GET` | `/ping` | Simple ping response |
| `GET` | `/debug` | Debug information |
| `GET` | `/test` | Test endpoint |
| `GET` | `/sql-schema` | Database schema information |
| `GET` | `/session` | Get session information |

---

## 🔐 Authentication & User Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | User login |
| `POST` | `/auth/logout` | User logout |
| `GET` | `/profile` | Get user profile |
| `PUT` | `/profile` | Update user profile |
| `POST` | `/test-credentials` | Test user credentials |
| `GET` | `/users` | Get all users |
| `POST` | `/users` | Create new user |
| `PUT` | `/users/{id}` | Update user by ID |
| `DELETE` | `/users/{id}` | Delete user by ID |

---

## 📚 Edition Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/editions` | Get all editions |
| `POST` | `/editions` | Create new edition |
| `PUT` | `/editions/{id}` | Update edition by ID |
| `DELETE` | `/editions/{id}` | Delete edition by ID |
| `GET` | `/editions/{id}/stats` | Get edition statistics |
| `GET` | `/editions/{id}/co-branding` | Get co-branding settings |
| `POST` | `/editions/{id}/co-branding` | Save co-branding settings |
| `POST` | `/upload-logo` | Upload logo |

---

## 👥 Admin & Company Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/edition-admins/{edition_id}` | Get edition admins |
| `POST` | `/edition-admins` | Create edition admin |
| `GET` | `/edition-admin-metrics/{edition_id}` | Get admin metrics |
| `GET` | `/companies/edition/{edition_id}` | Get companies by edition |
| `GET` | `/admin-users` | Get admin users |
| `GET` | `/company-titles/{edition_id}` | Get company titles |
| `GET` | `/company-types/{edition_id}` | Get company types |
| `GET` | `/companies` | Get all companies |
| `GET` | `/super-admins` | Get super admins |
| `POST` | `/super-admins` | Create super admin |
| `PUT` | `/super-admins/{id}` | Update super admin |
| `DELETE` | `/super-admins/{id}` | Delete super admin |

---

## ⚙️ Settings & Configuration Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/settings` | Get system settings |
| `POST` | `/settings` | Save system settings |
| `POST` | `/settings/logo` | Upload settings logo |
| `GET` | `/dashboard-metrics` | Get dashboard metrics |
| `GET` | `/audit-logs` | Get audit logs |
| `GET` | `/audit-logs/stats` | Get audit log statistics |

---

## 🆔 Safety ID System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/safety-ids` | Get all safety IDs |
| `POST` | `/safety-ids` | Create new safety ID |
| `GET` | `/safety-ids/{id}` | Get safety ID by ID |
| `PUT` | `/safety-ids/{id}` | Update safety ID |
| `DELETE` | `/safety-ids/{id}` | Delete safety ID |
| `POST` | `/safety-ids/assign` | Assign safety ID |
| `POST` | `/safety-ids/bulk-create` | Bulk create safety IDs |
| `GET` | `/safety-ids/search` | Search safety IDs |

### Safety ID Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/safety-id-orders` | Get all safety ID orders |
| `POST` | `/safety-id-orders` | Create new order |
| `PUT` | `/safety-id-orders/{id}` | Update order |

### Safety ID Print Batches
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/safety-id-print-batches` | Get all print batches |
| `POST` | `/safety-id-print-batches` | Create new print batch |
| `GET` | `/safety-id-print-batches/{id}/csv` | Generate CSV for batch |

---

## 💰 Financial System Endpoints

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/transactions` | Get all transactions |
| `POST` | `/transactions` | Create new transaction |
| `GET` | `/transactions/{id}` | Get transaction by ID |
| `PUT` | `/transactions/{id}` | Update transaction |
| `POST` | `/transactions/{id}/refund` | Process refund |
| `GET` | `/transactions/{id}/line-items` | Get transaction line items |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/subscriptions` | Get all subscriptions |
| `POST` | `/subscriptions` | Create new subscription |
| `GET` | `/subscriptions/{id}` | Get subscription by ID |
| `PUT` | `/subscriptions/{id}` | Update subscription |
| `POST` | `/subscriptions/{id}/cancel` | Cancel subscription |
| `GET` | `/subscriptions/{id}/history` | Get subscription history |

### Affiliates & Retailers
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/affiliate-commissions` | Get affiliate commissions |
| `POST` | `/affiliate-commissions` | Create affiliate commission |
| `GET` | `/affiliate-profiles` | Get affiliate profiles |
| `POST` | `/affiliate-profiles` | Create affiliate profile |
| `GET` | `/retailers` | Get all retailers |
| `POST` | `/retailers` | Create new retailer |
| `PUT` | `/retailers/{id}` | Update retailer |

---

## 📄 Documents System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/documents` | Get all documents |
| `POST` | `/documents` | Upload new document |
| `GET` | `/documents/{id}` | Get document by ID |
| `PUT` | `/documents/{id}` | Update document |
| `DELETE` | `/documents/{id}` | Delete document |
| `GET` | `/documents/{id}/download` | Download document |
| `POST` | `/documents/{id}/share` | Share document |

### Document Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/document-tags` | Get all document tags |
| `POST` | `/document-tags` | Create document tag |
| `PUT` | `/document-tags/{id}` | Update document tag |
| `DELETE` | `/document-tags/{id}` | Delete document tag |
| `POST` | `/documents/{id}/tags` | Assign tags to document |
| `DELETE` | `/documents/{doc_id}/tags/{tag_id}` | Remove tag from document |

---

## 📝 Notes System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/notes` | Get all notes |
| `POST` | `/notes` | Create new note |
| `GET` | `/notes/{id}` | Get note by ID |
| `PUT` | `/notes/{id}` | Update note |
| `DELETE` | `/notes/{id}` | Delete note |
| `POST` | `/notes/{id}/share` | Share note |

### Note Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/note-tags` | Get all note tags |
| `POST` | `/note-tags` | Create note tag |
| `PUT` | `/note-tags/{id}` | Update note tag |
| `DELETE` | `/note-tags/{id}` | Delete note tag |
| `GET` | `/note-tags/{id}/notes` | Get notes by tag |
| `POST` | `/notes/{id}/tags` | Assign tags to note |
| `DELETE` | `/notes/{note_id}/tags/{tag_id}` | Remove tag from note |

---

## 👥 Delegation System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/delegates` | Get all delegates |
| `POST` | `/delegates` | Create new delegation |
| `GET` | `/delegates/{id}` | Get delegate by ID |
| `PUT` | `/delegates/{id}` | Update delegation |
| `DELETE` | `/delegates/{id}` | Remove delegation |
| `GET` | `/delegates/family` | Get family delegations |
| `GET` | `/delegates/company` | Get company delegations |
| `POST` | `/delegates/{id}/permissions` | Update delegation permissions |
| `GET` | `/delegates/check-permission` | Check delegation permission |
| `GET` | `/delegates/stats` | Get delegation statistics |
| `POST` | `/delegates/bulk-create` | Bulk create delegations |

---

## 🚨 Emergency Contacts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/emergency-contacts` | Get all emergency contacts |
| `POST` | `/emergency-contacts` | Create emergency contact |
| `GET` | `/emergency-contacts/{id}` | Get emergency contact by ID |
| `PUT` | `/emergency-contacts/{id}` | Update emergency contact |
| `DELETE` | `/emergency-contacts/{id}` | Delete emergency contact |
| `GET` | `/emergency-contacts/search` | Search emergency contacts |

### User Emergency Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/user-emergency-contacts` | Get user emergency contacts |
| `POST` | `/user-emergency-contacts` | Link contact to user |
| `PUT` | `/user-emergency-contacts/{id}` | Update user emergency contact |
| `DELETE` | `/user-emergency-contacts/{id}` | Remove user emergency contact |
| `POST` | `/user-emergency-contacts/set-primary` | Set primary emergency contact |

---

## 🏢 User-Company Relationships Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/user-companies` | Get user-company relationships |
| `POST` | `/user-companies` | Add user to company |
| `PUT` | `/user-companies/{id}` | Update user company role |
| `DELETE` | `/user-companies/{id}` | Remove user from company |
| `GET` | `/companies/{id}/users` | Get company users |
| `POST` | `/companies/{id}/invite` | Invite user to company |
| `GET` | `/users/{id}/companies` | Get user's companies |

---

## 📦 Fulfillment Orders Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/fulfillment-orders` | Get all fulfillment orders |
| `POST` | `/fulfillment-orders` | Create new fulfillment order |
| `GET` | `/fulfillment-orders/{id}` | Get fulfillment order by ID |
| `PUT` | `/fulfillment-orders/{id}` | Update fulfillment order |
| `POST` | `/fulfillment-orders/{id}/ship` | Mark order as shipped |
| `GET` | `/fulfillment-orders/{id}/items` | Get order items |
| `POST` | `/fulfillment-orders/{id}/items` | Add item to order |
| `PUT` | `/fulfillment-order-items/{id}` | Update order item |
| `DELETE` | `/fulfillment-order-items/{id}` | Remove order item |

---

## ⚙️ Configuration System Endpoints

### Custom Fields
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/custom-fields` | Get all custom fields |
| `POST` | `/custom-fields` | Create custom field |
| `GET` | `/custom-fields/{id}` | Get custom field by ID |
| `PUT` | `/custom-fields/{id}` | Update custom field |
| `DELETE` | `/custom-fields/{id}` | Delete custom field |

### Pricing Configuration
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/pricing-configurations` | Get pricing configurations |
| `POST` | `/pricing-configurations` | Create pricing configuration |
| `PUT` | `/pricing-configurations/{id}` | Update pricing configuration |

### Reminder Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/reminder-settings` | Get reminder settings |
| `POST` | `/reminder-settings` | Create reminder setting |
| `PUT` | `/reminder-settings/{id}` | Update reminder setting |

### User Notification Preferences
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/user-notification-preferences` | Get user notification preferences |
| `PUT` | `/user-notification-preferences` | Update user notification preferences |

---

## 📊 Summary

**Total Endpoints**: 152 endpoints across 14 major system modules

### Endpoint Count by System:
- **System & Health**: 7 endpoints
- **Authentication & Users**: 9 endpoints  
- **Edition Management**: 8 endpoints
- **Admin & Company**: 12 endpoints
- **Settings**: 6 endpoints
- **Safety ID System**: 14 endpoints
- **Financial System**: 19 endpoints
- **Documents System**: 13 endpoints
- **Notes System**: 13 endpoints
- **Delegation System**: 11 endpoints
- **Emergency Contacts**: 11 endpoints
- **User-Company Relations**: 7 endpoints
- **Fulfillment Orders**: 9 endpoints
- **Configuration System**: 13 endpoints

### Common Query Parameters:
- `page` - Page number for pagination
- `limit` - Items per page
- `user_id` - Filter by user
- `company_id` - Filter by company
- `edition_id` - Filter by edition
- `status` - Filter by status
- `start_date` - Filter by start date
- `end_date` - Filter by end date

### Common Response Format:
```json
{
  "success": true|false,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  },
  "error": "Error message if success is false"
}
```