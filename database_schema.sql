-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  timestamp timestamp with time zone DEFAULT now(),
  user_id uuid,
  user_email character varying,
  user_role character varying,
  action character varying NOT NULL,
  entity_type character varying NOT NULL,
  entity_id character varying,
  entity_name character varying,
  edition_id uuid,
  edition_name character varying,
  company_id uuid,
  company_name character varying,
  old_values jsonb,
  new_values jsonb,
  success boolean DEFAULT true,
  error_message text,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT audit_logs_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id),
  CONSTRAINT audit_logs_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.certificate_tags (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  scope character varying NOT NULL CHECK (scope::text = ANY (ARRAY['global'::character varying, 'edition'::character varying]::text[])),
  edition_id uuid,
  category character varying DEFAULT 'general'::character varying,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'archived'::character varying]::text[])),
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT certificate_tags_pkey PRIMARY KEY (id),
  CONSTRAINT certificate_tags_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id),
  CONSTRAINT certificate_tags_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.co_branding_settings (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  edition_id uuid,
  logo_url text,
  primary_color character varying DEFAULT '#294199'::character varying,
  secondary_color character varying DEFAULT '#FF9E1E'::character varying,
  company_name text,
  show_logo boolean DEFAULT false,
  show_colors boolean DEFAULT false,
  show_company_name boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT now(),
  branding_mode text DEFAULT 'co_branding'::text,
  CONSTRAINT co_branding_settings_pkey PRIMARY KEY (id),
  CONSTRAINT co_branding_settings_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id)
);
CREATE TABLE public.companies (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  edition_id uuid NOT NULL,
  company_title_id uuid,
  company_type_id uuid,
  parent_company_id uuid,
  is_channel_partner boolean DEFAULT false,
  channel_partner_fields jsonb DEFAULT '{}'::jsonb,
  address text,
  phone character varying,
  email character varying,
  website character varying,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'suspended'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT companies_pkey PRIMARY KEY (id),
  CONSTRAINT fk_companies_title FOREIGN KEY (company_title_id) REFERENCES public.company_titles(id),
  CONSTRAINT fk_companies_type FOREIGN KEY (company_type_id) REFERENCES public.company_types(id),
  CONSTRAINT companies_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id),
  CONSTRAINT companies_parent_company_id_fkey FOREIGN KEY (parent_company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.company_titles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  edition_id uuid NOT NULL,
  name character varying NOT NULL,
  is_default boolean DEFAULT false,
  is_channel_partner boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  CONSTRAINT company_titles_pkey PRIMARY KEY (id),
  CONSTRAINT company_titles_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id)
);
CREATE TABLE public.company_types (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  edition_id uuid NOT NULL,
  name character varying NOT NULL,
  is_default boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  CONSTRAINT company_types_pkey PRIMARY KEY (id),
  CONSTRAINT company_types_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id)
);
CREATE TABLE public.custom_fields (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  edition_id uuid NOT NULL,
  label character varying NOT NULL,
  field_type character varying NOT NULL CHECK (field_type::text = ANY (ARRAY['text-short'::character varying, 'text-long'::character varying, 'number'::character varying, 'date'::character varying, 'checkbox'::character varying, 'dropdown-single'::character varying, 'dropdown-multi'::character varying]::text[])),
  is_required boolean DEFAULT false,
  view_edit_permission character varying DEFAULT 'all-roles'::character varying CHECK (view_edit_permission::text = ANY (ARRAY['admin-only'::character varying, 'admin-user'::character varying, 'admin-delegate'::character varying, 'all-roles'::character varying]::text[])),
  default_value text DEFAULT ''::text,
  dropdown_options jsonb DEFAULT '[]'::jsonb,
  display_order integer DEFAULT 0,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'archived'::character varying]::text[])),
  add_to_ems_profile boolean DEFAULT false, -- Added: August 4, 2025 - Edition Admin can flag custom fields to appear in EMS Profile
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT custom_fields_pkey PRIMARY KEY (id),
  CONSTRAINT custom_fields_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id),
  CONSTRAINT custom_fields_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.delegates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  edition_id uuid NOT NULL,
  delegate_name character varying NOT NULL,
  delegate_email character varying NOT NULL,
  type character varying NOT NULL CHECK (type::text = ANY (ARRAY['company-delegate'::character varying, 'user-delegate'::character varying]::text[])),
  access_level character varying NOT NULL CHECK (access_level::text = ANY (ARRAY['limited'::character varying, 'full'::character varying]::text[])),
  company_id uuid,
  delegated_by_company_admin_id uuid,
  user_id uuid,
  delegated_by_user_id uuid,
  permissions jsonb DEFAULT '{}'::jsonb,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'revoked'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT delegates_pkey PRIMARY KEY (id),
  CONSTRAINT delegates_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id),
  CONSTRAINT delegates_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT delegates_delegated_by_company_admin_id_fkey FOREIGN KEY (delegated_by_company_admin_id) REFERENCES public.users(id),
  CONSTRAINT delegates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT delegates_delegated_by_user_id_fkey FOREIGN KEY (delegated_by_user_id) REFERENCES public.users(id)
);
CREATE TABLE public.dev_checklist_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  role character varying,
  category character varying,
  priority character varying CHECK (priority::text = ANY (ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying]::text[])),
  status character varying DEFAULT 'to-do'::character varying CHECK (status::text = ANY (ARRAY['to-do'::character varying, 'in-progress'::character varying, 'ready-to-test'::character varying, 'completed'::character varying]::text[])),
  is_archived boolean DEFAULT false,
  display_order integer DEFAULT 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT dev_checklist_items_pkey PRIMARY KEY (id)
);
CREATE TABLE public.developer_feedback (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text NOT NULL,
  category character varying,
  priority character varying CHECK (priority::text = ANY (ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying]::text[])),
  status character varying DEFAULT 'open'::character varying CHECK (status::text = ANY (ARRAY['open'::character varying, 'in-progress'::character varying, 'resolved'::character varying, 'closed'::character varying]::text[])),
  reporter_name character varying,
  reporter_email character varying,
  screenshot_url text,
  browser_info text,
  page_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT developer_feedback_pkey PRIMARY KEY (id)
);
CREATE TABLE public.document_tags (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  scope character varying NOT NULL CHECK (scope::text = ANY (ARRAY['global'::character varying, 'edition'::character varying]::text[])),
  edition_id uuid,
  category character varying DEFAULT 'general'::character varying,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'archived'::character varying]::text[])),
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT document_tags_pkey PRIMARY KEY (id),
  CONSTRAINT document_tags_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id),
  CONSTRAINT document_tags_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.editions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  slug character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  description text,
  features jsonb DEFAULT '{}'::jsonb,
  branding jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT editions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.kv_store_36481cdb (
  key text NOT NULL,
  value jsonb NOT NULL,
  CONSTRAINT kv_store_36481cdb_pkey PRIMARY KEY (key)
);
CREATE TABLE public.note_tags (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  scope character varying NOT NULL CHECK (scope::text = ANY (ARRAY['global'::character varying, 'edition'::character varying]::text[])),
  edition_id uuid,
  category character varying DEFAULT 'general'::character varying,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'archived'::character varying]::text[])),
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT note_tags_pkey PRIMARY KEY (id),
  CONSTRAINT note_tags_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id),
  CONSTRAINT note_tags_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id)
);
CREATE TABLE public.payout_records (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  edition_id uuid NOT NULL,
  amount numeric NOT NULL,
  date_sent timestamp with time zone NOT NULL,
  reference character varying NOT NULL,
  notes text,
  payment_method character varying,
  status character varying DEFAULT 'completed'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying, 'cancelled'::character varying]::text[])),
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payout_records_pkey PRIMARY KEY (id),
  CONSTRAINT payout_records_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id),
  CONSTRAINT payout_records_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id)
);
CREATE TABLE public.pricing_configurations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  edition_id uuid NOT NULL UNIQUE,
  revenue_split_enabled boolean DEFAULT false,
  revenue_split_type character varying CHECK (revenue_split_type::text = ANY (ARRAY['percentage'::character varying, 'flat'::character varying]::text[])),
  revenue_split_value numeric DEFAULT 0,
  pricing_control character varying DEFAULT 'super-admin'::character varying CHECK (pricing_control::text = ANY (ARRAY['super-admin'::character varying, 'edition-admin'::character varying]::text[])),
  allow_edition_admin_control boolean DEFAULT false,
  pricing_model_type character varying NOT NULL CHECK (pricing_model_type::text = ANY (ARRAY['seat-based'::character varying, 'event-based'::character varying, 'hybrid'::character varying]::text[])),
  allow_seats boolean DEFAULT true,
  allow_individuals boolean DEFAULT true,
  seat_pricing_monthly numeric DEFAULT 0,
  seat_pricing_annual numeric DEFAULT 0,
  individual_parent_monthly numeric DEFAULT 0,
  individual_parent_annual numeric DEFAULT 0,
  individual_parent_lifetime numeric DEFAULT 0,
  individual_child_monthly numeric DEFAULT 0,
  individual_child_annual numeric DEFAULT 0,
  individual_child_lifetime numeric DEFAULT 0,
  event_base_fee numeric DEFAULT 0,
  event_base_fee_type character varying CHECK (event_base_fee_type::text = ANY (ARRAY['monthly'::character varying, 'annual'::character varying]::text[])),
  event_per_racer_fee numeric DEFAULT 0,
  event_mandatory_safety_id boolean DEFAULT false,
  event_discount_rate integer DEFAULT 0,
  monthly_revenue numeric DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  scanid_share numeric DEFAULT 0,
  edition_admin_share numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pricing_configurations_pkey PRIMARY KEY (id),
  CONSTRAINT pricing_configurations_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id)
);
CREATE TABLE public.reminder_settings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  scope character varying NOT NULL CHECK (scope::text = ANY (ARRAY['global'::character varying, 'edition'::character varying, 'company'::character varying]::text[])),
  edition_id uuid,
  company_id uuid,
  days_before_expiry text NOT NULL,
  reminder_frequency character varying DEFAULT 'daily'::character varying CHECK (reminder_frequency::text = ANY (ARRAY['daily'::character varying, 'weekly'::character varying, 'monthly'::character varying]::text[])),
  is_enabled boolean DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reminder_settings_pkey PRIMARY KEY (id),
  CONSTRAINT reminder_settings_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id),
  CONSTRAINT reminder_settings_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT reminder_settings_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  phone character varying,
  profile_image_url text,
  role character varying NOT NULL CHECK (role::text = ANY (ARRAY['super-admin'::character varying, 'edition-admin'::character varying, 'company-admin'::character varying, 'channel-admin'::character varying, 'user'::character varying]::text[])),
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'suspended'::character varying]::text[])),
  edition_id uuid,
  company_id uuid,
  channel_id uuid,
  last_login timestamp with time zone,
  is_current boolean DEFAULT false,
  
  -- EMS Profile Fields (Added: August 4, 2025)
  birthday date,
  gender character varying,
  height_feet integer, -- US: feet portion (5 feet, 6 inches = 5)
  height_inches integer, -- US: inches portion (5 feet, 6 inches = 6)  
  height_cm integer, -- Metric: centimeters (170 cm)
  weight_lbs integer, -- US: pounds (150 lbs)
  weight_kg numeric(5,2), -- Metric: kilograms (68.5 kg)
  notes_to_ems text,
  
  -- Show to EMS flags for each field
  show_picture_to_ems boolean DEFAULT true,
  show_name_to_ems boolean DEFAULT true,
  show_birthday_to_ems boolean DEFAULT true,
  show_gender_to_ems boolean DEFAULT false,
  show_height_to_ems boolean DEFAULT false,
  show_weight_to_ems boolean DEFAULT false,
  show_notes_to_ems boolean DEFAULT true,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id),
  CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES public.companies(id)
);

