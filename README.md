# url-merge

A zero-dependency URL path joiner. Like `path.join()` but for URLs.

Based on [proper-url-join](https://github.com/moxystudio/js-proper-url-join) but with no dependencies (uses native `URLSearchParams` instead of `query-string`).

## Installation

```bash
bun add url-merge
yarn add url-joiner
npm install url-joiner
pnpm add url-joiner
```

## Usage

```typescript
import urlMerge from "url-joiner";

urlMerge("http://example.com", "foo", "bar");
// => 'http://example.com/foo/bar'
```

## Examples

### Basic joining

```typescript
urlMerge("foo", "bar");
// => '/foo/bar'

urlMerge("/foo/", "/bar/", "/baz/");
// => '/foo/bar/baz'

urlMerge("http://example.com", "api", "users");
// => 'http://example.com/api/users'
```

### With query strings

```typescript
urlMerge("http://example.com", "foo?page=1");
// => 'http://example.com/foo?page=1'

urlMerge("http://example.com", "foo", "?page=1");
// => 'http://example.com/foo?page=1'
```

### Adding query parameters via options

```typescript
urlMerge("http://example.com", "users", { query: { page: 1, limit: 10 } });
// => 'http://example.com/users?limit=10&page=1'

// Merges with existing query string
urlMerge("http://example.com/users?sort=name", { query: { page: 1 } });
// => 'http://example.com/users?page=1&sort=name'

// Array values
urlMerge("http://example.com", { query: { tags: ["a", "b", "c"] } });
// => 'http://example.com?tags=a&tags=b&tags=c'
```

### Trailing slash control

```typescript
// Default: no trailing slash
urlMerge("foo", "bar");
// => '/foo/bar'

// Force trailing slash
urlMerge("foo", "bar", { trailingSlash: true });
// => '/foo/bar/'

// Keep original trailing slash
urlMerge("/foo/bar/", { trailingSlash: "keep" });
// => '/foo/bar/'

urlMerge("/foo/bar", { trailingSlash: "keep" });
// => '/foo/bar'
```

### Leading slash control

```typescript
// Default: add leading slash
urlMerge("foo", "bar");
// => '/foo/bar'

// Remove leading slash
urlMerge("/foo", "/bar", { leadingSlash: false });
// => 'foo/bar'

// Keep original leading slash
urlMerge("foo", "bar", { leadingSlash: "keep" });
// => 'foo/bar'

urlMerge("/foo", "bar", { leadingSlash: "keep" });
// => '/foo/bar'
```

### Protocol-relative URLs

```typescript
// By default, // is treated as a path
urlMerge("//cdn.example.com", "assets", "image.png");
// => '/cdn.example.com/assets/image.png'

// Enable protocol-relative URL handling
urlMerge("//cdn.example.com", "assets", "image.png", { protocolRelative: true });
// => '//cdn.example.com/assets/image.png'
```

### Handling numbers

```typescript
urlMerge("users", 123, "posts");
// => '/users/123/posts'

urlMerge("http://example.com", "api", "v", 2);
// => 'http://example.com/api/v/2'
```

### Filtering invalid values

Non-string and non-numeric values are automatically filtered:

```typescript
urlMerge("foo", null, "bar", undefined, "baz");
// => '/foo/bar/baz'

urlMerge("foo", "", "bar");
// => '/foo/bar'
```

## API

### urlMerge(...parts, [options])

Joins URL parts into a single URL string.

#### parts

Type: `string | number`

URL parts to join. Non-string/non-numeric values are ignored.

#### options

Type: `object`

##### leadingSlash

Type: `boolean | 'keep'`  
Default: `true`

- `true` - Always add a leading slash
- `false` - Never add a leading slash
- `'keep'` - Keep the leading slash if present in the input

##### trailingSlash

Type: `boolean | 'keep'`  
Default: `false`

- `true` - Always add a trailing slash
- `false` - Never add a trailing slash
- `'keep'` - Keep the trailing slash if present in the input

##### protocolRelative

Type: `boolean`  
Default: `false`

When `true`, treats `//` at the start as a protocol-relative URL (e.g., `//cdn.example.com`).

##### query

Type: `Record<string, string | number | boolean | Array<string | number | boolean>>`  
Default: `undefined`

Query parameters to append to the URL. These are merged with any existing query string. Keys are sorted alphabetically in the output.

## Testing

```bash
bun test
```

## License

MIT
