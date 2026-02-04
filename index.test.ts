import { test, expect } from "bun:test";

import urlMerge from "./index";

test("should add leading slash and no trailing slash by default", () => {
  expect(urlMerge()).toBe("/");
  expect(urlMerge(undefined, "foo")).toBe("/foo");
  expect(urlMerge("foo", null, "bar")).toBe("/foo/bar");
  expect(urlMerge("foo", "", "bar")).toBe("/foo/bar");
  expect(urlMerge("foo")).toBe("/foo");
  expect(urlMerge("/foo")).toBe("/foo");
  expect(urlMerge("/", "/foo")).toBe("/foo");
  expect(urlMerge("/", "//foo")).toBe("/foo");
  expect(urlMerge("/", "/foo//")).toBe("/foo");
  expect(urlMerge("/", "/foo/", "")).toBe("/foo");
  expect(urlMerge("/", "/foo/", "/")).toBe("/foo");
  expect(urlMerge("foo", "bar")).toBe("/foo/bar");
  expect(urlMerge("/foo", "bar")).toBe("/foo/bar");
  expect(urlMerge("/foo", "/bar")).toBe("/foo/bar");
  expect(urlMerge("/foo/", "/bar/")).toBe("/foo/bar");
  expect(urlMerge("/foo/", "/bar/baz")).toBe("/foo/bar/baz");
  expect(urlMerge("/foo/", "/bar//baz")).toBe("/foo/bar/baz");

  expect(urlMerge("http://google.com")).toBe("http://google.com");
  expect(urlMerge("http://google.com/")).toBe("http://google.com");
  expect(urlMerge("http://google.com", "")).toBe("http://google.com");
  expect(urlMerge("http://google.com", "foo")).toBe("http://google.com/foo");
  expect(urlMerge("http://google.com/", "foo")).toBe("http://google.com/foo");
  expect(urlMerge("http://google.com/", "/foo")).toBe("http://google.com/foo");
  expect(urlMerge("http://google.com//", "/foo")).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com/foo", "bar")).toBe(
    "http://google.com/foo/bar",
  );

  expect(urlMerge("http://google.com", "?queryString")).toBe(
    "http://google.com?queryString",
  );
  expect(urlMerge("http://google.com", "foo?queryString")).toBe(
    "http://google.com/foo?queryString",
  );
  expect(urlMerge("http://google.com", "foo", "?queryString")).toBe(
    "http://google.com/foo?queryString",
  );
  expect(urlMerge("http://google.com", "foo/", "?queryString")).toBe(
    "http://google.com/foo?queryString",
  );
  expect(urlMerge("http://google.com?queryString")).toBe(
    "http://google.com?queryString",
  );
});

test("should add leading slash and trailing slash", () => {
  const options = { trailingSlash: true as const };

  expect(urlMerge(options)).toBe("/");
  expect(urlMerge(undefined, "foo", options)).toBe("/foo/");
  expect(urlMerge("foo", null, "bar", options)).toBe("/foo/bar/");
  expect(urlMerge("foo", "", "bar", options)).toBe("/foo/bar/");
  expect(urlMerge("foo", options)).toBe("/foo/");
  expect(urlMerge("/foo", options)).toBe("/foo/");
  expect(urlMerge("/", "/foo", options)).toBe("/foo/");
  expect(urlMerge("/", "//foo", options)).toBe("/foo/");
  expect(urlMerge("/", "/foo//", options)).toBe("/foo/");
  expect(urlMerge("/", "/foo/", "", options)).toBe("/foo/");
  expect(urlMerge("/", "/foo/", "/", options)).toBe("/foo/");
  expect(urlMerge("foo", "bar", options)).toBe("/foo/bar/");
  expect(urlMerge("/foo", "bar", options)).toBe("/foo/bar/");
  expect(urlMerge("/foo", "/bar", options)).toBe("/foo/bar/");
  expect(urlMerge("/foo/", "/bar/", options)).toBe("/foo/bar/");
  expect(urlMerge("/foo/", "/bar/baz", options)).toBe("/foo/bar/baz/");
  expect(urlMerge("/foo/", "/bar//baz", options)).toBe("/foo/bar/baz/");

  expect(urlMerge("http://google.com", options)).toBe("http://google.com/");
  expect(urlMerge("http://google.com/", options)).toBe("http://google.com/");
  expect(urlMerge("http://google.com", "", options)).toBe(
    "http://google.com/",
  );
  expect(urlMerge("http://google.com", "foo", options)).toBe(
    "http://google.com/foo/",
  );
  expect(urlMerge("http://google.com/", "foo", options)).toBe(
    "http://google.com/foo/",
  );
  expect(urlMerge("http://google.com/", "/foo", options)).toBe(
    "http://google.com/foo/",
  );
  expect(urlMerge("http://google.com//", "/foo", options)).toBe(
    "http://google.com/foo/",
  );
  expect(urlMerge("http://google.com/foo", "bar", options)).toBe(
    "http://google.com/foo/bar/",
  );

  expect(urlMerge("http://google.com", "?queryString", options)).toBe(
    "http://google.com/?queryString",
  );
  expect(urlMerge("http://google.com", "foo?queryString", options)).toBe(
    "http://google.com/foo/?queryString",
  );
  expect(urlMerge("http://google.com", "foo", "?queryString", options)).toBe(
    "http://google.com/foo/?queryString",
  );
  expect(urlMerge("http://google.com", "foo/", "?queryString", options)).toBe(
    "http://google.com/foo/?queryString",
  );
  expect(urlMerge("http://google.com?queryString", options)).toBe(
    "http://google.com/?queryString",
  );
});

