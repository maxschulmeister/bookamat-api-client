import type { BookamatClient } from "../client";
import type {
  Attachment,
  AttachmentCreate,
  AttachmentDownloadResponse,
  AttachmentUpdate,
  Booking,
  BookingAttachmentsListParams,
  BookingCreate,
  BookingsParams,
  BookingTag,
  BookingTagCreate,
  BookingTagUpdate,
  BookingUpdate,
  PaginatedRequestParams,
} from "../types";
import { fetchAllPages, sanitizePayload } from "../utils";

// --- Booking Endpoints ---

/**
 * Lists all bookings (regular bookings with status "1").
 *
 * @param params - Optional filtering and pagination parameters
 * @returns A promise that resolves to an array of bookings
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#liste-der-buchungen|Bookamat API Docs - List Bookings}
 */
export async function listBookings(
  this: BookamatClient,
  params: BookingsParams = {}
): Promise<Booking[]> {
  const url = new URL(`${this.apiRoot}/bookings/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<Booking>(url.toString(), this.requestHeaders);
}

/**
 * Lists all open bookings (bookings without a date, status "2").
 *
 * @param params - Optional filtering and pagination parameters
 * @returns A promise that resolves to an array of open bookings
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#liste-der-offenen-buchungen|Bookamat API Docs - List Open Bookings}
 */
export async function listOpenBookings(
  this: BookamatClient,
  params: BookingsParams = {}
): Promise<Booking[]> {
  const url = new URL(`${this.apiRoot}/bookings/open/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<Booking>(url.toString(), this.requestHeaders);
}

/**
 * Lists all deleted bookings (bookings with status "3").
 *
 * @param params - Optional filtering and pagination parameters
 * @returns A promise that resolves to an array of deleted bookings
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#liste-der-geloschten-buchungen|Bookamat API Docs - List Deleted Bookings}
 */
export async function listDeletedBookings(
  this: BookamatClient,
  params: BookingsParams = {}
): Promise<Booking[]> {
  const url = new URL(`${this.apiRoot}/bookings/deleted/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<Booking>(url.toString(), this.requestHeaders);
}

/**
 * Lists all imported bookings (bookings with status "4").
 *
 * @param params - Optional filtering and pagination parameters
 * @returns A promise that resolves to an array of imported bookings
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#liste-der-importierten-buchungen|Bookamat API Docs - List Imported Bookings}
 */
export async function listImportedBookings(
  this: BookamatClient,
  params: BookingsParams = {}
): Promise<Booking[]> {
  const url = new URL(`${this.apiRoot}/bookings/imported/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<Booking>(url.toString(), this.requestHeaders);
}

/**
 * Gets details of a single booking (regular, open, deleted, or imported).
 *
 * @param id - The booking ID
 * @returns A promise that resolves to the booking details
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchung-detail|Bookamat API Docs - Booking Details}
 */
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

/**
 * Creates a new booking.
 *
 * @param payload - The booking data to create
 * @returns A promise that resolves to the created booking
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchung-hinzufugen|Bookamat API Docs - Create Booking}
 */
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

/**
 * Updates an existing booking using PUT (full update).
 *
 * @param id - The booking ID to update
 * @param payload - The complete booking data
 * @returns A promise that resolves to the updated booking
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchung-andern|Bookamat API Docs - Update Booking}
 */
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

/**
 * Partially updates an existing booking using PATCH.
 *
 * @param id - The booking ID to update
 * @param payload - The partial booking data to update
 * @returns A promise that resolves to the updated booking
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchung-andern|Bookamat API Docs - Update Booking}
 */
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

/**
 * Deletes a booking (sets status to "deleted").
 * Note: Bookings are not actually deleted but marked as deleted and can be restored.
 *
 * @param bookingId - The booking ID to delete
 * @returns A promise that resolves when the booking is deleted
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchung-loschen|Bookamat API Docs - Delete Booking}
 */
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

/**
 * Restores a deleted booking.
 * Changes status from "deleted" to "booked" (if date present) or "open" (if no date).
 *
 * @param bookingId - The booking ID to restore
 * @returns A promise that resolves to the restored booking
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchung-wiederherstellen|Bookamat API Docs - Restore Booking}
 */
export async function restoreBooking(
  this: BookamatClient,
  bookingId: number
): Promise<Booking> {
  const url = `${this.apiRoot}/bookings/${bookingId}/restore/`;
  return this.request<Booking>(url, {
    method: "POST",
    headers: this.requestHeaders,
  });
}

// --- Attachment Endpoints for Bookings ---

/**
 * Adds a new attachment to a booking.
 *
 * @param payload - The attachment data including base64 encoded file
 * @returns A promise that resolves to the created attachment
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchungsanhang-hinzufugen|Bookamat API Docs - Add Booking Attachment}
 */
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

/**
 * Lists all attachments for bookings with optional filtering.
 *
 * @param params - Parameters including booking ID filter and pagination
 * @returns A promise that resolves to an array of attachments
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#liste-der-anhange-fur-buchungen|Bookamat API Docs - List Booking Attachments}
 */
export async function listBookingAttachments(
  this: BookamatClient,
  params: BookingAttachmentsListParams
): Promise<Attachment[]> {
  const url = new URL(`${this.apiRoot}/bookings/attachments/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<Attachment>(url.toString(), this.requestHeaders);
}

/**
 * Gets details of a specific booking attachment.
 *
 * @param attachmentId - The attachment ID
 * @returns A promise that resolves to the attachment details
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchungsanhang-detail|Bookamat API Docs - Booking Attachment Details}
 */
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

/**
 * Updates a booking attachment using PUT (full update).
 *
 * @param attachmentId - The attachment ID to update
 * @param payload - The complete attachment data
 * @returns A promise that resolves to the updated attachment
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchungsanhang-andern|Bookamat API Docs - Update Booking Attachment}
 */
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

/**
 * Partially updates a booking attachment using PATCH.
 *
 * @param attachmentId - The attachment ID to update
 * @param payload - The partial attachment data to update
 * @returns A promise that resolves to the updated attachment
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchungsanhang-andern|Bookamat API Docs - Update Booking Attachment}
 */
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

/**
 * Deletes a booking attachment.
 *
 * @param attachmentId - The attachment ID to delete
 * @returns A promise that resolves when the attachment is deleted
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchungsanhang-loschen|Bookamat API Docs - Delete Booking Attachment}
 */
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

/**
 * Downloads a booking attachment as base64 encoded data.
 *
 * @param attachmentId - The attachment ID to download
 * @returns A promise that resolves to the attachment with base64 file data
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchungsanhang-download|Bookamat API Docs - Download Booking Attachment}
 */
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

/**
 * Gets all tags associated with a specific booking.
 *
 * @param bookingId - The booking ID
 * @param params - Optional pagination parameters
 * @returns A promise that resolves to an array of booking tags
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#liste-der-tags-zu-buchungen|Bookamat API Docs - List Booking Tags}
 */
export async function getBookingTags(
  this: BookamatClient,
  bookingId: number,
  params: PaginatedRequestParams = {}
): Promise<BookingTag[]> {
  const url = new URL(`${this.apiRoot}/bookings/${bookingId}/tags/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key !== "page") {
        // fetchAllPages handles pagination internally
        url.searchParams.append(key, String(value));
      }
    }
  });
  return fetchAllPages<BookingTag>(url.toString(), this.requestHeaders);
}

