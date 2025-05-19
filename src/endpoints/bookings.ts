import type { BookamatClient } from "../client";
import type {
  Attachment,
  AttachmentCreate,
  AttachmentDownloadResponse,
  AttachmentUpdate,
  Booking,
  BookingAttachmentsListParams, // Bookings is PaginatedResponse<Booking>
  BookingCreate,
  Bookings,
  BookingsParams,
  BookingTag,
  BookingTagCreate,
  BookingTagUpdate,
  BookingUpdate,
  PaginatedRequestParams,
  PaginatedResponse,
} from "../types";
import { sanitizePayload } from "../utils";

// --- Booking Endpoints ---
export async function listBookings(
  this: BookamatClient,
  params: BookingsParams = {}
): Promise<Bookings> {
  const url = new URL(`${this.apiRoot}/bookings/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  return this.request<Bookings>(url.toString(), {
    method: "GET",
    headers: this.requestHeaders,
  });
}

export async function getBookingDetails(
  this: BookamatClient,
  id: number
): Promise<Booking> {
  const url = `${this.apiRoot}/bookings/${id}/`;
  return this.request<Booking>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

export async function createBooking(
  this: BookamatClient,
  payload: BookingCreate
): Promise<Booking> {
  const sanitizedPayload = sanitizePayload(payload);
  // console.log(`Sanitized payload for createBooking: ${JSON.stringify(sanitizedPayload,null,2)}`);
  // if (sanitizedPayload.date) { console.log(`[Bookamat] createBooking: Payload date: ${sanitizedPayload.date}, Type: ${typeof sanitizedPayload.date}`); }
  const url = `${this.apiRoot}/bookings/`;
  try {
    return this.request<Booking>(url, {
      method: "POST",
      headers: this.requestHeaders,
      body: JSON.stringify(sanitizedPayload),
    });
  } catch (error) {
    // console.error(`[Bookamat] Booking creation failed. Payload: ${JSON.stringify(sanitizedPayload,null,2)}`);
    // if (error instanceof Error) { console.error(`[Bookamat] Error: ${error.message}`); }
    // else { console.error(`[Bookamat] Error: ${String(error)}`); }
    throw error;
  }
}

export async function updateBooking(
  this: BookamatClient,
  id: number,
  payload: BookingUpdate
): Promise<Booking> {
  const sanitizedPayload = sanitizePayload(payload);
  const url = `${this.apiRoot}/bookings/${id}/`;
  return this.request<Booking>(url, {
    method: "PUT",
    headers: this.requestHeaders,
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function partiallyUpdateBooking(
  this: BookamatClient,
  id: number,
  payload: Partial<BookingUpdate>
): Promise<Booking> {
  const sanitizedPayload = sanitizePayload(payload);
  const url = `${this.apiRoot}/bookings/${id}/`;
  return this.request<Booking>(url, {
    method: "PATCH",
    headers: this.requestHeaders,
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function deleteBooking(
  this: BookamatClient,
  bookingId: number
): Promise<void> {
  const url = `${this.apiRoot}/bookings/${bookingId}/`;
  await this.request<void>(url, {
    method: "DELETE",
    headers: this.requestHeaders,
  });
}

// --- Attachment Endpoints for Bookings ---
export async function addBookingAttachment(
  this: BookamatClient,
  payload: AttachmentCreate
): Promise<Attachment> {
  const url = `${this.apiRoot}/bookings/attachments/`;
  return this.request<Attachment>(url, {
    method: "POST",
    headers: this.requestHeaders,
    body: JSON.stringify(payload),
  });
}

export async function listBookingAttachments(
  this: BookamatClient,
  params: BookingAttachmentsListParams
): Promise<PaginatedResponse<Attachment>> {
  const url = new URL(`${this.apiRoot}/bookings/attachments/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });
  return this.request<PaginatedResponse<Attachment>>(url.toString(), {
    method: "GET",
    headers: this.requestHeaders,
  });
}

