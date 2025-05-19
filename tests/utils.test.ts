import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { fetchAllPages, sanitizePayload } from "../src/utils";

function makeFetchMockSequence(responses: any[]) {
  let call = 0;
  const fn = async () => responses[call++];
  (fn as any).preconnect = () => Promise.resolve();
  return fn as unknown as typeof fetch;
}

describe("utils", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("fetchAllPages paginates and collects all results", async () => {
    const page1 = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ results: [1, 2], next: "page2" }),
    };
    const page2 = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ results: [3], next: null }),
    };
    const page404 = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };
    globalThis.fetch = makeFetchMockSequence([page1, page2, page404]);
    const result = await fetchAllPages("http://localhost/resource", {
      Authorization: "x",
    });
    expect(result).toEqual([1, 2, 3]);
  });

  test("fetchAllPages handles array response", async () => {
    const arrPage = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => [1, 2, 3],
    };
    const page404 = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };
    globalThis.fetch = makeFetchMockSequence([arrPage, page404]);
    const result = await fetchAllPages("http://localhost/resource", {
      Authorization: "x",
    });
    expect(result).toEqual([1, 2, 3]);
  });

  test("fetchAllPages stops on 404", async () => {
    const page1 = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };
    globalThis.fetch = makeFetchMockSequence([page1]);
    const result = await fetchAllPages("http://localhost/resource", {
      Authorization: "x",
    });
    expect(result).toEqual([]);
  });

  test("fetchAllPages throws on other errors", async () => {
    const page1 = {
      ok: false,
      status: 500,
      text: async () => "server error",
      headers: { get: () => "0" },
    };
    globalThis.fetch = makeFetchMockSequence([page1]);
    await expect(
      fetchAllPages("http://localhost/resource", { Authorization: "x" })
    ).rejects.toThrow("HTTP 500");
  });

  test("sanitizePayload removes null, undefined, and empty strings", () => {
    const input: any = {
      a: 1,
      b: null,
      c: undefined,
      d: "",
      e: {
        f: null,
        g: "value",
        h: "",
        i: {
          j: undefined,
          k: 2,
        },
      },
      arr: [1, null, "", 2, undefined, { x: null, y: 3 }],
    };
    const expected: any = {
      a: 1,
      e: {
        g: "value",
        i: { k: 2 },
      },
      arr: [1, 2, { y: 3 }],
    };
    expect(sanitizePayload(input)).toEqual(expected);
  });

  test("sanitizePayload returns empty object if all fields removed", () => {
    expect(sanitizePayload({ a: null, b: undefined, c: "" } as any)).toEqual(
      {}
    );
  });

  test("sanitizePayload works with arrays of objects", () => {
    const arr: any = [
      { a: 1, b: null },
      { a: null, b: 2 },
      { a: undefined, b: undefined },
    ];
    const result = sanitizePayload(arr).filter(
      (obj: any) => Object.keys(obj).length > 0
    );
    expect(result).toEqual([{ a: 1 }, { b: 2 }]);
  });
});
