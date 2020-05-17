import {
  assertEquals,
  assertStrictEq,
} from "https://deno.land/std/testing/asserts.ts";
import Negotiator from "../mod.ts";

const { test } = Deno;

test("negotiator.charset() when no Accept-Charset should return *", () => {
  const negotiator = new Negotiator(new Headers());
  assertStrictEq(negotiator.charset(), "*");
});

test("negotiator.charset() when Accept-Charset: * should return *", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Charset", "*"]]));
  assertStrictEq(negotiator.charset(), "*");
});

test("negotiator.charset() when Accept-Charset: *, UTF-8 should return *", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*, UTF-8"]]),
  );
  assertStrictEq(negotiator.charset(), "*");
});

test("negotiator.charset() when Accept-Charset: *, UTF-8;q=0 should return *", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*, UTF-8"]]),
  );
  assertStrictEq(negotiator.charset(), "*");
});

test("negotiator.charset() when Accept-Charset: ISO-8859-1 should return ISO-8859-1", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "ISO-8859-1"]]),
  );
  assertStrictEq(negotiator.charset(), "ISO-8859-1");
});

test("negotiator.charset() when Accept-Charset: UTF-8;q=0 should return undefined", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8;q=0"]]),
  );
  assertStrictEq(negotiator.charset(), undefined);
});

test("negotiator.charset() when Accept-Charset: UTF-8, ISO-8859-1 should return UTF-8", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8, ISO-8859-1"]]),
  );
  assertStrictEq(negotiator.charset(), "UTF-8");
});

test("negotiator.charset() when Accept-Charset: UTF-8;q=0.8, ISO-8859-1 should return ISO-8859-1", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8;q=0.8, ISO-8859-1"]]),
  );
  assertStrictEq(negotiator.charset(), "ISO-8859-1");
});

test("negotiator.charset() when Accept-Charset: UTF-8;q=0.9, ISO-8859-1;q=0.8, UTF-8;q=0.7 should return UTF-8", () => {
  const negotiator = new Negotiator(
    new Headers(
      [["Accept-Charset", "UTF-8;q=0.9, ISO-8859-1;q=0.8, UTF-8;q=0.7"]],
    ),
  );
  assertStrictEq(negotiator.charset(), "UTF-8");
});

test("negotiator.charset(array) when no Accept-Charset should return undefined for empty list", () => {
  const negotiator = new Negotiator(
    new Headers(),
  );
  assertStrictEq(negotiator.charset([]), undefined);
});

test("negotiator.charset(array) when no Accept-Charset should return first type in list", () => {
  const negotiator = new Negotiator(
    new Headers(),
  );
  assertStrictEq(negotiator.charset(["UTF-8"]), "UTF-8");
  assertStrictEq(negotiator.charset(["UTF-8", "ISO-8859-1"]), "UTF-8");
});

test("negotiator.charset(array) when Accept-Charset: * should return undefined for empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*"]]),
  );
  assertStrictEq(negotiator.charset([]), undefined);
});

test("negotiator.charset(array) when Accept-Charset: * should return first type in list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*"]]),
  );
  assertStrictEq(negotiator.charset(["UTF-8"]), "UTF-8");
  assertStrictEq(negotiator.charset(["UTF-8", "ISO-8859-1"]), "UTF-8");
});

test("negotiator.charset(array) when Accept-Charset: *, UTF-8 should return first type in list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*, UTF-8"]]),
  );
  assertStrictEq(negotiator.charset(["UTF-8"]), "UTF-8");
  assertStrictEq(negotiator.charset(["UTF-8", "ISO-8859-1"]), "UTF-8");
});

test("negotiator.charset(array) when Accept-Charset: *, UTF-8;q=0 should return most client-preferred charset", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*, UTF-8;q=0"]]),
  );
  assertStrictEq(negotiator.charset(["UTF-8", "ISO-8859-1"]), "ISO-8859-1");
});

