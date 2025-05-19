/**
 * Defines the expected structure of a paginated API response that might also sometimes be a direct array.
 */
interface FlexiblePaginatedData<T> {
  results?: T[];
  next?: string | null;
  count?: number;
  previous?: string | null;
}

/**
 * Fetches all pages of results from a paginated Bookamat API endpoint.
 * @template T - The type of the items in the results array.
 * @param baseUrlForResource - The base URL for the paginated resource (without page query param, but other filters are fine).
 * @param headers - The request headers to use for fetching.
 * @param apiRoot - The root URL of the API, used if baseUrlForResource is a relative path.
 * @returns A promise that resolves to an array containing all items from all pages.
 */
export async function fetchAllPages<T>(
  baseUrlForResource: string,
  headers: Record<string, string>,
  apiRoot?: string // Optional: if baseUrlForResource is relative like "/bookings/"
): Promise<T[]> {
  let allItems: T[] = [];
  let currentUrlToFetch: string | null = null;
  let currentPageNumberForFallback = 1;

  const baseFetchUrl = new URL(baseUrlForResource, apiRoot); // Construct full URL if apiRoot is provided

  // Set up initial URL with page=1
  const initialUrlObj = new URL(baseFetchUrl.toString());
  initialUrlObj.searchParams.delete("page"); // Ensure no pre-existing page param from baseUrlForResource
  initialUrlObj.searchParams.set("page", "1");
  currentUrlToFetch = initialUrlObj.toString();

  while (currentUrlToFetch) {
    try {
      const response: Response = await fetch(currentUrlToFetch, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Treat 404 as end of pages, especially if we've already fetched some or tried subsequent pages.
          break;
        }
        const responseText = await response
          .text()
          .catch(() => "[no response body]");
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      const data: FlexiblePaginatedData<T> | T[] = await response.json();

      let results: T[] = [];
      if (
        typeof data === "object" &&
        data !== null &&
        "results" in data &&
        Array.isArray(data.results)
      ) {
        results = data.results;
      } else if (Array.isArray(data)) {
        results = data;
      }

      if (results.length > 0) {
        allItems = allItems.concat(results);
      }

      // Determine next URL
      let nextUrlFromData: string | null = null;
      if (
        typeof data === "object" &&
        data !== null &&
        "next" in data &&
        typeof data.next === "string"
      ) {
        nextUrlFromData = data.next;
      }

      if (nextUrlFromData) {
        currentUrlToFetch = nextUrlFromData;
        currentPageNumberForFallback = 1; // Reset fallback page number as we are following 'next' link
      } else if (results.length > 0 && !nextUrlFromData) {
        // No 'next' link (or invalid 'next' link), but we got some results.
        // Try incrementing page on the original base URL as a fallback.
        currentPageNumberForFallback++;
        const nextFallbackUrlObj = new URL(baseFetchUrl.toString());
        nextFallbackUrlObj.searchParams.delete("page"); // Clean slate for page param
        nextFallbackUrlObj.searchParams.set(
          "page",
          String(currentPageNumberForFallback)
        );
        currentUrlToFetch = nextFallbackUrlObj.toString();
      } else {
        // No 'next' link and no results (or results.length was 0), so stop.
        currentUrlToFetch = null;
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      // If the error is due to an invalid page (e.g., 404 from the API), assume end of pages.
      if (
        errorMessage.includes("Invalid page") ||
        errorMessage.includes("HTTP 404")
      ) {
        break;
      }
      throw error; // Re-throw other errors
    }
  }
  return allItems;
}

/**
 * Recursively removes all fields with null, undefined, or empty string values from an object or array.
 * @template T - The type of the object or array.
 * @param obj - The object or array to sanitize.
 * @returns The sanitized object or array.
 */
export function sanitizePayload<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj
      .map((item) => sanitizePayload(item))
      .filter(
        (item) => item !== null && item !== undefined && item !== ""
      ) as unknown as T;
  } else if (typeof obj === "object" && obj !== null) {
    const newObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined || value === "") continue;
      const sanitizedValue = sanitizePayload(value);
      // Ensure that if sanitizePayload returned null/undefined (e.g. an empty object became null), it's not added
      if (
        sanitizedValue !== null &&
        sanitizedValue !== undefined &&
        sanitizedValue !== ""
      ) {
        newObj[key] = sanitizedValue;
      }
    }
    // Return null if the object becomes empty after sanitization, to allow full cleanup
    // However, for the top-level payload, an empty object might be valid (e.g. {} for a PATCH)
    // This specific behavior (returning null for empty objects) might need adjustment based on API expectations.
    // For now, let's assume an empty object after sanitization is still a valid (empty) object.
    return newObj as T;
  }
  return obj;
}
