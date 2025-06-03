import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { BookamatClient } from "../../src/client";
import * as bookings from "../../src/endpoints/bookings";

const validOptions = {
  year: "2024",
  username: "testuser",
  apiKey: "testkey",
};

function makeFetchMock(response: any) {
  const fn = async () => response;
  (fn as any).preconnect = () => Promise.resolve();
  return fn as unknown as typeof fetch;
}

function makeFetchMockSequence(responses: any[]) {
  let call = 0;
  const fn = async () => {
    if (call < responses.length) {
      return responses[call++];
    }
    throw new Error("fetch called too many times");
  };
  (fn as any).preconnect = () => Promise.resolve();
  return fn as unknown as typeof fetch;
}

describe("endpoints/bookings", () => {
  let originalFetch: typeof globalThis.fetch;
  let client: BookamatClient;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    client = new BookamatClient(validOptions);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("listBookings returns paginated bookings", async () => {
    const bookingsPage = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ results: [{ id: 1 }], next: null }),
    };
    const emptyPage = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };
    globalThis.fetch = makeFetchMockSequence([bookingsPage, emptyPage]);
    const result = await bookings.listBookings.call(client, {});
    expect(result[0].id).toBe(1);
  });

  test("listOpenBookings returns paginated open bookings", async () => {
    const openBookingsPage = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ results: [{ id: 2, status: "2" }], next: null }),
    };
    const emptyPage = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };
    globalThis.fetch = makeFetchMockSequence([openBookingsPage, emptyPage]);
    const result = await bookings.listOpenBookings.call(client, {});
    expect(result[0].id).toBe(2);
    expect(result[0].status).toBe("2");
  });

  test("listDeletedBookings returns paginated deleted bookings", async () => {
    const deletedBookingsPage = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ results: [{ id: 3, status: "3" }], next: null }),
    };
    const emptyPage = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };
    globalThis.fetch = makeFetchMockSequence([deletedBookingsPage, emptyPage]);
    const result = await bookings.listDeletedBookings.call(client, {});
    expect(result[0].id).toBe(3);
    expect(result[0].status).toBe("3");
  });

  test("listImportedBookings returns paginated imported bookings", async () => {
    const importedBookingsPage = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ results: [{ id: 4, status: "4" }], next: null }),
    };
    const emptyPage = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };
    globalThis.fetch = makeFetchMockSequence([importedBookingsPage, emptyPage]);
    const result = await bookings.listImportedBookings.call(client, {});
    expect(result[0].id).toBe(4);
    expect(result[0].status).toBe("4");
  });

  test("getBookingDetails returns booking", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 2 }),
    });
    const result = await bookings.getBookingDetails.call(client, 2);
    expect(result.id).toBe(2);
  });

  test("createBooking posts and returns booking", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 201,
      headers: { get: () => "100" },
      json: async () => ({ id: 3 }),
    });
    const result = await bookings.createBooking.call(client, {
      title: "B",
      date: "2024-01-01",
      amounts: [],
    });
    expect(result.id).toBe(3);
  });

  test("updateBooking puts and returns booking", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 4 }),
    });
    const result = await bookings.updateBooking.call(client, 4, {
      title: "U",
      date: "2024-01-01",
      amounts: [],
    });
    expect(result.id).toBe(4);
  });

  test("partiallyUpdateBooking patches and returns booking", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 5 }),
    });
    const result = await bookings.partiallyUpdateBooking.call(client, 5, {
      title: "P",
    });
    expect(result.id).toBe(5);
  });

  test("deleteBooking calls DELETE and returns void", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 204,
      headers: { get: () => "0" },
      json: async () => undefined,
    });
    const result = await bookings.deleteBooking.call(client, 6);
    expect(result).toBeUndefined();
  });

  test("restoreBooking posts and returns restored booking", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 6, status: "1" }),
    });
    const result = await bookings.restoreBooking.call(client, 6);
    expect(result.id).toBe(6);
    expect(result.status).toBe("1");
  });

  test("addBookingAttachment posts and returns attachment", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 201,
      headers: { get: () => "100" },
      json: async () => ({ id: 7 }),
    });
    const result = await bookings.addBookingAttachment.call(client, {
      booking: 1,
      file: "base64",
    });
    expect(result.id).toBe(7);
  });

  test("listBookingAttachments returns attachments", async () => {
    const attachmentsPage = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ results: [{ id: 8 }], next: null }),
    };
    const emptyPage = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };
    globalThis.fetch = makeFetchMockSequence([attachmentsPage, emptyPage]);
    const result = await bookings.listBookingAttachments.call(client, {
      booking: 1,
    });
    expect(result[0].id).toBe(8);
  });

  test("getBookingAttachmentDetails returns attachment", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 9 }),
    });
    const result = await bookings.getBookingAttachmentDetails.call(client, 9);
    expect(result.id).toBe(9);
  });

  test("updateBookingAttachment puts and returns attachment", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 10 }),
    });
    const result = await bookings.updateBookingAttachment.call(client, 10, {
      file: "base64",
    });
    expect(result.id).toBe(10);
  });

  test("partiallyUpdateBookingAttachment patches and returns attachment", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 11 }),
    });
    const result = await bookings.partiallyUpdateBookingAttachment.call(
      client,
      11,
      { file: "base64" }
    );
    expect(result.id).toBe(11);
  });

  test("deleteBookingAttachment calls DELETE and returns void", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 204,
      headers: { get: () => "0" },
      json: async () => undefined,
    });
    const result = await bookings.deleteBookingAttachment.call(client, 12);
    expect(result).toBeUndefined();
  });

  test("downloadAttachment returns file string", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ file: "base64string" }),
    });
    const result = await bookings.downloadAttachment.call(client, 13);
    expect(result.file).toBe("base64string");
  });

  test("downloadAttachment throws if file missing", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({}),
    });
    await expect(
      bookings.downloadAttachment.call(client, 14)
    ).rejects.toThrow();
  });

  test("getBookingTags returns tags", async () => {
    const tagsPage = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ results: [{ id: 15 }], next: null }),
    };
    const emptyPage = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };
    globalThis.fetch = makeFetchMockSequence([tagsPage, emptyPage]);
    const result = await bookings.getBookingTags.call(client, 1, {});
    expect(result[0].id).toBe(15);
  });

  test("addTagToBooking posts and returns tag", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 201,
      headers: { get: () => "100" },
      json: async () => ({ id: 16 }),
    });
    const result = await bookings.addTagToBooking.call(client, 1, {
      name: "Tag",
    });
    expect(result.id).toBe(16);
  });

  test("getBookingTagDetails returns tag", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 17 }),
    });
    const result = await bookings.getBookingTagDetails.call(client, 1, 17);
    expect(result.id).toBe(17);
  });

  test("updateBookingTag puts and returns tag", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 18 }),
    });
    const result = await bookings.updateBookingTag.call(client, 1, 18, {
      name: "Updated",
    });
    expect(result.id).toBe(18);
  });

  test("partiallyUpdateBookingTag patches and returns tag", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 19 }),
    });
    const result = await bookings.partiallyUpdateBookingTag.call(
      client,
      1,
      19,
      { name: "Partial" }
    );
    expect(result.id).toBe(19);
  });

  test("removeTagFromBooking calls DELETE and returns void", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 204,
      headers: { get: () => "0" },
      json: async () => undefined,
    });
    const result = await bookings.removeTagFromBooking.call(client, 1, 20);
    expect(result).toBeUndefined();
  });

  test("all endpoints throw on error response", async () => {
    const errorResp = {
      ok: false,
      status: 500,
      text: async () => "server error",
      headers: { get: () => "0" },
    };
    for (const fnName of Object.keys(bookings)) {
      if (typeof (bookings as any)[fnName] === "function") {
        globalThis.fetch = makeFetchMock(errorResp);
        await expect(
          (bookings as any)[fnName].call(client, 1, {})
        ).rejects.toThrow("HTTP 500");
      }
    }
  });
});
