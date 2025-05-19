import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { BookamatClient } from "../../src/client";
import * as configuration from "../../src/endpoints/configuration";

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

describe("endpoints/configuration", () => {
  let originalFetch: typeof globalThis.fetch;
  let client: BookamatClient;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    client = new BookamatClient(validOptions);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("getConfiguration returns configuration", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ config: true }),
    });
    const result = await configuration.getConfiguration.call(client);
    expect(result.config).toBe(true);
  });

  test("getUser returns user", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ id: 1, username: "testuser" }),
    });
    const result = await configuration.getUser.call(client);
    expect(result.username).toBe("testuser");
  });

  test("all endpoints throw on error response", async () => {
    const errorResp = {
      ok: false,
      status: 500,
      text: async () => "server error",
      headers: { get: () => "0" },
    };
    for (const fnName of Object.keys(configuration)) {
      if (typeof (configuration as any)[fnName] === "function") {
        globalThis.fetch = makeFetchMock(errorResp);
        await expect(
          (configuration as any)[fnName].call(client)
        ).rejects.toThrow("HTTP 500");
      }
    }
  });
});
