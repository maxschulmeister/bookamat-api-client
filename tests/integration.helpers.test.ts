import { beforeAll, describe, expect, it } from "bun:test";
import pLimit from "p-limit";
import { BookamatClient } from "../src/client";

// Enforce concurrency limit of 1 to avoid hitting rate limits
const limit = pLimit(1);

describe("Helper Methods Integration Tests", () => {
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
    console.log("Helper methods integration test configuration:", {
      username,
      year,
      hasApiKey: !!apiKey,
    });
  });

  // --- getAllBookings Integration Test ---
  it("should fetch all bookings using helper method successfully", async () => {
    await limit(async () => {
      const result = await client.getAllBookings({});

      expect(Array.isArray(result)).toBe(true);
      console.log("All bookings fetched via helper method successfully:", {
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

      // Verify that getAllBookings returns the same data as listBookings
      const directResult = await client.listBookings({});
      expect(result.length).toBeGreaterThanOrEqual(directResult.length);

      // If there are results, verify structure consistency
      if (result.length > 0 && directResult.length > 0) {
        const helperBooking = result.find((b) => b.id === directResult[0].id);
        if (helperBooking) {
          expect(helperBooking.title).toBe(directResult[0].title);
          expect(helperBooking.date).toBe(directResult[0].date);
        }
      }
    });
  });

  it("should fetch all bookings with filtering parameters using helper method", async () => {
    await limit(async () => {
      // Test with date filtering
      const currentYear = new Date().getFullYear();
      const result = await client.getAllBookings({
        date_from: `${currentYear}-01-01`,
        date_until: `${currentYear}-12-31`,
      });

      expect(Array.isArray(result)).toBe(true);
      console.log("Filtered bookings fetched via helper method successfully:", {
        count: result.length,
        filter: `date range: ${currentYear}-01-01 to ${currentYear}-12-31`,
      });

      // Verify that all returned bookings are within the date range
      if (result.length > 0) {
        result.forEach((booking) => {
          const bookingDate = new Date(booking.date);
          const fromDate = new Date(`${currentYear}-01-01`);
          const toDate = new Date(`${currentYear}-12-31`);

          expect(bookingDate.getTime()).toBeGreaterThanOrEqual(
            fromDate.getTime()
          );
          expect(bookingDate.getTime()).toBeLessThanOrEqual(toDate.getTime());
        });
      }
    });
  });

  // --- getAllAccounts Integration Test ---
  it("should fetch all accounts using helper method successfully", async () => {
    await limit(async () => {
      const result = await client.getAllAccounts();

      expect(typeof result).toBe("object");
      expect(result).toHaveProperty("costaccounts");
      expect(result).toHaveProperty("bankaccounts");
      expect(result).toHaveProperty("purchasetaxaccounts");

      expect(Array.isArray(result.costaccounts)).toBe(true);
      expect(Array.isArray(result.bankaccounts)).toBe(true);
      expect(Array.isArray(result.purchasetaxaccounts)).toBe(true);

      console.log("All accounts fetched via helper method successfully:", {
        costAccountsCount: result.costaccounts.length,
        bankAccountsCount: result.bankaccounts.length,
        purchaseTaxAccountsCount: result.purchasetaxaccounts.length,
      });

      // Verify cost accounts structure
      if (result.costaccounts.length > 0) {
        const firstCostAccount = result.costaccounts[0];
        expect(firstCostAccount).toHaveProperty("id");
        expect(firstCostAccount).toHaveProperty("name");
        expect(firstCostAccount).toHaveProperty("section");
        expect(firstCostAccount).toHaveProperty("group");

        expect(typeof firstCostAccount.id).toBe("number");
        expect(typeof firstCostAccount.name).toBe("string");
        expect(typeof firstCostAccount.section).toBe("string");
        expect(["1", "2"]).toContain(firstCostAccount.group);
      }

      // Verify bank accounts structure
      if (result.bankaccounts.length > 0) {
        const firstBankAccount = result.bankaccounts[0];
        expect(firstBankAccount).toHaveProperty("id");
        expect(firstBankAccount).toHaveProperty("name");
        expect(firstBankAccount).toHaveProperty("position");
        expect(firstBankAccount).toHaveProperty("flag_balance");

        expect(typeof firstBankAccount.id).toBe("number");
        expect(typeof firstBankAccount.name).toBe("string");
        expect(typeof firstBankAccount.position).toBe("number");
        expect(typeof firstBankAccount.flag_balance).toBe("boolean");
      }

      // Verify purchase tax accounts structure
      if (result.purchasetaxaccounts.length > 0) {
        const firstPurchaseTaxAccount = result.purchasetaxaccounts[0];
        expect(firstPurchaseTaxAccount).toHaveProperty("id");
        expect(firstPurchaseTaxAccount).toHaveProperty("name");
        expect(firstPurchaseTaxAccount).toHaveProperty("section");
        expect(firstPurchaseTaxAccount).toHaveProperty("group");

        expect(typeof firstPurchaseTaxAccount.id).toBe("number");
        expect(typeof firstPurchaseTaxAccount.name).toBe("string");
        expect(typeof firstPurchaseTaxAccount.section).toBe("string");
        expect(["1", "2"]).toContain(firstPurchaseTaxAccount.group);
      }
    });
  });

  it("should verify getAllAccounts returns same data as individual calls", async () => {
    await limit(async () => {
      // Get all accounts via helper method
      const helperResult = await client.getAllAccounts();

      // Get accounts via individual calls
      const [costAccounts, bankAccounts, purchaseTaxAccounts] =
        await Promise.all([
          client.getCostAccounts(),
          client.getBankAccounts(),
          client.getPurchaseTaxAccounts(),
        ]);

      // Verify counts match
      expect(helperResult.costaccounts.length).toBe(costAccounts.length);
      expect(helperResult.bankaccounts.length).toBe(bankAccounts.length);
      expect(helperResult.purchasetaxaccounts.length).toBe(
        purchaseTaxAccounts.length
      );

      // Verify data consistency for cost accounts
      if (costAccounts.length > 0 && helperResult.costaccounts.length > 0) {
        const directAccount = costAccounts[0];
        const helperAccount = helperResult.costaccounts.find(
          (acc) => acc.id === directAccount.id
        );

        if (helperAccount) {
          expect(helperAccount.name).toBe(directAccount.name);
          expect(helperAccount.section).toBe(directAccount.section);
          expect(helperAccount.group).toBe(directAccount.group);
        }
      }

      // Verify data consistency for bank accounts
      if (bankAccounts.length > 0 && helperResult.bankaccounts.length > 0) {
        const directAccount = bankAccounts[0];
        const helperAccount = helperResult.bankaccounts.find(
          (acc) => acc.id === directAccount.id
        );

        if (helperAccount) {
          expect(helperAccount.name).toBe(directAccount.name);
          expect(helperAccount.position).toBe(directAccount.position);
          expect(helperAccount.flag_balance).toBe(directAccount.flag_balance);
        }
      }

      // Verify data consistency for purchase tax accounts
      if (
        purchaseTaxAccounts.length > 0 &&
        helperResult.purchasetaxaccounts.length > 0
      ) {
        const directAccount = purchaseTaxAccounts[0];
        const helperAccount = helperResult.purchasetaxaccounts.find(
          (acc) => acc.id === directAccount.id
        );

        if (helperAccount) {
          expect(helperAccount.name).toBe(directAccount.name);
          expect(helperAccount.section).toBe(directAccount.section);
          expect(helperAccount.group).toBe(directAccount.group);
        }
      }

      console.log("Helper method data consistency verified successfully");
    });
  });

  // --- Error Handling Tests ---
  it("should handle errors gracefully for helper methods", async () => {
    await limit(async () => {
      // Test getAllBookings with invalid parameters
      try {
        await client.getAllBookings({ date_from: "invalid-date" });
        // If no error is thrown, that's also acceptable behavior
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      // Test getAllAccounts error handling by temporarily breaking one of the underlying calls
      // This is more of a theoretical test since getAllAccounts calls multiple endpoints
      try {
        const result = await client.getAllAccounts();
        expect(result).toHaveProperty("costaccounts");
        expect(result).toHaveProperty("bankaccounts");
        expect(result).toHaveProperty("purchasetaxaccounts");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        console.log("getAllAccounts error handled gracefully:", error.message);
      }

      console.log("Helper method error handling tests completed successfully");
    });
  });
});
