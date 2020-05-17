import {
  assertEquals,
  assertStrictEq,
} from "https://deno.land/std/testing/asserts.ts";
import Negotiator from "../mod.ts";

const { test } = Deno;

test("negotiator.mediaType() when no Accept should return */*", () => {
  const negotiator = new Negotiator(new Headers());
  assertStrictEq(negotiator.mediaType(), "*/*");
});

test("negotiator.mediaType() when Accept: */* should return */*", () => {
  const negotiator = new Negotiator(new Headers([["Accept", "*/*"]]));
  assertStrictEq(negotiator.mediaType(), "*/*");
});

test("negotiator.mediaType() when Accept: application/json should return application/json", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept", "application/json"]]),
  );
  assertStrictEq(negotiator.mediaType(), "application/json");
});

test("negotiator.mediaType() when Accept: application/json;q=0 should return undefined", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept", "application/json;q=0"]]),
  );
  assertStrictEq(negotiator.mediaType(), undefined);
});

test("negotiator.mediaType() when Accept: text/* should return text/*", () => {
  const negotiator = new Negotiator(new Headers([["Accept", "text/*"]]));
  assertStrictEq(negotiator.mediaType(), "text/*");
});

test("negotiator.mediaType() when Accept: text/plain, application/json;q=0.5, text/html, */*;q=0.1 should return text/plain", () => {
  const negotiator = new Negotiator(
    new Headers(
      [["Accept", "text/plain, application/json;q=0.5, text/html, */*;q=0.1"]],
    ),
  );
  assertStrictEq(negotiator.mediaType(), "text/plain");
});

test("negotiator.mediaType() when Accept: text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1 should return text/plain", () => {
  const negotiator = new Negotiator(
    new Headers(
      [[
        "Accept",
        "text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1",
      ]],
    ),
  );
  assertStrictEq(negotiator.mediaType(), "text/plain");
});

test("negotiator.mediaType(array) when no Accept should return first item in list", () => {
  const negotiator = new Negotiator(new Headers());
  assertStrictEq(negotiator.mediaType(["text/html"]), "text/html");
  assertStrictEq(
    negotiator.mediaType(["text/html", "application/json"]),
    "text/html",
  );
  assertStrictEq(
    negotiator.mediaType(["application/json", "text/html"]),
    "application/json",
  );
});

test("negotiator.mediaType(array) when Accept: */* should return */*", () => {
  const negotiator = new Negotiator(new Headers([["Accept", "*/*"]]));
  assertStrictEq(negotiator.mediaType(["text/html"]), "text/html");
  assertStrictEq(
    negotiator.mediaType(["text/html", "application/json"]),
    "text/html",
  );
  assertStrictEq(
    negotiator.mediaType(["application/json", "text/html"]),
    "application/json",
  );
});

test("negotiator.mediaType(array) when Accept: application/json should be case insensitive", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept", "application/json"]]),
  );
  assertStrictEq(
    negotiator.mediaType(["application/JSON"]),
    "application/JSON",
  );
});

test("negotiator.mediaType(array) when Accept: application/json should only return application/json", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept", "application/json"]]),
  );
  assertStrictEq(negotiator.mediaType(["text/html"]), undefined);
  assertStrictEq(
    negotiator.mediaType(["text/html", "application/json"]),
    "application/json",
  );
});

test("negotiator.mediaType(array) when Accept: application/json;q=0 should return undefined", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept", "application/json;q=0"]]),
  );
  assertStrictEq(negotiator.mediaType([]), undefined);
});

test("negotiator.mediaType(array) when Accept: application/json;q=0.2, text/html should prefer text/html over application/json", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept", "application/json;q=0.2, text/html"]]),
  );
  assertStrictEq(
    negotiator.mediaType(["application/json"]),
    "application/json",
  );
  assertStrictEq(
    negotiator.mediaType(["application/json", "text/html"]),
    "text/html",
  );
  assertStrictEq(
    negotiator.mediaType(["text/html", "application/json"]),
    "text/html",
  );
});

test("negotiator.mediaType(array) when Accept: text/* should prefer text media types", () => {
  const negotiator = new Negotiator(new Headers([["Accept", "text/*"]]));
  assertStrictEq(negotiator.mediaType(["application/json"]), undefined);
  assertStrictEq(
    negotiator.mediaType(["application/json", "text/html"]),
    "text/html",
  );
  assertStrictEq(
    negotiator.mediaType(["text/html", "application/json"]),
    "text/html",
  );
});

