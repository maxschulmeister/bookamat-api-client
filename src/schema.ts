import { z } from "zod";

export const EUCountrySchema = z.enum([
  "BE",
  "BG",
  "DK",
  "DE",
  "EE",
  "FI",
  "FR",
  "GR",
  "IE",
  "IT",
  "HR",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SE",
  "SK",
  "SI",
  "ES",
  "CZ",
  "HU",
  "GB",
  "CY",
]);

export const VarRefundCountrySchema = z.enum([
  "IS",
  "JP",
  "CA",
  "LI",
  "NO",
  "CH",
  "KR",
  "TR",
  "XU",
]);

export const ThirdPartyCountrySchema = z.enum([
  "AF",
  "AL",
  "DZ",
  "AD",
  "AO",
  "AR",
  "AM",
  "AZ",
  "AU",
  "BH",
  "BD",
  "BO",
  "BA",
  "BW",
  "BR",
  "KY",
  "CL",
  "CN",
  "CR",
  "CI",
  "CD",
  "DO",
  "EC",
  "SV",
  "ER",
  "FO",
  "GM",
  "GE",
  "GH",
  "GD",
  "GL",
  "GT",
  "GN",
  "HN",
  "HK",
  "IN",
  "ID",
  "IQ",
  "IR",
  "IL",
  "JM",
  "YE",
  "JO",
  "KH",
  "CM",
  "KZ",
  "QA",
  "KE",
  "KG",
  "CO",
  "CG",
  "CU",
  "KW",
  "LA",
  "LB",
  "LR",
  "LY",
  "MY",
  "ML",
  "MA",
  "MK",
  "MX",
  "MD",
  "MC",
  "MN",
  "ME",
  "MZ",
  "MM",
  "NA",
  "NP",
  "NZ",
  "NI",
  "NE",
  "NG",
  "OM",
  "PK",
  "PA",
  "PY",
  "PE",
  "PH",
  "PR",
  "RW",
  "RU",
  "ZM",
  "SM",
  "SA",
  "SN",
  "RS",
  "ZW",
  "SG",
  "SO",
  "LK",
  "SD",
  "SR",
  "SY",
  "ZA",
  "SS",
  "TJ",
  "TW",
  "TZ",
  "TH",
  "TG",
  "TD",
  "TN",
  "TM",
  "UG",
  "UA",
  "UY",
  "UZ",
  "VE",
  "AE",
  "US",
  "VN",
  "BY",
  "CF",
  "EG",
  "ET",
]);

export const CountrySchema = z.union([
  EUCountrySchema,
  VarRefundCountrySchema,
  ThirdPartyCountrySchema,
]);

// --- Reusable Schemas ---

/**
 * Common string pattern for decimal numbers (e.g., "123.45", "-10.00")
 */
export const DecimalStringSchema = z.string().regex(/^-?\d+(\.\d+)?$/);

/**
 * Common name field constraint (max 40 chars)
 */
export const NameSchema = z.string().max(40);

/**
 * 1 = Income (Einnahme)
 * 2 = Expense (Ausgabe)
 * Used for CostAccounts and Bookings
 */
export const AccountGroupSchema = z.enum(["1", "2"]);

/**
 * 1 = Booked (gebucht) - when date is present
 * 2 = Open (offen) - when no date is present
 * 3 = Deleted (gelöscht)
 * 4 = Imported (importiert)
 */
export const BookingStatusSchema = z.enum(["1", "2", "3", "4"]);

/**
 * Common title field constraint (max 50 chars)
 */
export const TitleSchema = z.string().max(50);

// ------------------------

/**
 * Bookamat Client Options
 */
export const ClientOptionsSchema = z.object({
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit string"),
  username: z.string().min(1, "Username is required"),
  apiKey: z.string().min(1, "API Key is required"),
  country: CountrySchema.optional(),
  baseUrl: z.url().optional(),
});

/**
 * Params for fetching bookings
 */
