/**
 * Bookamat Client Options
 */
export interface ClientOptions {
  year: string;
  username: string;
  apiKey: string;
  country?: string;
  baseUrl?: string;
}

/**
 * Params for fetching bookings
 */
export interface BookingsParams {
  // Group (income/expense)
  group?: "1" | "2";

  // Title filters
  title?: string;
  title_contains?: string;

  // Date filters
  date?: string;
  date_from?: string;
  date_until?: string;

  // Invoice date filters
  date_invoice?: string;
  date_invoice_from?: string;
  date_invoice_until?: string;

  // Delivery date filters
  date_delivery?: string;
  date_delivery_from?: string;
  date_delivery_until?: string;

  // Order date filters
  date_order?: string;
  date_order_from?: string;
  date_order_until?: string;

  // Amount filters (gross)
  amount?: number;
  amount_min?: number;
  amount_max?: number;

  // Amount after tax filters (net)
  amount_after_tax?: number;
  amount_after_tax_min?: number;
  amount_after_tax_max?: number;

  // Account IDs
  bankaccount?: number;
  costaccount?: number;
  purchasetaxaccount?: number;
  costcentre?: number;
  foreign_business_base?: number;

  // Country filters
  country_dep?: string;
  country_rec?: string;

  // Tag ID
  tag?: number;

  // VAT ID filters
  vatin?: string;
  vatin_contains?: string;

  // Description filters
  description?: string;
  description_contains?: string;

  // Creation date filters
  create_date?: string;
  create_date_from?: string;
  create_date_until?: string;

  // Update date filters
  update_date?: string;
  update_date_from?: string;
  update_date_until?: string;

  // Attachment filter
  has_attachments?: boolean;

  // Sorting
  ordering?: string;

  // Pagination
  page?: number;
}

/**
 * Generic parameters for paginated list requests.
 */
export interface PaginatedRequestParams {
  page?: number; // Page number to fetch
  limit?: number; // Number of results per page (max 100 according to docs)
  ordering?: string; // Field to sort by (e.g., "id", "-name")
  // Add other common query parameters for filtering if applicable across multiple types
}

/**
 * Parameters for listing booking attachments, including filtering by booking ID.
 */
export interface BookingAttachmentsListParams extends PaginatedRequestParams {
  booking: number; // Filter by Booking ID
}

/**
 * Generic structure for paginated API responses.
 * @template T The type of the items in the results array.
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Bookings extends PaginatedResponse<Booking> {}

export interface Booking {
  id: number;
  status: "1" | "2" | "3" | "4";
  title: string;
  document_number: string;
  date: string;
  date_invoice: string | null;
  date_delivery: string | null;
  date_order: string | null;
  costcentre: {
    id: number;
    name: string;
  } | null;
  amounts: BookingAmount[];
  tags: BookingTag[];
  attachments: BookingAttachment[];
  vatin: string;
  country: string;
  description: string;
  create_date: string;
  update_date: string;
}

export interface BookingAmount {
  group: "1" | "2";
  bankaccount: Pick<BankAccount, "id" | "name">;
  costaccount: Pick<CostAccount, "id" | "name">;
  purchasetaxaccount: Pick<PurchaseTaxAccount, "id" | "name">;
  amount: string;
  amount_after_tax: string;
  tax_percent: string;
  tax_value: string;
  deductibility_tax_percent: string;
  deductibility_tax_value: string;
  deductibility_amount_percent: string;
  deductibility_amount_value: string;
  foreign_business_base: {
    id: number;
    vatin: string;
  } | null;
  country_dep: string;
  country_rec: string;
}

export interface BookingTag {
  id: number; // ID of the BookingTag association
  booking: number; // ID of the booking this tag association belongs to
  tag: number; // ID of the global Tag
  name: string; // Name of the global Tag
}

/**
 * Payload for creating a new tag association for a booking.
 */
export interface BookingTagCreate {
  tag: number; // ID of the global Tag to associate with the booking
}

/**
 * Payload for updating an existing booking tag association (e.g., changing which global tag it points to).
 */
export interface BookingTagUpdate {
  tag: number; // The new global Tag ID to associate
}

export interface BookingAttachment
  extends Pick<Attachment, "id" | "name" | "size"> {}

/**
 * Attachments
 */

