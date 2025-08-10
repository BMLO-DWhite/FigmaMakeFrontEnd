# Scan ID 365 Family - Design & Development Guidelines

## ⚠️ CRITICAL RULE: NO MOCK DATA
## ⚠️ CRITICAL RULE: DO NOT USE THE APP.TSX FILE IN THE ROOT (It's empty)
## ⚠️ CRITICAL RULE: DO NOT CRUD DATABASE TABLES 
## ⚠️ CRITICAL RULE: DO NOT CRUD FUNCTIONS
## ⚠️ CRITICAL RULE: DO NOT UPDATE THE BACKEND
## ⚠️ CRITICAL RULE: DO NOT USE GITHUB
## ⚠️ CRITICAL RULE: WHEN UNABLE TO DO A TASK REQUESTED, TELL THE PROMPTER YOU CANNOT DO THE TASK.  DO NOT FAKE IT.

## 🚫 MISTAKE PREVENTION GUIDELINES

### Endpoint Implementation Mistakes Prevention

**Created**: December 19, 2024 - 6:50 PM EST  
**Purpose**: Prevent recurring API implementation mistakes that cause delays and frustration

### ⚡ MANDATORY PRE-IMPLEMENTATION CHECKLIST

Before implementing ANY endpoint changes, ALWAYS follow this checklist:

1. **✅ CHECK EXISTING API CONTRACT**
   - Read `/utils/api.tsx` FIRST to understand what URLs the frontend expects
   - Check the endpoint_documentation.md file for existing endpoints
   - Note the exact URL patterns the frontend is calling
   - **NEVER implement endpoints that don't match the frontend expectations**

2. **✅ CHECK EXISTING SERVER ENDPOINTS**
   - Look at `/ENDPOINT_CHANGE_LOG.md` to see what was recently added
   - Search for similar endpoints in the server file
   - Check if endpoints already exist before proposing to add them

3. **✅ VERIFY FIELD NAMING CONVENTIONS**
   - Database fields use `snake_case` (e.g., `branding_mode`, `company_name`)
   - Frontend interfaces use `camelCase` (e.g., `brandingMode`, `organizationName`)
   - **ALWAYS implement proper field mapping in server endpoints**
   - Use helper functions for consistent field mapping

4. **✅ CHECK RECENT UPDATES**
   - If endpoints were updated in the last 24 hours, review them carefully
   - Look for patterns in recent mistakes to avoid repeating them
   - Verify that recent changes didn't already fix the issue

### Tech Stack
- - React 19 (latest stable)
- - TypeScript
- - Vite
- - Tailwind CSS
- - Redux Toolkit for global state
- - React Router v6
- - TanStack Query (for async server state)
- - Axios (with interceptors)
- - JWT-based Authentication
- - Material UI (optional fallback if Tailwind is insufficient)
- - React Hot Toast for notifications

### Folder Structure
- src/
- ├── api/                  # Axios services, custom query/mutation hooks
- ├── assets/               # Images, icons
- ├── components/           # Reusable UI components
- ├── constants/            # Application constants
- ├── context/              # Auth context for JWT and role management
- ├── hooks/                # Custom React hooks
- ├── layouts/              # Layouts (sidebar, navbar, etc.)
- ├── pages/                # Page views grouped by route
- ├── routes/               # Route config and guards (Protected, Role-based)
- ├── store/                # Redux Toolkit store setup
- ├── styles/               # Tailwind + global styles
- ├── theme/                # Tailwind or MUI theme configuration
- ├── utils/                # Utilities and helpers
- ├── App.tsx               # Root App
- └── main.tsx              # Entry point
- 
- public/
- package.json
- tsconfig.json
- vite.config.ts
- .env.example

## Shared Components
- - CustomTable
- - CustomTextField
- - CustomButton
- - CustomModal
- - UploadBox (file upload w/ preview)
- - ColorSwatchField
- - DatePickerField
- - CheckboxWithLink

## Layout Components
- - Sidebar (role-based nav, responsive)
- - Navbar (user info, logout)
- - RoleBasedLayout (conditional layout rendering)

### 🔧 IMPLEMENTATION RULES

1. **URL Pattern Consistency**
   - Frontend API calls define the URL patterns
   - Server endpoints MUST match frontend expectations exactly
   - Example: If frontend calls `/editions/${id}/co-branding`, server must use that exact pattern

2. **Field Mapping Implementation**
   ```typescript
   // REQUIRED: Map database fields to frontend fields
   const formattedResponse = {
     brandingMode: dbRecord.branding_mode,
     organizationName: dbRecord.company_name,
     primaryColor: dbRecord.primary_color,
     // etc.
   };
   ```

3. **Default Values**
   - Always provide sensible defaults when database records don't exist
   - Include all fields that the frontend interface expects
   - Use constants for default values (e.g., `#294199` for primary color)

4. **Error Handling**
   - Implement proper error handling for missing records
   - Return default values instead of errors when appropriate
   - Log errors appropriately for debugging

### 🚨 COMMON MISTAKE PATTERNS TO AVOID