-- ===========================================
-- EMS PROFILE OPTIMIZATION INDEXES
-- Added: January 4, 2025 10:45 AM EST
-- Purpose: Performance optimization for EMS Profile queries
-- ===========================================

-- Index for fast EMS Profile data filtering queries
CREATE INDEX IF NOT EXISTS idx_users_ems_profile_visibility ON users (
  show_birthday_to_ems,
  show_gender_to_ems,
  show_height_to_ems,
  show_weight_to_ems,
  show_notes_to_ems
) WHERE (
  show_birthday_to_ems = true OR 
  show_gender_to_ems = true OR 
  show_height_to_ems = true OR 
  show_weight_to_ems = true OR 
  show_notes_to_ems = true
);

-- Index for efficient birthday/age calculation queries
CREATE INDEX IF NOT EXISTS idx_users_birthday_ems ON users (birthday, show_birthday_to_ems) 
WHERE show_birthday_to_ems = true AND birthday IS NOT NULL;

-- Composite index for company + EMS profile queries
CREATE INDEX IF NOT EXISTS idx_users_company_ems ON users (company_id, show_birthday_to_ems, show_gender_to_ems, show_height_to_ems, show_weight_to_ems, show_notes_to_ems);

-- Index for edition-level EMS profile queries
CREATE INDEX IF NOT EXISTS idx_users_edition_ems ON users (edition_id, show_birthday_to_ems, show_gender_to_ems, show_height_to_ems, show_weight_to_ems, show_notes_to_ems);

