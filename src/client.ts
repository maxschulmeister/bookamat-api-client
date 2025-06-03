import * as assetEndpoints from "./endpoints/assets";
import * as bookingEndpoints from "./endpoints/bookings";
import * as configurationEndpoints from "./endpoints/configuration";
import * as settingsEndpoints from "./endpoints/settings";
import * as userEndpoints from "./endpoints/user";
import * as helperMethods from "./helpers";
import type { ClientOptions } from "./types";

/**
 * BookamatClient provides methods to interact with the Bookamat API.
 * It handles request authentication, endpoint construction, and basic response processing.
 */
export class BookamatClient {
  // --- Class Constants ---
  private static readonly DEFAULT_COUNTRY = "at";
  private static readonly DEFAULT_BASE_URL = "https://www.bookamat.com/api/v1";

  // --- Instance Properties ---
  public readonly year: string;
  public readonly username: string;
  private readonly apiKey: string; // Keep apiKey private for security
  public readonly country: string;
  public readonly baseUrl: string;

  /**
   * Creates an instance of BookamatClient.
   * @param opts - Client options including year, username, and apiKey.
   *               Optional country (defaults to "at") and baseUrl (defaults to "https://www.bookamat.com/api/v1").
   * @throws Error if required options (year, username, apiKey) are missing.
   */
  constructor(opts: ClientOptions) {
    if (!opts.year) {
      throw new Error("Bookamat client 'year' is required in options.");
    }
    this.year = opts.year;

    if (!opts.username) {
      throw new Error("Bookamat client 'username' is required in options.");
    }
    this.username = opts.username;

    if (!opts.apiKey) {
      throw new Error("Bookamat client 'apiKey' is required in options.");
    }
    this.apiKey = opts.apiKey;

    this.country = opts.country ?? BookamatClient.DEFAULT_COUNTRY;
    this.baseUrl = opts.baseUrl ?? BookamatClient.DEFAULT_BASE_URL;
  }

  // --- Private Helper for Authentication Header ---
  private getAuthHeader(): string {
    return `ApiKey ${this.username}:${this.apiKey}`;
  }

  // --- Private Getters for API construction ---
  get apiRoot(): string {
    // Made public for use in endpoint files via 'this'
    return `${this.baseUrl}/${this.country}/${this.year}`;
  }

