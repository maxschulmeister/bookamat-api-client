import { z } from "zod";
import {
  ActivateCostAccountRequestSchema,
  ActivatePurchaseTaxAccountRequestSchema,
  AssetAttachmentCreateSchema,
  AssetAttachmentDownloadResponseSchema,
  AssetAttachmentSchema,
  AssetAttachmentUpdateSchema,
  AssetAttachmentsListParamsSchema,
  AssetCreateSchema,
  AssetSchema,
  AssetUpdateSchema,
  AttachmentCreateSchema,
  AttachmentDownloadResponseSchema,
  AttachmentSchema,
  AttachmentUpdateSchema,
  AttachmentsSchema,
  BankAccountSchema,
  BookingAmountSchema,
  BookingAttachmentSchema,
  BookingAttachmentsListParamsSchema,
  BookingCreateAmountSchema,
  BookingCreateSchema,
  BookingSchema,
  BookingTagCreateSchema,
  BookingTagSchema,
  BookingTagUpdateSchema,
  BookingUpdateSchema,
  BookingsParamsSchema,
  BookingsSchema,
  ClientOptionsSchema,
  ConfigurationSchema,
  CostAccountSchema,
  CostCentreSchema,
  CountrySchema,
  CreateBankAccountRequestSchema,
  CreateCostCentreRequestSchema,
  CreateForeignBusinessBaseRequestSchema,
  CreateTagRequestSchema,
  EUCountrySchema,
  ForeignBusinessBaseSchema,
  GlobalTagSchema,
  PaginatedRequestParamsSchema,
  PredefinedCostAccountsParamsSchema,
  PredefinedPurchaseTaxAccountsParamsSchema,
  PurchaseTaxAccountSchema,
  ThirdPartyCountrySchema,
  UpdateBankAccountRequestSchema,
  UpdateCostCentreRequestSchema,
  UpdateForeignBusinessBaseRequestSchema,
  UpdateTagRequestSchema,
  UserAccountSchema,
  UserAccountsParamsSchema,
  UserExemptionsSchema,
  UserSchema,
  UserSettingsSchema,
  VarRefundCountrySchema,
} from "./schema";

/**
 * Bookamat Client Options
 */
export type ClientOptions = z.infer<typeof ClientOptionsSchema>;

/**
 * Params for fetching bookings
 */
export type BookingsParams = z.infer<typeof BookingsParamsSchema>;

/**
 * Generic parameters for paginated list requests.
 */
export type PaginatedRequestParams = z.infer<
  typeof PaginatedRequestParamsSchema
>;

/**
 * Parameters for listing booking attachments, including filtering by booking ID.
 */
export type BookingAttachmentsListParams = z.infer<
  typeof BookingAttachmentsListParamsSchema
>;

/**
 * Generic structure for paginated API responses.
 * @template T The type of the items in the results array.
 */
export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Bookings = z.infer<typeof BookingsSchema>;

export type Booking = z.infer<typeof BookingSchema>;

export type BookingAmount = z.infer<typeof BookingAmountSchema>;

export type BookingTag = z.infer<typeof BookingTagSchema>;

/**
 * Payload for creating a new tag association for a booking.
 */
export type BookingTagCreate = z.infer<typeof BookingTagCreateSchema>;

/**
 * Payload for updating an existing booking tag association (e.g., changing which global tag it points to).
 */
export type BookingTagUpdate = z.infer<typeof BookingTagUpdateSchema>;

export type BookingAttachment = z.infer<typeof BookingAttachmentSchema>;

/**
 * Attachments
 */

export type Attachment = z.infer<typeof AttachmentSchema>;

export type AttachmentCreate = z.infer<typeof AttachmentCreateSchema>;

/**
 * Payload for updating an existing booking attachment (PUT/PATCH request).
 * Currently, only the name is considered updatable.
 */
export type AttachmentUpdate = z.infer<typeof AttachmentUpdateSchema>;

export type Attachments = z.infer<typeof AttachmentsSchema>;

/**
 * Bookamat Accounts
 */

export type CostAccount = z.infer<typeof CostAccountSchema>;

export type PurchaseTaxAccount = z.infer<typeof PurchaseTaxAccountSchema>;

export type BankAccount = z.infer<typeof BankAccountSchema>;

/**
 * Bookamat Booking Details
 */

export type BookingCreate = z.infer<typeof BookingCreateSchema>;

export type BookingCreateAmount = z.infer<typeof BookingCreateAmountSchema>;

/**
 * Payload for updating an existing booking (PUT request).
 * Fields are based on BookingCreate and potentially updatable fields from the Booking object.
 */
export type BookingUpdate = z.infer<typeof BookingUpdateSchema>;

export type AttachmentDownloadResponse = z.infer<
  typeof AttachmentDownloadResponseSchema
>;

/**
 * API Configuration Object
 */
export type Configuration = z.infer<typeof ConfigurationSchema>;