-- ===========================================
-- EMS PROFILE DATA INTEGRITY CONSTRAINTS
-- Added: January 4, 2025 10:45 AM EST
-- Purpose: Ensure data quality and measurement system validation
-- ===========================================

-- Measurement system validation constraints
ALTER TABLE users ADD CONSTRAINT chk_height_measurement_system 
CHECK (
  (height_feet IS NOT NULL AND height_inches IS NOT NULL AND height_cm IS NULL) OR
  (height_feet IS NULL AND height_inches IS NULL AND height_cm IS NOT NULL) OR
  (height_feet IS NULL AND height_inches IS NULL AND height_cm IS NULL)
);

ALTER TABLE users ADD CONSTRAINT chk_weight_measurement_system 
CHECK (
  (weight_lbs IS NOT NULL AND weight_kg IS NULL) OR
  (weight_lbs IS NULL AND weight_kg IS NOT NULL) OR
  (weight_lbs IS NULL AND weight_kg IS NULL)
);

-- Reasonable value range constraints
ALTER TABLE users ADD CONSTRAINT chk_height_feet_range 
CHECK (height_feet IS NULL OR (height_feet >= 0 AND height_feet <= 9));

ALTER TABLE users ADD CONSTRAINT chk_height_inches_range 
CHECK (height_inches IS NULL OR (height_inches >= 0 AND height_inches < 12));