test("should remove leading slash and add trailing slash", () => {
  const options = {
    leadingSlash: false as const,
    trailingSlash: true as const,
  };

  expect(urlMerge(options)).toBe("/");
  expect(urlMerge(undefined, "foo", options)).toBe("foo/");
  expect(urlMerge("foo", null, "bar", options)).toBe("foo/bar/");
  expect(urlMerge("foo", "", "bar", options)).toBe("foo/bar/");
  expect(urlMerge("foo", options)).toBe("foo/");
  expect(urlMerge("/foo", options)).toBe("foo/");
  expect(urlMerge("/", "/foo", options)).toBe("foo/");
  expect(urlMerge("/", "//foo", options)).toBe("foo/");
  expect(urlMerge("/", "/foo//", options)).toBe("foo/");
  expect(urlMerge("/", "/foo/", "", options)).toBe("foo/");
  expect(urlMerge("/", "/foo/", "/", options)).toBe("foo/");
  expect(urlMerge("foo", "bar", options)).toBe("foo/bar/");
  expect(urlMerge("/foo", "bar", options)).toBe("foo/bar/");
  expect(urlMerge("/foo", "/bar", options)).toBe("foo/bar/");
  expect(urlMerge("/foo/", "/bar/", options)).toBe("foo/bar/");
  expect(urlMerge("/foo/", "/bar/baz", options)).toBe("foo/bar/baz/");
  expect(urlMerge("/foo/", "/bar//baz", options)).toBe("foo/bar/baz/");

  expect(urlMerge("http://google.com", options)).toBe("http://google.com/");
  expect(urlMerge("http://google.com/", options)).toBe("http://google.com/");
  expect(urlMerge("http://google.com", "", options)).toBe(
    "http://google.com/",
  );
  expect(urlMerge("http://google.com", "foo", options)).toBe(
    "http://google.com/foo/",
  );
  expect(urlMerge("http://google.com/", "foo", options)).toBe(
    "http://google.com/foo/",
  );
  expect(urlMerge("http://google.com/", "/foo", options)).toBe(
    "http://google.com/foo/",
  );
  expect(urlMerge("http://google.com//", "/foo", options)).toBe(
    "http://google.com/foo/",
  );
  expect(urlMerge("http://google.com/foo", "bar", options)).toBe(
    "http://google.com/foo/bar/",
  );

  expect(urlMerge("http://google.com", "?queryString", options)).toBe(
    "http://google.com/?queryString",
  );
  expect(urlMerge("http://google.com", "foo?queryString", options)).toBe(
    "http://google.com/foo/?queryString",
  );
  expect(urlMerge("http://google.com", "foo", "?queryString", options)).toBe(
    "http://google.com/foo/?queryString",
  );
  expect(urlMerge("http://google.com", "foo/", "?queryString", options)).toBe(
    "http://google.com/foo/?queryString",
  );
  expect(urlMerge("http://google.com?queryString", options)).toBe(
    "http://google.com/?queryString",
  );
});

