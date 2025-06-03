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

  test("getPredefinedCostAccounts returns paginated cost accounts", async () => {
    const mockResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 120,
          costaccount: 120,
          name: "Einnahmen",
          section: "Betriebseinnahmen",
          group: "1",
          inventory: false,
          index_incometax: ["9040"],
          deductibility_tax_percent: "100.00",
          deductibility_amount_percent: "100.00",
          description: "Alle Einnahmen im Inland",
          active: true,
          purchasetaxaccounts: [{ id: 211, name: "Umsatzsteuer Inland" }],
          counter_booked_bookings: 0,
          counter_open_bookings: 0,
          counter_deleted_bookings: 0,
          counter_bookingtemplates: 0,
        },
      ],
    };

    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => mockResponse,
    });

    const result = await configuration.getPredefinedCostAccounts.call(client);
    expect(result.count).toBe(2);
    expect(result.results[0].name).toBe("Einnahmen");
    expect(result.results[0].group).toBe("1");
  });

  test("getPredefinedCostAccount returns single cost account", async () => {
    const mockResponse = {
      id: 120,
      costaccount: 120,
      name: "Einnahmen",
      section: "Betriebseinnahmen",
      group: "1",
      inventory: false,
      index_incometax: ["9040"],
      deductibility_tax_percent: "100.00",
      deductibility_amount_percent: "100.00",
      description: "Alle Einnahmen im Inland",
      active: true,
      purchasetaxaccounts: [{ id: 211, name: "Umsatzsteuer Inland" }],
      counter_booked_bookings: 0,
      counter_open_bookings: 0,
      counter_deleted_bookings: 0,
      counter_bookingtemplates: 0,
    };

    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => mockResponse,
    });

    const result = await configuration.getPredefinedCostAccount.call(
      client,
      120
    );
    expect(result.id).toBe(120);
    expect(result.name).toBe("Einnahmen");
  });

  test("getPredefinedPurchaseTaxAccounts returns paginated purchase tax accounts", async () => {
    const mockResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 211,
          purchasetaxaccount: 211,
          name: "Umsatzsteuer Inland",
          section: "Inland",
          group: "1",
          reverse_charge: false,
          ic_report: false,
          ic_delivery: false,
          ic_service: false,
          ioss_report: false,
          eu_oss_report: false,
          tax_values: ["20.00", "10.00", "12.00"],
          index_purchasetax: ["000", "022", "025", "029"],
          description: "Dieses Umsatzsteuerkonto verwendest du für Einnahmen",
          active: true,
          counter_booked_bookings: 0,
          counter_open_bookings: 0,
          counter_deleted_bookings: 0,
          counter_bookingtemplates: 0,
        },
      ],
    };

    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => mockResponse,
    });

    const result = await configuration.getPredefinedPurchaseTaxAccounts.call(
      client
    );
    expect(result.count).toBe(2);
    expect(result.results[0].name).toBe("Umsatzsteuer Inland");
    expect(result.results[0].group).toBe("1");
  });

  test("getPredefinedPurchaseTaxAccount returns single purchase tax account", async () => {
    const mockResponse = {
      id: 211,
      purchasetaxaccount: 211,
      name: "Umsatzsteuer Inland",
      section: "Inland",
      group: "1",
      reverse_charge: false,
      ic_report: false,
      ic_delivery: false,
      ic_service: false,
      ioss_report: false,
      eu_oss_report: false,
      tax_values: ["20.00", "10.00", "12.00"],
      index_purchasetax: ["000", "022", "025", "029"],
      description: "Dieses Umsatzsteuerkonto verwendest du für Einnahmen",
      active: true,
      counter_booked_bookings: 0,
      counter_open_bookings: 0,
      counter_deleted_bookings: 0,
      counter_bookingtemplates: 0,
    };

    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => mockResponse,
    });

    const result = await configuration.getPredefinedPurchaseTaxAccount.call(
      client,
      211
    );
    expect(result.id).toBe(211);
    expect(result.name).toBe("Umsatzsteuer Inland");
  });

  test("getPredefinedCostAccounts with filtering parameters", async () => {
    const mockResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [],
    };

    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => mockResponse,
    });

    const result = await configuration.getPredefinedCostAccounts.call(client, {
      group: "1",
      inventory: true,
      ordering: "name",
    });

    // Verify the response structure
    expect(result.count).toBe(1);
    expect(Array.isArray(result.results)).toBe(true);
  });

  test("all endpoints throw on error response", async () => {
    const errorResp = {
      ok: false,
      status: 500,
      text: async () => "server error",
      headers: { get: () => "0" },
    };

    const endpoints = [
      () => configuration.getPredefinedCostAccounts.call(client),
      () => configuration.getPredefinedCostAccount.call(client, 1),
      () => configuration.getPredefinedPurchaseTaxAccounts.call(client),
      () => configuration.getPredefinedPurchaseTaxAccount.call(client, 1),
    ];

    for (const endpoint of endpoints) {
      globalThis.fetch = makeFetchMock(errorResp);
      await expect(endpoint()).rejects.toThrow("HTTP 500");
    }
  });
});