export const BookingsParamsSchema = z.object({
  // Group (income/expense)
  group: AccountGroupSchema.optional(),

  // Title filters
  title: TitleSchema.optional(),
  title_contains: z.string().optional(),

  // Date filters
  date: z.iso.date().optional(),
  date_from: z.iso.date().optional(),
  date_until: z.iso.date().optional(),

  // Invoice date filters
  date_invoice: z.iso.date().optional(),
  date_invoice_from: z.iso.date().optional(),
  date_invoice_until: z.iso.date().optional(),

  // Delivery date filters
  date_delivery: z.iso.date().optional(),
  date_delivery_from: z.iso.date().optional(),
  date_delivery_until: z.iso.date().optional(),

  // Order date filters
  date_order: z.iso.date().optional(),
  date_order_from: z.iso.date().optional(),
  date_order_until: z.iso.date().optional(),

  // Amount filters (gross)
  amount: z.number().optional(),
  amount_min: z.number().optional(),
  amount_max: z.number().optional(),

  // Amount after tax filters (net)
  amount_after_tax: z.number().optional(),
  amount_after_tax_min: z.number().optional(),
  amount_after_tax_max: z.number().optional(),

  // Account IDs
  bankaccount: z.int().positive().optional(),
  costaccount: z.int().positive().optional(),
  purchasetaxaccount: z.int().positive().optional(),
  costcentre: z.int().positive().optional(),
  foreign_business_base: z.int().positive().optional(),

  // Country filters
  country_dep: CountrySchema.optional(),
  country_rec: CountrySchema.optional(),

  // Tag ID
  tag: z.int().positive().optional(),

  // VAT ID filters
  vatin: z.string().optional(),
  vatin_contains: z.string().optional(),

  // Description filters
  description: z.string().optional(),
  description_contains: z.string().optional(),

  // Creation date filters
  create_date: z.iso.datetime().optional(),
  create_date_from: z.iso.datetime().optional(),
  create_date_until: z.iso.datetime().optional(),

  // Update date filters
  update_date: z.iso.datetime().optional(),
  update_date_from: z.iso.datetime().optional(),
  update_date_until: z.iso.datetime().optional(),

  // Attachment filter
  has_attachments: z.boolean().optional(),

  // Sorting
  ordering: z.string().optional(),

  // Pagination
  page: z.int().positive().optional(),
});

/**
 * Generic parameters for paginated list requests.
 */
export const PaginatedRequestParamsSchema = z.object({
  page: z.int().positive().optional(), // Page number to fetch
  limit: z.int().positive().max(100).optional(), // Number of results per page (max 100 according to docs)
  ordering: z.string().optional(), // Field to sort by (e.g., "id", "-name")
  // Add other common query parameters for filtering if applicable across multiple types
});

/**
 * Parameters for listing booking attachments, including filtering by booking ID.
 */
export const BookingAttachmentsListParamsSchema =
  PaginatedRequestParamsSchema.extend({
    booking: z.int().positive(), // Filter by Booking ID
  });

/**
 * Generic structure for paginated API responses.
 * Note: Zod schemas cannot be generic in the same way as TS types.
 * We will define a helper function to create paginated schemas.
 */
export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    count: z.int().nonnegative(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  });

/**
 * Bookamat Accounts
 */

export const CostAccountSchema = z.object({
  id: z.int(),
  costaccount: z.int(),
  name: NameSchema,
  section: z.string(),
  group: AccountGroupSchema,
  inventory: z.boolean(),
  index_incometax: z.array(z.string()),
  deductibility_tax_percent: DecimalStringSchema,
  deductibility_amount_percent: DecimalStringSchema,
  description: z.string(),
  active: z.boolean(),
  purchasetaxaccounts: z.array(
    z.object({
      id: z.int(),
      name: z.string(),
    })
  ),
  counter_booked_bookings: z.int(),
  counter_open_bookings: z.int(),
  counter_deleted_bookings: z.int(),
  counter_bookingtemplates: z.int(),
});

