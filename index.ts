/**
 * Options for configuring URL merging behavior.
 */
export type UrlMergeOptions = {
  /**
   * Controls the leading slash behavior.
   * - `true` (default): Always add a leading slash
   * - `false`: Never add a leading slash
   * - `'keep'`: Preserve the leading slash if present in input
   */
  leadingSlash?: boolean | "keep";

  /**
   * Controls the trailing slash behavior.
   * - `true`: Always add a trailing slash
   * - `false` (default): Never add a trailing slash
   * - `'keep'`: Preserve the trailing slash if present in input
   */
  trailingSlash?: boolean | "keep";

  /**
   * When `true`, treats `//` at the start as a protocol-relative URL.
   * @default false
   */
  protocolRelative?: boolean;

  /**
   * Query parameters to append to the URL. Merged with any existing query string.
   * Keys are sorted alphabetically in the output.
   */
  query?: Record<
    string,
    string | number | boolean | (string | number | boolean)[]
  >;
};

const defaultUrlRegExp = /^(\w+:\/\/[^/?]+)?(.*?)(\?.+)?$/;
const protocolRelativeUrlRegExp = /^(\/\/[^/?]+)(.*?)(\?.+)?$/;

const normalizeParts = (parts: unknown[]): string[] =>
  parts
    // Filter non-string or non-numeric values
    .filter(
      (part): part is string | number =>
        typeof part === "string" || typeof part === "number",
    )
    // Convert to strings
    .map((part) => `${part}`)
    // Remove empty parts
    .filter((part) => part);

const parseParts = (parts: string[], options: UrlMergeOptions) => {
  const { protocolRelative } = options;

  const partsStr = parts.join("/");
  const urlRegExp = protocolRelative
    ? protocolRelativeUrlRegExp
    : defaultUrlRegExp;
  const [, prefix = "", pathname = "", suffix = ""] =
    partsStr.match(urlRegExp) || [];

  return {
    prefix,
    pathname: {
      parts: pathname.split("/").filter((part) => part !== ""),
      hasLeading: suffix ? /^\/\/+/.test(pathname) : /^\/+/.test(pathname),
      hasTrailing: suffix ? /\/\/+$/.test(pathname) : /\/+$/.test(pathname),
    },
    suffix,
  };
};

const buildUrl = (
  parsedParts: ReturnType<typeof parseParts>,
  options: UrlMergeOptions,
): string => {
  const { prefix, pathname, suffix } = parsedParts;
  const { parts: pathnameParts, hasLeading, hasTrailing } = pathname;
  const { leadingSlash, trailingSlash } = options;

  const addLeading =
    leadingSlash === true || (leadingSlash === "keep" && hasLeading);
  const addTrailing =
    trailingSlash === true || (trailingSlash === "keep" && hasTrailing);

  // Start with prefix if not empty (http://google.com)
  let url = prefix;

  // Add the parts
  if (pathnameParts.length > 0) {
    if (url || addLeading) {
      url += "/";
    }

    url += pathnameParts.join("/");
  }

  // Add trailing to the end
  if (addTrailing) {
    url += "/";
  }

  // Add leading if URL is still empty
  if (!url && addLeading) {
    url += "/";
  }

  const suffixStr = suffix.replace(/^\?/, "");

  // Parse existing query string while preserving valueless keys (e.g. ?flag).
  const queryParams = new URLSearchParams();
  const valuelessKeys = new Set<string>();

  if (suffixStr) {
    for (const part of suffixStr.split("&")) {
      if (!part) {
        continue;
      }

      const eqIndex = part.indexOf("=");
      if (eqIndex === -1) {
        valuelessKeys.add(decodeURIComponent(part));
      } else {
        const key = decodeURIComponent(part.slice(0, eqIndex));
        const value = decodeURIComponent(part.slice(eqIndex + 1));
        queryParams.append(key, value);
      }
    }
  }

  // Merge with options.query (option values replace existing key values).
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      queryParams.delete(key);
      valuelessKeys.delete(key);

      if (Array.isArray(value)) {
        for (const item of value) {
          queryParams.append(key, String(item));
        }
      } else {
        queryParams.append(key, String(value));
      }
    }
  }

  // Sort query entries by key while preserving relative order for duplicate keys.
  queryParams.sort();

  const valuedEntries: Array<{ key: string; value: string }> = [];
  for (const [key, value] of queryParams.entries()) {
    valuedEntries.push({ key, value });
  }

  const valuelessEntries = [...valuelessKeys]
    .sort()
    .map((key) => ({ key, value: null as null }));

  // Merge valueless and valued entries in sorted key order.
  const queryParts: string[] = [];
  let valuedIdx = 0;
  let valuelessIdx = 0;

  while (
    valuedIdx < valuedEntries.length ||
    valuelessIdx < valuelessEntries.length
  ) {
    const valued = valuedEntries[valuedIdx];
    const valueless = valuelessEntries[valuelessIdx];

    const useValueless =
      !valued || (valueless && valueless.key <= valued.key);

    if (useValueless) {
      queryParts.push(encodeURIComponent(valueless.key));
      valuelessIdx += 1;
    } else {
      queryParts.push(
        `${encodeURIComponent(valued.key)}=${encodeURIComponent(valued.value)}`,
      );
      valuedIdx += 1;
    }
  }

  const queryStr = queryParts.join("&");

  if (queryStr) {
    url += `?${queryStr}`;
  }

  return url;
};