test("negotiator.charset(array) when Accept-Charset: *, UTF-8;q=0 should exclude UTF-8", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*, UTF-8;q=0"]]),
  );
  assertStrictEq(negotiator.charset(["UTF-8"]), undefined);
});

test("negotiator.charset(array) when Accept-Charset: ISO-8859-1 should return matching charset", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "ISO-8859-1"]]),
  );
  assertStrictEq(negotiator.charset(["ISO-8859-1"]), "ISO-8859-1");
  assertStrictEq(negotiator.charset(["UTF-8", "ISO-8859-1"]), "ISO-8859-1");
});

test("negotiator.charset(array) when Accept-Charset: ISO-8859-1 should be case insensitive, returning provided casing", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "ISO-8859-1"]]),
  );
  assertStrictEq(negotiator.charset(["iso-8859-1"]), "iso-8859-1");
  assertStrictEq(
    negotiator.charset(["iso-8859-1", "ISO-8859-1"]),
    "iso-8859-1",
  );
  assertStrictEq(
    negotiator.charset(["ISO-8859-1", "iso-8859-1"]),
    "ISO-8859-1",
  );
});

test("negotiator.charset(array) when Accept-Charset: ISO-8859-1 should return undefined when no matching charsets", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "ISO-8859-1"]]),
  );
  assertStrictEq(negotiator.charset(["UTF-8"]), undefined);
});

test("negotiator.charset(array) when Accept-Charset: UTF-8;q=0 should always return undefined", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8;q=0"]]),
  );
  assertStrictEq(negotiator.charset(["ISO-8859-1"]), undefined);
  assertStrictEq(
    negotiator.charset(["UTF-8", "KOI8-R", "ISO-8859-1"]),
    undefined,
  );
  assertStrictEq(negotiator.charset(["KOI8-R"]), undefined);
});

test("negotiator.charset(array) when Accept-Charset: UTF-8, ISO-8859-1 should return first matching charset", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8, ISO-8859-1"]]),
  );
  assertStrictEq(negotiator.charset(["ISO-8859-1"]), "ISO-8859-1");
  assertStrictEq(
    negotiator.charset(["UTF-8", "KOI8-R", "ISO-8859-1"]),
    "UTF-8",
  );
});

test("negotiator.charset(array) when Accept-Charset: UTF-8, ISO-8859-1 should return undefined when no matching charsets", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8, ISO-8859-1"]]),
  );
  assertStrictEq(negotiator.charset(["KOI8-R"]), undefined);
});

test("negotiator.charset(array) when Accept-Charset: UTF-8;q=0.8, ISO-8859-1 should return undefined when no matching charsets", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8;q=0.8, ISO-8859-1"]]),
  );
  assertStrictEq(negotiator.charset(["ISO-8859-1"]), "ISO-8859-1");
  assertStrictEq(
    negotiator.charset(["UTF-8", "KOI8-R", "ISO-8859-1"]),
    "ISO-8859-1",
  );
  assertStrictEq(negotiator.charset(["UTF-8", "KOI8-R"]), "UTF-8");
});

test("negotiator.charset(array) when Accept-Charset: UTF-8;q=0.9, ISO-8859-1;q=0.8, UTF-8;q=0.7 should use highest perferred order on duplicate", () => {
  const negotiator = new Negotiator(
    new Headers(
      [["Accept-Charset", "UTF-8;q=0.9, ISO-8859-1;q=0.8, UTF-8;q=0.7"]],
    ),
  );
  assertStrictEq(negotiator.charset(["ISO-8859-1"]), "ISO-8859-1");
  assertStrictEq(negotiator.charset(["UTF-8", "ISO-8859-1"]), "UTF-8");
  assertStrictEq(negotiator.charset(["ISO-8859-1", "UTF-8"]), "UTF-8");
});

test("negotiator.charsets() when no Accept-Charset should return *", () => {
  const negotiator = new Negotiator(
    new Headers(),
  );
  assertEquals(negotiator.charsets(), ["*"]);
});

test("negotiator.charsets() when Accept-Charset: * should return *", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*"]]),
  );
  assertEquals(negotiator.charsets(), ["*"]);
});