test("negotiator.mediaType(array) when Accept: text/*, text/plain;q=0 should prefer text media types", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept", "text/*, text/plain;q=0"]]),
  );
  assertStrictEq(negotiator.mediaType(["application/json"]), undefined);
  assertStrictEq(
    negotiator.mediaType(["application/json", "text/html"]),
    "text/html",
  );
  assertStrictEq(
    negotiator.mediaType(["text/html", "application/json"]),
    "text/html",
  );
});

test("negotiator.mediaType(array) when Accept: text/plain, application/json;q=0.5, text/html, */*;q=0.1 should return in preferred order", () => {
  const negotiator = new Negotiator(
    new Headers(
      [["Accept", "text/plain, application/json;q=0.5, text/html, */*;q=0.1"]],
    ),
  );
  assertStrictEq(
    negotiator.mediaType(["application/json", "text/plain", "text/html"]),
    "text/plain",
  );
  assertStrictEq(
    negotiator.mediaType(["image/jpeg", "text/html"]),
    "text/html",
  );
  assertStrictEq(
    negotiator.mediaType(["image/jpeg", "image/gif"]),
    "image/jpeg",
  );
});

test("negotiator.mediaType(array) when Accept: text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1 should return the client-preferred order", () => {
  const negotiator = new Negotiator(
    new Headers(
      [[
        "Accept",
        "text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1",
      ]],
    ),
  );
  assertStrictEq(
    negotiator.mediaType(
      [
        "text/plain",
        "text/html",
        "text/xml",
        "text/yaml",
        "text/javascript",
        "text/csv",
        "text/css",
        "text/rtf",
        "text/markdown",
        "application/json",
        "application/octet-stream",
      ],
    ),
    "text/plain",
  );
});

test("negotiator.mediaTypes() when no Accept should return */*", () => {
  const negotiator = new Negotiator(new Headers());
  assertEquals(negotiator.mediaTypes(), ["*/*"]);
});

test("negotiator.mediaTypes() when Accept: */* should return */*", () => {
  const negotiator = new Negotiator(new Headers([["Accept", "*/*"]]));
  mediaTypesPreferred("*/*", ["*/*"]);
});

test("negotiator.mediaTypes() when Accept: application/json should return application/json", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept", "application/json"]]),
  );
  assertEquals(negotiator.mediaTypes(), ["application/json"]);
});

test("negotiator.mediaTypes() when Accept: application/json;q=0 should return empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept", "application/json;q=0"]]),
  );
  assertEquals(negotiator.mediaTypes(), []);
});

test("negotiator.mediaTypes() when Accept: application/json;q=0.2, text/html should return text/html, application/json", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept", "application/json;q=0.2, text/html"]]),
  );
  assertEquals(negotiator.mediaTypes(), ["text/html", "application/json"]);
});

test("negotiator.mediaTypes() when Accept: text/* should return text/html, application/json", () => {
  const negotiator = new Negotiator(new Headers([["Accept", "text/*"]]));
  assertEquals(negotiator.mediaTypes(), ["text/*"]);
});

test("negotiator.mediaTypes() when Accept: text/* should return text/html, application/json", () => {
  const negotiator = new Negotiator(new Headers([["Accept", "text/*"]]));
  assertEquals(negotiator.mediaTypes(), ["text/*"]);
});

test("negotiator.mediaTypes() when Accept: text/*, text/plain;q=0 should return text/*", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept", "text/*, text/plain;q=0"]]),
  );
  assertEquals(negotiator.mediaTypes(), ["text/*"]);
});

test("negotiator.mediaTypes() when Accept: text/html;LEVEL=1 should return text/html;LEVEL=1", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept", "text/html;LEVEL=1"]]),
  );
  assertEquals(negotiator.mediaTypes(), ["text/html"]);
});

test('negotiator.mediaTypes() when Accept: text/html;foo="bar,text/css;";fizz="buzz,5", text/plain should return text/html, text/plain', () => {
  const negotiator = new Negotiator(
    new Headers(
      [["Accept", 'text/html;foo="bar,text/css;";fizz="buzz,5", text/plain']],
    ),
  );
  assertEquals(negotiator.mediaTypes(), ["text/html", "text/plain"]);
});

test("negotiator.mediaTypes() when Accept: text/plain, application/json;q=0.5, text/html, */*;q=0.1 should return text/plain, text/html, application/json, */*", () => {
  const negotiator = new Negotiator(
    new Headers(
      [["Accept", "text/plain, application/json;q=0.5, text/html, */*;q=0.1"]],
    ),
  );
  assertEquals(
    negotiator.mediaTypes(),
    ["text/plain", "text/html", "application/json", "*/*"],
  );
});