1. **❌ URL Mismatch Pattern**
   - **Mistake**: Creating `/resource-settings/:id` when frontend calls `/resources/:id/settings`
   - **Fix**: Always match the frontend URL pattern exactly

2. **❌ Field Mapping Forgotten**
   - **Mistake**: Returning raw database fields to frontend
   - **Fix**: Always implement snake_case ↔ camelCase mapping

3. **❌ Missing Default Values**
   - **Mistake**: Returning empty or null responses for missing records
   - **Fix**: Provide complete default objects that match the interface

4. **❌ Not Checking Existing Code**
   - **Mistake**: Implementing endpoints that already exist or don't match expectations
   - **Fix**: Always check existing code first

### 🔍 VERIFICATION STEPS

After implementing changes:
1. **Test that frontend can fetch data without errors**
2. **Verify that all interface fields are populated**
3. **Test that saving data works correctly**
4. **Check that field mapping works correctly**
5. **Ensure default values are sensible**

### 📝 DOCUMENTATION REQUIREMENTS

When implementing endpoint changes:
1. **Document the URL pattern and why it was chosen**
2. **List all field mappings implemented**
3. **Note any default values used**
4. **Include timestamp and change description**
5. **Update change log with verification status**

### 🎯 SUCCESS CRITERIA

An endpoint implementation is successful when:
- ✅ Frontend loads data without console errors
- ✅ All interface fields are properly populated
- ✅ Saving changes works correctly
- ✅ Field mapping works both directions
- ✅ No URL or field name mismatches exist
- ✅ Default values are reasonable and complete

---

## Design Consistency Guidelines


### General Principles
- Always maintain the original design structure unless explicitly requested to change
- Ask for approval before swapping layouts or changing the positioning of elements
- Follow the established visual hierarchy and spacing patterns

### Color Palette
- **Primary Blue**: `#294199` - Used for primary buttons, selected states, and key branding elements
- **Secondary Orange**: `#FF9E1E` - Used for secondary actions and accent elements
- **Background Colors**:
  - Main content areas: `#F8F9FA` (light gray)
  - Right panels/forms: `#FFFFFF` (white)
  - Selected menu items: `#294199` with white text
  - Unselected menu items: black text on `#F8F9FA` background

### Typography
- **Font Family**: `"Montserrat", "Arial", sans-serif`
- Do not override default font sizes, weights, or line-heights unless specifically requested
- Use the existing typography scale defined in `styles/globals.css`

### Form Controls
- **Radio Buttons**: Must be clearly visible with proper contrast
- **Input Fields**: Consistent spacing and styling
- **Buttons**: Use established color scheme and sizing

### Layout Structure
- **Left Panel**: Navigation, lists, and primary content
- **Right Panel**: Forms, configuration, and detailed views (always white background)
- **Header**: Consistent navigation and user information
- **Footer**: Action buttons and controls

## Data Table Guidelines

### Sortable Fields
Make the following field types sortable when they appear in tables:
- Names (first name, last name, organization name, etc.)
- Email addresses
- Dates (created, modified, last login, expiration, etc.)
- Status fields
- Numerical values (counts, IDs, etc.)

### Search vs Filter Distinction

**🔍 Search Functionality:**
- Search is about finding specific items by text matching
- Should look across multiple text fields (name, username, email, phone, etc.)
- Works globally across all data in the current view
- Example: Typing "John" shows all users with "John" in their name or username across all companies

**🔧 Filter Functionality:**
- Filter is about narrowing the scope to a specific subset of data
- Limits results to a particular category, company, status, or date range
- Works to define the boundaries of what should be searched/displayed
- Example: Selecting "Acme Inc." company filter shows only users from that company

**Combined Usage:**
- **Filter Only**: View all users from a single company
- **Search Only**: Search all users across all companies
- **Search + Filter**: Search within the selected company scope
- Filters should persist when searching, and searches should work within filtered results

### Searchable/Filterable Fields
Implement search and filter functionality for:
- **Text Fields**: Names, email addresses, organization names, descriptions
- **Date Fields**: Creation dates, modification dates, expiration dates, last login
- **Status Fields**: Active/inactive, enabled/disabled, etc.
- **Category Fields**: User roles, edition types, feature categories

### Non-Sortable/Non-Searchable Fields
Do NOT make these sortable or searchable:
- Action buttons/controls
- Profile images/avatars
- Complex formatted content
- Internal system IDs (unless specifically needed for debugging)

### Table Features to Include
- **Pagination**: For tables with more than 25 items
- **Search Bar**: Global text search with clear placeholder indicating searchable fields
- **Column Filters**: Dropdown/select filters for categorical data (status, type, etc.)
- **Sort Indicators**: Clear visual indication of sort direction with clickable headers
- **Row Selection**: For bulk actions when applicable
- **Results Summary**: Show "X of Y items" with current filter/search context
- **Clear Filters**: Button to reset all filters and search when active
- **Responsive Design**: Tables should work on different screen sizes
- **Emulation Button**: Blue button with left/right arrows icon for user emulation functionality