ALTER TABLE users ADD CONSTRAINT chk_height_cm_range 
CHECK (height_cm IS NULL OR (height_cm >= 30 AND height_cm <= 300));

ALTER TABLE users ADD CONSTRAINT chk_weight_lbs_range 
CHECK (weight_lbs IS NULL OR (weight_lbs >= 1 AND weight_lbs <= 2000));

ALTER TABLE users ADD CONSTRAINT chk_weight_kg_range 
CHECK (weight_kg IS NULL OR (weight_kg >= 0.5 AND weight_kg <= 900));

-- Gender validation constraint
ALTER TABLE users ADD CONSTRAINT chk_gender_values 
CHECK (gender IS NULL OR gender IN ('Male', 'Female', 'Other', 'Prefer not to say'));

-- Birthday validation constraint
ALTER TABLE users ADD CONSTRAINT chk_birthday_reasonable 
CHECK (birthday IS NULL OR (birthday >= '1900-01-01' AND birthday <= CURRENT_DATE));

-- ===========================================
-- EMS PROFILE AUTOMATED TRIGGERS
-- Added: January 4, 2025 10:45 AM EST
-- Purpose: Automatic updated_at timestamp management
-- ===========================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table updated_at automation
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- CUSTOM FIELDS EMS PROFILE OPTIMIZATION
-- Added: January 4, 2025 10:45 AM EST
-- Purpose: Performance optimization for custom fields EMS Profile integration
-- ===========================================

-- Index for fast EMS-enabled custom fields queries
CREATE INDEX IF NOT EXISTS idx_custom_fields_ems_profile ON custom_fields (edition_id, add_to_ems_profile, status) 
WHERE add_to_ems_profile = true AND status = 'active';

-- Index for custom fields display order and EMS profile
CREATE INDEX IF NOT EXISTS idx_custom_fields_display_ems ON custom_fields (edition_id, display_order, add_to_ems_profile) 
WHERE status = 'active';

-- Trigger for custom_fields table updated_at automation
DROP TRIGGER IF EXISTS update_custom_fields_updated_at ON custom_fields;
CREATE TRIGGER update_custom_fields_updated_at
    BEFORE UPDATE ON custom_fields
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- SAFETY ID SYSTEM TABLES
-- Added: January 4, 2025 11:00 AM EST
-- Purpose: Safety ID supply chain tracking system (Firebase-to-Supabase migration)
-- Supply Chain: System â†’ Affiliate â†’ Retailer â†’ Buyer â†’ Assigned Person
-- ===========================================

