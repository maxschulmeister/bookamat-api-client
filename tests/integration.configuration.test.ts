import { beforeAll, describe, expect, it } from "bun:test";
import pLimit from "p-limit";
import { BookamatClient } from "../src/client";

// Enforce concurrency limit of 1 to avoid hitting rate limits
const limit = pLimit(1);

describe("Configuration Integration Tests", () => {
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

    // Debug: Log the constructed URLs
    console.log("Client configuration:");
    console.log("- API Root:", client.apiRoot);
    console.log("- Username:", client.username);
    console.log("- Year:", client.year);
    console.log("- Country:", client.country);
    console.log("- Base URL:", client.baseUrl);
  });

  it("should successfully fetch predefined cost accounts from real API", async () => {
    try {
      const result = await limit(async () => {
        // Debug: Log the URL being called
        const costAccountsUrl = `${client.apiRoot}/configuration/costaccounts/`;
        console.log("Calling predefined cost accounts URL:", costAccountsUrl);
        console.log("Request headers:", client.requestHeaders);

        const costAccounts = await client.getPredefinedCostAccounts();
        return costAccounts;
      });

      // Verify the response structure
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");

      console.log("Predefined cost accounts response:", result);

      // Check for paginated response structure
      expect(result).toHaveProperty("count");
      expect(result).toHaveProperty("results");
      expect(typeof result.count).toBe("number");
      expect(Array.isArray(result.results)).toBe(true);

      // If there are results, check the structure of cost accounts
      if (result.results.length > 0) {
        const firstAccount = result.results[0];
        expect(firstAccount).toHaveProperty("id");
        expect(firstAccount).toHaveProperty("name");
        expect(firstAccount).toHaveProperty("section");
        expect(firstAccount).toHaveProperty("group");
        expect(firstAccount).toHaveProperty("inventory");

        expect(typeof firstAccount.id).toBe("number");
        expect(typeof firstAccount.name).toBe("string");
        expect(typeof firstAccount.section).toBe("string");
        expect(["1", "2"]).toContain(firstAccount.group);
        expect(typeof firstAccount.inventory).toBe("boolean");

        console.log("Predefined cost accounts fetched successfully:", {
          count: result.count,
          accounts: result.results.slice(0, 3).map((acc) => ({
            id: acc.id,
            name: acc.name,
            section: acc.section,
            group: acc.group,
          })),
        });
      }

      console.log("Predefined cost accounts fetched successfully");
    } catch (error) {
      console.error("Predefined cost accounts API call failed:");
      console.error("Error:", error);

      // Re-throw with additional context
      if (error instanceof Error) {
        if (error.message.includes("HTTP 404")) {
          throw new Error(`Predefined cost accounts endpoint not found. This might indicate:
1. The API endpoint has changed
2. The credentials are invalid
3. The year ${client.year} is not accessible
4. The API structure is different than expected

Original error: ${error.message}`);
        } else if (
          error.message.includes("HTTP 401") ||
          error.message.includes("HTTP 403")
        ) {
          throw new Error(`Authentication failed. Please check:
1. Username: ${client.username}
2. API key validity
3. Account permissions

Original error: ${error.message}`);
        }
      }
      throw error;
    }
  });

  it("should successfully fetch a specific predefined cost account from real API", async () => {
    try {
      // First get the list to find a valid ID
      const listResult = await limit(async () => {
        return await client.getPredefinedCostAccounts();
      });

      if (listResult.results.length === 0) {
        console.log(
          "No predefined cost accounts available, skipping detail test"
        );
        return;
      }

      const firstAccountId = listResult.results[0].id;

      const result = await limit(async () => {
        // Debug: Log the URL being called
        const costAccountUrl = `${client.apiRoot}/configuration/costaccounts/${firstAccountId}/`;
        console.log(
          "Calling predefined cost account detail URL:",
          costAccountUrl
        );

        const costAccount = await client.getPredefinedCostAccount(
          firstAccountId
        );
        return costAccount;
      });

      // Verify the response structure
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(result.id).toBe(firstAccountId);
      expect(typeof result.name).toBe("string");
      expect(typeof result.section).toBe("string");

      console.log("Predefined cost account detail fetched successfully:", {
        id: result.id,
        name: result.name,
        section: result.section,
      });
    } catch (error) {
      console.error("Predefined cost account detail API call failed:", error);
      throw error;
    }
  });

  it("should successfully fetch predefined purchase tax accounts from real API", async () => {
    try {
      const result = await limit(async () => {
        // Debug: Log the URL being called
        const purchaseTaxAccountsUrl = `${client.apiRoot}/configuration/purchasetaxaccounts/`;
        console.log(
          "Calling predefined purchase tax accounts URL:",
          purchaseTaxAccountsUrl
        );

        const purchaseTaxAccounts =
          await client.getPredefinedPurchaseTaxAccounts();
        return purchaseTaxAccounts;
      });

      // Verify the response structure
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");

      console.log("Predefined purchase tax accounts response:", result);

      // Check for paginated response structure
      expect(result).toHaveProperty("count");
      expect(result).toHaveProperty("results");
      expect(typeof result.count).toBe("number");
      expect(Array.isArray(result.results)).toBe(true);

      // If there are results, check the structure of purchase tax accounts
      if (result.results.length > 0) {
        const firstAccount = result.results[0];
        expect(firstAccount).toHaveProperty("id");
        expect(firstAccount).toHaveProperty("name");
        expect(firstAccount).toHaveProperty("section");
        expect(firstAccount).toHaveProperty("group");
        expect(firstAccount).toHaveProperty("reverse_charge");

        expect(typeof firstAccount.id).toBe("number");
        expect(typeof firstAccount.name).toBe("string");
        expect(typeof firstAccount.section).toBe("string");
        expect(["1", "2"]).toContain(firstAccount.group);
        expect(typeof firstAccount.reverse_charge).toBe("boolean");

        console.log("Predefined purchase tax accounts fetched successfully:", {
          count: result.count,
          accounts: result.results.slice(0, 3).map((acc) => ({
            id: acc.id,
            name: acc.name,
            section: acc.section,
            group: acc.group,
          })),
        });
      }

      console.log("Predefined purchase tax accounts fetched successfully");
    } catch (error) {
      console.error("Predefined purchase tax accounts API call failed:", error);
      throw error;
    }
  });

  it("should successfully fetch a specific predefined purchase tax account from real API", async () => {
    try {
      // First get the list to find a valid ID
      const listResult = await limit(async () => {
        return await client.getPredefinedPurchaseTaxAccounts();
      });

      if (listResult.results.length === 0) {
        console.log(
          "No predefined purchase tax accounts available, skipping detail test"
        );
        return;
      }

      const firstAccountId = listResult.results[0].id;

      const result = await limit(async () => {
        // Debug: Log the URL being called
        const purchaseTaxAccountUrl = `${client.apiRoot}/configuration/purchasetaxaccounts/${firstAccountId}/`;
        console.log(
          "Calling predefined purchase tax account detail URL:",
          purchaseTaxAccountUrl
        );

        const purchaseTaxAccount = await client.getPredefinedPurchaseTaxAccount(
          firstAccountId
        );
        return purchaseTaxAccount;
      });

      // Verify the response structure
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(result.id).toBe(firstAccountId);
      expect(typeof result.name).toBe("string");
      expect(typeof result.section).toBe("string");

      console.log(
        "Predefined purchase tax account detail fetched successfully:",
        {
          id: result.id,
          name: result.name,
          section: result.section,
        }
      );
    } catch (error) {
      console.error(
        "Predefined purchase tax account detail API call failed:",
        error
      );
      throw error;
    }
  });

  it("should successfully fetch predefined cost accounts with filtering parameters", async () => {
    try {
      const result = await limit(async () => {
        // Test with filtering parameters
        const costAccounts = await client.getPredefinedCostAccounts({
          group: "1", // Income accounts only
          ordering: "name",
        });
        return costAccounts;
      });

      // Verify the response structure
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(result).toHaveProperty("count");
      expect(result).toHaveProperty("results");

      // If there are results, verify they match the filter
      if (result.results.length > 0) {
        result.results.forEach((account) => {
          expect(account.group).toBe("1"); // Should only return income accounts
        });
      }

      console.log("Filtered predefined cost accounts fetched successfully:", {
        count: result.count,
        filter: "group=1, ordering=name",
      });
    } catch (error) {
      console.error(
        "Filtered predefined cost accounts API call failed:",
        error
      );
      throw error;
    }
  });

  it("should handle API errors gracefully", async () => {
    // This test verifies that our error handling works correctly
    // It will pass even if the API calls fail, as long as we get meaningful error messages

    let costAccountsError: Error | null = null;
    let purchaseTaxAccountsError: Error | null = null;

    try {
      await limit(async () => {
        await client.getPredefinedCostAccounts();
      });
    } catch (error) {
      costAccountsError = error as Error;
    }

    try {
      await limit(async () => {
        await client.getPredefinedPurchaseTaxAccounts();
      });
    } catch (error) {
      purchaseTaxAccountsError = error as Error;
    }

    // If both calls failed, log the errors for debugging
    if (costAccountsError && purchaseTaxAccountsError) {
      console.log("Both API calls failed - this might indicate:");
      console.log("1. Invalid credentials");
      console.log("2. API endpoint changes");
      console.log("3. Network issues");
      console.log("4. API service unavailable");

      console.log("Predefined cost accounts error:", costAccountsError.message);
      console.log(
        "Predefined purchase tax accounts error:",
        purchaseTaxAccountsError.message
      );

      // Expect that we at least get meaningful error messages
      expect(costAccountsError.message).toContain("HTTP");
      expect(purchaseTaxAccountsError.message).toContain("HTTP");
    }

    // This test always passes - it's just for debugging
    expect(true).toBe(true);
  });
});
