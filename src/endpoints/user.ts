import type { BookamatClient } from "../client";
import type {
  PaginatedResponse,
  UserAccount,
  UserAccountsParams,
  UserExemptions,
  UserSettings,
} from "../types";

/**
 * Retrieves all active user accounts/packages from the Bookamat API.
 * Note: This endpoint uses a special URL without the country/year prefix.
 *
 * @param params - Optional filtering and pagination parameters
 * @returns A promise that resolves to a paginated list of user accounts
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/user.html#accounts|Bookamat API Docs - User Accounts}
 */
export async function getUserAccounts(
  this: BookamatClient,
  params?: UserAccountsParams
): Promise<PaginatedResponse<UserAccount>> {
  // Note: This endpoint exceptionally has no prefix (no country/year)
  const url = `${this.baseUrl}/user/accounts/`;
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
  }

  const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

  return this.request<PaginatedResponse<UserAccount>>(fullUrl, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Retrieves a specific user account by ID from the Bookamat API.
 * Note: This endpoint uses a special URL without the country/year prefix.
 *
 * @param id - The ID of the user account to retrieve
 * @returns A promise that resolves to the user account
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/user.html#accounts|Bookamat API Docs - User Accounts}
 */
export async function getUserAccount(
  this: BookamatClient,
  id: number
): Promise<UserAccount> {
  // Note: This endpoint exceptionally has no prefix (no country/year)
  const url = `${this.baseUrl}/user/accounts/${id}/`;
  return this.request<UserAccount>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Retrieves user settings from the Bookamat API.
 * These are the basic settings for a user account including initial values
 * for tax percentages and business deductibility percentages.
 *
 * @returns A promise that resolves to a paginated list of user settings
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/user.html#grundeinstellungen|Bookamat API Docs - User Settings}
 */
export async function getUserSettings(
  this: BookamatClient
): Promise<PaginatedResponse<UserSettings>> {
  const url = `${this.apiRoot}/user/settings/`;
  return this.request<PaginatedResponse<UserSettings>>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Retrieves a specific user settings entry by ID from the Bookamat API.
 *
 * @param id - The ID of the user settings to retrieve
 * @returns A promise that resolves to the user settings
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/user.html#grundeinstellungen|Bookamat API Docs - User Settings}
 */
export async function getUserSettingsDetails(
  this: BookamatClient,
  id: number
): Promise<UserSettings> {
  const url = `${this.apiRoot}/user/settings/${id}/`;
  return this.request<UserSettings>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Retrieves user exemptions (tax exemption amounts) from the Bookamat API.
 * These include various exemption values like basic exemption (9221),
 * investment exemptions, etc.
 *
 * @returns A promise that resolves to a paginated list of user exemptions
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/user.html#freibetrage|Bookamat API Docs - User Exemptions}
 */
export async function getUserExemptions(
  this: BookamatClient
): Promise<PaginatedResponse<UserExemptions>> {
  const url = `${this.apiRoot}/user/exemptions/`;
  return this.request<PaginatedResponse<UserExemptions>>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Retrieves a specific user exemptions entry by ID from the Bookamat API.
 *
 * @param id - The ID of the user exemptions to retrieve
 * @returns A promise that resolves to the user exemptions
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/user.html#freibetrage|Bookamat API Docs - User Exemptions}
 */
export async function getUserExemptionsDetails(
  this: BookamatClient,
  id: number
): Promise<UserExemptions> {
  const url = `${this.apiRoot}/user/exemptions/${id}/`;
  return this.request<UserExemptions>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}
