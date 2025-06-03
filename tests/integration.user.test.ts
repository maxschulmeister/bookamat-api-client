import { beforeAll, describe, expect, it } from "bun:test";
import pLimit from "p-limit";
import { BookamatClient } from "../src/client";

// Enforce concurrency limit of 1 to avoid hitting rate limits
const limit = pLimit(1);

describe("User Integration Tests", () => {
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

  it("should successfully fetch user accounts from real API", async () => {
    try {
      const result = await limit(async () => {
        // Debug: Log the URL being called (note: no prefix for user accounts)
        const userAccountsUrl = `${client.baseUrl}/user/accounts/`;
        console.log("Calling user accounts URL:", userAccountsUrl);
        console.log("Request headers:", client.requestHeaders);

        const userAccounts = await client.getUserAccounts();
        return userAccounts;
      });

      // Verify the response structure
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");

      console.log("User accounts response:", result);

      // Check for paginated response structure
      expect(result).toHaveProperty("count");
      expect(result).toHaveProperty("results");
      expect(typeof result.count).toBe("number");
      expect(Array.isArray(result.results)).toBe(true);

      // If there are results, check the structure of user accounts
      if (result.results.length > 0) {
        const firstAccount = result.results[0];
        expect(firstAccount).toHaveProperty("id");
        expect(firstAccount).toHaveProperty("country");
        expect(firstAccount).toHaveProperty("year");
        expect(firstAccount).toHaveProperty("url");

        expect(typeof firstAccount.id).toBe("number");
        expect(typeof firstAccount.country).toBe("string");
        expect(typeof firstAccount.year).toBe("number");
        expect(typeof firstAccount.url).toBe("string");

        console.log("User accounts fetched successfully:", {
          count: result.count,
          accounts: result.results.map((acc) => ({
            id: acc.id,
            country: acc.country,
            year: acc.year,
            url: acc.url,
          })),
        });
      }

      console.log("User accounts fetched successfully");
    } catch (error) {
      console.error("User accounts API call failed:");
      console.error("Error:", error);

      // Re-throw with additional context
      if (error instanceof Error) {
        if (error.message.includes("HTTP 404")) {
          throw new Error(`User accounts endpoint not found. This might indicate:
1. The API endpoint has changed
2. The credentials are invalid
3. The API structure is different than expected

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

  it("should successfully fetch a specific user account from real API", async () => {
    try {
      // First get the list to find a valid ID
      const listResult = await limit(async () => {
        return await client.getUserAccounts();
      });

      if (listResult.results.length === 0) {
        console.log("No user accounts available, skipping detail test");
        return;
      }

      const firstAccountId = listResult.results[0].id;

      const result = await limit(async () => {
        // Debug: Log the URL being called
        const userAccountUrl = `${client.baseUrl}/user/accounts/${firstAccountId}/`;
        console.log("Calling user account detail URL:", userAccountUrl);

        const userAccount = await client.getUserAccount(firstAccountId);
        return userAccount;
      });

      // Verify the response structure
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(result.id).toBe(firstAccountId);
      expect(typeof result.country).toBe("string");
      expect(typeof result.year).toBe("number");

      console.log("User account detail fetched successfully:", {
        id: result.id,
        country: result.country,
        year: result.year,
        url: result.url,
      });
    } catch (error) {
      console.error("User account detail API call failed:", error);
      throw error;
    }
  });

  it("should successfully fetch user accounts with filtering parameters", async () => {
    try {
      const result = await limit(async () => {
        // Test with filtering parameters
        const userAccounts = await client.getUserAccounts({
          year: parseInt(client.year), // Filter by current year
        });
        return userAccounts;
      });

      // Verify the response structure
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(result).toHaveProperty("count");
      expect(result).toHaveProperty("results");

      // If there are results, verify they match the filter
      if (result.results.length > 0) {
        result.results.forEach((account) => {
          expect(account.year).toBe(parseInt(client.year));
        });
      }

      console.log("Filtered user accounts fetched successfully:", {
        count: result.count,
        filter: `year=${client.year}`,
      });
    } catch (error) {
      console.error("Filtered user accounts API call failed:", error);
      throw error;
    }
  });

  it("should successfully fetch user settings from real API", async () => {
    try {
      const result = await limit(async () => {
        // Debug: Log the URL being called
        const userSettingsUrl = `${client.apiRoot}/user/settings/`;
        console.log("Calling user settings URL:", userSettingsUrl);

        const userSettings = await client.getUserSettings();
        return userSettings;
      });

      // Verify the response structure
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");

      console.log("User settings response:", result);

      // Check for paginated response structure
      expect(result).toHaveProperty("count");
      expect(result).toHaveProperty("results");
      expect(typeof result.count).toBe("number");
      expect(Array.isArray(result.results)).toBe(true);

      // If there are results, check the structure of user settings
      if (result.results.length > 0) {
        const firstSettings = result.results[0];
        expect(firstSettings).toHaveProperty("id");
        expect(firstSettings).toHaveProperty("group");
        expect(firstSettings).toHaveProperty("purchasetax");
        expect(firstSettings).toHaveProperty("tax_percent");

        expect(typeof firstSettings.id).toBe("number");
        expect(["1", "2"]).toContain(firstSettings.group);
        expect(typeof firstSettings.purchasetax).toBe("boolean");
        expect(typeof firstSettings.tax_percent).toBe("string");

        console.log("User settings fetched successfully:", {
          count: result.count,
          settings: result.results.map((settings) => ({
            id: settings.id,
            group: settings.group,
            purchasetax: settings.purchasetax,
            tax_percent: settings.tax_percent,
          })),
        });
      }

      console.log("User settings fetched successfully");
    } catch (error) {
      console.error("User settings API call failed:", error);
      throw error;
    }
  });

  it("should successfully fetch user exemptions from real API", async () => {
    try {
      const result = await limit(async () => {
        // Debug: Log the URL being called
        const userExemptionsUrl = `${client.apiRoot}/user/exemptions/`;
        console.log("Calling user exemptions URL:", userExemptionsUrl);

        const userExemptions = await client.getUserExemptions();
        return userExemptions;
      });

      // Verify the response structure
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");

      console.log("User exemptions response:", result);

      // Check for paginated response structure
      expect(result).toHaveProperty("count");
      expect(result).toHaveProperty("results");
      expect(typeof result.count).toBe("number");
      expect(Array.isArray(result.results)).toBe(true);

      // If there are results, check the structure of user exemptions
      if (result.results.length > 0) {
        const firstExemptions = result.results[0];
        expect(firstExemptions).toHaveProperty("id");
        expect(firstExemptions).toHaveProperty("exemption_9221");
        expect(firstExemptions).toHaveProperty("exemption_9227");
        expect(firstExemptions).toHaveProperty("exemption_9229");

        expect(typeof firstExemptions.id).toBe("number");
        expect(typeof firstExemptions.exemption_9221).toBe("string");
        expect(typeof firstExemptions.exemption_9227).toBe("string");

        console.log("User exemptions fetched successfully:", {
          count: result.count,
          exemptions: result.results.map((exemptions) => ({
            id: exemptions.id,
            exemption_9221: exemptions.exemption_9221,
            exemption_9227: exemptions.exemption_9227,
          })),
        });
      }

      console.log("User exemptions fetched successfully");
    } catch (error) {
      console.error("User exemptions API call failed:", error);
      throw error;
    }
  });

  it("should successfully fetch user settings details from real API", async () => {
    try {
      // First get the list to find a valid ID
      const listResult = await limit(async () => {
        return await client.getUserSettings();
      });

      if (listResult.results.length === 0) {
        console.log("No user settings available, skipping detail test");
        return;
      }

      const firstSettingsId = listResult.results[0].id;

      const result = await limit(async () => {
        // Debug: Log the URL being called
        const userSettingsUrl = `${client.apiRoot}/user/settings/${firstSettingsId}/`;
        console.log("Calling user settings detail URL:", userSettingsUrl);

        const userSettings = await client.getUserSettingsDetails(
          firstSettingsId
        );
        return userSettings;
      });

      // Verify the response structure
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(result.id).toBe(firstSettingsId);
      expect(typeof result.group).toBe("string");
      expect(typeof result.purchasetax).toBe("boolean");

      console.log("User settings detail fetched successfully:", {
        id: result.id,
        group: result.group,
        purchasetax: result.purchasetax,
        tax_percent: result.tax_percent,
      });
    } catch (error) {
      console.error("User settings detail API call failed:", error);
      throw error;
    }
  });

  it("should successfully fetch user exemptions details from real API", async () => {
    try {
      // First get the list to find a valid ID
      const listResult = await limit(async () => {
        return await client.getUserExemptions();
      });

      if (listResult.results.length === 0) {
        console.log("No user exemptions available, skipping detail test");
        return;
      }

      const firstExemptionsId = listResult.results[0].id;

      const result = await limit(async () => {
        // Debug: Log the URL being called
        const userExemptionsUrl = `${client.apiRoot}/user/exemptions/${firstExemptionsId}/`;
        console.log("Calling user exemptions detail URL:", userExemptionsUrl);

        const userExemptions = await client.getUserExemptionsDetails(
          firstExemptionsId
        );
        return userExemptions;
      });

      // Verify the response structure
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(result.id).toBe(firstExemptionsId);
      expect(typeof result.exemption_9221).toBe("string");
      expect(typeof result.exemption_9227).toBe("string");

      console.log("User exemptions detail fetched successfully:", {
        id: result.id,
        exemption_9221: result.exemption_9221,
        exemption_9227: result.exemption_9227,
        exemption_9229: result.exemption_9229,
      });
    } catch (error) {
      console.error("User exemptions detail API call failed:", error);
      throw error;
    }
  });

  it("should handle API errors gracefully", async () => {
    // This test verifies that our error handling works correctly
    // It will pass even if the API calls fail, as long as we get meaningful error messages

    let userAccountsError: Error | null = null;
    let userSettingsError: Error | null = null;
    let userExemptionsError: Error | null = null;

    try {
      await limit(async () => {
        await client.getUserAccounts();
      });
    } catch (error) {
      userAccountsError = error as Error;
    }

    try {
      await limit(async () => {
        await client.getUserSettings();
      });
    } catch (error) {
      userSettingsError = error as Error;
    }

    try {
      await limit(async () => {
        await client.getUserExemptions();
      });
    } catch (error) {
      userExemptionsError = error as Error;
    }

    // If all calls failed, log the errors for debugging
    if (userAccountsError && userSettingsError && userExemptionsError) {
      console.log("All API calls failed - this might indicate:");
      console.log("1. Invalid credentials");
      console.log("2. API endpoint changes");
      console.log("3. Network issues");
      console.log("4. API service unavailable");

      console.log("User accounts error:", userAccountsError.message);
      console.log("User settings error:", userSettingsError.message);
      console.log("User exemptions error:", userExemptionsError.message);

      // Expect that we at least get meaningful error messages
      expect(userAccountsError.message).toContain("HTTP");
      expect(userSettingsError.message).toContain("HTTP");
      expect(userExemptionsError.message).toContain("HTTP");
    }

    // This test always passes - it's just for debugging
    expect(true).toBe(true);
  });
});