test("negotiator.charsets() when Accept-Charset: *, UTF-8 should return *", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*, UTF-8"]]),
  );
  assertEquals(negotiator.charsets(), ["*", "UTF-8"]);
});

test("negotiator.charsets() when Accept-Charset: *, UTF-8;q=0 should exclude UTF-8", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*, UTF-8;q=0"]]),
  );
  assertEquals(negotiator.charsets(), ["*"]);
});

test("negotiator.charsets() when Accept-Charset: UTF-8;q=0 should return empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8;q=0"]]),
  );
  assertEquals(negotiator.charsets(), []);
});

test("negotiator.charsets() when Accept-Charset: ISO-8859-1 should return client-preferred charsets", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "ISO-8859-1"]]),
  );
  assertEquals(negotiator.charsets(), ["ISO-8859-1"]);
});

test("negotiator.charsets() when Accept-Charset: UTF-8, ISO-8859-1 should return client-preferred charsets", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8, ISO-8859-1"]]),
  );
  assertEquals(negotiator.charsets(), ["UTF-8", "ISO-8859-1"]);
});

test("negotiator.charsets() when Accept-Charset: UTF-8;q=0.8, ISO-8859-1 should return client-preferred charsets", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8;q=0.8, ISO-8859-1"]]),
  );
  assertEquals(negotiator.charsets(), ["ISO-8859-1", "UTF-8"]);
});

test("negotiator.charsets() when Accept-Charset: UTF-8;foo=bar;q=1, ISO-8859-1;q=1 should return client-preferred charsets", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8;foo=bar;q=1, ISO-8859-1;q=1"]]),
  );
  assertEquals(negotiator.charsets(), ["UTF-8", "ISO-8859-1"]);
});

test("negotiator.charsets() when Accept-Charset: UTF-8;q=0.9, ISO-8859-1;q=0.8, UTF-8;q=0.7 should use highest perferred order on duplicate", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8;foo=bar;q=1, ISO-8859-1;q=1"]]),
  );
  assertEquals(negotiator.charsets(), ["UTF-8", "ISO-8859-1"]);
});

test("negotiator.charsets(array) when no Accept-Charset should return empty list for empty list", () => {
  const negotiator = new Negotiator(
    new Headers(),
  );
  assertEquals(negotiator.charsets([]), []);
});

test("negotiator.charsets(array) when no Accept-Charset should return original list", () => {
  const negotiator = new Negotiator(
    new Headers(),
  );
  assertEquals(negotiator.charsets(["UTF-8"]), ["UTF-8"]);
  assertEquals(
    negotiator.charsets(["UTF-8", "ISO-8859-1"]),
    ["UTF-8", "ISO-8859-1"],
  );
});

test("negotiator.charsets(array) when Accept-Charset: * should return empty list for empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*"]]),
  );
  assertEquals(negotiator.charsets([]), []);
});

test("negotiator.charsets(array) when Accept-Charset: * should return original list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*"]]),
  );
  assertEquals(negotiator.charsets(["UTF-8"]), ["UTF-8"]);
  assertEquals(
    negotiator.charsets(["UTF-8", "ISO-8859-1"]),
    ["UTF-8", "ISO-8859-1"],
  );
});

test("negotiator.charsets(array) when Accept-Charset: *, UTF-8 should return matching charsets", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*, UTF-8"]]),
  );
  assertEquals(negotiator.charsets(["UTF-8"]), ["UTF-8"]);
  assertEquals(
    negotiator.charsets(["UTF-8", "ISO-8859-1"]),
    ["UTF-8", "ISO-8859-1"],
  );
});

test("negotiator.charsets(array) when Accept-Charset: *, UTF-8;q=0 should exclude UTF-8", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "*, UTF-8;q=0"]]),
  );
  assertEquals(negotiator.charsets(["UTF-8"]), []);
  assertEquals(negotiator.charsets(["UTF-8", "ISO-8859-1"]), ["ISO-8859-1"]);
});

