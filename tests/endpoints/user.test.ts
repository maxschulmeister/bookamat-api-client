import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { BookamatClient } from "../../src/client";
import * as user from "../../src/endpoints/user";

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

describe("endpoints/user", () => {
  let originalFetch: typeof globalThis.fetch;
  let client: BookamatClient;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    client = new BookamatClient(validOptions);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("getUserAccounts returns paginated user accounts", async () => {
    const mockResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 100,
          country: "Österreich",
          year: 2021,
          url: "/at/2021/",
        },
        {
          id: 101,
          country: "Österreich",
          year: 2020,
          url: "/at/2020/",
        },
      ],
    };

    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => mockResponse,
    });

    const result = await user.getUserAccounts.call(client);
    expect(result.count).toBe(2);
    expect(result.results[0].country).toBe("Österreich");
    expect(result.results[0].year).toBe(2021);
  });

  test("getUserAccount returns single user account", async () => {
    const mockResponse = {
      id: 100,
      country: "Österreich",
      year: 2021,
      url: "/at/2021/",
    };

    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => mockResponse,
    });

    const result = await user.getUserAccount.call(client, 100);
    expect(result.id).toBe(100);
    expect(result.country).toBe("Österreich");
    expect(result.year).toBe(2021);
  });

  test("getUserAccounts with filtering parameters", async () => {
    const mockResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 100,
          country: "Österreich",
          year: 2021,
          url: "/at/2021/",
        },
      ],
    };

    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => mockResponse,
    });

    const result = await user.getUserAccounts.call(client, { year: 2021 });
    expect(result.count).toBe(1);
    expect(result.results[0].year).toBe(2021);
  });

  test("getUserSettings returns paginated user settings", async () => {
    const mockResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 100,
          group: "1",
          purchasetax: true,
          purchasetax_range: "1",
          ic_report_range: "1",
          tax_percent: "20.00",
          deductibility_tax_percent: "0.00",
          deductibility_income_percent: "100.00",
        },
      ],
    };

    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => mockResponse,
    });

    const result = await user.getUserSettings.call(client);
    expect(result.count).toBe(1);
    expect(result.results[0].group).toBe("1");
    expect(result.results[0].purchasetax).toBe(true);
    expect(result.results[0].tax_percent).toBe("20.00");
  });

  test("getUserSettingsDetails returns single user settings", async () => {
    const mockResponse = {
      id: 100,
      group: "1",
      purchasetax: true,
      purchasetax_range: "1",
      ic_report_range: "1",
      tax_percent: "20.00",
      deductibility_tax_percent: "0.00",
      deductibility_income_percent: "100.00",
    };

    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => mockResponse,
    });

    const result = await user.getUserSettingsDetails.call(client, 100);
    expect(result.id).toBe(100);
    expect(result.group).toBe("1");
    expect(result.purchasetax).toBe(true);
  });

  test("getUserExemptions returns paginated user exemptions", async () => {
    const mockResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 100,
          exemption_9221: "2500.00",
          exemption_9227: "0.00",
          exemption_9229: "0.00",
          exemption_9276: "0.00",
          exemption_9277: "0.00",
        },
      ],
    };

    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => mockResponse,
    });

    const result = await user.getUserExemptions.call(client);
    expect(result.count).toBe(1);
    expect(result.results[0].exemption_9221).toBe("2500.00");
    expect(result.results[0].exemption_9227).toBe("0.00");
  });

  test("getUserExemptionsDetails returns single user exemptions", async () => {
    const mockResponse = {
      id: 100,
      exemption_9221: "2500.00",
      exemption_9227: "0.00",
      exemption_9229: "0.00",
      exemption_9276: "0.00",
      exemption_9277: "0.00",
    };

    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => mockResponse,
    });

    const result = await user.getUserExemptionsDetails.call(client, 100);
    expect(result.id).toBe(100);
    expect(result.exemption_9221).toBe("2500.00");
    expect(result.exemption_9277).toBe("0.00");
  });

  test("all endpoints throw on error response", async () => {
    const errorResp = {
      ok: false,
      status: 500,
      text: async () => "server error",
      headers: { get: () => "0" },
    };

    const endpoints = [
      () => user.getUserAccounts.call(client),
      () => user.getUserAccount.call(client, 1),
      () => user.getUserSettings.call(client),
      () => user.getUserSettingsDetails.call(client, 1),
      () => user.getUserExemptions.call(client),
      () => user.getUserExemptionsDetails.call(client, 1),
    ];

    for (const endpoint of endpoints) {
      globalThis.fetch = makeFetchMock(errorResp);
      await expect(endpoint()).rejects.toThrow("HTTP 500");
    }
  });
});