test("should remove leading slash and trailing slash", () => {
  const options = {
    leadingSlash: false as const,
    trailingSlash: false as const,
  };

  expect(urlMerge(options)).toBe("");
  expect(urlMerge(undefined, "foo", options)).toBe("foo");
  expect(urlMerge("foo", null, "bar", options)).toBe("foo/bar");
  expect(urlMerge("foo", "", "bar", options)).toBe("foo/bar");
  expect(urlMerge("foo", options)).toBe("foo");
  expect(urlMerge("/foo", options)).toBe("foo");
  expect(urlMerge("/", "/foo", options)).toBe("foo");
  expect(urlMerge("/", "//foo", options)).toBe("foo");
  expect(urlMerge("/", "/foo//", options)).toBe("foo");
  expect(urlMerge("/", "/foo/", "", options)).toBe("foo");
  expect(urlMerge("/", "/foo/", "/", options)).toBe("foo");
  expect(urlMerge("foo", "bar", options)).toBe("foo/bar");
  expect(urlMerge("/foo", "bar", options)).toBe("foo/bar");
  expect(urlMerge("/foo", "/bar", options)).toBe("foo/bar");
  expect(urlMerge("/foo/", "/bar/", options)).toBe("foo/bar");
  expect(urlMerge("/foo/", "/bar/baz", options)).toBe("foo/bar/baz");
  expect(urlMerge("/foo/", "/bar//baz", options)).toBe("foo/bar/baz");

  expect(urlMerge("http://google.com", options)).toBe("http://google.com");
  expect(urlMerge("http://google.com/", options)).toBe("http://google.com");
  expect(urlMerge("http://google.com", "", options)).toBe("http://google.com");
  expect(urlMerge("http://google.com", "foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com/", "foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com/", "/foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com//", "/foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com/foo", "bar", options)).toBe(
    "http://google.com/foo/bar",
  );

  expect(urlMerge("http://google.com", "?queryString", options)).toBe(
    "http://google.com?queryString",
  );
  expect(urlMerge("http://google.com", "foo?queryString", options)).toBe(
    "http://google.com/foo?queryString",
  );
  expect(urlMerge("http://google.com", "foo", "?queryString", options)).toBe(
    "http://google.com/foo?queryString",
  );
  expect(urlMerge("http://google.com", "foo/", "?queryString", options)).toBe(
    "http://google.com/foo?queryString",
  );
  expect(urlMerge("http://google.com?queryString", options)).toBe(
    "http://google.com?queryString",
  );
});

test("should support URLs with relative protocol according to options.protocolRelative", () => {
  const options = { protocolRelative: true };

  expect(urlMerge("//google.com", "foo", options)).toBe("//google.com/foo");
  expect(urlMerge("//google.com/", "foo", options)).toBe("//google.com/foo");
  expect(urlMerge("//google.com/foo", "bar", options)).toBe(
    "//google.com/foo/bar",
  );
  expect(urlMerge("//google.com/foo//", "bar", options)).toBe(
    "//google.com/foo/bar",
  );

  options.protocolRelative = false;

  expect(urlMerge("//google.com", "foo", options)).toBe("/google.com/foo");
  expect(urlMerge("//google.com/", "foo", options)).toBe("/google.com/foo");
  expect(urlMerge("//google.com/foo", "bar", options)).toBe(
    "/google.com/foo/bar",
  );
  expect(urlMerge("//google.com/foo//", "bar", options)).toBe(
    "/google.com/foo/bar",
  );
});

