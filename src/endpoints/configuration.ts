import type { BookamatClient } from "../client";
import type { Configuration, User } from "../types";

/**
 * Retrieves the client configuration from the Bookamat API.
 * @returns A promise that resolves to the Configuration object.
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/index.html#konfiguration|Bookamat API Docs - Konfiguration}
 */
export async function getConfiguration(
  this: BookamatClient
): Promise<Configuration> {
  const url = `${this.apiRoot}/preferences/configuration/`;
  return this.request<Configuration>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}

/**
 * Retrieves the current user's details from the Bookamat API.
 * @returns A promise that resolves to the User object.
 * @see {@link https://www.bookamat.com/dokumentation/api/v1/index.html#konfiguration|Bookamat API Docs - User}
 */
export async function getUser(this: BookamatClient): Promise<User> {
  const url = `${this.apiRoot}/user/`;
  return this.request<User>(url, {
    method: "GET",
    headers: this.requestHeaders,
  });
}
