import type { BookamatClient } from "../client";
import type {
  CostAccount,
  PaginatedResponse,
  PredefinedCostAccountsParams,
  PredefinedPurchaseTaxAccountsParams,
  PurchaseTaxAccount,
} from "../types";

/**
 * Retrieves all predefined cost accounts from the Bookamat API.
 * These are predefined accounts that can be activated/deactivated by users.
 * Only activated accounts are relevant for bookings and assets.
 *
 * @param params - Optional filtering and pagination parameters
 * @returns A promise that resolves to a paginated list of predefined cost accounts
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/configuration.html#vordefinierte-steuerkonten|Bookamat API Docs - Vordefinierte Steuerkonten}
 */
export async function getPredefinedCostAccounts(
  this: BookamatClient,
  params?: PredefinedCostAccountsParams
): Promise<PaginatedResponse<CostAccount>> {
  const url = `${this.apiRoot}/configuration/costaccounts/`;
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
  }

  const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

  return this.request<PaginatedResponse<CostAccount>>(fullUrl, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Retrieves a specific predefined cost account by ID from the Bookamat API.
 *
 * @param id - The ID of the predefined cost account to retrieve
 * @returns A promise that resolves to the predefined cost account
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/configuration.html#vordefinierte-steuerkonten|Bookamat API Docs - Vordefinierte Steuerkonten}
 */
export async function getPredefinedCostAccount(
  this: BookamatClient,
  id: number
): Promise<CostAccount> {
  const url = `${this.apiRoot}/configuration/costaccounts/${id}/`;
  return this.request<CostAccount>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Retrieves all predefined purchase tax accounts from the Bookamat API.
 * These are predefined accounts that can be activated/deactivated by users.
 * Only activated accounts are relevant for bookings.
 *
 * @param params - Optional filtering and pagination parameters
 * @returns A promise that resolves to a paginated list of predefined purchase tax accounts
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/configuration.html#vordefinierte-umsatzsteuerkonten|Bookamat API Docs - Vordefinierte Umsatzsteuerkonten}
 */
export async function getPredefinedPurchaseTaxAccounts(
  this: BookamatClient,
  params?: PredefinedPurchaseTaxAccountsParams
): Promise<PaginatedResponse<PurchaseTaxAccount>> {
  const url = `${this.apiRoot}/configuration/purchasetaxaccounts/`;
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
  }

  const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

  return this.request<PaginatedResponse<PurchaseTaxAccount>>(fullUrl, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Retrieves a specific predefined purchase tax account by ID from the Bookamat API.
 *
 * @param id - The ID of the predefined purchase tax account to retrieve
 * @returns A promise that resolves to the predefined purchase tax account
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/configuration.html#vordefinierte-umsatzsteuerkonten|Bookamat API Docs - Vordefinierte Umsatzsteuerkonten}
 */
export async function getPredefinedPurchaseTaxAccount(
  this: BookamatClient,
  id: number
): Promise<PurchaseTaxAccount> {
  const url = `${this.apiRoot}/configuration/purchasetaxaccounts/${id}/`;
  return this.request<PurchaseTaxAccount>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}
