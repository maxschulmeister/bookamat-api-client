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
} from "../types";
import { fetchAllPages, sanitizePayload } from "../utils";

// --- Asset (Anlagen) Endpoints ---
export async function getAssets(
  this: BookamatClient,
  params: PaginatedRequestParams = {}
): Promise<Asset[]> {
  const url = new URL(`${this.apiRoot}/assets/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<Asset>(url.toString(), this.requestHeaders);
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
): Promise<AssetAttachment[]> {
  const url = new URL(`${this.apiRoot}/assets/attachments/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<AssetAttachment>(url.toString(), this.requestHeaders);
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
