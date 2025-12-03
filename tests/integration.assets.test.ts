import { beforeAll, describe, expect, it } from "bun:test";
import pLimit from "p-limit";
import { BookamatClient } from "../src/client";

// Enforce concurrency limit of 1 to avoid hitting rate limits
const limit = pLimit(1);

describe("Assets Integration Tests", () => {
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
    console.log("Assets integration test configuration:", {
      username,
      year,
      hasApiKey: !!apiKey,
    });
  });

  // --- Asset List Operations ---
  it("should fetch all assets successfully", async () => {
    await limit(async () => {
      const result = await client.getAssets({});

      expect(Array.isArray(result)).toBe(true);
      console.log("All assets fetched successfully:", {
        count: result.length,
        assets: result.slice(0, 3).map((asset) => ({
          id: asset.id,
          name: asset.name,
          acquisition_date: asset.acquisition_date,
        })),
      });

      if (result.length > 0) {
        const firstAsset = result[0];
        expect(firstAsset).toHaveProperty("id");
        expect(firstAsset).toHaveProperty("name");
        expect(firstAsset).toHaveProperty("acquisition_date");
        expect(firstAsset).toHaveProperty("initial_value");

        expect(typeof firstAsset.id).toBe("number");
        expect(typeof firstAsset.name).toBe("string");
        expect(typeof firstAsset.acquisition_date).toBe("string");
        expect(typeof firstAsset.initial_value).toBe("string");
      }
    });
  });

  it("should fetch asset details successfully", async () => {
    await limit(async () => {
      const assets = await client.getAssets({});

      if (assets.length > 0) {
        const assetId = assets[0].id;
        const result = await client.getAssetDetails(assetId);

        expect(result).toHaveProperty("id", assetId);
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("acquisition_date");
        expect(result).toHaveProperty("initial_value");

        console.log("Asset details fetched successfully:", {
          id: result.id,
          name: result.name,
          acquisition_date: result.acquisition_date,
          initial_value: result.initial_value,
        });
      }
    });
  });

  // --- Asset Attachments ---
  it("should fetch asset attachments successfully", async () => {
    await limit(async () => {
      const assets = await client.getAssets({});

      if (assets.length > 0) {
        const assetId = assets[0].id;
        const result = await client.listAssetAttachments({ asset: assetId });

        expect(Array.isArray(result)).toBe(true);
        console.log("Asset attachments fetched successfully:", {
          assetId,
          attachmentCount: result.length,
        });

        if (result.length > 0) {
          const firstAttachment = result[0];
          expect(firstAttachment).toHaveProperty("id");
          expect(firstAttachment).toHaveProperty("asset");
          expect(firstAttachment.asset).toBe(assetId);
        }
      }
    });
  });

  it("should fetch asset attachment details successfully", async () => {
    await limit(async () => {
      const assets = await client.getAssets({});

      if (assets.length > 0) {
        const assetId = assets[0].id;
        const attachments = await client.listAssetAttachments({
          asset: assetId,
        });

        if (attachments.length > 0) {
          const attachmentId = attachments[0].id;
          const result = await client.getAssetAttachmentDetails(attachmentId);

          expect(result).toHaveProperty("id", attachmentId);
          expect(result).toHaveProperty("asset", assetId);

          console.log("Asset attachment details fetched successfully:", {
            id: result.id,
            assetId: result.asset,
          });
        }
      }
    });
  });

  // --- CRUD Operations Integration Tests ---
  // Note: These tests are commented out to avoid modifying production data
  // Uncomment and modify for testing in a safe environment

  /*
  it("should create, update, and delete an asset", async () => {
    await limit(async () => {
      // Create
      const created = await client.createAsset({
        name: "Test Asset",
        acquisition_date: "2024-01-01",
        initial_value: "1000.00",
      });
      
      expect(created).toHaveProperty("id");
      expect(created.name).toBe("Test Asset");
      expect(created.acquisition_date).toBe("2024-01-01");
      expect(created.initial_value).toBe("1000.00");
      
      // Update
      const updated = await client.updateAsset(created.id, {
        name: "Updated Test Asset",
        acquisition_date: "2024-01-02",
        initial_value: "1500.00",
      });
      
      expect(updated.name).toBe("Updated Test Asset");
      expect(updated.acquisition_date).toBe("2024-01-02");
      expect(updated.initial_value).toBe("1500.00");
      
      // Partial Update
      const partiallyUpdated = await client.partiallyUpdateAsset(created.id, {
        name: "Partially Updated Test Asset",
      });
      
      expect(partiallyUpdated.name).toBe("Partially Updated Test Asset");
      
      // Delete
      await client.deleteAsset(created.id);
      
      console.log("Asset CRUD operations completed successfully");
    });
  });

  it("should create, update, and delete asset attachments", async () => {
    await limit(async () => {
      // First create a test asset
      const asset = await client.createAsset({
        name: "Test Asset for Attachments",
        acquisition_date: "2024-01-01",
        initial_value: "500.00",
      });

      // Create attachment
      const created = await client.addAssetAttachment({
        asset: asset.id,
        file: "dGVzdCBhc3NldCBmaWxlIGNvbnRlbnQ=", // base64 encoded "test asset file content"
      });
      
      expect(created).toHaveProperty("id");
      expect(created.asset).toBe(asset.id);
      
      // Update attachment
      const updated = await client.updateAssetAttachment(created.id, {
        file: "dXBkYXRlZCBhc3NldCBmaWxlIGNvbnRlbnQ=", // base64 encoded "updated asset file content"
      });
      
      expect(updated.id).toBe(created.id);
      
      // Partial update attachment
      const partiallyUpdated = await client.partiallyUpdateAssetAttachment(created.id, {
        file: "cGFydGlhbGx5IHVwZGF0ZWQgYXNzZXQgZmlsZQ==", // base64 encoded "partially updated asset file"
      });
      
      expect(partiallyUpdated.id).toBe(created.id);
      
      // Download attachment
      const downloaded = await client.downloadAssetAttachment(created.id);
      expect(downloaded).toHaveProperty("file");
      
      // Delete attachment
      await client.deleteAssetAttachment(created.id);
      
      // Clean up asset
      await client.deleteAsset(asset.id);
      
      console.log("Asset attachment CRUD operations completed successfully");
    });
  });
  */

  // --- Error Handling Tests ---
  it("should handle errors gracefully for all asset endpoints", async () => {
    await limit(async () => {
      // Test with invalid IDs
      const invalidId = 999999;

      // These endpoints throw errors for invalid IDs
      await expect(client.getAssetDetails(invalidId)).rejects.toThrow();
      await expect(
        client.getAssetAttachmentDetails(invalidId)
      ).rejects.toThrow();

      // This endpoint returns empty array for invalid asset ID
      const attachments = await client.listAssetAttachments({
        asset: invalidId,
      });
      expect(attachments).toEqual([]);

      console.log("Asset error handling tests completed successfully");
    });
  });
});