export const PurchaseTaxAccountSchema = z.object({
  id: z.int(),
  purchasetaxaccount: z.int(),
  name: NameSchema,
  section: z.string(),
  group: z.string(),
  reverse_charge: z.boolean(),
  ic_report: z.boolean(),
  ic_delivery: z.boolean(),
  ic_service: z.boolean(),
  ioss_report: z.boolean(),
  eu_oss_report: z.boolean(),
  tax_values: z.array(z.string()),
  index_purchasetax: z.array(z.string()),
  description: z.string(),
  active: z.boolean(),
  counter_booked_bookings: z.int(),
  counter_open_bookings: z.int(),
  counter_deleted_bookings: z.int(),
  counter_bookingtemplates: z.int(),
});

export const BankAccountSchema = z.object({
  id: z.int(),
  name: NameSchema,
  position: z.int(),
  flag_balance: z.boolean(),
  opening_balance: DecimalStringSchema,
  counter_booked_bookings: z.int(),
  counter_open_bookings: z.int(),
  counter_deleted_bookings: z.int(),
  counter_bookingtemplates: z.int(),
});

export const CostCentreSchema = z
  .object({
    id: z.int(),
    name: NameSchema,
    description: z.string().optional(),
    active: z.boolean().optional(),
  })
  .passthrough(); // Allow other properties

export const AttachmentSchema = z.object({
  id: z.int(),
  booking: z.int(),
  name: z.string(),
  size: z.int().nonnegative(),
});

export const AttachmentCreateSchema = z.object({
  booking: z.int(),
  name: z.string().min(1),
  file: z.base64(), // Base64 encoded file
});

export const AttachmentUpdateSchema = z.object({
  name: z.string().min(1).optional(),
});

