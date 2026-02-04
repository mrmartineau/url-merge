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

  // Build a query object based on the url query string and options query object
  const suffixStr = suffix.replace(/^\?/, "");

  // Parse existing query string, preserving valueless keys
  const existingQuery: Map<string, string | null> = new Map();
  if (suffixStr) {
    for (const part of suffixStr.split("&")) {
      const eqIndex = part.indexOf("=");
      if (eqIndex === -1) {
        // Key without value
        existingQuery.set(decodeURIComponent(part), null);
      } else {
        const key = decodeURIComponent(part.slice(0, eqIndex));
        const value = decodeURIComponent(part.slice(eqIndex + 1));
        existingQuery.set(key, value);
      }
    }
  }

  // Merge with options.query
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      // Handle arrays by converting to URLSearchParams format later
      if (Array.isArray(value)) {
        // For arrays, we'll handle specially in stringify
        existingQuery.set(key, value.map(String).join("\0"));
      } else {
        existingQuery.set(key, String(value));
      }
    }
  }

  // Sort keys and stringify
  const sortedKeys = [...existingQuery.keys()].sort();
  const queryParts: string[] = [];

  for (const key of sortedKeys) {
    const value = existingQuery.get(key);
    const encodedKey = encodeURIComponent(key);

    if (value === undefined) {
      // Should not happen, but satisfy TypeScript
      continue;
    } else if (value === null) {
      // Valueless key
      queryParts.push(encodedKey);
    } else if (value.includes("\0")) {
      // Array value (joined with null char)
      const values = value.split("\0");
      for (const v of values) {
        queryParts.push(`${encodedKey}=${encodeURIComponent(v)}`);
      }
    } else {
      queryParts.push(`${encodedKey}=${encodeURIComponent(value)}`);
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
