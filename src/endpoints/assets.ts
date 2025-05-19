import type { BookamatClient } from "../client";
import type {
  Asset,
  AssetAttachment,
  AssetAttachmentCreate,
  AssetAttachmentDownloadResponse,
  AssetAttachmentsListParams,
  AssetAttachmentUpdate,
  AssetCreate,
  AssetUpdate,
  PaginatedRequestParams,
  PaginatedResponse,
} from "../types";
import { sanitizePayload } from "../utils"; // fetchAllPages might not be used here if assets don't have an equivalent getAll

// --- Asset (Anlagen) Endpoints ---
export async function getAssets(
  this: BookamatClient,
  params?: PaginatedRequestParams
): Promise<PaginatedResponse<Asset>> {
  const url = new URL(`${this.apiRoot}/assets/`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return this.request<PaginatedResponse<Asset>>(url.toString(), {
    method: "GET",
    headers: this.requestHeaders,
  });
}

export async function createAsset(
  this: BookamatClient,
  payload: AssetCreate
): Promise<Asset> {
  const sanitizedPayload = sanitizePayload(payload);
  const url = `${this.apiRoot}/assets/`;
  return this.request<Asset>(url, {
    method: "POST",
    headers: this.requestHeaders,
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function getAssetDetails(
  this: BookamatClient,
  id: number
): Promise<Asset> {
  const url = `${this.apiRoot}/assets/${id}/`;
  return this.request<Asset>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

export async function updateAsset(
  this: BookamatClient,
  id: number,
  payload: AssetUpdate
): Promise<Asset> {
  const sanitizedPayload = sanitizePayload(payload);
  const url = `${this.apiRoot}/assets/${id}/`;
  return this.request<Asset>(url, {
    method: "PUT",
    headers: this.requestHeaders,
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function partiallyUpdateAsset(
  this: BookamatClient,
  id: number,
  payload: Partial<AssetUpdate>
): Promise<Asset> {
  const sanitizedPayload = sanitizePayload(payload);
  const url = `${this.apiRoot}/assets/${id}/`;
  return this.request<Asset>(url, {
    method: "PATCH",
    headers: this.requestHeaders,
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function deleteAsset(
  this: BookamatClient,
  id: number
): Promise<void> {
  const url = `${this.apiRoot}/assets/${id}/`;
  await this.request<void>(url, {
    method: "DELETE",
    headers: this.requestHeaders,
  });
}

// --- Attachments to Assets Endpoints ---
export async function listAssetAttachments(
  this: BookamatClient,
  params: AssetAttachmentsListParams
): Promise<PaginatedResponse<AssetAttachment>> {
  const url = new URL(`${this.apiRoot}/assets/attachments/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });
  return this.request<PaginatedResponse<AssetAttachment>>(url.toString(), {
    method: "GET",
    headers: this.requestHeaders,
  });
}

export async function addAssetAttachment(
  this: BookamatClient,
  payload: AssetAttachmentCreate
): Promise<AssetAttachment> {
  const sanitizedPayload = sanitizePayload(payload);
  const url = `${this.apiRoot}/assets/attachments/`;
  return this.request<AssetAttachment>(url, {
    method: "POST",
    headers: this.requestHeaders,
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function getAssetAttachmentDetails(
  this: BookamatClient,
  attachmentId: number
): Promise<AssetAttachment> {
  const url = `${this.apiRoot}/assets/attachments/${attachmentId}/`;
  return this.request<AssetAttachment>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

export async function updateAssetAttachment(
  this: BookamatClient,
  attachmentId: number,
  payload: AssetAttachmentUpdate
): Promise<AssetAttachment> {
  const sanitizedPayload = sanitizePayload(payload);
  const url = `${this.apiRoot}/assets/attachments/${attachmentId}/`;
  return this.request<AssetAttachment>(url, {
    method: "PUT",
    headers: this.requestHeaders,
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function partiallyUpdateAssetAttachment(
  this: BookamatClient,
  attachmentId: number,
  payload: Partial<AssetAttachmentUpdate>
): Promise<AssetAttachment> {
  const sanitizedPayload = sanitizePayload(payload);
  const url = `${this.apiRoot}/assets/attachments/${attachmentId}/`;
  return this.request<AssetAttachment>(url, {
    method: "PATCH",
    headers: this.requestHeaders,
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function deleteAssetAttachment(
  this: BookamatClient,
  attachmentId: number
): Promise<void> {
  const url = `${this.apiRoot}/assets/attachments/${attachmentId}/`;
  await this.request<void>(url, {
    method: "DELETE",
    headers: this.requestHeaders,
  });
}

export async function downloadAssetAttachment(
  this: BookamatClient,
  attachmentId: number
): Promise<AssetAttachmentDownloadResponse> {
  const url = `${this.apiRoot}/assets/attachments/${attachmentId}/download/`;
  const data = await this.request<AssetAttachmentDownloadResponse>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
  if (!data.file || typeof data.file !== "string") {
    throw new Error(
      `Asset attachment download for ID ${attachmentId} missing base64 'file' string in response.`
    );
  }
  return data;
}