/**
 * Adds a tag to a booking.
 *
 * @param bookingId - The booking ID
 * @param payload - The tag association data
 * @returns A promise that resolves to the created booking tag association
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchungstag-hinzufugen|Bookamat API Docs - Add Booking Tag}
 */
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

/**
 * Gets details of a specific booking tag association.
 *
 * @param bookingId - The booking ID
 * @param bookingTagId - The booking tag association ID
 * @returns A promise that resolves to the booking tag details
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchungstag-detail|Bookamat API Docs - Booking Tag Details}
 */
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

/**
 * Updates a booking tag association using PUT (full update).
 *
 * @param bookingId - The booking ID
 * @param bookingTagId - The booking tag association ID
 * @param payload - The complete tag association data
 * @returns A promise that resolves to the updated booking tag
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchungstag-andern|Bookamat API Docs - Update Booking Tag}
 */
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

/**
 * Partially updates a booking tag association using PATCH.
 *
 * @param bookingId - The booking ID
 * @param bookingTagId - The booking tag association ID
 * @param payload - The partial tag association data to update
 * @returns A promise that resolves to the updated booking tag
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchungstag-andern|Bookamat API Docs - Update Booking Tag}
 */
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

/**
 * Removes a tag from a booking.
 *
 * @param bookingId - The booking ID
 * @param bookingTagId - The booking tag association ID to remove
 * @returns A promise that resolves when the tag is removed from the booking
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/bookings.html#buchungstag-loschen|Bookamat API Docs - Delete Booking Tag}
 */
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
