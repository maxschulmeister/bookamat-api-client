import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { BookamatClient } from "../../src/client";

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

  // --- Bank Accounts Tests ---
  test("getBankAccounts returns paginated bank accounts", async () => {
    const firstPage = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({
        count: 1,
        results: [
          {
            id: 1254,
            name: "Bankkonto",
            position: 0,
            flag_balance: true,
            opening_balance: "-999.99",
            counter_booked_bookings: 20,
            counter_open_bookings: 5,
            counter_deleted_bookings: 5,
            counter_bookingtemplates: 10,
          },
        ],
        next: null,
      }),
    };
    const emptyPage = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };

    globalThis.fetch = makeFetchMockSequence([firstPage, emptyPage]);
    const result = await client.getBankAccounts();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Bankkonto");
  });

  test("getBankAccountDetails returns single bank account", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({
        id: 1254,
        name: "Bankkonto",
        position: 0,
        flag_balance: true,
        opening_balance: "-999.99",
        counter_booked_bookings: 20,
        counter_open_bookings: 5,
        counter_deleted_bookings: 5,
        counter_bookingtemplates: 10,
      }),
    });

    const result = await client.getBankAccountDetails(1254);
    expect(result.id).toBe(1254);
    expect(result.name).toBe("Bankkonto");
  });

  test("createBankAccount creates new bank account", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 201,
      headers: { get: () => "100" },
      json: async () => ({
        id: 1256,
        name: "Bar/Kassa",
        position: 2,
        flag_balance: false,
        opening_balance: "0.00",
        counter_booked_bookings: 0,
        counter_open_bookings: 0,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 0,
      }),
    });

    const result = await client.createBankAccount({ name: "Bar/Kassa" });
    expect(result.id).toBe(1256);
    expect(result.name).toBe("Bar/Kassa");
  });

  test("updateBankAccount updates existing bank account", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 202,
      headers: { get: () => "100" },
      json: async () => ({
        id: 1255,
        name: "Kreditkarte",
        position: 1,
        flag_balance: true,
        opening_balance: "100.00",
        counter_booked_bookings: 30,
        counter_open_bookings: 0,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 5,
      }),
    });

    const result = await client.updateBankAccount(1255, {
      flag_balance: true,
      opening_balance: "100.00",
    });
    expect(result.flag_balance).toBe(true);
    expect(result.opening_balance).toBe("100.00");
  });

  test("deleteBankAccount deletes bank account", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 204,
      headers: { get: () => "0" },
    });

    const result = await client.deleteBankAccount(1255);
    expect(result).toBeUndefined();
  });

  // --- Cost Accounts Tests ---
  test("getCostAccounts returns paginated cost accounts", async () => {
    const firstPage = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({
        count: 1,
        results: [
          {
            id: 2369,
            name: "Miete und Pacht",
            section: "4000",
            group: "2",
            inventory: false,
            index_incometax: "123",
            description: "Miete für Geschäftsräume",
            active: true,
            purchasetaxaccounts: [],
            counter_booked_bookings: 10,
            counter_open_bookings: 2,
            counter_deleted_bookings: 0,
            counter_bookingtemplates: 5,
          },
        ],
        next: null,
      }),
    };
    const emptyPage = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };

    globalThis.fetch = makeFetchMockSequence([firstPage, emptyPage]);
    const result = await client.getCostAccounts();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Miete und Pacht");
  });

  test("activateCostAccount activates predefined cost account", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 201,
      headers: { get: () => "100" },
      json: async () => ({
        id: 2370,
        name: "Sonstige Einnahmen",
        section: "8000",
        group: "1",
        inventory: false,
        index_incometax: "456",
        description: "Sonstige Einnahmen",
        active: true,
        purchasetaxaccounts: [],
        counter_booked_bookings: 0,
        counter_open_bookings: 0,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 0,
      }),
    });

    const result = await client.activateCostAccount({ costaccount: 2370 });
    expect(result.id).toBe(2370);
    expect(result.active).toBe(true);
  });

  test("deleteCostAccount deactivates cost account", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 204,
      headers: { get: () => "0" },
    });

    const result = await client.deleteCostAccount(2370);
    expect(result).toBeUndefined();
  });

  // --- Purchase Tax Accounts Tests ---
  test("getPurchaseTaxAccounts returns paginated purchase tax accounts", async () => {
    const firstPage = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({
        count: 1,
        results: [
          {
            id: 3476,
            name: "Vorsteuer Inland",
            section: "2500",
            group: "2",
            reverse_charge: false,
            ic_report: false,
            ic_delivery: false,
            ic_service: false,
            ioss_report: false,
            description: "Vorsteuer für Inlandsgeschäfte",
            active: true,
            counter_booked_bookings: 15,
            counter_open_bookings: 3,
            counter_deleted_bookings: 1,
            counter_bookingtemplates: 8,
          },
        ],
        next: null,
      }),
    };
    const emptyPage = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };

    globalThis.fetch = makeFetchMockSequence([firstPage, emptyPage]);
    const result = await client.getPurchaseTaxAccounts();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Vorsteuer Inland");
  });

  // --- Cost Centres Tests ---
  test("getCostCentres returns paginated cost centres", async () => {
    const firstPage = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({
        count: 1,
        results: [
          {
            id: 4523,
            name: "Büro",
            position: 0,
            counter_booked_bookings: 25,
            counter_open_bookings: 5,
            counter_deleted_bookings: 2,
            counter_bookingtemplates: 12,
          },
        ],
        next: null,
      }),
    };
    const emptyPage = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };

    globalThis.fetch = makeFetchMockSequence([firstPage, emptyPage]);
    const result = await client.getCostCentres();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Büro");
  });

  test("createCostCentre creates new cost centre", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 201,
      headers: { get: () => "100" },
      json: async () => ({
        id: 4524,
        name: "Marketing",
        position: 1,
        counter_booked_bookings: 0,
        counter_open_bookings: 0,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 0,
      }),
    });

    const result = await client.createCostCentre({ name: "Marketing" });
    expect(result.id).toBe(4524);
    expect(result.name).toBe("Marketing");
  });

  // --- Global Tags Tests ---
  test("getGlobalTags returns paginated global tags", async () => {
    const firstPage = {
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({
        count: 1,
        results: [
          {
            id: 6001,
            name: "Projekt A",
            position: 0,
            counter_booked_bookings: 12,
            counter_open_bookings: 2,
            counter_deleted_bookings: 1,
            counter_bookingtemplates: 6,
          },
        ],
        next: null,
      }),
    };
    const emptyPage = {
      ok: false,
      status: 404,
      text: async () => "not found",
      headers: { get: () => "0" },
    };

    globalThis.fetch = makeFetchMockSequence([firstPage, emptyPage]);
    const result = await client.getGlobalTags();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Projekt A");
  });

  test("createGlobalTag creates new global tag", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 201,
      headers: { get: () => "100" },
      json: async () => ({
        id: 6002,
        name: "Projekt B",
        position: 1,
        counter_booked_bookings: 0,
        counter_open_bookings: 0,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 0,
      }),
    });

    const result = await client.createGlobalTag({ name: "Projekt B" });
    expect(result.id).toBe(6002);
    expect(result.name).toBe("Projekt B");
  });

  // --- Missing Purchase Tax Account Tests ---
  test("activatePurchaseTaxAccount activates predefined purchase tax account", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 201,
      headers: { get: () => "100" },
      json: async () => ({
        id: 3477,
        name: "Vorsteuer EU",
        section: "2600",
        group: "2",
        reverse_charge: false,
        ic_report: true,
        ic_delivery: false,
        ic_service: false,
        ioss_report: false,
        eu_oss_report: false,
        tax_values: ["20.00"],
        index_purchasetax: ["030"],
        description: "Vorsteuer für EU-Geschäfte",
        active: true,
        counter_booked_bookings: 0,
        counter_open_bookings: 0,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 0,
      }),
    });

    const result = await client.activatePurchaseTaxAccount({
      purchasetaxaccount: 3477,
    });
    expect(result.id).toBe(3477);
    expect(result.active).toBe(true);
  });

  test("deletePurchaseTaxAccount deactivates purchase tax account", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 204,
      headers: { get: () => "0" },
    });

    const result = await client.deletePurchaseTaxAccount(3477);
    expect(result).toBeUndefined();
  });

  // --- Missing Cost Centre Tests ---
  test("updateCostCentre updates existing cost centre", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({
        id: 4524,
        name: "Updated Marketing",
        position: 1,
        counter_booked_bookings: 5,
        counter_open_bookings: 2,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 3,
      }),
    });

    const result = await client.updateCostCentre(4524, {
      name: "Updated Marketing",
    });
    expect(result.id).toBe(4524);
    expect(result.name).toBe("Updated Marketing");
  });

  test("replaceCostCentre replaces existing cost centre", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({
        id: 4524,
        name: "Replaced Marketing",
        position: 2,
        counter_booked_bookings: 0,
        counter_open_bookings: 0,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 0,
      }),
    });

    const result = await client.replaceCostCentre(4524, {
      name: "Replaced Marketing",
      position: 2,
    });
    expect(result.id).toBe(4524);
    expect(result.name).toBe("Replaced Marketing");
    expect(result.position).toBe(2);
  });

  test("deleteCostCentre deletes cost centre", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 204,
      headers: { get: () => "0" },
    });

    const result = await client.deleteCostCentre(4524);
    expect(result).toBeUndefined();
  });

  // --- Missing Foreign Business Base Tests ---
  test("createForeignBusinessBase creates new foreign business base", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 201,
      headers: { get: () => "100" },
      json: async () => ({
        id: 5001,
        name: "Germany Office",
        position: 0,
        counter_booked_bookings: 0,
        counter_open_bookings: 0,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 0,
      }),
    });

    const result = await client.createForeignBusinessBase({
      name: "Germany Office",
    });
    expect(result.id).toBe(5001);
    expect(result.name).toBe("Germany Office");
  });

  test("updateForeignBusinessBase updates existing foreign business base", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({
        id: 5001,
        name: "Updated Germany Office",
        position: 0,
        counter_booked_bookings: 3,
        counter_open_bookings: 1,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 2,
      }),
    });

    const result = await client.updateForeignBusinessBase(5001, {
      name: "Updated Germany Office",
    });
    expect(result.id).toBe(5001);
    expect(result.name).toBe("Updated Germany Office");
  });

  test("replaceForeignBusinessBase replaces existing foreign business base", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({
        id: 5001,
        name: "Replaced Germany Office",
        position: 1,
        counter_booked_bookings: 0,
        counter_open_bookings: 0,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 0,
      }),
    });

    const result = await client.replaceForeignBusinessBase(5001, {
      name: "Replaced Germany Office",
      position: 1,
    });
    expect(result.id).toBe(5001);
    expect(result.name).toBe("Replaced Germany Office");
    expect(result.position).toBe(1);
  });

  test("deleteForeignBusinessBase deletes foreign business base", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 204,
      headers: { get: () => "0" },
    });

    const result = await client.deleteForeignBusinessBase(5001);
    expect(result).toBeUndefined();
  });

  // --- Missing Global Tag Tests ---
  test("updateGlobalTag updates existing global tag", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({
        id: 6002,
        name: "Updated Projekt B",
        position: 1,
        counter_booked_bookings: 5,
        counter_open_bookings: 2,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 3,
      }),
    });

    const result = await client.updateGlobalTag(6002, {
      name: "Updated Projekt B",
    });
    expect(result.id).toBe(6002);
    expect(result.name).toBe("Updated Projekt B");
  });

  test("replaceGlobalTag replaces existing global tag", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({
        id: 6002,
        name: "Replaced Projekt B",
        position: 2,
        counter_booked_bookings: 0,
        counter_open_bookings: 0,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 0,
      }),
    });

    const result = await client.replaceGlobalTag(6002, {
      name: "Replaced Projekt B",
      position: 2,
    });
    expect(result.id).toBe(6002);
    expect(result.name).toBe("Replaced Projekt B");
    expect(result.position).toBe(2);
  });

  test("deleteGlobalTag deletes global tag", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 204,
      headers: { get: () => "0" },
    });

    const result = await client.deleteGlobalTag(6002);
    expect(result).toBeUndefined();
  });

  // --- Missing Bank Account Test ---
  test("replaceBankAccount replaces existing bank account", async () => {
    globalThis.fetch = makeFetchMock({
      ok: true,
      status: 200,
      headers: { get: () => "100" },
      json: async () => ({
        id: 1255,
        name: "Replaced Bank Account",
        position: 0,
        flag_balance: false,
        opening_balance: "0.00",
        counter_booked_bookings: 0,
        counter_open_bookings: 0,
        counter_deleted_bookings: 0,
        counter_bookingtemplates: 0,
      }),
    });

    const result = await client.replaceBankAccount(1255, {
      name: "Replaced Bank Account",
      flag_balance: false,
      opening_balance: "0.00",
    });
    expect(result.id).toBe(1255);
    expect(result.name).toBe("Replaced Bank Account");
    expect(result.flag_balance).toBe(false);
  });

  // --- Error Handling Test ---
  test("settings endpoints handle errors properly", async () => {
    globalThis.fetch = makeFetchMock({
      ok: false,
      status: 500,
      text: async () => "server error",
      headers: { get: () => "0" },
    });

    await expect(client.getBankAccounts()).rejects.toThrow("HTTP 500");
  });
});