  get requestHeaders(): Record<string, string> {
    // Made public for use in endpoint files via 'this'
    return {
      Authorization: this.getAuthHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * Internal helper for HTTP requests with uniform error handling.
   * @template T - Expected response type.
   * @param url - Request URL.
   * @param init - Fetch initialization options.
   * @returns Parsed JSON as type T.
   */
  async request<T>(url: string, init: RequestInit): Promise<T> {
    // Made public for use in endpoint files via 'this'
    const response = await fetch(url, init);
    if (!response.ok) {
      const errorText = await response.text().catch(() => "[no response body]");
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    // Handle cases where response might be empty (e.g., 204 No Content for DELETE)
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return undefined as T; // Or handle as Promise<void> more explicitly if possible
    }
    return response.json();
  }

  // --- Configuration Endpoints ---
  public getPredefinedCostAccounts =
    configurationEndpoints.getPredefinedCostAccounts;
  public getPredefinedCostAccount =
    configurationEndpoints.getPredefinedCostAccount;
  public getPredefinedPurchaseTaxAccounts =
    configurationEndpoints.getPredefinedPurchaseTaxAccounts;
  public getPredefinedPurchaseTaxAccount =
    configurationEndpoints.getPredefinedPurchaseTaxAccount;

  // --- User Endpoints ---
  public getUserAccounts = userEndpoints.getUserAccounts;
  public getUserAccount = userEndpoints.getUserAccount;
  public getUserSettings = userEndpoints.getUserSettings;
  public getUserSettingsDetails = userEndpoints.getUserSettingsDetails;
  public getUserExemptions = userEndpoints.getUserExemptions;
  public getUserExemptionsDetails = userEndpoints.getUserExemptionsDetails;

  // --- Settings Endpoints ---
  public getBankAccounts = settingsEndpoints.getBankAccounts;
  public getBankAccountDetails = settingsEndpoints.getBankAccountDetails;
  public createBankAccount = settingsEndpoints.createBankAccount;
  public updateBankAccount = settingsEndpoints.updateBankAccount;
  public replaceBankAccount = settingsEndpoints.replaceBankAccount;
  public deleteBankAccount = settingsEndpoints.deleteBankAccount;

  public getCostAccounts = settingsEndpoints.getCostAccounts;
  public getCostAccountDetails = settingsEndpoints.getCostAccountDetails;
  public activateCostAccount = settingsEndpoints.activateCostAccount;
  public deleteCostAccount = settingsEndpoints.deleteCostAccount;

  public getPurchaseTaxAccounts = settingsEndpoints.getPurchaseTaxAccounts;
  public getPurchaseTaxAccountDetails =
    settingsEndpoints.getPurchaseTaxAccountDetails;
  public activatePurchaseTaxAccount =
    settingsEndpoints.activatePurchaseTaxAccount;
  public deletePurchaseTaxAccount = settingsEndpoints.deletePurchaseTaxAccount;

  public getCostCentres = settingsEndpoints.getCostCentres;
  public getCostCentreDetails = settingsEndpoints.getCostCentreDetails;
  public createCostCentre = settingsEndpoints.createCostCentre;
  public updateCostCentre = settingsEndpoints.updateCostCentre;
  public replaceCostCentre = settingsEndpoints.replaceCostCentre;
  public deleteCostCentre = settingsEndpoints.deleteCostCentre;

  public getForeignBusinessBases = settingsEndpoints.getForeignBusinessBases;
  public getForeignBusinessBaseDetails =
    settingsEndpoints.getForeignBusinessBaseDetails;
  public createForeignBusinessBase =
    settingsEndpoints.createForeignBusinessBase;
  public updateForeignBusinessBase =
    settingsEndpoints.updateForeignBusinessBase;
  public replaceForeignBusinessBase =
    settingsEndpoints.replaceForeignBusinessBase;
  public deleteForeignBusinessBase =
    settingsEndpoints.deleteForeignBusinessBase;

  public getGlobalTags = settingsEndpoints.getGlobalTags;
  public getGlobalTagDetails = settingsEndpoints.getGlobalTagDetails;
  public createGlobalTag = settingsEndpoints.createGlobalTag;
  public updateGlobalTag = settingsEndpoints.updateGlobalTag;
  public replaceGlobalTag = settingsEndpoints.replaceGlobalTag;
  public deleteGlobalTag = settingsEndpoints.deleteGlobalTag;

  // --- Booking Endpoints ---
  public listBookings = bookingEndpoints.listBookings;
  public listOpenBookings = bookingEndpoints.listOpenBookings;
  public listDeletedBookings = bookingEndpoints.listDeletedBookings;
  public listImportedBookings = bookingEndpoints.listImportedBookings;
  public getBookingDetails = bookingEndpoints.getBookingDetails;
  public createBooking = bookingEndpoints.createBooking;
  public updateBooking = bookingEndpoints.updateBooking;
  public partiallyUpdateBooking = bookingEndpoints.partiallyUpdateBooking;
  public deleteBooking = bookingEndpoints.deleteBooking;
  public restoreBooking = bookingEndpoints.restoreBooking;
  public addBookingAttachment = bookingEndpoints.addBookingAttachment;
  public listBookingAttachments = bookingEndpoints.listBookingAttachments;
  public getBookingAttachmentDetails =
    bookingEndpoints.getBookingAttachmentDetails;
  public updateBookingAttachment = bookingEndpoints.updateBookingAttachment;
  public partiallyUpdateBookingAttachment =
    bookingEndpoints.partiallyUpdateBookingAttachment;
  public deleteBookingAttachment = bookingEndpoints.deleteBookingAttachment;
  public downloadAttachment = bookingEndpoints.downloadAttachment;
  public getBookingTags = bookingEndpoints.getBookingTags;
  public addTagToBooking = bookingEndpoints.addTagToBooking;
  public getBookingTagDetails = bookingEndpoints.getBookingTagDetails;
  public updateBookingTag = bookingEndpoints.updateBookingTag;
  public partiallyUpdateBookingTag = bookingEndpoints.partiallyUpdateBookingTag;
  public removeTagFromBooking = bookingEndpoints.removeTagFromBooking;

  // --- Asset (Anlagen) Endpoints ---
  public getAssets = assetEndpoints.getAssets;
  public createAsset = assetEndpoints.createAsset;
  public getAssetDetails = assetEndpoints.getAssetDetails;
  public updateAsset = assetEndpoints.updateAsset;
  public partiallyUpdateAsset = assetEndpoints.partiallyUpdateAsset;
  public deleteAsset = assetEndpoints.deleteAsset;
  public listAssetAttachments = assetEndpoints.listAssetAttachments;
  public addAssetAttachment = assetEndpoints.addAssetAttachment;
  public getAssetAttachmentDetails = assetEndpoints.getAssetAttachmentDetails;
  public updateAssetAttachment = assetEndpoints.updateAssetAttachment;
  public partiallyUpdateAssetAttachment =
    assetEndpoints.partiallyUpdateAssetAttachment;
  public deleteAssetAttachment = assetEndpoints.deleteAssetAttachment;
  public downloadAssetAttachment = assetEndpoints.downloadAssetAttachment;

  // --- Helper Methods (Aggregations, etc.) ---
  public getAllBookings = helperMethods.getAllBookings;
  public getAllAccounts = helperMethods.getAllAccounts;
}