-- Safety ID Orders/Batches table
CREATE TABLE public.safety_id_orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id character varying NOT NULL UNIQUE, -- Firebase: orderId
  edition_id uuid NOT NULL,
  affiliate_id uuid, -- References users table (affiliate)
  retailer_id uuid, -- References users table (retailer) 
  buyer_id uuid, -- References users table (buyer)
  set_number integer NOT NULL, -- Firebase: set (batch number)
  total_safety_ids integer DEFAULT 0,
  generated_at timestamp with time zone NOT NULL, -- Firebase: generatedAt
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'completed'::character varying, 'cancelled'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT safety_id_orders_pkey PRIMARY KEY (id),
  CONSTRAINT safety_id_orders_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id),
  CONSTRAINT safety_id_orders_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.users(id),
  CONSTRAINT safety_id_orders_retailer_id_fkey FOREIGN KEY (retailer_id) REFERENCES public.users(id),
  CONSTRAINT safety_id_orders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id)
);

-- Individual Safety IDs table
CREATE TABLE public.safety_ids (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  rider_id character varying NOT NULL UNIQUE, -- Firebase: riderId (the actual Safety ID like "C2875")
  order_id uuid, -- References safety_id_orders table (NULL for indirect purchases)
  edition_id uuid NOT NULL,
  affiliate_id uuid, -- References users table (affiliate in supply chain)
  retailer_id uuid, -- References users table (retailer in supply chain)
  buyer_id uuid, -- References users table (buyer in supply chain)
  assigned_to_id uuid, -- References users table (final assigned person)
  set_number integer, -- Firebase: set (batch number for grouping) - NULL for older records
  serial_number character varying, -- Firebase: serialNumber (added after C2875, so NULL for older Safety IDs)
  transaction_id character varying, -- Firebase: transactionID (NULL for indirect purchases)
  generated_at timestamp with time zone NOT NULL, -- Firebase: generatedAt
  assigned_at timestamp with time zone, -- When assigned to final user
  purchase_type character varying DEFAULT 'unknown'::character varying CHECK (purchase_type::text = ANY (ARRAY['direct'::character varying, 'indirect'::character varying, 'unknown'::character varying]::text[])), -- Track purchase method
  status character varying DEFAULT 'generated'::character varying CHECK (status::text = ANY (ARRAY['generated'::character varying, 'assigned'::character varying, 'active'::character varying, 'expired'::character varying, 'revoked'::character varying]::text[])),
  is_printed boolean DEFAULT false, -- Track if Safety ID has been printed
  print_batch_id uuid, -- Reference to print batch for Adobe Illustrator workflow
  firebase_migrated boolean DEFAULT false, -- Track which records came from Firebase migration
  firebase_document_id character varying, -- Original Firebase document ID for reference
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT safety_ids_pkey PRIMARY KEY (id),
  CONSTRAINT safety_ids_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.safety_id_orders(id),
  CONSTRAINT safety_ids_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id),
  CONSTRAINT safety_ids_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.users(id),
  CONSTRAINT safety_ids_retailer_id_fkey FOREIGN KEY (retailer_id) REFERENCES public.users(id),
  CONSTRAINT safety_ids_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id),
  CONSTRAINT safety_ids_assigned_to_id_fkey FOREIGN KEY (assigned_to_id) REFERENCES public.users(id)
);

-- Print batches for Adobe Illustrator CSV workflow
CREATE TABLE public.safety_id_print_batches (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  edition_id uuid NOT NULL,
  batch_name character varying NOT NULL,
  total_safety_ids integer DEFAULT 0,
  csv_generated boolean DEFAULT false,
  csv_file_path text, -- Path to generated CSV file
  print_status character varying DEFAULT 'pending'::character varying CHECK (print_status::text = ANY (ARRAY['pending'::character varying, 'csv_generated'::character varying, 'printed'::character varying, 'distributed'::character varying]::text[])),
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT safety_id_print_batches_pkey PRIMARY KEY (id),
  CONSTRAINT safety_id_print_batches_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.editions(id),
  CONSTRAINT safety_id_print_batches_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);

