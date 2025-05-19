import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { BookamatClient } from "../../src/client";
import * as settings from "../../src/endpoints/settings";

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

describe("endpoints/settings", () => {
  let originalFetch: typeof globalThis.fetch;
  let client: BookamatClient;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    client = new BookamatClient(validOptions);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  for (const fnName of [
    "getBankAccounts",
    "getCostAccounts",
    "getPurchaseTaxAccounts",
    "getCostCentres",
    "getForeignBusinessBases",
    "getGlobalTags",
  ]) {
    test(`${fnName} returns paginated results`, async () => {
      globalThis.fetch = makeFetchMock({
        ok: true,
        status: 200,
        headers: { get: () => "100" },
        json: async () => ({ results: [{ id: 1 }], next: null }),
      });
      const result = await (settings as any)[fnName].call(client, {});
      expect(result.results[0].id).toBe(1);
    });
  }

  for (const fnName of [
    "getBankAccountDetails",
    "getCostAccountDetails",
    "getPurchaseTaxAccountDetails",
    "getCostCentreDetails",
    "getForeignBusinessBaseDetails",
    "getGlobalTagDetails",
  ]) {
    test(`${fnName} returns details`, async () => {
      globalThis.fetch = makeFetchMock({
        ok: true,
        status: 200,
        headers: { get: () => "100" },
        json: async () => ({ id: 2 }),
      });
      const result = await (settings as any)[fnName].call(client, 2);
      expect(result.id).toBe(2);
    });
  }

  test("all endpoints throw on error response", async () => {
    const errorResp = {
      ok: false,
      status: 500,
      text: async () => "server error",
      headers: { get: () => "0" },
    };
    for (const fnName of Object.keys(settings)) {
      if (typeof (settings as any)[fnName] === "function") {
        globalThis.fetch = makeFetchMock(errorResp);
        await expect(
          (settings as any)[fnName].call(client, 1, {})
        ).rejects.toThrow("HTTP 500");
      }
    }
  });
});
