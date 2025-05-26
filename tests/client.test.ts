import { describe, expect, it } from "bun:test";
import { BookamatClient } from "../src/client";

describe("BookamatClient", () => {
  it("should create a client instance with required options", () => {
    const client = new BookamatClient({
      year: "2024",
      username: "test-user",
      apiKey: "test-key",
    });

    expect(client.year).toBe("2024");
    expect(client.username).toBe("test-user");
    expect(client.country).toBe("at"); // default value
  });

  it("should throw error when required options are missing", () => {
    expect(() => {
      new BookamatClient({
        year: "",
        username: "test-user",
        apiKey: "test-key",
      });
    }).toThrow("Bookamat client 'year' is required in options.");

    expect(() => {
      new BookamatClient({
        year: "2024",
        username: "",
        apiKey: "test-key",
      });
    }).toThrow("Bookamat client 'username' is required in options.");

    expect(() => {
      new BookamatClient({
        year: "2024",
        username: "test-user",
        apiKey: "",
      });
    }).toThrow("Bookamat client 'apiKey' is required in options.");
  });

  it("should accept custom country and baseUrl", () => {
    const client = new BookamatClient({
      year: "2024",
      username: "test-user",
      apiKey: "test-key",
      country: "de",
      baseUrl: "https://custom.api.com/v1",
    });

    expect(client.country).toBe("de");
    expect(client.baseUrl).toBe("https://custom.api.com/v1");
  });

  it("should construct correct API root URL", () => {
    const client = new BookamatClient({
      year: "2024",
      username: "test-user",
      apiKey: "test-key",
      country: "at",
    });

    expect(client.apiRoot).toBe("https://www.bookamat.com/api/v1/at/2024");
  });

  it("should have correct request headers", () => {
    const client = new BookamatClient({
      year: "2024",
      username: "test-user",
      apiKey: "test-key",
    });

    const headers = client.requestHeaders;
    expect(headers.Authorization).toBe("ApiKey test-user:test-key");
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers.Accept).toBe("application/json");
  });
});