test("negotiator.mediaTypes() when Accept: text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1 should return the client-preferred order", () => {
  const negotiator = new Negotiator(
    new Headers(
      [[
        "Accept",
        "text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1",
      ]],
    ),
  );
  assertEquals(
    negotiator.mediaTypes(),
    [
      "text/plain",
      "text/html",
      "text/xml",
      "text/yaml",
      "text/javascript",
      "text/csv",
      "text/css",
      "text/rtf",
      "text/markdown",
      "application/json",
      "application/octet-stream",
      "*/*",
    ],
  );
});

test("negotiator.mediaTypes(array) when no Accept should return return original list", () => {
  mediaTypesNegotiated(
    null,
    ["application/json", "text/plain"],
    ["application/json", "text/plain"],
  );
});

test("negotiator.mediaTypes(array) when Accept: */* should return return original list", () => {
  mediaTypesNegotiated(
    "*/*",
    ["application/json", "text/plain"],
    ["application/json", "text/plain"],
  );
});

test("negotiator.mediaTypes(array) when Accept: */*;q=0.8, text/*, image/* should return return stable-sorted list", () => {
  mediaTypesNegotiated(
    "*/*;q=0.8, text/*, image/*",
    [
      "application/json",
      "text/html",
      "text/plain",
      "text/xml",
      "application/xml",
      "image/gif",
      "image/jpeg",
      "image/png",
      "audio/mp3",
      "application/javascript",
      "text/javascript",
    ],
    [
      "text/html",
      "text/plain",
      "text/xml",
      "text/javascript",
      "image/gif",
      "image/jpeg",
      "image/png",
      "application/json",
      "application/xml",
      "audio/mp3",
      "application/javascript",
    ],
  );
});

test("negotiator.mediaTypes(array) when Accept: application/json should accept application/json", () => {
  mediaTypesNegotiated(
    "application/json",
    ["application/json"],
    ["application/json"],
  );
});

test("negotiator.mediaTypes(array) when Accept: application/json should be case insensitive", () => {
  mediaTypesNegotiated(
    "application/json",
    ["application/JSON"],
    ["application/JSON"],
  );
});

test("negotiator.mediaTypes(array) when Accept: application/json should only return application/json", () => {
  mediaTypesNegotiated(
    "application/json",
    ["text/html", "application/json"],
    ["application/json"],
  );
});

test("negotiator.mediaTypes(array) when Accept: application/json should ignore invalid types", () => {
  mediaTypesNegotiated(
    "application/json",
    ["boom", "application/json"],
    ["application/json"],
  );
});

test("negotiator.mediaTypes(array) when Accept: application/json;q=0 should not accept application/json", () => {
  mediaTypesNegotiated("application/json;q=0", ["application/json"], []);
});

test("negotiator.mediaTypes(array) when Accept: application/json;q=0 should not accept other media types", () => {
  mediaTypesNegotiated(
    "application/json;q=0",
    ["application/json", "text/html", "image/jpeg"],
    [],
  );
});

test("negotiator.mediaTypes(array) when Accept: application/json;q=0.2, text/html should prefer text/html over application/json", () => {
  mediaTypesNegotiated(
    "application/json;q=0.2, text/html",
    ["application/json", "text/html"],
    ["text/html", "application/json"],
  );
});

test("negotiator.mediaTypes(array) when Accept: application/json;q=0.9, text/html;q=0.8, application/json;q=0.7 should prefer application/json over text/html", () => {
  mediaTypesNegotiated(
    "application/json;q=0.9, text/html;q=0.8, application/json;q=0.7",
    ["text/html", "application/json"],
    ["application/json", "text/html"],
  );
});

test("negotiator.mediaTypes(array) when Accept: application/json, */*;q=0.1 should prefer application/json over text/html", () => {
  mediaTypesNegotiated(
    "application/json, */*;q=0.1",
    ["text/html", "application/json"],
    ["application/json", "text/html"],
  );
});