export interface Attachment {
  id: number;
  booking: number;
  name: string;
  size: number;
}

export interface AttachmentCreate {
  booking: number;
  name: string;
  file: string; // Base64 encoded file
}

/**
 * Payload for updating an existing booking attachment (PUT/PATCH request).
 * Currently, only the name is considered updatable.
 */
export interface AttachmentUpdate {
  name?: string;
  // The API docs hint that PUT/PATCH are possible, but don't specify fields.
  // 'booking' ID is unlikely to be changeable via this endpoint.
}

export interface Attachments {
  count: number;
  next: string | null;
  previous: string | null;
  results: Attachment[];
}

/**
 * Bookamat Accounts
 */

export interface CostAccount {
  id: number;
  costaccount: number;
  name: string;
  section: string;
  group: "1" | "2";
  inventory: boolean;
  index_incometax: string[];
  deductibility_tax_percent: string;
  deductibility_amount_percent: string;
  description: string;
  active: boolean;
  purchasetaxaccounts: { id: number; name: string }[];
  counter_booked_bookings: number;
  counter_open_bookings: number;
  counter_deleted_bookings: number;
  counter_bookingtemplates: number;
}

export interface PurchaseTaxAccount {
  id: number;
  purchasetaxaccount: number;
  name: string;
  section: string;
  group: "1" | "2";
  reverse_charge: boolean;
  ic_report: boolean;
  ic_delivery: boolean;
  ic_service: boolean;
  ioss_report: boolean;
  eu_oss_report: boolean;
  tax_values: string[];
  index_purchasetax: string[];
  description: string;
  active: boolean;
  counter_booked_bookings: number;
  counter_open_bookings: number;
  counter_deleted_bookings: number;
  counter_bookingtemplates: number;
}

export interface BankAccount {
  id: number;
  name: string;
  position: number;
  flag_balance: boolean;
  opening_balance: string;
  counter_booked_bookings: number;
  counter_open_bookings: number;
  counter_deleted_bookings: number;
  counter_bookingtemplates: number;
}

/**
 * Bookamat Booking Details
 */

export interface BookingCreate {
  title: string; // Concise, meaningful title summarizing vendor and items
  date: string; // Booking date in YYYY-MM-DD format
  amounts: BookingCreateAmount[]; // Line items grouped by tax/account combinations
  date_invoice?: string; // Invoice date if present
  date_delivery?: string; // Delivery date, defaults to invoice date if not present
  date_order?: string; // Order date, defaults to invoice date if not present
  costcentre?: number; // Cost center ID if applicable
  vatin?: string; // VAT identification number if present
  country?: string; // Country code (ISO 3166-1 alpha-2)
  description?: string; // Invoice number only (e.g. '#12345'), otherwise blank
  foreign_business_base?: number; // Foreign business unit ID if applicable
  country_dep?: string; // Country of departure code if applicable
  country_rec?: string; // Country of consumption code if applicable
}

export interface BookingCreateAmount {
  bankaccount: number; // ID des Zahlungsmittelkontos (Ganzzahl)
  costaccount: number; // ID des Steuerkontos (Ganzzahl)
  purchasetaxaccount: number; // ID des Umsatzsteuerkontos (Ganzzahl)
  amount: string; // Bruttobetrag (Dezimalzahl)
  tax_percent: string; // Umsatzsteuer in % (Dezimalzahl, 0.00 bis 100.00)
  deductibility_tax_percent: string; // Betrieblicher Anteil der Umsatzsteuer in % (Dezimalzahl, 0.00 bis 100.00)
  deductibility_amount_percent: string; // Betrieblicher Anteil des Nettobetrags in % (Dezimalzahl, 0.00 bis 100.00)
  foreign_business_base?: number; // ID der ausländischen Betriebsstätte (Ganzzahl)
  country_dep?: string; // Abgangsland (String, Auswahl) - Siehe Länder
  country_rec?: string; // Mitgliedstaat des Verbrauchs (String, Auswahl) - Siehe Länder
}

/**
 * Payload for updating an existing booking (PUT request).
 * Fields are based on BookingCreate and potentially updatable fields from the Booking object.
 */
export interface BookingUpdate {
  title: string;
  date: string; // Booking date in YYYY-MM-DD format
  amounts: BookingCreateAmount[]; // Line items, reusing BookingCreateAmount