export const AttachmentsSchema = z.object({
  count: z.int().nonnegative(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(AttachmentSchema),
});

export const BookingAttachmentSchema = AttachmentSchema.pick({
  id: true,
  name: true,
  size: true,
});

export const BookingTagSchema = z.object({
  id: z.int(),
  booking: z.int(),
  tag: z.int(),
  name: z.string(),
});

export const BookingTagCreateSchema = z.object({
  tag: z.int(),
});

export const BookingTagUpdateSchema = z.object({
  tag: z.int(),
});

export const BookingAmountSchema = z.object({
  group: AccountGroupSchema,
  bankaccount: BankAccountSchema.pick({ id: true, name: true }),
  costaccount: CostAccountSchema.pick({ id: true, name: true }),
  purchasetaxaccount: PurchaseTaxAccountSchema.pick({ id: true, name: true }),
  amount: DecimalStringSchema,
  amount_after_tax: DecimalStringSchema,
  tax_percent: DecimalStringSchema,
  tax_value: DecimalStringSchema,
  deductibility_tax_percent: DecimalStringSchema,
  deductibility_tax_value: DecimalStringSchema,
  deductibility_amount_percent: DecimalStringSchema,
  deductibility_amount_value: DecimalStringSchema,
  foreign_business_base: z
    .object({
      id: z.int(),
      vatin: z.string(),
    })
    .nullable(),
  country_dep: CountrySchema,
  country_rec: CountrySchema,
});

export const BookingSchema = z.object({
  id: z.int(),
  status: BookingStatusSchema,
  title: TitleSchema,
  document_number: z.string(),
  date: z.iso.date(),
  date_invoice: z.iso.date().nullable(),
  date_delivery: z.iso.date().nullable(),
  date_order: z.iso.date().nullable(),
  costcentre: z
    .object({
      id: z.int(),
      name: z.string(),
    })
    .nullable(),
  amounts: z.array(BookingAmountSchema),
  tags: z.array(BookingTagSchema),
  attachments: z.array(BookingAttachmentSchema),
  vatin: z.string(),
  country: CountrySchema,
  description: z.string(),
  create_date: z.iso.datetime(),
  update_date: z.iso.datetime(),
});

export const BookingsSchema = createPaginatedResponseSchema(BookingSchema);

export const BookingCreateAmountSchema = z.object({
  bankaccount: z.int(),
  costaccount: z.int(),
  purchasetaxaccount: z.int(),
  amount: DecimalStringSchema,
  tax_percent: DecimalStringSchema,
  deductibility_tax_percent: DecimalStringSchema,
  deductibility_amount_percent: DecimalStringSchema,
  foreign_business_base: z.int().optional(),
  country_dep: CountrySchema.optional(),
  country_rec: CountrySchema.optional(),
});

export const BookingCreateSchema = z.object({
  title: TitleSchema.min(1),
  date: z.iso.date(),
  amounts: z.array(BookingCreateAmountSchema).min(1),
  date_invoice: z.iso.date().optional(),
  date_delivery: z.iso.date().optional(),
  date_order: z.iso.date().optional(),
  costcentre: z.int().optional(),
  vatin: z.string().optional(),
  country: CountrySchema.optional(),
  description: z.string().optional(),
  foreign_business_base: z.int().optional(),
  country_dep: CountrySchema.optional(),
  country_rec: CountrySchema.optional(),
});

export const BookingUpdateSchema = z.object({
  title: TitleSchema.min(1),
  date: z.iso.date(),
  amounts: z.array(BookingCreateAmountSchema).min(1),
  status: BookingStatusSchema.optional(),
  document_number: z.string().optional(),
  date_invoice: z.iso.date().nullable().optional(),
  date_delivery: z.iso.date().nullable().optional(),
  date_order: z.iso.date().nullable().optional(),
  costcentre: z.int().nullable().optional(),
  vatin: z.string().optional(),
  country: CountrySchema.optional(),
  description: z.string().optional(),
  foreign_business_base: z.int().nullable().optional(),
  country_dep: CountrySchema.optional(),
  country_rec: CountrySchema.optional(),
});

export const AttachmentDownloadResponseSchema = AttachmentSchema.extend({
  mimetype: z.string(),
  file: z.base64(),
});

export const ConfigurationSchema = z
  .object({
    company_name: z.string(),
    default_currency: z.string().length(3),
  })
  .passthrough();

export const AssetSchema = z
  .object({
    id: z.int(),
    name: NameSchema,
    description: z.string().optional(),
    acquisition_date: z.iso.date().optional(),
    commissioning_date: z.iso.date().optional(),
    decommissioning_date: z.iso.date().nullable().optional(),
    initial_value: DecimalStringSchema.optional(),
    current_value: DecimalStringSchema.optional(),
  })
  .passthrough();

export const AssetCreateSchema = z
  .object({
    name: NameSchema.min(1),
    description: z.string().optional(),
    acquisition_date: z.iso.date(),
    commissioning_date: z.iso.date().optional(),
    initial_value: DecimalStringSchema,
  })
  .passthrough();

export const AssetUpdateSchema = z
  .object({
    name: NameSchema.optional(),
    description: z.string().optional(),
    acquisition_date: z.iso.date().optional(),
    commissioning_date: z.iso.date().optional(),
    decommissioning_date: z.iso.date().nullable().optional(),
    initial_value: DecimalStringSchema.optional(),
  })
  .passthrough();

export const AssetAttachmentSchema = z.object({
  id: z.int(),
  asset: z.int(),
  name: z.string(),
  size: z.int().nonnegative(),
});

export const AssetAttachmentCreateSchema = z.object({
  asset: z.int(),
  name: z.string().min(1),
  file: z.base64(),
});

export const AssetAttachmentUpdateSchema = z.object({
  name: z.string().min(1).optional(),
});

export const AssetAttachmentsListParamsSchema =
  PaginatedRequestParamsSchema.extend({
    asset: z.int().positive(),
  });

export const AssetAttachmentDownloadResponseSchema =
  AssetAttachmentSchema.extend({
    mimetype: z.string(),
    file: z.base64(),
  });

export const ForeignBusinessBaseSchema = z
  .object({
    id: z.int(),
    name: NameSchema,
    vatin: z.string().optional(),
    country: CountrySchema.optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    zip_code: z.string().optional(),
    active: z.boolean().optional(),
  })
  .passthrough();

export const GlobalTagSchema = z
  .object({
    id: z.int(),
    name: NameSchema,
    description: z.string().optional(),
  })
  .passthrough();

export const UserSchema = z
  .object({
    id: z.int(),
    username: z.string(),
    email: z.email(),
    first_name: z.string(),
    last_name: z.string(),
  })
  .passthrough();

export const UserAccountSchema = z.object({
  id: z.int(),
  country: CountrySchema,
  year: z.int(),
  url: z.url(),
});

export const PredefinedCostAccountsParamsSchema = z.object({
  group: AccountGroupSchema.optional(),
  inventory: z.boolean().optional(),
  index_incometax: z.string().optional(),
  ordering: z.string().optional(),
  page: z.int().positive().optional(),
});

export const PredefinedPurchaseTaxAccountsParamsSchema = z.object({
  group: AccountGroupSchema.optional(),
  reverse_charge: z.boolean().optional(),
  ic_report: z.boolean().optional(),
  ic_delivery: z.boolean().optional(),
  ic_service: z.boolean().optional(),
  ioss_report: z.boolean().optional(),
  eu_oss_report: z.boolean().optional(),
  tax_values: z.string().optional(),
  index_purchasetax: z.string().optional(),
  ordering: z.string().optional(),
  page: z.int().positive().optional(),
});

export const UserAccountsParamsSchema = z.object({
  year: z.int().optional(),
  page: z.int().positive().optional(),
});

export const UserSettingsSchema = z.object({
  id: z.int(),
  group: AccountGroupSchema,
  purchasetax: z.boolean(),
  purchasetax_range: AccountGroupSchema, // Assuming 1,2 for range too, otherwise keep as is. Checking usage...
  ic_report_range: AccountGroupSchema, // Assuming 1,2 for range too
  tax_percent: DecimalStringSchema,
  deductibility_tax_percent: DecimalStringSchema,
  deductibility_income_percent: DecimalStringSchema,
});

export const UserExemptionsSchema = z.object({
  id: z.int(),
  exemption_9221: DecimalStringSchema,
  exemption_9227: DecimalStringSchema,
  exemption_9229: DecimalStringSchema,
  exemption_9276: DecimalStringSchema,
  exemption_9277: DecimalStringSchema,
});

export const CreateBankAccountRequestSchema = z.object({
  name: NameSchema.min(1),
  position: z.int().optional(),
  flag_balance: z.boolean().optional(),
  opening_balance: DecimalStringSchema.optional(),
});

export const UpdateBankAccountRequestSchema = z.object({
  name: NameSchema.optional(),
  position: z.int().optional(),
  flag_balance: z.boolean().optional(),
  opening_balance: DecimalStringSchema.optional(),
});

export const ActivateCostAccountRequestSchema = z.object({
  costaccount: z.int(),
});

export const ActivatePurchaseTaxAccountRequestSchema = z.object({
  purchasetaxaccount: z.int(),
});

export const CreateCostCentreRequestSchema = z.object({
  name: NameSchema.min(1),
  position: z.int().optional(),
});

export const UpdateCostCentreRequestSchema = z.object({
  name: NameSchema.optional(),
  position: z.int().optional(),
});

export const CreateForeignBusinessBaseRequestSchema = z.object({
  name: NameSchema.min(1),
  position: z.int().optional(),
});

export const UpdateForeignBusinessBaseRequestSchema = z.object({
  name: NameSchema.optional(),
  position: z.int().optional(),
});

export const CreateTagRequestSchema = z.object({
  name: NameSchema.min(3),
  position: z.int().optional(),
});

export const UpdateTagRequestSchema = z.object({
  name: NameSchema.min(3).optional(),
  position: z.int().optional(),
});
