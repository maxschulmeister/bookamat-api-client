import { beforeAll, describe, expect, it } from "bun:test";
import pLimit from "p-limit";
import { BookamatClient } from "../src/client";

// Enforce concurrency limit of 1 to avoid hitting rate limits
const limit = pLimit(1);

describe("Bookings Integration Tests", () => {
  let client: BookamatClient;

  beforeAll(() => {
    // Read environment variables for test credentials
    const username = process.env.BOOKAMAT_USERNAME;
    const apiKey = process.env.BOOKAMAT_API_KEY;
    const year = process.env.BOOKAMAT_YEAR;

    if (!username || !apiKey || !year) {
      throw new Error(
        "Missing required environment variables: BOOKAMAT_USERNAME, BOOKAMAT_API_KEY, BOOKAMAT_YEAR"
      );
    }

    client = new BookamatClient({
      year,
      username,
      apiKey,
    });

    // Debug: Log the configuration
    console.log("Bookings integration test configuration:", {
      username,
      year,
      hasApiKey: !!apiKey,
    });
  });

  // --- Booking List Operations ---
  it("should fetch all bookings successfully", async () => {
    await limit(async () => {
      const result = await client.listBookings({});

      expect(Array.isArray(result)).toBe(true);
      console.log("All bookings fetched successfully:", {
        count: result.length,
        bookings: result.slice(0, 3).map((booking) => ({
          id: booking.id,
          title: booking.title,
          date: booking.date,
        })),
      });

      if (result.length > 0) {
        const firstBooking = result[0];
        expect(firstBooking).toHaveProperty("id");
        expect(firstBooking).toHaveProperty("title");
        expect(firstBooking).toHaveProperty("date");
        expect(firstBooking).toHaveProperty("amounts");

        expect(typeof firstBooking.id).toBe("number");
        expect(typeof firstBooking.title).toBe("string");
        expect(typeof firstBooking.date).toBe("string");
        expect(Array.isArray(firstBooking.amounts)).toBe(true);
      }
    });
  });

  it("should fetch open bookings successfully", async () => {
    await limit(async () => {
      const result = await client.listOpenBookings({});

      expect(Array.isArray(result)).toBe(true);
      console.log("Open bookings fetched successfully:", {
        count: result.length,
      });

      if (result.length > 0) {
        const firstBooking = result[0];
        expect(firstBooking).toHaveProperty("id");
        expect(firstBooking).toHaveProperty("status");
        expect(firstBooking.status).toBe("2"); // Open status
      }
    });
  });

  it("should fetch deleted bookings successfully", async () => {
    await limit(async () => {
      const result = await client.listDeletedBookings({});

      expect(Array.isArray(result)).toBe(true);
      console.log("Deleted bookings fetched successfully:", {
        count: result.length,
      });

      if (result.length > 0) {
        const firstBooking = result[0];
        expect(firstBooking).toHaveProperty("id");
        expect(firstBooking).toHaveProperty("status");
        expect(firstBooking.status).toBe("3"); // Deleted status
      }
    });
  });

  it("should fetch imported bookings successfully", async () => {
    await limit(async () => {
      const result = await client.listImportedBookings({});

      expect(Array.isArray(result)).toBe(true);
      console.log("Imported bookings fetched successfully:", {
        count: result.length,
      });

      if (result.length > 0) {
        const firstBooking = result[0];
        expect(firstBooking).toHaveProperty("id");
        expect(firstBooking).toHaveProperty("status");
        expect(firstBooking.status).toBe("4"); // Imported status
      }
    });
  });

  it("should fetch booking details successfully", async () => {
    await limit(async () => {
      const bookings = await client.listBookings({});

      if (bookings.length > 0) {
        const bookingId = bookings[0].id;
        const result = await client.getBookingDetails(bookingId);

        expect(result).toHaveProperty("id", bookingId);
        expect(result).toHaveProperty("title");
        expect(result).toHaveProperty("date");
        expect(result).toHaveProperty("amounts");

        console.log("Booking details fetched successfully:", {
          id: result.id,
          title: result.title,
          date: result.date,
          amountsCount: result.amounts.length,
        });
      }
    });
  });

  // --- Booking Attachments ---
  it("should fetch booking attachments successfully", async () => {
    await limit(async () => {
      const bookings = await client.listBookings({});

      if (bookings.length > 0) {
        const bookingId = bookings[0].id;
        const result = await client.listBookingAttachments({
          booking: bookingId,
        });

        expect(Array.isArray(result)).toBe(true);
        console.log("Booking attachments fetched successfully:", {
          bookingId,
          attachmentCount: result.length,
        });

        if (result.length > 0) {
          const firstAttachment = result[0];
          expect(firstAttachment).toHaveProperty("id");
          expect(firstAttachment).toHaveProperty("booking");
          expect(firstAttachment.booking).toBe(bookingId);
        }
      }
    });
  });

  it("should fetch booking attachment details successfully", async () => {
    await limit(async () => {
      const bookings = await client.listBookings({});

      if (bookings.length > 0) {
        const bookingId = bookings[0].id;
        const attachments = await client.listBookingAttachments({
          booking: bookingId,
        });

        if (attachments.length > 0) {
          const attachmentId = attachments[0].id;
          const result = await client.getBookingAttachmentDetails(attachmentId);

          expect(result).toHaveProperty("id", attachmentId);
          expect(result).toHaveProperty("booking", bookingId);

          console.log("Booking attachment details fetched successfully:", {
            id: result.id,
            bookingId: result.booking,
          });
        }
      }
    });
  });

  // --- Booking Tags ---
  it("should fetch booking tags successfully", async () => {
    await limit(async () => {
      const bookings = await client.listBookings({});

      if (bookings.length > 0) {
        const bookingId = bookings[0].id;
        const result = await client.getBookingTags(bookingId, {});

        expect(Array.isArray(result)).toBe(true);
        console.log("Booking tags fetched successfully:", {
          bookingId,
          tagCount: result.length,
        });

        if (result.length > 0) {
          const firstTag = result[0];
          expect(firstTag).toHaveProperty("id");
          expect(firstTag).toHaveProperty("name");
        }
      }
    });
  });

  it("should fetch booking tag details successfully", async () => {
    await limit(async () => {
      const bookings = await client.listBookings({});

      if (bookings.length > 0) {
        const bookingId = bookings[0].id;
        const tags = await client.getBookingTags(bookingId, {});

        if (tags.length > 0) {
          const tagId = tags[0].id;
          const result = await client.getBookingTagDetails(bookingId, tagId);

          expect(result).toHaveProperty("id", tagId);
          expect(result).toHaveProperty("name");

          console.log("Booking tag details fetched successfully:", {
            id: result.id,
            name: result.name,
            bookingId,
          });
        }
      }
    });
  });

  // --- CRUD Operations Integration Tests ---
  // Note: These tests are commented out to avoid modifying production data
  // Uncomment and modify for testing in a safe environment

  /*
  it("should create, update, and delete a booking", async () => {
    await limit(async () => {
      // Create
      const created = await client.createBooking({
        title: "Test Booking",
        date: "2024-01-01",
        amounts: [
          {
            amount: "100.00",
            costaccount: 120, // Use a valid cost account ID
            purchasetaxaccount: 211, // Use a valid purchase tax account ID
          }
        ],
      });
      
      expect(created).toHaveProperty("id");
      expect(created.title).toBe("Test Booking");
      
      // Update
      const updated = await client.updateBooking(created.id, {
        title: "Updated Test Booking",
        date: "2024-01-02",
        amounts: created.amounts,
      });
      
      expect(updated.title).toBe("Updated Test Booking");
      expect(updated.date).toBe("2024-01-02");
      
      // Partial Update
      const partiallyUpdated = await client.partiallyUpdateBooking(created.id, {
        title: "Partially Updated Test Booking",
      });
      
      expect(partiallyUpdated.title).toBe("Partially Updated Test Booking");
      
      // Delete
      await client.deleteBooking(created.id);
      
      console.log("Booking CRUD operations completed successfully");
    });
  });

  it("should create, update, and delete booking attachments", async () => {
    await limit(async () => {
      // First create a test booking
      const booking = await client.createBooking({
        title: "Test Booking for Attachments",
        date: "2024-01-01",
        amounts: [
          {
            amount: "50.00",
            costaccount: 120,
            purchasetaxaccount: 211,
          }
        ],
      });

      // Create attachment
      const created = await client.addBookingAttachment({
        booking: booking.id,
        file: "dGVzdCBmaWxlIGNvbnRlbnQ=", // base64 encoded "test file content"
      });
      
      expect(created).toHaveProperty("id");
      expect(created.booking).toBe(booking.id);
      
      // Update attachment
      const updated = await client.updateBookingAttachment(created.id, {
        file: "dXBkYXRlZCBmaWxlIGNvbnRlbnQ=", // base64 encoded "updated file content"
      });
      
      expect(updated.id).toBe(created.id);
      
      // Partial update attachment
      const partiallyUpdated = await client.partiallyUpdateBookingAttachment(created.id, {
        file: "cGFydGlhbGx5IHVwZGF0ZWQgZmlsZQ==", // base64 encoded "partially updated file"
      });
      
      expect(partiallyUpdated.id).toBe(created.id);
      
      // Download attachment
      const downloaded = await client.downloadAttachment(created.id);
      expect(downloaded).toHaveProperty("file");
      
      // Delete attachment
      await client.deleteBookingAttachment(created.id);
      
      // Clean up booking
      await client.deleteBooking(booking.id);
      
      console.log("Booking attachment CRUD operations completed successfully");
    });
  });

  it("should create, update, and delete booking tags", async () => {
    await limit(async () => {
      // First create a test booking
      const booking = await client.createBooking({
        title: "Test Booking for Tags",
        date: "2024-01-01",
        amounts: [
          {
            amount: "75.00",
            costaccount: 120,
            purchasetaxaccount: 211,
          }
        ],
      });

      // Create tag
      const created = await client.addTagToBooking(booking.id, {
        name: "Test Tag",
      });
      
      expect(created).toHaveProperty("id");
      expect(created.name).toBe("Test Tag");
      
      // Update tag
      const updated = await client.updateBookingTag(booking.id, created.id, {
        name: "Updated Test Tag",
      });
      
      expect(updated.name).toBe("Updated Test Tag");
      
      // Partial update tag
      const partiallyUpdated = await client.partiallyUpdateBookingTag(booking.id, created.id, {
        name: "Partially Updated Test Tag",
      });
      
      expect(partiallyUpdated.name).toBe("Partially Updated Test Tag");
      
      // Remove tag
      await client.removeTagFromBooking(booking.id, created.id);
      
      // Clean up booking
      await client.deleteBooking(booking.id);
      
      console.log("Booking tag CRUD operations completed successfully");
    });
  });

  it("should restore a deleted booking", async () => {
    await limit(async () => {
      // Create a booking
      const booking = await client.createBooking({
        title: "Test Booking for Restore",
        date: "2024-01-01",
        amounts: [
          {
            amount: "25.00",
            costaccount: 120,
            purchasetaxaccount: 211,
          }
        ],
      });

      // Delete the booking
      await client.deleteBooking(booking.id);

      // Restore the booking
      const restored = await client.restoreBooking(booking.id);
      
      expect(restored).toHaveProperty("id", booking.id);
      expect(restored.status).toBe("1"); // Active status
      
      // Clean up
      await client.deleteBooking(booking.id);
      
      console.log("Booking restore operation completed successfully");
    });
  });
  */

  // --- Error Handling Tests ---
  it("should handle errors gracefully for all booking endpoints", async () => {
    await limit(async () => {
      // Test with invalid IDs
      const invalidId = 999999;

      // These endpoints throw errors for invalid IDs
      await expect(client.getBookingDetails(invalidId)).rejects.toThrow();
      await expect(
        client.getBookingAttachmentDetails(invalidId)
      ).rejects.toThrow();
      
      // This endpoint returns empty array for invalid booking ID
      const tags = await client.getBookingTags(invalidId, {});
      expect(tags).toEqual([]);
      
      // This endpoint throws error for invalid IDs
      await expect(
        client.getBookingTagDetails(invalidId, invalidId)
      ).rejects.toThrow();

      console.log("Booking error handling tests completed successfully");
    });
  });
});
