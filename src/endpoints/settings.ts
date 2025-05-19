import type { BookamatClient } from "../client";
import type {
  BankAccount,
  CostAccount,
  CostCentre,
  ForeignBusinessBase,
  GlobalTag,
  PaginatedRequestParams,
  PaginatedResponse,
  PurchaseTaxAccount,
} from "../types";

// --- Settings: Bank Accounts ---
export async function getBankAccounts(
  this: BookamatClient,
  params?: PaginatedRequestParams
): Promise<PaginatedResponse<BankAccount>> {
  const url = new URL(`${this.apiRoot}/preferences/bankaccounts/`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return this.request<PaginatedResponse<BankAccount>>(url.toString(), {
    method: "GET",
    headers: this.requestHeaders,
  });
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

// --- Settings: Cost Accounts ---
export async function getCostAccounts(
  this: BookamatClient,
  params?: PaginatedRequestParams
): Promise<PaginatedResponse<CostAccount>> {
  const url = new URL(`${this.apiRoot}/preferences/costaccounts/`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return this.request<PaginatedResponse<CostAccount>>(url.toString(), {
    method: "GET",
    headers: this.requestHeaders,
  });
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

// --- Settings: Purchase Tax Accounts ---
export async function getPurchaseTaxAccounts(
  this: BookamatClient,
  params?: PaginatedRequestParams
): Promise<PaginatedResponse<PurchaseTaxAccount>> {
  const url = new URL(`${this.apiRoot}/preferences/purchasetaxaccounts/`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return this.request<PaginatedResponse<PurchaseTaxAccount>>(url.toString(), {
    method: "GET",
    headers: this.requestHeaders,
  });
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

// --- Settings: Cost Centres ---
export async function getCostCentres(
  this: BookamatClient,
  params?: PaginatedRequestParams
): Promise<PaginatedResponse<CostCentre>> {
  const url = new URL(`${this.apiRoot}/preferences/costcentres/`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return this.request<PaginatedResponse<CostCentre>>(url.toString(), {
    method: "GET",
    headers: this.requestHeaders,
  });
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

// --- Settings: Foreign Business Bases (Betriebsstätten) ---
export async function getForeignBusinessBases(
  this: BookamatClient,
  params?: PaginatedRequestParams
): Promise<PaginatedResponse<ForeignBusinessBase>> {
  const url = new URL(`${this.apiRoot}/preferences/foreignbusinessbases/`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return this.request<PaginatedResponse<ForeignBusinessBase>>(url.toString(), {
    method: "GET",
    headers: this.requestHeaders,
  });
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

// --- Settings: Global Tags ---
export async function getGlobalTags(
  this: BookamatClient,
  params?: PaginatedRequestParams
): Promise<PaginatedResponse<GlobalTag>> {
  const url = new URL(`${this.apiRoot}/preferences/tags/`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return this.request<PaginatedResponse<GlobalTag>>(url.toString(), {
    method: "GET",
    headers: this.requestHeaders,
  });
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