  status?: "1" | "2" | "3" | "4"; // Booking status
  document_number?: string; // Document number

  date_invoice?: string | null; // Invoice date, or null to clear
  date_delivery?: string | null; // Delivery date, or null to clear
  date_order?: string | null; // Order date, or null to clear

  costcentre?: number | null; // Cost center ID, or null to remove
  vatin?: string;
  country?: string; // Country code (ISO 3166-1 alpha-2)
  description?: string;

  foreign_business_base?: number | null; // Foreign business unit ID, or null to remove
  country_dep?: string; // Country of departure code if applicable
  country_rec?: string; // Country of consumption code if applicable
}

export interface AttachmentDownloadResponse extends Attachment {
  mimetype: string;
  file: string; // base64 encoded file content
}

/**
 * API Configuration Object
 */
export interface Configuration {
  // Placeholder: Define actual configuration fields based on API response
  company_name: string;
  default_currency: string;
  // Add other configuration properties as needed
  [key: string]: any; // Allow other properties
}

/**
 * Cost Centre Object
 */
export interface CostCentre {
  id: number;
  name: string;
  description?: string;
  active?: boolean;
  // Add other cost centre properties as needed from API documentation
  [key: string]: any;
}

/**
 * Asset (Anlage) Object
 */
export interface Asset {
  id: number;
  name: string;
  description?: string;
  acquisition_date?: string; // Anschaffungsdatum
  commissioning_date?: string; // Inbetriebnahmedatum
  decommissioning_date?: string | null; // Außerbetriebnahmedatum
  initial_value?: string; // Anschaffungswert
  current_value?: string; // Buchwert
  // Placeholder for other asset-specific fields like depreciation type, useful life, etc.
  // attachments might be a separate sub-resource or an array here, similar to bookings
  // tags might also be applicable
  [key: string]: any;
}

/**
 * Payload for creating a new Asset (Anlage).
 */
export interface AssetCreate {
  name: string;
  description?: string;
  acquisition_date: string;
  commissioning_date?: string;
  initial_value: string;
  // Add other required/optional fields for asset creation
  [key: string]: any;
}

/**
 * Payload for updating an existing Asset (Anlage).
 */
export interface AssetUpdate {
  name?: string;
  description?: string;
  acquisition_date?: string;
  commissioning_date?: string;
  decommissioning_date?: string | null;
  initial_value?: string;
  // Add other updatable fields
  [key: string]: any;
}

/**
 * Represents an attachment linked to an Asset (Anlage).
 */
export interface AssetAttachment {
  id: number;
  asset: number; // ID of the asset this attachment belongs to
  name: string;
  size: number;
  // Potentially other fields like created_at, updated_at if the API provides them
}

/**
 * Payload for creating a new attachment for an Asset.
 */
export interface AssetAttachmentCreate {
  asset: number; // ID of the asset to attach the file to
  name: string; // Filename
  file: string; // Base64 encoded file content
}

/**
 * Payload for updating an AssetAttachment (e.g., renaming).
 */
export interface AssetAttachmentUpdate {
  name?: string;
}

/**
 * Parameters for listing asset attachments, including filtering by asset ID.
 */
export interface AssetAttachmentsListParams extends PaginatedRequestParams {
  asset: number; // Filter by Asset ID
}

/**
 * Response for downloading an asset attachment.
 */
export interface AssetAttachmentDownloadResponse extends AssetAttachment {
  mimetype: string;
  file: string; // base64 encoded file content
}

/**
 * Foreign Business Base (Betriebsstätte) Object
 */
export interface ForeignBusinessBase {
  id: number;
  name: string;
  vatin?: string; // VAT Identification Number
  country?: string; // ISO 3166-1 alpha-2 country code
  address?: string;
  city?: string;
  zip_code?: string;
  active?: boolean;
  // Add other foreign business base properties as needed from API documentation
  [key: string]: any;
}

/**
 * Global Tag Object (distinct from BookingTag)
 */
export interface GlobalTag {
  id: number;
  name: string;
  description?: string;
  // Add other global tag properties as needed from API documentation
  [key: string]: any;
}

/**
 * User Object
 */
export interface User {
  // Placeholder: Define actual user fields based on API response
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  // Add other user properties as needed
  [key: string]: any; // Allow other properties
}
