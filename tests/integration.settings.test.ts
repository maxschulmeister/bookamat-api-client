import { beforeAll, describe, expect, it } from "bun:test";
import pLimit from "p-limit";
import { BookamatClient } from "../src/client";

// Enforce concurrency limit of 1 to avoid hitting rate limits
const limit = pLimit(1);

describe("Settings Integration Tests", () => {
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
    console.log("Integration test configuration:", {
      username,
      year,
      hasApiKey: !!apiKey,
    });
  });

  // --- Bank Accounts Integration Tests ---
  it("should fetch bank accounts successfully", async () => {
    await limit(async () => {
      const result = await client.getBankAccounts();

      expect(Array.isArray(result)).toBe(true);
      console.log("Bank accounts fetched successfully:", {
        count: result.length,
        accounts: result.slice(0, 3).map((acc) => ({
          id: acc.id,
          name: acc.name,
          position: acc.position,
        })),
      });

      if (result.length > 0) {
        const firstAccount = result[0];
        expect(firstAccount).toHaveProperty("id");
        expect(firstAccount).toHaveProperty("name");
        expect(firstAccount).toHaveProperty("position");
        expect(firstAccount).toHaveProperty("flag_balance");
        expect(firstAccount).toHaveProperty("opening_balance");

        expect(typeof firstAccount.id).toBe("number");
        expect(typeof firstAccount.name).toBe("string");
        expect(typeof firstAccount.position).toBe("number");
        expect(typeof firstAccount.flag_balance).toBe("boolean");
        expect(typeof firstAccount.opening_balance).toBe("string");
      }
    });
  });

  it("should fetch bank account details successfully", async () => {
    await limit(async () => {
      const accounts = await client.getBankAccounts();

      if (accounts.length > 0) {
        const accountId = accounts[0].id;
        const result = await client.getBankAccountDetails(accountId);

        expect(result).toHaveProperty("id", accountId);
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("position");
        expect(result).toHaveProperty("flag_balance");
        expect(result).toHaveProperty("opening_balance");

        console.log("Bank account details fetched successfully:", {
          id: result.id,
          name: result.name,
          position: result.position,
        });
      }
    });
  });

  // --- Cost Accounts Integration Tests ---
  it("should fetch cost accounts successfully", async () => {
    await limit(async () => {
      const result = await client.getCostAccounts();

      expect(Array.isArray(result)).toBe(true);
      console.log("Cost accounts fetched successfully:", {
        count: result.length,
        accounts: result.slice(0, 3).map((acc) => ({
          id: acc.id,
          name: acc.name,
          section: acc.section,
          group: acc.group,
        })),
      });

      if (result.length > 0) {
        const firstAccount = result[0];
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
      }
    });
  });

  it("should fetch cost account details successfully", async () => {
    await limit(async () => {
      const accounts = await client.getCostAccounts();

      if (accounts.length > 0) {
        const accountId = accounts[0].id;
        const result = await client.getCostAccountDetails(accountId);

        expect(result).toHaveProperty("id", accountId);
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("section");
        expect(result).toHaveProperty("group");
        expect(result).toHaveProperty("inventory");

        console.log("Cost account details fetched successfully:", {
          id: result.id,
          name: result.name,
          section: result.section,
          group: result.group,
        });
      }
    });
  });

  // --- Purchase Tax Accounts Integration Tests ---
  it("should fetch purchase tax accounts successfully", async () => {
    await limit(async () => {
      const result = await client.getPurchaseTaxAccounts();

      expect(Array.isArray(result)).toBe(true);
      console.log("Purchase tax accounts fetched successfully:", {
        count: result.length,
        accounts: result.slice(0, 3).map((acc) => ({
          id: acc.id,
          name: acc.name,
          section: acc.section,
          group: acc.group,
        })),
      });

      if (result.length > 0) {
        const firstAccount = result[0];
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
      }
    });
  });

  it("should fetch purchase tax account details successfully", async () => {
    await limit(async () => {
      const accounts = await client.getPurchaseTaxAccounts();

      if (accounts.length > 0) {
        const accountId = accounts[0].id;
        const result = await client.getPurchaseTaxAccountDetails(accountId);

        expect(result).toHaveProperty("id", accountId);
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("section");
        expect(result).toHaveProperty("group");
        expect(result).toHaveProperty("reverse_charge");

        console.log("Purchase tax account details fetched successfully:", {
          id: result.id,
          name: result.name,
          section: result.section,
          group: result.group,
        });
      }
    });
  });

  // --- Cost Centres Integration Tests ---
  it("should fetch cost centres successfully", async () => {
    await limit(async () => {
      const result = await client.getCostCentres();

      expect(Array.isArray(result)).toBe(true);
      console.log("Cost centres fetched successfully:", {
        count: result.length,
        centres: result.slice(0, 3).map((centre) => ({
          id: centre.id,
          name: centre.name,
          position: centre.position,
        })),
      });

      if (result.length > 0) {
        const firstCentre = result[0];
        expect(firstCentre).toHaveProperty("id");
        expect(firstCentre).toHaveProperty("name");
        expect(firstCentre).toHaveProperty("position");

        expect(typeof firstCentre.id).toBe("number");
        expect(typeof firstCentre.name).toBe("string");
        expect(typeof firstCentre.position).toBe("number");
      }
    });
  });

  it("should fetch cost centre details successfully", async () => {
    await limit(async () => {
      const centres = await client.getCostCentres();

      if (centres.length > 0) {
        const centreId = centres[0].id;
        const result = await client.getCostCentreDetails(centreId);

        expect(result).toHaveProperty("id", centreId);
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("position");

        console.log("Cost centre details fetched successfully:", {
          id: result.id,
          name: result.name,
          position: result.position,
        });
      }
    });
  });

  // --- Foreign Business Bases Integration Tests ---
  it("should fetch foreign business bases successfully", async () => {
    await limit(async () => {
      const result = await client.getForeignBusinessBases();

      expect(Array.isArray(result)).toBe(true);
      console.log("Foreign business bases fetched successfully:", {
        count: result.length,
        bases: result.slice(0, 3).map((base) => ({
          id: base.id,
          name: base.name,
          position: base.position,
        })),
      });

      if (result.length > 0) {
        const firstBase = result[0];
        expect(firstBase).toHaveProperty("id");
        expect(firstBase).toHaveProperty("name");
        expect(firstBase).toHaveProperty("position");

        expect(typeof firstBase.id).toBe("number");
        expect(typeof firstBase.name).toBe("string");
        expect(typeof firstBase.position).toBe("number");
      }
    });
  });

  it("should fetch foreign business base details successfully", async () => {
    await limit(async () => {
      const bases = await client.getForeignBusinessBases();

      if (bases.length > 0) {
        const baseId = bases[0].id;
        const result = await client.getForeignBusinessBaseDetails(baseId);

        expect(result).toHaveProperty("id", baseId);
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("position");

        console.log("Foreign business base details fetched successfully:", {
          id: result.id,
          name: result.name,
          position: result.position,
        });
      }
    });
  });

  // --- Global Tags Integration Tests ---
  it("should fetch global tags successfully", async () => {
    await limit(async () => {
      const result = await client.getGlobalTags();

      expect(Array.isArray(result)).toBe(true);
      console.log("Global tags fetched successfully:", {
        count: result.length,
        tags: result.slice(0, 3).map((tag) => ({
          id: tag.id,
          name: tag.name,
          position: tag.position,
        })),
      });

      if (result.length > 0) {
        const firstTag = result[0];
        expect(firstTag).toHaveProperty("id");
        expect(firstTag).toHaveProperty("name");
        expect(firstTag).toHaveProperty("position");

        expect(typeof firstTag.id).toBe("number");
        expect(typeof firstTag.name).toBe("string");
        expect(typeof firstTag.position).toBe("number");
      }
    });
  });

  it("should fetch global tag details successfully", async () => {
    await limit(async () => {
      const tags = await client.getGlobalTags();

      if (tags.length > 0) {
        const tagId = tags[0].id;
        const result = await client.getGlobalTagDetails(tagId);

        expect(result).toHaveProperty("id", tagId);
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("position");

        console.log("Global tag details fetched successfully:", {
          id: result.id,
          name: result.name,
          position: result.position,
        });
      }
    });
  });

  // --- CRUD Operations Integration Tests ---
  // Note: These tests are commented out to avoid modifying production data
  // Uncomment and modify for testing in a safe environment

  /*
  it("should create, update, and delete a bank account", async () => {
    await limit(async () => {
      // Create
      const created = await client.createBankAccount({
        name: "Test Bank Account",
        flag_balance: false,
        opening_balance: "0.00",
      });

      expect(created).toHaveProperty("id");
      expect(created.name).toBe("Test Bank Account");

      // Update
      const updated = await client.updateBankAccount(created.id, {
        name: "Updated Test Bank Account",
        flag_balance: true,
      });

      expect(updated.name).toBe("Updated Test Bank Account");
      expect(updated.flag_balance).toBe(true);

      // Replace
      const replaced = await client.replaceBankAccount(created.id, {
        name: "Replaced Test Bank Account",
        flag_balance: false,
        opening_balance: "100.00",
      });

      expect(replaced.name).toBe("Replaced Test Bank Account");
      expect(replaced.flag_balance).toBe(false);
      expect(replaced.opening_balance).toBe("100.00");

      // Delete
      await client.deleteBankAccount(created.id);

      console.log("Bank account CRUD operations completed successfully");
    });
  });

  it("should create, update, and delete a cost centre", async () => {
    await limit(async () => {
      // Create
      const created = await client.createCostCentre({
        name: "Test Cost Centre",
      });

      expect(created).toHaveProperty("id");
      expect(created.name).toBe("Test Cost Centre");

      // Update
      const updated = await client.updateCostCentre(created.id, {
        name: "Updated Test Cost Centre",
      });

      expect(updated.name).toBe("Updated Test Cost Centre");

      // Replace
      const replaced = await client.replaceCostCentre(created.id, {
        name: "Replaced Test Cost Centre",
        position: 5,
      });

      expect(replaced.name).toBe("Replaced Test Cost Centre");
      expect(replaced.position).toBe(5);

      // Delete
      await client.deleteCostCentre(created.id);

      console.log("Cost centre CRUD operations completed successfully");
    });
  });

  it("should create, update, and delete a foreign business base", async () => {
    await limit(async () => {
      // Create
      const created = await client.createForeignBusinessBase({
        name: "Test Foreign Business Base",
      });

      expect(created).toHaveProperty("id");
      expect(created.name).toBe("Test Foreign Business Base");

      // Update
      const updated = await client.updateForeignBusinessBase(created.id, {
        name: "Updated Test Foreign Business Base",
      });

      expect(updated.name).toBe("Updated Test Foreign Business Base");

      // Replace
      const replaced = await client.replaceForeignBusinessBase(created.id, {
        name: "Replaced Test Foreign Business Base",
        position: 3,
      });

      expect(replaced.name).toBe("Replaced Test Foreign Business Base");
      expect(replaced.position).toBe(3);

      // Delete
      await client.deleteForeignBusinessBase(created.id);

      console.log(
        "Foreign business base CRUD operations completed successfully"
      );
    });
  });

  it("should create, update, and delete a global tag", async () => {
    await limit(async () => {
      // Create
      const created = await client.createGlobalTag({
        name: "Test Global Tag",
      });

      expect(created).toHaveProperty("id");
      expect(created.name).toBe("Test Global Tag");

      // Update
      const updated = await client.updateGlobalTag(created.id, {
        name: "Updated Test Global Tag",
      });

      expect(updated.name).toBe("Updated Test Global Tag");

      // Replace
      const replaced = await client.replaceGlobalTag(created.id, {
        name: "Replaced Test Global Tag",
        position: 10,
      });

      expect(replaced.name).toBe("Replaced Test Global Tag");
      expect(replaced.position).toBe(10);

      // Delete
      await client.deleteGlobalTag(created.id);

      console.log("Global tag CRUD operations completed successfully");
    });
  });

  it("should activate and delete cost accounts", async () => {
    await limit(async () => {
      // Get predefined cost accounts to find one to activate
      const predefinedAccounts = await client.getPredefinedCostAccounts();

      if (predefinedAccounts.results.length > 0) {
        // Find an inactive account to activate
        const inactiveAccount = predefinedAccounts.results.find(
          (acc) => !acc.active
        );

        if (inactiveAccount) {
          // Activate
          const activated = await client.activateCostAccount({
            costaccount: inactiveAccount.costaccount,
          });

          expect(activated).toHaveProperty("id");
          expect(activated.active).toBe(true);

          // Delete (deactivate)
          await client.deleteCostAccount(activated.id);

          console.log(
            "Cost account activate/delete operations completed successfully"
          );
        } else {
          console.log("No inactive cost accounts found to test activation");
        }
      }
    });
  });

  it("should activate and delete purchase tax accounts", async () => {
    await limit(async () => {
      // Get predefined purchase tax accounts to find one to activate
      const predefinedAccounts =
        await client.getPredefinedPurchaseTaxAccounts();

      if (predefinedAccounts.results.length > 0) {
        // Find an inactive account to activate
        const inactiveAccount = predefinedAccounts.results.find(
          (acc) => !acc.active
        );

        if (inactiveAccount) {
          // Activate
          const activated = await client.activatePurchaseTaxAccount({
            purchasetaxaccount: inactiveAccount.purchasetaxaccount,
          });

          expect(activated).toHaveProperty("id");
          expect(activated.active).toBe(true);

          // Delete (deactivate)
          await client.deletePurchaseTaxAccount(activated.id);

          console.log(
            "Purchase tax account activate/delete operations completed successfully"
          );
        } else {
          console.log(
            "No inactive purchase tax accounts found to test activation"
          );
        }
      }
    });
  });
  */

  // --- Error Handling Tests ---
  it("should handle errors gracefully for all endpoints", async () => {
    await limit(async () => {
      // Test with invalid IDs that should return 404 errors
      const invalidId = 999999;

      await expect(client.getBankAccountDetails(invalidId)).rejects.toThrow();
      await expect(client.getCostAccountDetails(invalidId)).rejects.toThrow();
      await expect(
        client.getPurchaseTaxAccountDetails(invalidId)
      ).rejects.toThrow();
      await expect(client.getCostCentreDetails(invalidId)).rejects.toThrow();
      await expect(
        client.getForeignBusinessBaseDetails(invalidId)
      ).rejects.toThrow();
      await expect(client.getGlobalTagDetails(invalidId)).rejects.toThrow();

      console.log("Error handling tests completed successfully");
    });
  });
});
