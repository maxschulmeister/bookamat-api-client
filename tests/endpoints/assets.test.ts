import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { BookamatClient } from "../../src/client";
import * as assets from "../../src/endpoints/assets";

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

describe("endpoints/assets", () => {
  let originalFetch: typeof globalThis.fetch;
  let client: BookamatClient;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    client = new BookamatClient(validOptions);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("getAssets returns paginated assets", async () => {
    const assetsPage = {
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
    globalThis.fetch = makeFetchMockSequence([assetsPage, emptyPage]);
    const result = await assets.getAssets.call(client, {});
    expect(result[0].id).toBe(1);
  });

  test("createAsset posts and returns asset", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 201,
      headers: { get: () => "100" },
      json: async () => ({ id: 2, name: "Asset" }),
    });
    const result = await assets.createAsset.call(client, {
      name: "Asset",
      acquisition_date: "2024-01-01",
      initial_value: "100",
    });
    expect(result.id).toBe(2);
  });

  test("getAssetDetails returns asset", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 3 }),
    });
    const result = await assets.getAssetDetails.call(client, 3);
    expect(result.id).toBe(3);
  });

  test("updateAsset puts and returns asset", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 4 }),
    });
    const result = await assets.updateAsset.call(client, 4, {
      name: "Updated",
    });
    expect(result.id).toBe(4);
  });

  test("partiallyUpdateAsset patches and returns asset", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 5 }),
    });
    const result = await assets.partiallyUpdateAsset.call(client, 5, {
      name: "Partial",
    });
    expect(result.id).toBe(5);
  });

  test("deleteAsset calls DELETE and returns void", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 204,
      headers: { get: () => "0" },
      json: async () => undefined,
    });
    const result = await assets.deleteAsset.call(client, 6);
    expect(result).toBeUndefined();
  });

  test("listAssetAttachments returns attachments", async () => {
    const attachmentsPage = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ results: [{ id: 7 }], next: null }),
    };
    const emptyPage = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };
    globalThis.fetch = makeFetchMockSequence([attachmentsPage, emptyPage]);
    const result = await assets.listAssetAttachments.call(client, { asset: 1 });
    expect(result[0].id).toBe(7);
  });

  test("addAssetAttachment posts and returns attachment", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 201,
      headers: { get: () => "100" },
      json: async () => ({ id: 8 }),
    });
    const result = await assets.addAssetAttachment.call(client, {
      asset: 1,
      file: "base64",
    });
    expect(result.id).toBe(8);
  });

  test("getAssetAttachmentDetails returns attachment", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 9 }),
    });
    const result = await assets.getAssetAttachmentDetails.call(client, 9);
    expect(result.id).toBe(9);
  });

  test("updateAssetAttachment puts and returns attachment", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 10 }),
    });
    const result = await assets.updateAssetAttachment.call(client, 10, {
      file: "base64",
    });
    expect(result.id).toBe(10);
  });

  test("partiallyUpdateAssetAttachment patches and returns attachment", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 11 }),
    });
    const result = await assets.partiallyUpdateAssetAttachment.call(
      client,
      11,
      { file: "base64" }
    );
    expect(result.id).toBe(11);
  });

  test("deleteAssetAttachment calls DELETE and returns void", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 204,
      headers: { get: () => "0" },
      json: async () => undefined,
    });
    const result = await assets.deleteAssetAttachment.call(client, 12);
    expect(result).toBeUndefined();
  });

  test("downloadAssetAttachment returns file string", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ file: "base64string" }),
    });
    const result = await assets.downloadAssetAttachment.call(client, 13);
    expect(result.file).toBe("base64string");
  });

  test("downloadAssetAttachment throws if file missing", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({}),
    });
    await expect(
      assets.downloadAssetAttachment.call(client, 14)
    ).rejects.toThrow();
  });

  test("all endpoints throw on error response", async () => {
    const errorResp = {
      ok: false,
      status: 500,
      text: async () => "server error",
      headers: { get: () => "0" },
    };
    for (const fnName of Object.keys(assets)) {
      if (typeof (assets as any)[fnName] === "function") {
        globalThis.fetch = makeFetchMock(errorResp);
        // Some endpoints expect void, some expect object
        await expect(
          (assets as any)[fnName].call(client, 1, {})
        ).rejects.toThrow("HTTP 500");
      }
    }
  });
});