test("negotiator.charsets(array) when Accept-Charset: UTF-8;q=0 should always return empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8;q=0"]]),
  );
  assertEquals(negotiator.charsets(["ISO-8859-1"]), []);
  assertEquals(negotiator.charsets(["UTF-8", "KOI8-R", "ISO-8859-1"]), []);
  assertEquals(negotiator.charsets(["KOI8-R"]), []);
});

test("negotiator.charsets(array) when Accept-Charset: ISO-8859-1 should return matching charsets", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "ISO-8859-1"]]),
  );
  assertEquals(negotiator.charsets(["ISO-8859-1"]), ["ISO-8859-1"]);
  assertEquals(negotiator.charsets(["UTF-8", "ISO-8859-1"]), ["ISO-8859-1"]);
});

test("negotiator.charsets(array) when Accept-Charset: ISO-8859-1 should be case insensitive, returning provided casing", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "ISO-8859-1"]]),
  );
  assertEquals(negotiator.charsets(["iso-8859-1"]), ["iso-8859-1"]);
  assertEquals(
    negotiator.charsets(["iso-8859-1", "ISO-8859-1"]),
    ["iso-8859-1", "ISO-8859-1"],
  );
  assertEquals(
    negotiator.charsets(["ISO-8859-1", "iso-8859-1"]),
    ["ISO-8859-1", "iso-8859-1"],
  );
});

test("negotiator.charsets(array) when Accept-Charset: ISO-8859-1 should return empty list when no matching charsets", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "ISO-8859-1"]]),
  );
  assertEquals(negotiator.charsets(["utf-8"]), []);
});

test("negotiator.charsets(array) when Accept-Charset: UTF-8, ISO-8859-1 should return matching charsets", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8, ISO-8859-1"]]),
  );
  assertEquals(negotiator.charsets(["ISO-8859-1"]), ["ISO-8859-1"]);
  assertEquals(
    negotiator.charsets(["UTF-8", "KOI8-R", "ISO-8859-1"]),
    ["UTF-8", "ISO-8859-1"],
  );
});

test("negotiator.charsets(array) when Accept-Charset: UTF-8, ISO-8859-1 should return empty list when no matching charsets'", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8, ISO-8859-1"]]),
  );
  assertEquals(negotiator.charsets(["KOI8-R"]), []);
});

test("negotiator.charsets(array) when Accept-Charset: UTF-8;q=0.8, ISO-8859-1 should return matching charsets in client-preferred order", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8;q=0.8, ISO-8859-1"]]),
  );
  assertEquals(negotiator.charsets(["ISO-8859-1"]), ["ISO-8859-1"]);
  assertEquals(
    negotiator.charsets(["UTF-8", "KOI8-R", "ISO-8859-1"]),
    ["ISO-8859-1", "UTF-8"],
  );
});

test("negotiator.charsets(array) when Accept-Charset: UTF-8;q=0.8, ISO-8859-1 should return empty list when no matching charsets", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Charset", "UTF-8;q=0.8, ISO-8859-1"]]),
  );
  assertEquals(negotiator.charsets(["KOI8-R"]), []);
});

test("negotiator.charsets(array) when Accept-Charset: UTF-8;q=0.9, ISO-8859-1;q=0.8, UTF-8;q=0.7 should use highest perferred order on duplicate", () => {
  const negotiator = new Negotiator(
    new Headers(
      [["Accept-Charset", "UTF-8;q=0.9, ISO-8859-1;q=0.8, UTF-8;q=0.7"]],
    ),
  );
  assertEquals(negotiator.charsets(["ISO-8859-1"]), ["ISO-8859-1"]);
  assertEquals(
    negotiator.charsets(["UTF-8", "ISO-8859-1"]),
    ["UTF-8", "ISO-8859-1"],
  );
  assertEquals(
    negotiator.charsets(["ISO-8859-1", "UTF-8"]),
    ["UTF-8", "ISO-8859-1"],
  );
});