### Implementation Guidelines for Search & Filter
- **Search Icon**: Use lucide-react Search icon next to search inputs
- **Filter Icon**: Use lucide-react Filter icon next to filter controls
- **Placeholder Text**: Be specific about searchable fields (e.g., "Search by name, email, or phone...")
- **Empty States**: Provide helpful messages and clear action when no results found
- **State Management**: Use useEffect to update filtered results when dependencies change
- **Performance**: Implement client-side filtering for small datasets (&lt;1000 items)
- **Accessibility**: Ensure proper labels and keyboard navigation for all controls

## Component Patterns

### Form Layouts
- Use consistent spacing between form sections
- Group related fields together
- Place primary actions (Save, Submit) before secondary actions (Cancel, Skip)
- Use proper validation and error messaging

### Navigation
- Maintain breadcrumb navigation for nested screens
- Use consistent sidebar navigation patterns
- Ensure selected states are clearly visible

## Breadcrumb Navigation – Implementation Instructions for Scan ID 365

### 🎯 Purpose of Breadcrumbs
Breadcrumbs help users:
- Understand where they are in the hierarchy
- Navigate backward efficiently  
- Reduce confusion on deeply nested pages (e.g., viewing a specific user's document)

### 🧩 General Structure
Use the following consistent structure for all breadcrumbs:

```
[Role Dashboard] > [Section Name] > [Subsection or Action] > [Entity Name] (if applicable)
```

#### Examples:

**Example 1:** Viewing a specific user's profile under a company:
```
Edition Dashboard > Companies > [ABC Landscaping] > Users > [John Smith]
```

**Example 2:** Editing pricing settings:
```
Edition Dashboard > Pricing & Payouts > Pricing Configuration
```

**Example 3:** Viewing payout history:
```
Edition Dashboard > Pricing & Payouts > Payout History
```

### 🛠️ Implementation Guidelines

1. **Always start with the role dashboard** (Super Admin Dashboard, Edition Dashboard, Company Dashboard, etc.)
2. **Use descriptive section names** that match the navigation menu
3. **Include entity names** when viewing/editing specific items
4. **Make each level clickable** when navigation is possible
5. **Use consistent styling** across all breadcrumbs
6. **Position breadcrumbs** below the main header but above page content

### 🎨 Visual Guidelines

- Use the shadcn/ui Breadcrumb component for consistency
- Style separators with the standard ">" character
- Make active (current) page non-clickable and visually distinct
- Ensure sufficient color contrast for accessibility

### File Uploads
- Support both drag-and-drop and click-to-browse
- Show upload progress and success/error states
- Display file previews when appropriate
- Include file size and format requirements

## Backend Integration

### API Response Patterns
- Consistent error handling and messaging
- Proper loading states
- Toast notifications for user feedback
- Optimistic updates where appropriate

### Data Storage
- Use KV store for configuration and settings
- Use Supabase Storage for file uploads
- Implement proper signed URLs for private files
- Include data validation and sanitization

### Database Initialization (CRITICAL RULE)
- **NO AUTOMATION**: Database initialization and seeding MUST be a manual process only
- **SQL SCRIPTS ONLY**: The application should provide SQL scripts that can be manually executed
- **NO AUTOMATIC SEEDING**: Never implement endpoints or functions that automatically create tables or seed data
- **NO DATABASE AUTOMATION**: The app should not attempt to automatically initialize, migrate, or seed the database
- **MANUAL EXECUTION ONLY**: Database setup requires manual execution of provided SQL scripts on Supabase
- **NORMALIZED DATABASE REQUIRED**: All database operations must use a properly normalized relational structure
- **SQL FILE ACCESS**: The application may provide access to view/download SQL scripts for manual execution

## Authentication & Security

### User Management
- Current user protection (cannot delete own account)
- Proper role-based access control
- Session management and logout functionality
- Password hashing and secure storage

### Role-Based Screen Access Control

The system has a clear hierarchy of access levels for different screens and functionality. Each role has progressively more restrictions as you go down the hierarchy:

**🔹 Super User - Global Settings Mode**
- Screen: Settings page from main navigation
- Can manage global settings (system branding, super admin management, global document management)
- Can create and manage global-scoped tags
- Has unrestricted access to all system configuration
- Context: `isGlobalMode = true`

**🔹 Super User - Edition Settings Mode**
- Screen: Edition feature configuration screens
- Can manage edition-level settings and below (edition, channel, company scopes)
- CANNOT create global-scoped tags (global scope should not be offered in dropdowns)
- Has full access to edition configuration but respects scope boundaries
- Context: `isGlobalMode = false`

**🔹 Edition Admin **
- Will have access to edition-level screens similar to Super User edition mode
- Will have additional restrictions compared to Super User (more limited configuration options)
- Cannot access Super Admin global settings
- Cannot create or modify anything above their edition scope

**🔹 Channel Partner **
- Will have access to channel-level screens only
- Can only manage settings within their channel and companies below them
- Cannot access edition-level or global configuration
- More restricted than Edition Admin

**🔹 Company Admin **
- Will have access to company-level screens only
- Can only manage settings within their specific company
- Cannot access channel, edition, or global configuration
- Most restricted admin level

### Implementation Rules for Future Screens
When building screens for lower-level roles, follow these principles:

1. **Scope Restrictions**: Each role should only see scope options at their level and below
   - Super User (Global): global scope only
   - Super User (Edition): edition, channel, company scopes only
   - Edition Admin: edition, channel, company scopes only (with additional restrictions)
   - Channel Partner: channel, company scopes only
   - Company Admin: company scope only

2. **Feature Restrictions**: Lower roles have more limited configuration options
   - Some settings may be view-only for lower roles
   - Some features may be completely hidden from lower roles

3. **Data Visibility**: Each role should only see data within their scope
   - Edition Admins see only their edition's data
   - Channel Partners see only their channel's data
   - Company Admins see only their company's data

4. **Consistent Patterns**: Use the same UI components but with different props to control restrictions
   - Same TagsManagement component with different `isGlobalMode` and scope restrictions
   - Same form components with different field availability
   - Same table components with different data filtering

### User Emulation System
- **Emulation Hierarchy**: Super admin → Edition admin → Channel admin → Company admin → User
- **Second Emulation Hierarchy**: Super admin → Edition admin → Company admin → User
- **Emulation Rules**: Each level can emulate all levels below them, but not their own level or above
- **Emulation Button**: Always use the blue button with left/right arrows icon (⇄) for emulation functionality
- **Emulation State**: Track original user context and current emulated user context
- **Emulation UI**: Show clear indication in header when emulating another user
- **Emulation Security**: Maintain audit trail of emulation actions for compliance

### File Security
- Private storage buckets for sensitive files
- Signed URLs with appropriate expiration times
- File type and size validation
- Secure upload handling

<!-- ### Delegate Permissions System

**Core Principles:**
- **Billing and Subscription Restriction**: Delegates will NEVER have the ability to manage subscriptions or billing - these permissions are reserved for direct account owners only
- **Feature-Based Organization**: Permissions are organized by feature areas (Documents, Certificates, Notes) with clear view vs CRUD capabilities
- **Extensible Structure**: As new features are added, they will automatically expand the rights list for delegate selection
- **Hierarchical Access**: Delegate access follows the existing role hierarchy and scope rules

**Permission Structure by Feature Area:**

🔹 **Documents Management**
- View documents (always available)
- Create documents (full delegates can act on behalf of user; limited delegates can only create their own)
- Edit documents (full delegates can edit any; limited delegates can only edit their own)
- Delete documents (full delegates can delete any; limited delegates can only delete their own) -->

🔹 **Certificates Management**
- View certificates (always available)
- Create certificates (full delegates can act on behalf of user; limited delegates can only create their own)
- Edit certificates (full delegates can edit any; limited delegates can only edit their own)
- Delete certificates (full delegates can delete any; limited delegates can only delete their own)

🔹 **Notes Management**
- View notes (always available)
- Create notes (full delegates can act on behalf of user; limited delegates can only create their own)
- Edit notes (full delegates can edit any; limited delegates can only edit their own)
- Delete notes (full delegates can delete any; limited delegates can only delete their own)

**Access Level Definitions:**

🔹 **Full Access Delegates**
- Act on behalf of the user/company with complete authority
- Can view, create, edit, and delete ALL items within their scope
- Have the same permissions as the user/admin who assigned them (minus billing/subscriptions)

🔹 **Limited Access Delegates**
- Can view ALL items but can only CRUD items they create themselves
- Cannot modify items created by others
- Settings determine which specific features they have limited rights to configure

**Delegation Types:**

🔹 **Company-Level Delegates**
- Assigned by Company Admins or higher
- Can manage data across the entire company scope
- Access level (Full/Limited) determines their modification capabilities

🔹 **User-Level Delegates**
- Assigned by individual users
- Can only manage data for that specific user
- Often used for personal assistance or emergency access scenarios
- Access level (Full/Limited) determines their modification capabilities

**Implementation Guidelines:**
- Permissions should be clearly categorized by feature in the UI
- Each permission should explicitly state "View", "Create", "Edit", or "Delete" capabilities
- Future features will automatically add new permission categories following this pattern
- Never include billing, subscription, or financial management permissions for delegates
- Always respect the existing scope and hierarchy rules established in the tagging system

## Development Standards

### Code Organization
- Modular component structure
- Consistent import patterns
- Proper TypeScript usage
- Clear component props and interfaces

### File Size and Component Reuse
- **File Size Limits**: Keep TSX files under 500 lines when possible
- **Component Reuse**: Create reusable components to avoid duplicate code
- **Generic Components**: Build flexible components that can handle different data types with proper props
- **Pattern Examples**: 
  - Reusable admin/user tables for super admins, edition admins, channel partner admins, company admins, and users
  - Generic forms that can handle different admin types while maintaining context
  - Shared search and filter components for consistent UX
- **Separation Strategy**: 
  - Extract large components into smaller, focused sub-components
  - Create shared utilities for common patterns (search, filter, pagination)
  - Use composition over inheritance for flexibility

### Error Handling
- Comprehensive error logging
- User-friendly error messages
- Graceful degradation for failed operations
- Debug tools for development

### JSX Syntax Best Practices
- **Complex Conditional Rendering**: When using ternary operators in JSX, always ensure proper parenthesis matching
- **Bracket Matching**: Pay special attention to closing parentheses when dealing with nested JSX structures
- **Breaking Down Complex Expressions**: Split complex ternary operations into smaller, more manageable pieces when possible
- **Syntax Verification**: Before finalizing code with complex JSX, verify all opening and closing brackets match
- **Common Error Pattern**: Watch for missing closing parentheses in structures like:
  ```jsx
  {condition ? (
    <ComplexComponent>
      {nestedCondition ? <NestedElement /> : <Alternative />}
    </ComplexComponent>
  ) : (
    <AlternativeComponent />
  )} // <- Ensure this closing parenthesis is present
  ```
- **Best Practice**: Use consistent indentation to visually verify bracket matching in complex JSX

### Testing & Debugging
- Include development tools for debugging
- Proper console logging for troubleshooting
- Health check endpoints for system status
- File upload verification and status checking

## Business Logic & Data Models

### Companies System

**Company Structure:**
- Companies belong to a specific Edition
- Companies have standard business information (name, phone, address, website, etc.)
- Companies can have different "Titles" instead of just "Company" (configurable by Edition Admin)
- Companies have "Types" that categorize their business (configurable by Edition Admin)
- Companies contain Users who belong to that company

**Company Titles (Configurable by Edition Admin):**
- Default: "Company"
- Examples: "Club", "Yacht", "Organization", "Facility"
- Edition Admins can add, edit, and remove title options
- Each company is assigned one title from the available list

**Company Types (Configurable by Edition Admin):**
- "Channel Partner" (special type with commission features)
- Examples: "Medical Supply", "Management", "Service Provider", "Distributor"
- Edition Admins can add, edit, and remove type options
- Each company is assigned one type from the available list

**Channel Partners (Special Company Type):**
- Channel Partners are companies with type "Channel Partner"
- They can have income/commission splits with the Edition Owner
- Commission can be configured as either dollar amount ($) or percentage (%)
- Commission splits are managed at the Edition Admin level only
- Channel Partners have additional fields for commission tracking

### Users System

**User Structure:**
- Users belong to a specific Company
- Users belong to the Edition that their Company is in
- Users have standard profile information (name, email, phone, role, etc.)
- Users inherit access permissions based on their Company's Edition features

**User Hierarchy:**
- Edition Admin → Company Admin → Channel Admin → User
- Users are the bottom level of the hierarchy
- Company Admins can only manage users within their company
- Channel Admins can manage users within their channel scope

### Data Relationships

```
Edition
├── Edition Admins
├── Company Title Options (configurable)
├── Company Type Options (configurable)
└── Companies
    ├── Company Info (name, phone, address, assigned title, assigned type)
    ├── Channel Partner Details (if type = "Channel Partner")
    │   └── Commission Split Settings ($ or %)
    │   └── Companies
    │   │   └── Users
    │   │   │   └── User Profiles (name, email, phone, role, etc.)
    └── Users
        └── User Profiles (name, email, phone, role, etc.)
```

### Validation Rules

- Company titles must be selected from Edition Admin configured options
- Company types must be selected from Edition Admin configured options
- Channel Partner commission splits can only be configured by Edition Admins
- Users must belong to an existing company within the edition
- Companies cannot be moved between editions after creation

## Documents vs Certificates

### Why We Have Two Repositories

The system maintains separate repositories for Documents and Certificates due to their distinct purposes and data requirements:

**🎓 Certificates (Structured, Verifiable Records)**
- **Purpose**: Structured, standardized proof of training, compliance, or achievement
- **Source**: Usually issued by third party or validated internally
- **Structure**: Defined fields and metadata including:
  - Certificate name/type
  - Issuer information
  - Issue date
  - Expiration date  
  - Tags (e.g., PPE, Forklift, CPR)
  - Optional PIN protection
- **Use Cases**:
  - Compliance audits
  - Employee onboarding/training tracking
  - Safety and regulatory certifications
  - Auto-expiration reminders
- **Why Separate**: 
  - Requires consistent data structure and workflows (expirations, reminders)
  - Reports, filtering, and dashboards rely on predictable metadata
  - Potential integration with training systems or LMS in the future

**📂 Documents (General, Flexible File Storage)**
- **Purpose**: Unstructured or loosely structured files
- **Source**: Can be anything relevant to user's role, emergency readiness, or compliance
- **Structure**: Minimal metadata including:
  - Title/description
  - Optional tags
  - Upload date
  - Optional expiration and PIN protection (if enabled)
- **Use Cases**:
  - Uploaded ID cards, insurance policies, licenses
  - Signed waivers or incident reports
  - Personal emergency-related files
  - Organizational forms or SOPs
- **Why Separate**:
  - Not all documents require structured metadata like certificates
  - Simpler UI for general uploads
  - Avoids cluttering certificate system with non-training-related files

### Key Differences Summary

| Feature | Certificates | Documents |
|---------|-------------|-----------|
| **Structured metadata** | ✅ Yes (name, issuer, dates, tags) | ⚠️ Minimal (title, tag, date, optional PIN) |
| **Supports expiration logic** | ✅ Built-in, expected | ✅ Optional, if feature enabled |
| **Tracked for compliance** | ✅ Yes | ⚠️ Maybe (but not by default) |
| **Used for audits/training** | ✅ Primary use | ❌ Not structured for it |
| **Flexible file type** | ✅ Yes | ✅ Yes |
| **Upload purpose** | Training, credentials, safety certs | General-purpose file storage |
| **Created/uploaded by** | Admins or users with training context | Any user/admin uploading a file |

## Tagging System Guidelines

### Tagging System Overview
Tags are used across Documents, Notes, and Certificates to:
- Categorize items for easy search and filtering
- Drive automation (e.g. reminders, expirations)
- Enable reporting and compliance visibility
- Maintain consistency across organizational levels

### Tag Modules
Tags are module-specific and cannot be shared between modules:
- **📄 Documents**: PPE Training, Employee Handbook, Signed Waiver
- **📝 Notes**: Medical Alert, Incident Report, EMS Follow-Up  
- **🎓 Certificates**: CPR Certified, Forklift Training, OSHA 10

### Tag Scope and Visibility Rules

| Scope | Who Creates | Where Created | Who Can Use |
|-------|-------------|---------------|-------------|
| **Global** | Super Admin | Super Admin Settings Only | Everyone |
| **Edition** | Super Admin or Edition Admin | Edition Feature Settings | Users in that edition |
| **Channel** | Channel Partner | Channel Settings | Users under that channel |
| **Company** | Company Admin (Optional) | Company Settings | Only within that company |

**Important Creation Rules:**
- Global tags can ONLY be created in Super Admin settings, not in edition-level interfaces
- Edition-level tag management interfaces should not offer "Global" as a scope option
- Each scope level has designated creation interfaces to maintain proper access control

**Important Rules:**
- Tags are presented in grouped/categorized dropdowns, not free-text entry
- End users and delegates **cannot create** tags but can **apply existing tags** and **request new ones**
- Module-specific tags cannot be used across different modules

### Tag Request Workflow
When users need new tags:
1. Users see "Request New Tag" option in tagging interfaces
2. They provide: suggested tag name, intended module (docs/notes/certs), optional explanation
3. Request goes to Company Admin → Channel Partner → Edition Admin (based on permissions)
4. Approved tags appear in the dropdown within the appropriate module

### Tag Archiving System
**Archive vs Delete Rules:**
- Tags that are currently in use CANNOT be deleted
- Instead of deletion, tags in use must be ARCHIVED
- Archived tags remain in the system but are hidden from users (except admins)
- Only truly unused tags can be permanently deleted
- Admins can view and manage archived tags through filter options

**Tag Status Management:**
- **Active**: Default state - visible to all authorized users
- **Archived**: Hidden from users but visible to admins for management
- **Delete**: Only available for truly unused tags

**Archive Implementation:**
- Check tag usage across all modules before allowing deletion
- Provide archive checkbox in edit forms for administrative control
- Include filters for Active (default), Archived, and All tags in management interfaces
- Archive functionality should preserve tag relationships while hiding from user selection

### Tag Rules by Role

🔹 **Super Admin**
- Can CRUD tags at the global level
- Can merge global tags or any tag created under editions/channels/companies
- Cannot configure PIN or expiration/reminder settings (those are scoped to edition and below)

🔹 **Edition Admin**
- Can CRUD tags at the edition level and all levels beneath (channels, companies)
- Can merge tags within their edition scope (CANNOT merge global tags)
- Can configure the following feature-level settings, which cascade downward:
  - **PIN Options**:
    - Use Master PIN (boolean toggle)
    - Use Document View PIN (per-item toggle)
  - **Expiration Date & Reminder Settings**:
    - Enable expiration field on documents/certs
    - Define default reminder intervals (e.g., 30/15/7 days before expiration)
- **Global Tag Restrictions**: Cannot create, edit, delete, archive, or merge global tags created by Super Admin
- Global tags appear as read-only in edition-level interfaces for visibility but with no action buttons

🔹 **Channel Partner**
- Can CRUD tags only within their own channel scope and companies under them
- Can configure PIN and expiration/reminder defaults for their own channel and sub-companies if permitted by the Edition Admin
- Cannot merge tags created outside of their scope (e.g., sibling companies or other channels)

🔹 **Company Admin**
- Can apply existing tags
- Can create new tags only if permitted by their Channel or Edition Admin (controlled by a flag)
- Cannot merge or delete tags
- Cannot configure PIN or expiration/reminder settings — only follow what's enabled at edition/channel level

🔹 **End User / Delegate**
- Can only view or apply tags to items they are permitted to manage
- Cannot create, edit, delete, or merge tags
- Cannot configure any PIN or expiration settings

### PIN Management Notes
🔐 **Two settings control how PINs function:**
- **Use Master PIN**: Enables a single PIN shared across multiple protected items
- **Use Document View PIN**: Enables setting a unique PIN per document/note/certificate
- Both are configured at the Edition level and are inherited downward
- PIN logic is enforced per item only if the feature is enabled at or above the org level where the item resides

### Expiration & Reminder Settings Notes
⏰ **Configurable at the Edition and Channel Partner level only**
- Applies to Documents and Certificates
- Settings include:
  - Enable expiration date toggle (per item)
  - Set default reminder intervals
  - Allow admins to override at the item level

### Merge Tag Rules
🔁 **Only Super Admin and Edition Admins can perform tag merges**
- **Super Admin**: Can merge any tags including global tags
- **Edition Admin**: Can merge tags within their edition scope only (CANNOT merge global tags)
- Merge action must:
  - Be scoped to within the same edition/channel/company (cannot merge across isolated orgs unless by Super Admin)
  - Replace all uses of Tag A with Tag B
  - Soft-delete Tag A after merge
- **Global Tag Protection**: Global tags can only be merged by Super Admin in global mode, never in edition-level interfaces

### Implementation Guidelines
- Always implement tag scopes with proper visibility controls
- Include tag request functionality in all tagging interfaces
- Use consistent tag UI patterns across Documents, Notes, and Certificates
- Implement tag merging functionality for administrative cleanup
- **Implement tag archiving system** to preserve data integrity when tags are in use
- Support expiration date settings and reminder configurations
- Include Management PIN options (Master PIN, Document View PIN) where applicable
- **Check tag usage before deletion** and archive instead when tags are in use
- **Enforce role-based tag permissions** according to the rules defined above
- **Implement cascading settings** for PIN and expiration configurations from Edition to lower levels

### 🚧 TODO: Company and Channel Tag Selection UI
**IMPORTANT MISSING FUNCTIONALITY**: When creating "Company" or "Channel" scoped tags, we need to select which specific company or channel the tag belongs to. This functionality is not yet implemented because we haven't created the Company Admin and Channel Partner interfaces.

**Required for Future Implementation**:
- Company tag creation must include dropdown to select which company within the edition
- Channel tag creation must include dropdown to select which channel within the edition  
- These dropdowns should be populated from the edition's companies and channels
- This selection UI should be added when building the Company Admin and Channel Partner management interfaces

**Temporary Workaround**: Currently only Global and Edition scoped tags can be properly created and managed until company/channel selection UI is implemented.

## Accessibility Guidelines

### Dialog Components
- **Reference**: See `/guidelines/Dialog-Accessibility-Guidelines.md` for complete implementation details
- **Required**: All Dialog components MUST include proper accessibility attributes
- **DialogContent**: Always include either `description` prop OR `aria-describedby` attribute
- **DialogTitle**: Always include descriptive title in DialogHeader
- **Best Practice**: Use context-sensitive descriptions that explain the dialog's purpose


### Common Dialog Patterns
```tsx
// Form Dialog
<DialogContent description="Complete the form below to create or modify the item">

// Confirmation Dialog  
<DialogContent description="Review the details and confirm your action">

// Settings Dialog
<DialogContent description="Configure settings and preferences for this feature">
```

## 🔐 CHANGE APPROVAL PROCESS

### Required Process for All Updates

Before implementing any endpoint changes, database modifications, or significant code updates, I must:

1. **📋 Present a Change Summary** with the following details:
   - **Date/Time**: Current date and time of proposed changes
   - **Issue(s) Being Addressed**: Clear description of what problems the changes solve
   - **Files Affected**: List of all files that will be created, modified, or deleted
   - **Endpoints Added/Modified**: Specific API endpoints being added or changed
   - **Database Changes**: Any database schema or data modifications required
   - **Testing Requirements**: What needs to be tested to verify the changes work
   - **Risk Assessment**: Potential issues or side effects of the changes

2. **🎯 Request Explicit Approval** using this format:

```
## CHANGE APPROVAL REQUIRED

**Date**: [Current Date/Time]
**Summary**: [Brief description of changes]

**Changes Proposed**:
- Files to create: [list]
- Files to modify: [list] 
- Endpoints to add: [list]
- Database changes: [list]

**Issues Being Fixed**:
- [Specific issue 1]
- [Specific issue 2]

**Testing Plan**:
- [Test 1]
- [Test 2]

**Risks/Considerations**:
- [Risk 1]
- [Risk 2]

Do you approve these changes? Please respond with "APPROVED" or provide feedback on modifications needed.
```

3. **⏳ Wait for Approval** before implementing any changes
4. **📝 Document Implementation** with timestamps when changes are completed

### When This Process Applies

This approval process is required for:
- ✅ Adding new server endpoints
- ✅ Modifying existing endpoints  
- ✅ Database schema changes
- ✅ Major component refactoring
- ✅ Changes to multiple interconnected files
- ✅ Updates that affect user authentication or data flow

### Exceptions (No Approval Required)

Small updates that don't require approval:
- ❌ Minor styling adjustments
- ❌ Fixing obvious typos or formatting
- ❌ Adding comments or documentation
- ❌ Single-file component modifications that don't affect API calls

### Implementation Guidelines After Approval

Once changes are approved:
1. **CHECK ENDPOINT EXISTENCE FIRST**: Before adding any endpoints, check if they already exist in the server
2. **ACTUAL IMPLEMENTATION**: When approved, implement the changes directly rather than providing instructions
3. **ENDPOINT TRACKING**: Add date/time comments to all endpoint implementations
4. **CHANGE LOG**: Maintain a running log of all endpoint additions with timestamps
5. **DUPLICATION PREVENTION**: Never remove and recreate existing endpoints - only add missing ones
6. **VERIFICATION**: Provide testing verification that proposed changes work as expected

### 📝 ENDPOINT TRACKING SYSTEM

**Critical Rules for Endpoint Management:**
- **ALWAYS CHECK FIRST**: Before proposing endpoint additions, verify what already exists
- **TIMESTAMP ALL ADDITIONS**: Every endpoint must include creation date/time in comments
- **MAINTAIN CHANGE LOG**: Keep detailed record of all endpoint modifications
- **PREVENT DUPLICATION**: Never suggest removing existing endpoints to recreate them
- **CHECK LAST UPDATE**: If an endpoint was updated in the last 24 hours, review thoroughly

**Required Endpoint Comment Format:**
```typescript
// [ENDPOINT NAME] - Added: [DATE] [TIME]
// Purpose: [Brief description]
// Last Updated: [DATE] [TIME] - [Change description]
app.get("/make-server-36481cdb/[route]", async (c) => {
  // Implementation
});
```

**Change Log Format:**
```
## ENDPOINT CHANGE LOG

### December 19, 2024
- **5:30 PM EST**: Added 5 missing endpoints (co-branding, company-titles, company-types, companies, profile PUT)
- **Purpose**: Fix database schema relation errors
- **Status**: APPROVED and IMPLEMENTED

### [Next Date]
- **[Time]**: [Changes made]
```

### 🚫 CRITICAL IMPLEMENTATION RULES

1. **NO INSTRUCTION FILES**: When approved, implement changes directly in code files
2. **NO DUPLICATE ENDPOINTS**: Check existing server code before adding new endpoints  
3. **TIMESTAMP EVERYTHING**: All changes must include date/time tracking
4. **PRESERVE EXISTING**: Never remove working endpoints to recreate them
5. **ACTUAL IMPLEMENTATION**: Write actual code, not instructions for the user to follow
6. **CHECK RECENT CHANGES**: If last update was within 24 hours, review carefully for accuracy

### 🔍 PRE-APPROVAL CHECKLIST

Before presenting any change request:
- [ ] Check CurrentIndexTSX.md for existing endpoints
- [ ] Verify the specific errors/issues being addressed
- [ ] Confirm endpoints don't already exist
- [ ] Check when server was last updated
- [ ] Prepare exact implementation code (not instructions)
- [ ] Include proper error handling and logging
- [ ] Plan timestamp comments for all new code

---

## Notes for AI Assistant

- Always reference these guidelines when implementing new features
- **ALWAYS use the Change Approval Process** for significant updates
- Ask for clarification if requirements conflict with established patterns
- Maintain consistency with existing codebase patterns
- Document any deviations from these guidelines with clear reasoning
- **Question any contradictions** to the business logic defined above
- **ALWAYS implement proper Dialog accessibility** according to the guidelines in `/guidelines/Dialog-Accessibility-Guidelines.md`

 Some of the base components you are using may have styling(eg. gap/typography) baked in as defaults.
So make sure you explicitly set any styling information from the guidelines in the generated react to override the defaults.





💡 **Full Tailwind CSS Content Configuration for React + Vite Projects**

When generating a project using Tailwind CSS, ensure that the `tailwind.config.js` file scans all necessary folders where components, layouts, pages, and utilities may exist. Improper configuration results in broken styles and incomplete UI rendering after export.

## Tailwind CSS Setup
- 1. Enable JIT (default in recent versions)
- 2. Extend theme colors:
-    colors: { primary: "#1D4ED8", secondary: "#9333EA" }
- 3. Content Paths:
-    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
- 4. Tailwind Directives in index.css:
-    @tailwind base;
-    @tailwind components;
-    @tailwind utilities;

📌 **Use this content array in `tailwind.config.js`:**

```js
// tailwind.config.js
module.exports = {
  content: [
    // Root level files
    "./*.{js,ts,jsx,tsx,html}",

    // HTML files
    "./index.html",
    "./public/**/*.html",

    // Main source directories
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",

    // Utility and other directories
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",

    // UI components (important for shadcn/ui or reusable components)
    "./components/ui/**/*.{js,ts,jsx,tsx}",

    // Additional folders
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",

    // Include TypeScript declaration files
    "./**/*.d.ts"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};