test('negotiator.mediaTypes(array) when Accept: application/xhtml+xml;profile="http://www.wapforum.org/xhtml" should accept application/xhtml+xml;profile="http://www.wapforum.org/xhtml"', () => {
  mediaTypesNegotiated(
    'application/xhtml+xml;profile="http://www.wapforum.org/xhtml"',
    ['application/xhtml+xml;profile="http://www.wapforum.org/xhtml"'],
    ['application/xhtml+xml;profile="http://www.wapforum.org/xhtml"'],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/* should prefer text media types", () => {
  mediaTypesNegotiated(
    "text/*",
    ["text/html", "application/json", "text/plain"],
    ["text/html", "text/plain"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/*, text/html;level should accept text/html", () => {
  mediaTypesNegotiated("text/*, text/html;level", ["text/html"], ["text/html"]);
});

test("negotiator.mediaTypes(array) when Accept: text/*, text/plain;q=0 should prefer text media types except text/plain", () => {
  mediaTypesNegotiated(
    "text/*, text/plain;q=0",
    ["text/html", "text/plain"],
    ["text/html"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/*, text/plain;q=0.5 should prefer text/plain below other text types", () => {
  mediaTypesNegotiated(
    "text/*, text/plain;q=0.5",
    ["text/html", "text/plain", "text/xml"],
    ["text/html", "text/xml", "text/plain"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/html;level=1 should accept text/html;level=1", () => {
  mediaTypesNegotiated(
    "text/html;level=1",
    ["text/html;level=1"],
    ["text/html;level=1"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/html;level=1 should accept text/html;Level=1", () => {
  mediaTypesNegotiated(
    "text/html;level=1",
    ["text/html;Level=1"],
    ["text/html;Level=1"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/html;level=1 should not accept text/html;level=2", () => {
  mediaTypesNegotiated("text/html;level=1", ["text/html;level=2"], []);
});

test("negotiator.mediaTypes(array) when Accept: text/html;level=1 should not accept text/html", () => {
  mediaTypesNegotiated("text/html;level=1", ["text/html"], []);
});

test("negotiator.mediaTypes(array) when Accept: text/html;level=1 should accept text/html;level=1;foo=bar", () => {
  mediaTypesNegotiated(
    "text/html;level=1",
    ["text/html;level=1;foo=bar"],
    ["text/html;level=1;foo=bar"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/html;level=1;foo=bar should not accept text/html;level=1", () => {
  mediaTypesNegotiated("text/html;level=1;foo=bar", ["text/html;level=1"], []);
});

test("negotiator.mediaTypes(array) when Accept: text/html;level=1;foo=bar should accept text/html;level=1;foo=bar", () => {
  mediaTypesNegotiated(
    "text/html;level=1;foo=bar",
    ["text/html;level=1;foo=bar"],
    ["text/html;level=1;foo=bar"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/html;level=1;foo=bar should accept text/html;foo=bar;level=1", () => {
  mediaTypesNegotiated(
    "text/html;level=1;foo=bar",
    ["text/html;foo=bar;level=1"],
    ["text/html;foo=bar;level=1"],
  );
});

test('negotiator.mediaTypes(array) when Accept: text/html;level=1;foo="bar" should accept text/html;foo=bar;level=1', () => {
  mediaTypesNegotiated(
    'text/html;level=1;foo="bar"',
    ["text/html;level=1;foo=bar"],
    ["text/html;level=1;foo=bar"],
  );
});

test('negotiator.mediaTypes(array) when Accept: text/html;level=1;foo="bar" should accept text/html;level=1;foo="bar"', () => {
  mediaTypesNegotiated(
    'text/html;level=1;foo="bar"',
    ['text/html;level=1;foo="bar"'],
    ['text/html;level=1;foo="bar"'],
  );
});

test('negotiator.mediaTypes(array) when Accept: text/html;foo=";level=2;" should not accept text/html;level=2', () => {
  mediaTypesNegotiated('text/html;foo=";level=2;"', ["text/html;level=2"], []);
});

test('negotiator.mediaTypes(array) when Accept: text/html;foo=";level=2;" should accept text/html;foo=";level=2;"', () => {
  mediaTypesNegotiated(
    'text/html;foo=";level=2;"',
    ['text/html;foo=";level=2;"'],
    ['text/html;foo=";level=2;"'],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/html;LEVEL=1 should accept text/html;level=1", () => {
  mediaTypesNegotiated(
    "text/html;LEVEL=1",
    ["text/html;level=1"],
    ["text/html;level=1"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/html;LEVEL=1 should accept text/html;Level=1", () => {
  mediaTypesNegotiated(
    "text/html;LEVEL=1",
    ["text/html;Level=1"],
    ["text/html;Level=1"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/html;LEVEL=1;level=2 should accept text/html;level=2", () => {
  mediaTypesNegotiated(
    "text/html;LEVEL=1;level=2",
    ["text/html;level=2"],
    ["text/html;level=2"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/html;LEVEL=1;level=2 should not accept text/html;level=1", () => {
  mediaTypesNegotiated("text/html;LEVEL=1;level=2", ["text/html;level=1"], []);
});

test("negotiator.mediaTypes(array) when Accept: text/html;level=2 should not accept text/html;level=1", () => {
  mediaTypesNegotiated("text/html;level=2", ["text/html;level=1"], []);
});

test("negotiator.mediaTypes(array) when Accept: text/html;level=2, text/html should prefer text/html;level=2 over text/html", () => {
  mediaTypesNegotiated(
    "text/html;level=2, text/html",
    ["text/html", "text/html;level=2"],
    ["text/html;level=2", "text/html"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/html;level=2;q=0.1, text/html should prefer text/html over text/html;level=2", () => {
  mediaTypesNegotiated(
    "text/html;level=2;q=0.1, text/html",
    ["text/html;level=2", "text/html"],
    ["text/html", "text/html;level=2"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/html;level=2;q=0.1;level=1 should not accept text/html;level=1", () => {
  mediaTypesNegotiated(
    "text/html;level=2;q=0.1;level=1",
    ["text/html;level=1"],
    [],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/html;level=2;q=0.1, text/html;level=1, text/html;q=0.5 should prefer text/html;level=1, text/html, text/html;level=2", () => {
  mediaTypesNegotiated(
    "text/html;level=2;q=0.1, text/html;level=1, text/html;q=0.5",
    ["text/html;level=1", "text/html;level=2", "text/html"],
    ["text/html;level=1", "text/html", "text/html;level=2"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/plain, application/json;q=0.5, text/html, */*;q=0.1 should prefer text/plain over text/html", () => {
  mediaTypesNegotiated(
    "text/plain, application/json;q=0.5, text/html, */*;q=0.1",
    ["text/html", "text/plain"],
    ["text/plain", "text/html"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/plain, application/json;q=0.5, text/html, */*;q=0.1 should prefer application/json after text", () => {
  mediaTypesNegotiated(
    "text/plain, application/json;q=0.5, text/html, */*;q=0.1",
    ["application/json", "text/html", "text/plain"],
    ["text/plain", "text/html", "application/json"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/plain, application/json;q=0.5, text/html, */*;q=0.1 should prefer image/jpeg after text", () => {
  mediaTypesNegotiated(
    "text/plain, application/json;q=0.5, text/html, */*;q=0.1",
    ["image/jpeg", "text/html", "text/plain"],
    ["text/plain", "text/html", "image/jpeg"],
  );
});

test("negotiator.mediaTypes(array) when Accept: text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1 should return the client-preferred order", () => {
  mediaTypesNegotiated(
    "text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1",
    [
      "text/plain",
      "text/html",
      "text/xml",
      "text/yaml",
      "text/javascript",
      "text/csv",
      "text/css",
      "text/rtf",
      "text/markdown",
      "application/json",
      "application/octet-stream",
    ],
    [
      "text/plain",
      "text/html",
      "text/xml",
      "text/yaml",
      "text/javascript",
      "text/csv",
      "text/css",
      "text/rtf",
      "text/markdown",
      "application/json",
      "application/octet-stream",
    ],
  );
});

function mediaTypesNegotiated(
  header: string | null,
  serverTypes: string[],
  preferredTypes: string[],
) {
  const headers = new Headers();
  if (header) {
    headers.set("Accept", header);
  }
  const negotiator = new Negotiator(headers);
  assertEquals(negotiator.mediaTypes(serverTypes), preferredTypes);
}

function mediaTypesPreferred(header: string, preferredTypes: string[]) {
  const negotiator = new Negotiator(new Headers([["Accept", header]]));
  assertEquals(negotiator.mediaTypes(), preferredTypes);
}
