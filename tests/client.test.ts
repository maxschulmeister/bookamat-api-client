import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { BookamatClient } from "../src/client";
import * as assetEndpoints from "../src/endpoints/assets";
import * as bookingEndpoints from "../src/endpoints/bookings";
import * as configurationEndpoints from "../src/endpoints/configuration";
import * as settingsEndpoints from "../src/endpoints/settings";
import * as helperMethods from "../src/helpers";

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

describe("BookamatClient", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("constructor throws if required options are missing", () => {
    expect(
      () => new BookamatClient({ username: "a", apiKey: "b" } as any)
    ).toThrow();
    expect(
      () => new BookamatClient({ year: "2024", apiKey: "b" } as any)
    ).toThrow();
    expect(
      () => new BookamatClient({ year: "2024", username: "a" } as any)
    ).toThrow();
  });

  test("constructor sets defaults", () => {
    const client = new BookamatClient(validOptions);
    expect(client.year).toBe("2024");
    expect(client.username).toBe("testuser");
    expect(client.country).toBe("at");
    expect(client.baseUrl).toBe("https://www.bookamat.com/api/v1");
  });

  test("constructor allows custom country and baseUrl", () => {
    const client = new BookamatClient({
      ...validOptions,
      country: "de",
      baseUrl: "http://localhost",
    });
    expect(client.country).toBe("de");
    expect(client.baseUrl).toBe("http://localhost");
  });

  test("apiRoot and requestHeaders are correct", () => {
    const client = new BookamatClient(validOptions);
    expect(client.apiRoot).toContain(client.baseUrl);
    expect(client.apiRoot).toContain(client.country);
    expect(client.apiRoot).toContain(client.year);
    expect(client.requestHeaders.Authorization).toContain(client.username);
    expect(client.requestHeaders.Authorization).toContain(validOptions.apiKey);
    expect(client.requestHeaders["Content-Type"]).toBe("application/json");
    expect(client.requestHeaders.Accept).toBe("application/json");
  });

  test("request throws on non-ok response and returns JSON on ok", async () => {
    const client = new BookamatClient(validOptions);
    // ok response
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "10" },
      json: async () => ({ foo: "bar" }),
    });
    const result = await client.request("http://test", { method: "GET" });
    expect(result).toEqual({ foo: "bar" });
    // error response
    globalThis.fetch = makeFetchMock({
      ok: false,
      status: 400,
      text: async () => "bad request",
      headers: { get: () => "10" },
    });
    await expect(
      client.request("http://fail", { method: "GET" })
    ).rejects.toThrow("HTTP 400");
    // 204 No Content
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 204,
      headers: { get: () => "0" },
      json: async () => undefined,
    });
    const empty = await client.request("http://empty", { method: "DELETE" });
    expect(empty).toBeUndefined();
  });

  test("has all expected endpoint and helper methods as functions", () => {
    const client = new BookamatClient(validOptions);
    const methodSources = [
      configurationEndpoints,
      settingsEndpoints,
      bookingEndpoints,
      assetEndpoints,
      helperMethods,
    ];
    for (const mod of methodSources) {
      for (const fnName of Object.keys(mod)) {
        if (typeof (mod as any)[fnName] === "function") {
          expect(typeof (client as any)[fnName]).toBe("function");
        }
      }
    }
  });
});
