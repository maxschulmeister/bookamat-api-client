import type { BookamatClient } from "./client";
import type {
  BankAccount,
  Booking,
  BookingsParams,
  CostAccount,
  PurchaseTaxAccount,
} from "./types";
import { fetchAllPages } from "./utils";

export interface AllAccountsResponse {
  costaccounts: CostAccount[];
  bankaccounts: BankAccount[];
  purchasetaxaccounts: PurchaseTaxAccount[];
}

// --- Client-Side Aggregation/Enhancement Methods ---

/**
 * Fetches all bookings across all available pages based on the provided parameters.
 * This method resides in `helpers.ts` as it aggregates paginated results.
 * @param params - Optional parameters to filter bookings.
 * @returns A promise that resolves to an array containing all Booking objects.
 */
export async function getAllBookings(
  this: BookamatClient,
  params: BookingsParams = {}
): Promise<Booking[]> {
  const urlObj = new URL(`${this.apiRoot}/bookings/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        urlObj.searchParams.append(key, String(value));
      }
    }
  });
  // The third argument to fetchAllPages is apiRoot, which is not needed here as this.apiRoot is part of urlObj.
  return fetchAllPages<Booking>(urlObj.toString(), this.requestHeaders);
}

// getAccountIds function has been removed.

/**
 * Fetches all cost accounts, bank accounts, and purchase tax accounts with their full details.
 * This method resides in `helpers.ts` as it makes multiple paginated calls.
 * @returns A promise that resolves to an object containing arrays of detailed account objects.
 */
export async function getAllAccounts(
  this: BookamatClient
): Promise<AllAccountsResponse> {
  const [costaccount, bankaccount, purchasetaxaccount] = await Promise.all([
    this.getCostAccounts(),
    this.getBankAccounts(),
    this.getPurchaseTaxAccounts(),
  ]);

  return {
    costaccounts: costaccount.results,
    bankaccounts: bankaccount.results,
    purchasetaxaccounts: purchasetaxaccount.results,
  };
}