/**
 * Cost Centre Object
 */
export type CostCentre = z.infer<typeof CostCentreSchema>;

/**
 * Asset (Anlage) Object
 */
export type Asset = z.infer<typeof AssetSchema>;

/**
 * Payload for creating a new Asset (Anlage).
 */
export type AssetCreate = z.infer<typeof AssetCreateSchema>;

/**
 * Payload for updating an existing Asset (Anlage).
 */
export type AssetUpdate = z.infer<typeof AssetUpdateSchema>;

/**
 * Represents an attachment linked to an Asset (Anlage).
 */
export type AssetAttachment = z.infer<typeof AssetAttachmentSchema>;

/**
 * Payload for creating a new attachment for an Asset.
 */
export type AssetAttachmentCreate = z.infer<typeof AssetAttachmentCreateSchema>;

/**
 * Payload for updating an AssetAttachment (e.g., renaming).
 */
export type AssetAttachmentUpdate = z.infer<typeof AssetAttachmentUpdateSchema>;

/**
 * Parameters for listing asset attachments, including filtering by asset ID.
 */
export type AssetAttachmentsListParams = z.infer<
  typeof AssetAttachmentsListParamsSchema
>;

/**
 * Response for downloading an asset attachment.
 */
export type AssetAttachmentDownloadResponse = z.infer<
  typeof AssetAttachmentDownloadResponseSchema
>;

/**
 * Foreign Business Base (Betriebsstätte) Object
 */
export type ForeignBusinessBase = z.infer<typeof ForeignBusinessBaseSchema>;

/**
 * Global Tag Object (distinct from BookingTag)
 */
export type GlobalTag = z.infer<typeof GlobalTagSchema>;

/**
 * User Object
 */
export type User = z.infer<typeof UserSchema>;

/**
 * User Account Object - represents an active package/year for a user
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/user.html#accounts|Bookamat API Docs - User Accounts}
 */
export type UserAccount = z.infer<typeof UserAccountSchema>;

/**
 * Parameters for filtering predefined cost accounts.
 */
export type PredefinedCostAccountsParams = z.infer<
  typeof PredefinedCostAccountsParamsSchema
>;

/**
 * Parameters for filtering predefined purchase tax accounts.
 */
export type PredefinedPurchaseTaxAccountsParams = z.infer<
  typeof PredefinedPurchaseTaxAccountsParamsSchema
>;

/**
 * Parameters for filtering user accounts.
 */
export type UserAccountsParams = z.infer<typeof UserAccountsParamsSchema>;

/**
 * User Settings Object - basic settings for a user account
 */
export type UserSettings = z.infer<typeof UserSettingsSchema>;

/**
 * User Exemptions Object - tax exemption amounts
 */
export type UserExemptions = z.infer<typeof UserExemptionsSchema>;

/**
 * Request body for creating a new bank account.
 */
export type CreateBankAccountRequest = z.infer<
  typeof CreateBankAccountRequestSchema
>;

/**
 * Request body for updating a bank account.
 */
export type UpdateBankAccountRequest = z.infer<
  typeof UpdateBankAccountRequestSchema
>;

/**
 * Request body for activating a cost account.
 */
export type ActivateCostAccountRequest = z.infer<
  typeof ActivateCostAccountRequestSchema
>;

/**
 * Request body for activating a purchase tax account.
 */
export type ActivatePurchaseTaxAccountRequest = z.infer<
  typeof ActivatePurchaseTaxAccountRequestSchema
>;

/**
 * Request body for creating a new cost centre.
 */
export type CreateCostCentreRequest = z.infer<
  typeof CreateCostCentreRequestSchema
>;

/**
 * Request body for updating a cost centre.
 */
export type UpdateCostCentreRequest = z.infer<
  typeof UpdateCostCentreRequestSchema
>;

/**
 * Request body for creating a new foreign business base.
 */
export type CreateForeignBusinessBaseRequest = z.infer<
  typeof CreateForeignBusinessBaseRequestSchema
>;

/**
 * Request body for updating a foreign business base.
 */
export type UpdateForeignBusinessBaseRequest = z.infer<
  typeof UpdateForeignBusinessBaseRequestSchema
>;

/**
 * Request body for creating a new tag.
 */
export type CreateTagRequest = z.infer<typeof CreateTagRequestSchema>;

/**
 * Request body for updating a tag.
 */
export type UpdateTagRequest = z.infer<typeof UpdateTagRequestSchema>;

/**
 * EU Country Codes
 */
export type EUCountry = z.infer<typeof EUCountrySchema>;

/**
 * Third-party VAT Refund Country Codes
 */
export type VarRefundCountry = z.infer<typeof VarRefundCountrySchema>;

/**
 * Third-party Country Codes
 */
export type ThirdPartyCountry = z.infer<typeof ThirdPartyCountrySchema>;

/**
 * All Country Codes (Union of all country code types)
 */
export type Country = z.infer<typeof CountrySchema>;
