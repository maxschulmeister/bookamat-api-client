import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { BookamatClient } from "../src/client";
import { getAllAccounts, getAllBookings } from "../src/helpers";

const validOptions = {
  year: "2024",
  username: "testuser",
  apiKey: "testkey",
};

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

describe("helpers", () => {
  let originalFetch: typeof globalThis.fetch;
  let client: BookamatClient;
  let costAccountsSpy: any;
  let bankAccountsSpy: any;
  let purchaseTaxAccountsSpy: any;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    client = new BookamatClient(validOptions);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (costAccountsSpy) costAccountsSpy.mockRestore();
    if (bankAccountsSpy) bankAccountsSpy.mockRestore();
    if (purchaseTaxAccountsSpy) purchaseTaxAccountsSpy.mockRestore();
  });

  test("getAllBookings returns all bookings from paginated API", async () => {
    const bookingsPage1 = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ results: [{ id: 1 }], next: "page2" }),
    };
    const bookingsPage2 = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({ results: [{ id: 2 }], next: null }),
    };
    const page404 = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };
    globalThis.fetch = makeFetchMockSequence([
      bookingsPage1,
      bookingsPage2,
      page404,
    ]);
    const result = await getAllBookings.call(client, {});
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test("getAllBookings returns empty array if no results", async () => {
    const emptyPage = {
      ok: true,
      status: 200,
      headers: { get: () => "0" },
      json: async () => ({ results: [], next: null }),
    };
    globalThis.fetch = makeFetchMockSequence([emptyPage]);
    const result = await getAllBookings.call(client, {});
    expect(result).toEqual([]);
  });

  test("getAllBookings throws on error response", async () => {
    const errorPage = {
      ok: false,
      status: 500,
      text: async () => "server error",
      headers: { get: () => "0" },
    };
    globalThis.fetch = makeFetchMockSequence([errorPage]);
    await expect(getAllBookings.call(client, {})).rejects.toThrow("HTTP 500");
  });

  test("getAllAccounts returns all account types", async () => {
    client.getCostAccounts = async () => ({
      results: [
        {
          id: 1,
          costaccount: 1,
          name: "Cost",
          section: "A",
          group: "1",
          inventory: false,
          index_incometax: [],
          deductibility_tax_percent: "0",
          deductibility_amount_percent: "0",
          description: "",
          active: true,
          purchasetaxaccounts: [],
          counter_booked_bookings: 0,
          counter_open_bookings: 0,
          counter_deleted_bookings: 0,
          counter_bookingtemplates: 0,
        },
      ],
      count: 1,
      next: null,
      previous: null,
    });
    client.getBankAccounts = async () => ({
      results: [
        {
          id: 2,
          name: "Bank",
          position: 1,
          flag_balance: false,
          opening_balance: "0",
          counter_booked_bookings: 0,
          counter_open_bookings: 0,
          counter_deleted_bookings: 0,
          counter_bookingtemplates: 0,
        },
      ],
      count: 1,
      next: null,
      previous: null,
    });
    client.getPurchaseTaxAccounts = async () => ({
      results: [
        {
          id: 3,
          purchasetaxaccount: 1,
          name: "Tax",
          section: "A",
          group: "1",
          reverse_charge: false,
          ic_report: false,
          ic_delivery: false,
          ic_service: false,
          ioss_report: false,
          eu_oss_report: false,
          tax_values: [],
          index_purchasetax: [],
          description: "",
          active: true,
          counter_booked_bookings: 0,
          counter_open_bookings: 0,
          counter_deleted_bookings: 0,
          counter_bookingtemplates: 0,
        },
      ],
      count: 1,
      next: null,
      previous: null,
    });
    const result = await getAllAccounts.call(client);
    expect(result.costaccounts[0].id).toBe(1);
    expect(result.bankaccounts[0].id).toBe(2);
    expect(result.purchasetaxaccounts[0].id).toBe(3);
  });

  test("getAllAccounts throws on error", async () => {
    client.getCostAccounts = async () => {
      throw new Error("HTTP 500");
    };
    client.getBankAccounts = async () => ({
      results: [],
      count: 0,
      next: null,
      previous: null,
    });
    client.getPurchaseTaxAccounts = async () => ({
      results: [],
      count: 0,
      next: null,
      previous: null,
    });
    await expect(getAllAccounts.call(client)).rejects.toThrow("HTTP 500");
  });
});