export async function getBookingAttachmentDetails(
  this: BookamatClient,
  attachmentId: number
): Promise<Attachment> {
  const url = `${this.apiRoot}/bookings/attachments/${attachmentId}/`;
  return this.request<Attachment>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

export async function updateBookingAttachment(
  this: BookamatClient,
  attachmentId: number,
  payload: AttachmentUpdate
): Promise<Attachment> {
  const sanitizedPayload = sanitizePayload(payload);
  const url = `${this.apiRoot}/bookings/attachments/${attachmentId}/`;
  return this.request<Attachment>(url, {
    method: "PUT",
    headers: this.requestHeaders,
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function partiallyUpdateBookingAttachment(
  this: BookamatClient,
  attachmentId: number,
  payload: Partial<AttachmentUpdate>
): Promise<Attachment> {
  const sanitizedPayload = sanitizePayload(payload);
  const url = `${this.apiRoot}/bookings/attachments/${attachmentId}/`;
  return this.request<Attachment>(url, {
    method: "PATCH",
    headers: this.requestHeaders,
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function deleteBookingAttachment(
  this: BookamatClient,
  attachmentId: number
): Promise<void> {
  const url = `${this.apiRoot}/bookings/attachments/${attachmentId}/`;
  await this.request<void>(url, {
    method: "DELETE",
    headers: this.requestHeaders,
  });
}

export async function downloadAttachment(
  this: BookamatClient,
  attachmentId: number
): Promise<AttachmentDownloadResponse> {
  const url = `${this.apiRoot}/bookings/attachments/${attachmentId}/download/`;
  const data = await this.request<AttachmentDownloadResponse>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
  if (!data.file || typeof data.file !== "string") {
    throw new Error(
      `Attachment download for ID ${attachmentId} missing base64 'file' string in response.`
    );
  }
  return data;
}

// --- Tags for Bookings Endpoints ---
export async function getBookingTags(
  this: BookamatClient,
  bookingId: number,
  params?: PaginatedRequestParams
): Promise<PaginatedResponse<BookingTag>> {
  const url = new URL(`${this.apiRoot}/bookings/${bookingId}/tags/`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return this.request<PaginatedResponse<BookingTag>>(url.toString(), {
    method: "GET",
    headers: this.requestHeaders,
  });
}

export async function addTagToBooking(
  this: BookamatClient,
  bookingId: number,
  payload: BookingTagCreate
): Promise<BookingTag> {
  const url = `${this.apiRoot}/bookings/${bookingId}/tags/`;
  const sanitizedPayload = sanitizePayload(payload);
  return this.request<BookingTag>(url, {
    method: "POST",
    headers: this.requestHeaders,
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function getBookingTagDetails(
  this: BookamatClient,
  bookingId: number,
  bookingTagId: number
): Promise<BookingTag> {
  const url = `${this.apiRoot}/bookings/${bookingId}/tags/${bookingTagId}/`;
  return this.request<BookingTag>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

export async function updateBookingTag(
  this: BookamatClient,
  bookingId: number,
  bookingTagId: number,
  payload: BookingTagUpdate
): Promise<BookingTag> {
  const url = `${this.apiRoot}/bookings/${bookingId}/tags/${bookingTagId}/`;
  const sanitizedPayload = sanitizePayload(payload);
  return this.request<BookingTag>(url, {
    method: "PUT",
    headers: this.requestHeaders,
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function partiallyUpdateBookingTag(
  this: BookamatClient,
  bookingId: number,
  bookingTagId: number,
  payload: Partial<BookingTagUpdate>
): Promise<BookingTag> {
  const url = `${this.apiRoot}/bookings/${bookingId}/tags/${bookingTagId}/`;
  const sanitizedPayload = sanitizePayload(payload);
  return this.request<BookingTag>(url, {
    method: "PATCH",
    headers: this.requestHeaders,
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function removeTagFromBooking(
  this: BookamatClient,
  bookingId: number,
  bookingTagId: number
): Promise<void> {
  const url = `${this.apiRoot}/bookings/${bookingId}/tags/${bookingTagId}/`;
  await this.request<void>(url, {
    method: "DELETE",
    headers: this.requestHeaders,
  });
}
