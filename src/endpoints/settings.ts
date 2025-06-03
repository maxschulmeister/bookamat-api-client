import type { BookamatClient } from "../client";
import type {
  ActivateCostAccountRequest,
  ActivatePurchaseTaxAccountRequest,
  BankAccount,
  CostAccount,
  CostCentre,
  CreateBankAccountRequest,
  CreateCostCentreRequest,
  CreateForeignBusinessBaseRequest,
  CreateTagRequest,
  ForeignBusinessBase,
  GlobalTag,
  PaginatedRequestParams,
  PurchaseTaxAccount,
  UpdateBankAccountRequest,
  UpdateCostCentreRequest,
  UpdateForeignBusinessBaseRequest,
  UpdateTagRequest,
} from "../types";
import { fetchAllPages } from "../utils";

// --- Settings: Bank Accounts ---
export async function getBankAccounts(
  this: BookamatClient,
  params: PaginatedRequestParams = {}
): Promise<BankAccount[]> {
  const url = new URL(`${this.apiRoot}/preferences/bankaccounts/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<BankAccount>(url.toString(), this.requestHeaders);
}

export async function getBankAccountDetails(
  this: BookamatClient,
  id: number
): Promise<BankAccount> {
  const url = `${this.apiRoot}/preferences/bankaccounts/${id}/`;
  return this.request<BankAccount>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Creates a new bank account.
 *
 * @param data - The bank account data to create
 * @returns A promise that resolves to the created bank account
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bank_accounts.html#zahlungsmittelkonto-hinzufugen|Bookamat API Docs - Create Bank Account}
 */
export async function createBankAccount(
  this: BookamatClient,
  data: CreateBankAccountRequest
): Promise<BankAccount> {
  const url = `${this.apiRoot}/preferences/bankaccounts/`;
  return this.request<BankAccount>(url, {
    method: "POST",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing bank account using PATCH (partial update).
 *
 * @param id - The bank account ID to update
 * @param data - The bank account data to update
 * @returns A promise that resolves to the updated bank account
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bank_accounts.html#zahlungsmittelkonto-andern|Bookamat API Docs - Update Bank Account}
 */
export async function updateBankAccount(
  this: BookamatClient,
  id: number,
  data: UpdateBankAccountRequest
): Promise<BankAccount> {
  const url = `${this.apiRoot}/preferences/bankaccounts/${id}/`;
  return this.request<BankAccount>(url, {
    method: "PATCH",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Replaces an existing bank account using PUT (full update).
 *
 * @param id - The bank account ID to replace
 * @param data - The complete bank account data
 * @returns A promise that resolves to the updated bank account
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bank_accounts.html#zahlungsmittelkonto-andern|Bookamat API Docs - Replace Bank Account}
 */
export async function replaceBankAccount(
  this: BookamatClient,
  id: number,
  data: CreateBankAccountRequest
): Promise<BankAccount> {
  const url = `${this.apiRoot}/preferences/bankaccounts/${id}/`;
  return this.request<BankAccount>(url, {
    method: "PUT",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a bank account.
 * Note: Only bank accounts without associated bookings can be deleted.
 *
 * @param id - The bank account ID to delete
 * @returns A promise that resolves when the bank account is deleted
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bank_accounts.html#zahlungsmittelkonto-loschen|Bookamat API Docs - Delete Bank Account}
 */
export async function deleteBankAccount(
  this: BookamatClient,
  id: number
): Promise<void> {
  const url = `${this.apiRoot}/preferences/bankaccounts/${id}/`;
  await this.request<void>(url, {
    method: "DELETE",
    headers: this.requestHeaders,
  });
}

// --- Settings: Cost Accounts ---
export async function getCostAccounts(
  this: BookamatClient,
  params: PaginatedRequestParams = {}
): Promise<CostAccount[]> {
  const url = new URL(`${this.apiRoot}/preferences/costaccounts/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<CostAccount>(url.toString(), this.requestHeaders);
}

export async function getCostAccountDetails(
  this: BookamatClient,
  id: number
): Promise<CostAccount> {
  const url = `${this.apiRoot}/preferences/costaccounts/${id}/`;
  return this.request<CostAccount>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Activates a predefined cost account.
 *
 * @param data - The cost account activation data
 * @returns A promise that resolves to the activated cost account
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/cost_accounts.html#steuerkonto-hinzufugen|Bookamat API Docs - Activate Cost Account}
 */
export async function activateCostAccount(
  this: BookamatClient,
  data: ActivateCostAccountRequest
): Promise<CostAccount> {
  const url = `${this.apiRoot}/preferences/costaccounts/`;
  return this.request<CostAccount>(url, {
    method: "POST",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Deactivates (deletes) a cost account.
 * Note: Only cost accounts without associated bookings can be deleted.
 *
 * @param id - The cost account ID to deactivate
 * @returns A promise that resolves when the cost account is deactivated
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/cost_accounts.html#steuerkonto-loschen|Bookamat API Docs - Deactivate Cost Account}
 */
export async function deleteCostAccount(
  this: BookamatClient,
  id: number
): Promise<void> {
  const url = `${this.apiRoot}/preferences/costaccounts/${id}/`;
  await this.request<void>(url, {
    method: "DELETE",
    headers: this.requestHeaders,
  });
}

// --- Settings: Purchase Tax Accounts ---
export async function getPurchaseTaxAccounts(
  this: BookamatClient,
  params: PaginatedRequestParams = {}
): Promise<PurchaseTaxAccount[]> {
  const url = new URL(`${this.apiRoot}/preferences/purchasetaxaccounts/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<PurchaseTaxAccount>(url.toString(), this.requestHeaders);
}

export async function getPurchaseTaxAccountDetails(
  this: BookamatClient,
  id: number
): Promise<PurchaseTaxAccount> {
  const url = `${this.apiRoot}/preferences/purchasetaxaccounts/${id}/`;
  return this.request<PurchaseTaxAccount>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Activates a predefined purchase tax account.
 *
 * @param data - The purchase tax account activation data
 * @returns A promise that resolves to the activated purchase tax account
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/purchasetax_accounts.html#umsatzsteuerkonto-hinzufugen|Bookamat API Docs - Activate Purchase Tax Account}
 */
export async function activatePurchaseTaxAccount(
  this: BookamatClient,
  data: ActivatePurchaseTaxAccountRequest
): Promise<PurchaseTaxAccount> {
  const url = `${this.apiRoot}/preferences/purchasetaxaccounts/`;
  return this.request<PurchaseTaxAccount>(url, {
    method: "POST",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Deactivates (deletes) a purchase tax account.
 * Note: Only purchase tax accounts without associated bookings can be deleted.
 *
 * @param id - The purchase tax account ID to deactivate
 * @returns A promise that resolves when the purchase tax account is deactivated
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/purchasetax_accounts.html#umsatzsteuerkonto-loschen|Bookamat API Docs - Deactivate Purchase Tax Account}
 */
export async function deletePurchaseTaxAccount(
  this: BookamatClient,
  id: number
): Promise<void> {
  const url = `${this.apiRoot}/preferences/purchasetaxaccounts/${id}/`;
  await this.request<void>(url, {
    method: "DELETE",
    headers: this.requestHeaders,
  });
}

// --- Settings: Cost Centres ---
export async function getCostCentres(
  this: BookamatClient,
  params: PaginatedRequestParams = {}
): Promise<CostCentre[]> {
  const url = new URL(`${this.apiRoot}/preferences/costcentres/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<CostCentre>(url.toString(), this.requestHeaders);
}

export async function getCostCentreDetails(
  this: BookamatClient,
  id: number
): Promise<CostCentre> {
  const url = `${this.apiRoot}/preferences/costcentres/${id}/`;
  return this.request<CostCentre>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Creates a new cost centre.
 *
 * @param data - The cost centre data to create
 * @returns A promise that resolves to the created cost centre
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/cost_centres.html#kostenstelle-hinzufugen|Bookamat API Docs - Create Cost Centre}
 */
export async function createCostCentre(
  this: BookamatClient,
  data: CreateCostCentreRequest
): Promise<CostCentre> {
  const url = `${this.apiRoot}/preferences/costcentres/`;
  return this.request<CostCentre>(url, {
    method: "POST",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing cost centre using PATCH (partial update).
 *
 * @param id - The cost centre ID to update
 * @param data - The cost centre data to update
 * @returns A promise that resolves to the updated cost centre
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/cost_centres.html#kostenstelle-andern|Bookamat API Docs - Update Cost Centre}
 */
export async function updateCostCentre(
  this: BookamatClient,
  id: number,
  data: UpdateCostCentreRequest
): Promise<CostCentre> {
  const url = `${this.apiRoot}/preferences/costcentres/${id}/`;
  return this.request<CostCentre>(url, {
    method: "PATCH",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Replaces an existing cost centre using PUT (full update).
 *
 * @param id - The cost centre ID to replace
 * @param data - The complete cost centre data
 * @returns A promise that resolves to the updated cost centre
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/cost_centres.html#kostenstelle-andern|Bookamat API Docs - Replace Cost Centre}
 */
export async function replaceCostCentre(
  this: BookamatClient,
  id: number,
  data: CreateCostCentreRequest
): Promise<CostCentre> {
  const url = `${this.apiRoot}/preferences/costcentres/${id}/`;
  return this.request<CostCentre>(url, {
    method: "PUT",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a cost centre.
 * Note: Only cost centres without associated bookings can be deleted.
 *
 * @param id - The cost centre ID to delete
 * @returns A promise that resolves when the cost centre is deleted
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/cost_centres.html#kostenstelle-loschen|Bookamat API Docs - Delete Cost Centre}
 */
export async function deleteCostCentre(
  this: BookamatClient,
  id: number
): Promise<void> {
  const url = `${this.apiRoot}/preferences/costcentres/${id}/`;
  await this.request<void>(url, {
    method: "DELETE",
    headers: this.requestHeaders,
  });
}

// --- Settings: Foreign Business Bases (Betriebsstätten) ---
export async function getForeignBusinessBases(
  this: BookamatClient,
  params: PaginatedRequestParams = {}
): Promise<ForeignBusinessBase[]> {
  const url = new URL(`${this.apiRoot}/preferences/foreignbusinessbases/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<ForeignBusinessBase>(
    url.toString(),
    this.requestHeaders
  );
}

export async function getForeignBusinessBaseDetails(
  this: BookamatClient,
  id: number
): Promise<ForeignBusinessBase> {
  const url = `${this.apiRoot}/preferences/foreignbusinessbases/${id}/`;
  return this.request<ForeignBusinessBase>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Creates a new foreign business base.
 *
 * @param data - The foreign business base data to create
 * @returns A promise that resolves to the created foreign business base
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/foreign_business_bases.html#betriebsstatte-hinzufugen|Bookamat API Docs - Create Foreign Business Base}
 */
export async function createForeignBusinessBase(
  this: BookamatClient,
  data: CreateForeignBusinessBaseRequest
): Promise<ForeignBusinessBase> {
  const url = `${this.apiRoot}/preferences/foreignbusinessbases/`;
  return this.request<ForeignBusinessBase>(url, {
    method: "POST",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing foreign business base using PATCH (partial update).
 *
 * @param id - The foreign business base ID to update
 * @param data - The foreign business base data to update
 * @returns A promise that resolves to the updated foreign business base
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/foreign_business_bases.html#betriebsstatte-andern|Bookamat API Docs - Update Foreign Business Base}
 */
export async function updateForeignBusinessBase(
  this: BookamatClient,
  id: number,
  data: UpdateForeignBusinessBaseRequest
): Promise<ForeignBusinessBase> {
  const url = `${this.apiRoot}/preferences/foreignbusinessbases/${id}/`;
  return this.request<ForeignBusinessBase>(url, {
    method: "PATCH",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Replaces an existing foreign business base using PUT (full update).
 *
 * @param id - The foreign business base ID to replace
 * @param data - The complete foreign business base data
 * @returns A promise that resolves to the updated foreign business base
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/foreign_business_bases.html#betriebsstatte-andern|Bookamat API Docs - Replace Foreign Business Base}
 */
export async function replaceForeignBusinessBase(
  this: BookamatClient,
  id: number,
  data: CreateForeignBusinessBaseRequest
): Promise<ForeignBusinessBase> {
  const url = `${this.apiRoot}/preferences/foreignbusinessbases/${id}/`;
  return this.request<ForeignBusinessBase>(url, {
    method: "PUT",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a foreign business base.
 * Note: Only foreign business bases without associated bookings can be deleted.
 *
 * @param id - The foreign business base ID to delete
 * @returns A promise that resolves when the foreign business base is deleted
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/foreign_business_bases.html#betriebsstatte-loschen|Bookamat API Docs - Delete Foreign Business Base}
 */
export async function deleteForeignBusinessBase(
  this: BookamatClient,
  id: number
): Promise<void> {
  const url = `${this.apiRoot}/preferences/foreignbusinessbases/${id}/`;
  await this.request<void>(url, {
    method: "DELETE",
    headers: this.requestHeaders,
  });
}

// --- Settings: Global Tags ---
export async function getGlobalTags(
  this: BookamatClient,
  params: PaginatedRequestParams = {}
): Promise<GlobalTag[]> {
  const url = new URL(`${this.apiRoot}/preferences/tags/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<GlobalTag>(url.toString(), this.requestHeaders);
}

export async function getGlobalTagDetails(
  this: BookamatClient,
  id: number
): Promise<GlobalTag> {
  const url = `${this.apiRoot}/preferences/tags/${id}/`;
  return this.request<GlobalTag>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Creates a new global tag.
 *
 * @param data - The tag data to create
 * @returns A promise that resolves to the created tag
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/tags.html#tag-hinzufugen|Bookamat API Docs - Create Tag}
 */
export async function createGlobalTag(
  this: BookamatClient,
  data: CreateTagRequest
): Promise<GlobalTag> {
  const url = `${this.apiRoot}/preferences/tags/`;
  return this.request<GlobalTag>(url, {
    method: "POST",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing global tag using PATCH (partial update).
 *
 * @param id - The tag ID to update
 * @param data - The tag data to update
 * @returns A promise that resolves to the updated tag
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/tags.html#tag-andern|Bookamat API Docs - Update Tag}
 */
export async function updateGlobalTag(
  this: BookamatClient,
  id: number,
  data: UpdateTagRequest
): Promise<GlobalTag> {
  const url = `${this.apiRoot}/preferences/tags/${id}/`;
  return this.request<GlobalTag>(url, {
    method: "PATCH",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Replaces an existing global tag using PUT (full update).
 *
 * @param id - The tag ID to replace
 * @param data - The complete tag data
 * @returns A promise that resolves to the updated tag
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/tags.html#tag-andern|Bookamat API Docs - Replace Tag}
 */
export async function replaceGlobalTag(
  this: BookamatClient,
  id: number,
  data: CreateTagRequest
): Promise<GlobalTag> {
  const url = `${this.apiRoot}/preferences/tags/${id}/`;
  return this.request<GlobalTag>(url, {
    method: "PUT",
    headers: {
      ...this.requestHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a global tag.
 * Note: Only tags without associated bookings can be deleted.
 *
 * @param id - The tag ID to delete
 * @returns A promise that resolves when the tag is deleted
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/tags.html#tag-loschen|Bookamat API Docs - Delete Tag}
 */
export async function deleteGlobalTag(
  this: BookamatClient,
  id: number
): Promise<void> {
  const url = `${this.apiRoot}/preferences/tags/${id}/`;
  await this.request<void>(url, {
    method: "DELETE",
    headers: this.requestHeaders,
  });
}