test("should include numbers", () => {
  expect(urlMerge(undefined, 1)).toBe("/1");
  expect(urlMerge(1, null, 2)).toBe("/1/2");
  expect(urlMerge(1, "", 2)).toBe("/1/2");
  expect(urlMerge(1)).toBe("/1");
  expect(urlMerge("/1")).toBe("/1");
  expect(urlMerge("/", "/1")).toBe("/1");
  expect(urlMerge("/", "//1")).toBe("/1");
  expect(urlMerge("/", "/1//")).toBe("/1");
  expect(urlMerge("/", "/1/", "")).toBe("/1");
  expect(urlMerge("/", "/1/", "/")).toBe("/1");
  expect(urlMerge(1, 2)).toBe("/1/2");
  expect(urlMerge("/1", 2)).toBe("/1/2");
  expect(urlMerge("/1", "/2")).toBe("/1/2");
  expect(urlMerge("/1/", "/2/")).toBe("/1/2");
  expect(urlMerge("/1/", "/2/3")).toBe("/1/2/3");
  expect(urlMerge("/1/", "/2//3")).toBe("/1/2/3");

  expect(urlMerge("http://google.com", 1)).toBe("http://google.com/1");
  expect(urlMerge("http://google.com/", 1)).toBe("http://google.com/1");
  expect(urlMerge("http://google.com/", "/1")).toBe("http://google.com/1");
  expect(urlMerge("http://google.com//", "/1")).toBe("http://google.com/1");
  expect(urlMerge("http://google.com/1", 2)).toBe("http://google.com/1/2");

  expect(urlMerge("http://google.com", "?1")).toBe("http://google.com?1");
  expect(urlMerge("http://google.com", "foo?1")).toBe(
    "http://google.com/foo?1",
  );
  expect(urlMerge("http://google.com", "foo", "?1")).toBe(
    "http://google.com/foo?1",
  );
  expect(urlMerge("http://google.com", "foo/", "?1")).toBe(
    "http://google.com/foo?1",
  );
  expect(urlMerge("http://google.com?1")).toBe("http://google.com?1");
});

test("should handle the provided query object and append it to the url", () => {
  const options: UrlJoinOptions = { query: { biz: "buz", foo: "bar" } };

  expect(urlMerge("/google.com", options)).toBe("/google.com?biz=buz&foo=bar");
  expect(urlMerge("google.com", options)).toBe("/google.com?biz=buz&foo=bar");

  options.protocolRelative = false;

  expect(urlMerge("//google.com", options)).toBe(
    "/google.com?biz=buz&foo=bar",
  );

  options.leadingSlash = false;

  expect(urlMerge("google.com", options)).toBe("google.com?biz=buz&foo=bar");

  options.trailingSlash = true;

  expect(urlMerge("google.com", options)).toBe("google.com/?biz=buz&foo=bar");

  options.trailingSlash = false;

  expect(urlMerge("google.com", "qux?tux=baz", options)).toBe(
    "google.com/qux?biz=buz&foo=bar&tux=baz",
  );
});

test("should handle array values in query object", () => {
  const options = { query: { foo: [1, 2, 3] } };

  expect(urlMerge("/google.com", options)).toBe(
    "/google.com?foo=1&foo=2&foo=3",
  );
});

test("should keep leading slash and remove trailing slash", () => {
  const options = { leadingSlash: "keep" as const };

  expect(urlMerge(options)).toBe("");
  expect(urlMerge(undefined, "foo", options)).toBe("foo");
  expect(urlMerge("foo", null, "bar", options)).toBe("foo/bar");
  expect(urlMerge("foo", "", "bar", options)).toBe("foo/bar");
  expect(urlMerge("foo", options)).toBe("foo");
  expect(urlMerge("/foo", options)).toBe("/foo");
  expect(urlMerge("/", "/foo", options)).toBe("/foo");
  expect(urlMerge("/", "//foo", options)).toBe("/foo");
  expect(urlMerge("/", "/foo//", options)).toBe("/foo");
  expect(urlMerge("/", "/foo/", "", options)).toBe("/foo");
  expect(urlMerge("/", "/foo/", "/", options)).toBe("/foo");
  expect(urlMerge("foo", "bar", options)).toBe("foo/bar");
  expect(urlMerge("/foo", "bar", options)).toBe("/foo/bar");
  expect(urlMerge("/foo", "/bar", options)).toBe("/foo/bar");
  expect(urlMerge("/foo/", "/bar/", options)).toBe("/foo/bar");
  expect(urlMerge("/foo/", "/bar/baz", options)).toBe("/foo/bar/baz");
  expect(urlMerge("/foo/", "/bar//baz", options)).toBe("/foo/bar/baz");

  expect(urlMerge("http://google.com", options)).toBe("http://google.com");
  expect(urlMerge("http://google.com/", options)).toBe("http://google.com");
  expect(urlMerge("http://google.com", "", options)).toBe("http://google.com");
  expect(urlMerge("http://google.com", "foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com/", "foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com/", "/foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com//", "/foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com/foo", "bar", options)).toBe(
    "http://google.com/foo/bar",
  );

  expect(urlMerge("http://google.com", "?queryString", options)).toBe(
    "http://google.com?queryString",
  );
  expect(urlMerge("http://google.com", "foo?queryString", options)).toBe(
    "http://google.com/foo?queryString",
  );
  expect(urlMerge("http://google.com", "foo", "?queryString", options)).toBe(
    "http://google.com/foo?queryString",
  );
  expect(urlMerge("http://google.com", "foo/", "?queryString", options)).toBe(
    "http://google.com/foo?queryString",
  );
});