-- ===========================================
-- SAFETY ID SYSTEM INDEXES
-- Added: January 4, 2025 11:00 AM EST
-- Purpose: Performance optimization for Safety ID queries
-- ===========================================

-- Index for fast Safety ID lookups by rider_id
CREATE INDEX IF NOT EXISTS idx_safety_ids_rider_id ON safety_ids (rider_id);

-- Index for Safety ID supply chain queries
CREATE INDEX IF NOT EXISTS idx_safety_ids_supply_chain ON safety_ids (edition_id, affiliate_id, retailer_id, buyer_id, assigned_to_id);

-- Index for Safety ID status and assignment queries
CREATE INDEX IF NOT EXISTS idx_safety_ids_status_assigned ON safety_ids (status, assigned_to_id, assigned_at);

-- Index for Safety ID order and set grouping (handles NULL values for older records)
CREATE INDEX IF NOT EXISTS idx_safety_ids_order_set ON safety_ids (order_id, set_number) WHERE order_id IS NOT NULL;

-- Index for Safety ID serial numbers (for newer records that have them)
CREATE INDEX IF NOT EXISTS idx_safety_ids_serial_number ON safety_ids (serial_number) WHERE serial_number IS NOT NULL;

-- Index for Safety ID transaction tracking (for direct purchases)
CREATE INDEX IF NOT EXISTS idx_safety_ids_transaction_id ON safety_ids (transaction_id) WHERE transaction_id IS NOT NULL;

-- Index for Firebase migration tracking
CREATE INDEX IF NOT EXISTS idx_safety_ids_firebase_migrated ON safety_ids (firebase_migrated, firebase_document_id) WHERE firebase_migrated = true;

-- Index for purchase type analysis
CREATE INDEX IF NOT EXISTS idx_safety_ids_purchase_type ON safety_ids (edition_id, purchase_type, status);

-- Index for print batch tracking
CREATE INDEX IF NOT EXISTS idx_safety_ids_print_batch ON safety_ids (print_batch_id, is_printed) WHERE print_batch_id IS NOT NULL;

-- Index for Safety ID orders by affiliate/retailer/buyer
CREATE INDEX IF NOT EXISTS idx_safety_id_orders_supply_chain ON safety_id_orders (edition_id, affiliate_id, retailer_id, buyer_id);

-- Index for Safety ID orders by generation date
CREATE INDEX IF NOT EXISTS idx_safety_id_orders_generated_at ON safety_id_orders (generated_at, status);

-- Index for print batches by status
CREATE INDEX IF NOT EXISTS idx_safety_id_print_batches_status ON safety_id_print_batches (edition_id, print_status, created_at);

-- ===========================================
-- SAFETY ID SYSTEM TRIGGERS
-- Added: January 4, 2025 11:00 AM EST
-- Purpose: Automated timestamp and data management
-- ===========================================

-- Trigger for safety_id_orders table updated_at automation
DROP TRIGGER IF EXISTS update_safety_id_orders_updated_at ON safety_id_orders;
CREATE TRIGGER update_safety_id_orders_updated_at
    BEFORE UPDATE ON safety_id_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for safety_ids table updated_at automation
DROP TRIGGER IF EXISTS update_safety_ids_updated_at ON safety_ids;
CREATE TRIGGER update_safety_ids_updated_at
    BEFORE UPDATE ON safety_ids
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for safety_id_print_batches table updated_at automation
DROP TRIGGER IF EXISTS update_safety_id_print_batches_updated_at ON safety_id_print_batches;
CREATE TRIGGER update_safety_id_print_batches_updated_at
    BEFORE UPDATE ON safety_id_print_batches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set assigned_at when Safety ID is assigned
CREATE OR REPLACE FUNCTION set_safety_id_assigned_at()
RETURNS TRIGGER AS $$
BEGIN
    -- If assigned_to_id is being set and status is changing to 'assigned'
    IF NEW.assigned_to_id IS NOT NULL AND OLD.assigned_to_id IS NULL AND NEW.status = 'assigned' THEN
        NEW.assigned_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for automatic assigned_at timestamp
DROP TRIGGER IF EXISTS set_safety_id_assigned_at_trigger ON safety_ids;
CREATE TRIGGER set_safety_id_assigned_at_trigger
    BEFORE UPDATE ON safety_ids
    FOR EACH ROW
    EXECUTE FUNCTION set_safety_id_assigned_at();