/**
 * Joins URL parts into a single URL string, normalizing slashes and merging query parameters.
 *
 * @param parts - URL parts to join. Non-string/non-numeric values are ignored.
 *                The last argument can be an options object.
 * @returns The joined URL string.
 *
 * @example
 * // Basic joining
 * urlMerge('foo', 'bar');
 * // => '/foo/bar'
 *
 * @example
 * // With full URL
 * urlMerge('http://example.com', 'api', 'users');
 * // => 'http://example.com/api/users'
 *
 * @example
 * // With query parameters
 * urlMerge('http://example.com', 'users', { query: { page: 1, limit: 10 } });
 * // => 'http://example.com/users?limit=10&page=1'
 *
 * @example
 * // Trailing slash control
 * urlMerge('foo', 'bar', { trailingSlash: true });
 * // => '/foo/bar/'
 *
 * @example
 * // Leading slash control
 * urlMerge('/foo', '/bar', { leadingSlash: false });
 * // => 'foo/bar'
 *
 * @example
 * // Protocol-relative URLs
 * urlMerge('//cdn.example.com', 'assets', { protocolRelative: true });
 * // => '//cdn.example.com/assets'
 *
 * @example
 * // Array query values
 * urlMerge('/search', { query: { tags: ['a', 'b', 'c'] } });
 * // => '/search?tags=a&tags=b&tags=c'
 */
const urlMerge = (...parts: unknown[]): string => {
  const lastArg = parts[parts.length - 1];
  let options: UrlMergeOptions;

  // If last argument is an object, then it's the options
  // Note that null is an object, so we verify if is truthy
  if (lastArg && typeof lastArg === "object" && !Array.isArray(lastArg)) {
    options = lastArg as UrlMergeOptions;
    parts = parts.slice(0, -1);
  } else {
    options = {};
  }

  // Parse options
  options = {
    leadingSlash: true,
    trailingSlash: false,
    protocolRelative: false,
    ...options,
  };

  // Normalize parts before parsing them
  const normalizedParts = normalizeParts(parts);

  // Split the parts into prefix, pathname, and suffix
  // (scheme://host)(/pathnameParts.join('/'))(?queryString)
  const parsedParts = parseParts(normalizedParts, options);

  // Finally build the url based on the parsedParts
  return buildUrl(parsedParts, options);
};

export default urlMerge;