test("should add leading slash and keep trailing slash", () => {
  const options = { trailingSlash: "keep" as const };

  expect(urlMerge(options)).toBe("/");
  expect(urlMerge(undefined, "foo", options)).toBe("/foo");
  expect(urlMerge("foo", null, "bar", options)).toBe("/foo/bar");
  expect(urlMerge("foo", "", "bar", options)).toBe("/foo/bar");
  expect(urlMerge("foo", options)).toBe("/foo");
  expect(urlMerge("/foo", options)).toBe("/foo");
  expect(urlMerge("/", "/foo", options)).toBe("/foo");
  expect(urlMerge("/", "//foo", options)).toBe("/foo");
  expect(urlMerge("/", "/foo//", options)).toBe("/foo/");
  expect(urlMerge("/", "/foo/", "", options)).toBe("/foo/");
  expect(urlMerge("/", "/foo/", "/", options)).toBe("/foo/");
  expect(urlMerge("foo", "bar", options)).toBe("/foo/bar");
  expect(urlMerge("/foo", "bar", options)).toBe("/foo/bar");
  expect(urlMerge("/foo", "/bar", options)).toBe("/foo/bar");
  expect(urlMerge("/foo/", "/bar/", options)).toBe("/foo/bar/");
  expect(urlMerge("/foo/", "/bar/baz", options)).toBe("/foo/bar/baz");
  expect(urlMerge("/foo/", "/bar//baz", options)).toBe("/foo/bar/baz");

  expect(urlMerge("http://google.com", options)).toBe("http://google.com");
  expect(urlMerge("http://google.com/", options)).toBe("http://google.com/");
  expect(urlMerge("http://google.com", "", options)).toBe("http://google.com");
  expect(urlMerge("http://google.com", "foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com/", "foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com/", "/foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com//", "/foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com/foo", "bar", options)).toBe(
    "http://google.com/foo/bar",
  );

  expect(urlMerge("http://google.com", "?queryString", options)).toBe(
    "http://google.com?queryString",
  );
  expect(urlMerge("http://google.com", "foo?queryString", options)).toBe(
    "http://google.com/foo?queryString",
  );
  expect(urlMerge("http://google.com", "foo", "?queryString", options)).toBe(
    "http://google.com/foo?queryString",
  );
  expect(urlMerge("http://google.com", "foo/", "?queryString", options)).toBe(
    "http://google.com/foo/?queryString",
  );
});

test("should keep leading slash and add trailing slash", () => {
  const options = {
    leadingSlash: "keep" as const,
    trailingSlash: true as const,
  };

  expect(urlMerge(options)).toBe("/");
  expect(urlMerge(undefined, "foo", options)).toBe("foo/");
  expect(urlMerge("foo", null, "bar", options)).toBe("foo/bar/");
  expect(urlMerge("foo", "", "bar", options)).toBe("foo/bar/");
  expect(urlMerge("foo", options)).toBe("foo/");
  expect(urlMerge("/foo", options)).toBe("/foo/");
  expect(urlMerge("/", "/foo", options)).toBe("/foo/");
  expect(urlMerge("/", "//foo", options)).toBe("/foo/");
  expect(urlMerge("/", "/foo//", options)).toBe("/foo/");
  expect(urlMerge("/", "/foo/", "", options)).toBe("/foo/");
  expect(urlMerge("/", "/foo/", "/", options)).toBe("/foo/");
  expect(urlMerge("foo", "bar", options)).toBe("foo/bar/");
  expect(urlMerge("/foo", "bar", options)).toBe("/foo/bar/");
  expect(urlMerge("/foo", "/bar", options)).toBe("/foo/bar/");
  expect(urlMerge("/foo/", "/bar/", options)).toBe("/foo/bar/");
  expect(urlMerge("/foo/", "/bar/baz", options)).toBe("/foo/bar/baz/");
  expect(urlMerge("/foo/", "/bar//baz", options)).toBe("/foo/bar/baz/");

  expect(urlMerge("http://google.com", options)).toBe("http://google.com/");
  expect(urlMerge("http://google.com/", options)).toBe("http://google.com/");
  expect(urlMerge("http://google.com", "", options)).toBe(
    "http://google.com/",
  );
  expect(urlMerge("http://google.com", "foo", options)).toBe(
    "http://google.com/foo/",
  );
  expect(urlMerge("http://google.com/", "foo", options)).toBe(
    "http://google.com/foo/",
  );
  expect(urlMerge("http://google.com/", "/foo", options)).toBe(
    "http://google.com/foo/",
  );
  expect(urlMerge("http://google.com//", "/foo", options)).toBe(
    "http://google.com/foo/",
  );
  expect(urlMerge("http://google.com/foo", "bar", options)).toBe(
    "http://google.com/foo/bar/",
  );

  expect(urlMerge("http://google.com", "?queryString", options)).toBe(
    "http://google.com/?queryString",
  );
  expect(urlMerge("http://google.com", "foo?queryString", options)).toBe(
    "http://google.com/foo/?queryString",
  );
  expect(urlMerge("http://google.com", "foo", "?queryString", options)).toBe(
    "http://google.com/foo/?queryString",
  );
  expect(urlMerge("http://google.com", "foo/", "?queryString", options)).toBe(
    "http://google.com/foo/?queryString",
  );
  expect(urlMerge("http://google.com?queryString", options)).toBe(
    "http://google.com/?queryString",
  );
});

test("should remove leading slash and keep trailing slash", () => {
  const options = {
    leadingSlash: false as const,
    trailingSlash: "keep" as const,
  };

  expect(urlMerge(options)).toBe("");
  expect(urlMerge(undefined, "foo", options)).toBe("foo");
  expect(urlMerge("foo", null, "bar", options)).toBe("foo/bar");
  expect(urlMerge("foo", "", "bar", options)).toBe("foo/bar");
  expect(urlMerge("foo", options)).toBe("foo");
  expect(urlMerge("/foo", options)).toBe("foo");
  expect(urlMerge("/", "/foo", options)).toBe("foo");
  expect(urlMerge("/", "//foo", options)).toBe("foo");
  expect(urlMerge("/", "/foo//", options)).toBe("foo/");
  expect(urlMerge("/", "/foo/", "", options)).toBe("foo/");
  expect(urlMerge("/", "/foo/", "/", options)).toBe("foo/");
  expect(urlMerge("foo", "bar", options)).toBe("foo/bar");
  expect(urlMerge("/foo", "bar", options)).toBe("foo/bar");
  expect(urlMerge("/foo", "/bar", options)).toBe("foo/bar");
  expect(urlMerge("/foo/", "/bar/", options)).toBe("foo/bar/");
  expect(urlMerge("/foo/", "/bar/baz", options)).toBe("foo/bar/baz");
  expect(urlMerge("/foo/", "/bar//baz", options)).toBe("foo/bar/baz");

  expect(urlMerge("http://google.com", options)).toBe("http://google.com");
  expect(urlMerge("http://google.com/", options)).toBe("http://google.com/");

  expect(urlMerge("http://google.com", "", options)).toBe("http://google.com");
  expect(urlMerge("http://google.com", "foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com/", "foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com/", "/foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com//", "/foo", options)).toBe(
    "http://google.com/foo",
  );
  expect(urlMerge("http://google.com/foo", "bar", options)).toBe(
    "http://google.com/foo/bar",
  );

  expect(urlMerge("http://google.com", "?queryString", options)).toBe(
    "http://google.com?queryString",
  );
  expect(urlMerge("http://google.com", "foo?queryString", options)).toBe(
    "http://google.com/foo?queryString",
  );
  expect(urlMerge("http://google.com", "foo", "?queryString", options)).toBe(
    "http://google.com/foo?queryString",
  );
  expect(urlMerge("http://google.com", "foo/", "?queryString", options)).toBe(
    "http://google.com/foo/?queryString",
  );
  expect(urlMerge("http://google.com?queryString", options)).toBe(
    "http://google.com?queryString",
  );
});
