import {
  assertEquals,
  assertStrictEq,
} from "https://deno.land/std/testing/asserts.ts";
import Negotiator from "../mod.ts";

const { test } = Deno;

test("negotiator.language() when no Accept-Language should return *", () => {
  const negotiator = new Negotiator(new Headers());
  assertStrictEq(negotiator.language(), "*");
});

test("negotiator.language() when Accept-Language: * should return *", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Language", "*"]]));
  assertStrictEq(negotiator.language(), "*");
});

test("negotiator.language() when Accept-Language: *, en should return *", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*, en"]]),
  );
  assertStrictEq(negotiator.language(), "*");
});

test("negotiator.language() when Accept-Language: *, en;q=0 should return *", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*, en;q=0"]]),
  );
  assertStrictEq(negotiator.language(), "*");
});

test("negotiator.language() when Accept-Language: *;q=0.8, en, es should return en", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*;q=0.8, en, es"]]),
  );
  assertStrictEq(negotiator.language(), "en");
});

test("negotiator.language() when Accept-Language: en should return en", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Language", "en"]]));
  assertStrictEq(negotiator.language(), "en");
});

test("negotiator.language() when Accept-Language: en;q=0 should return undefined", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en;q=0"]]),
  );
  assertStrictEq(negotiator.language(), undefined);
});

test("negotiator.language() when Accept-Language: en;q=0.8, es should return es", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en;q=0.8, es"]]),
  );
  assertStrictEq(negotiator.language(), "es");
});

test("negotiator.language() when Accept-Language: en;q=0.9, es;q=0.8, en;q=0.7 should return en", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en;q=0.9, es;q=0.8, en;q=0.7"]]),
  );
  assertStrictEq(negotiator.language(), "en");
});

test("negotiator.language() when Accept-Language: en-US, en;q=0.8 should return en-US", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US, en;q=0.8"]]),
  );
  assertStrictEq(negotiator.language(), "en-US");
});

test("negotiator.language() when Accept-Language: en-US, en-GB should return en-US", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US, en-GB"]]),
  );
  assertStrictEq(negotiator.language(), "en-US");
});

test("negotiator.language() when Accept-Language: en-US;q=0.8, es should return es", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US;q=0.8, es"]]),
  );
  assertStrictEq(negotiator.language(), "es");
});

test("negotiator.language() when Accept-Language: nl;q=0.5, fr, de, en, it, es, pt, no, se, fi, ro should return fr", () => {
  const negotiator = new Negotiator(
    new Headers(
      [["Accept-Language", "nl;q=0.5, fr, de, en, it, es, pt, no, se, fi, ro"]],
    ),
  );
  assertStrictEq(negotiator.language(), "fr");
});

test("negotiator.language(array) when no Accept-Language should return undefined for empty list", () => {
  const negotiator = new Negotiator(new Headers());
  assertStrictEq(negotiator.language([]), undefined);
});

test("negotiator.language(array) when no Accept-Language should return first language in list", () => {
  const negotiator = new Negotiator(new Headers());
  assertStrictEq(negotiator.language(["en"]), "en");
  assertStrictEq(negotiator.language(["es", "en"]), "es");
});

test("negotiator.language(array) when Accept-Language: * should return undefined for empty list", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Language", "*"]]));
  assertStrictEq(negotiator.language([]), undefined);
});

test("negotiator.language(array) when Accept-Language: * should return first language in list", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Language", "*"]]));
  assertStrictEq(negotiator.language(["en"]), "en");
  assertStrictEq(negotiator.language(["es", "en"]), "es");
});

test("negotiator.language(array) when Accept-Language: *, en should return undefined for empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*, en"]]),
  );
  assertStrictEq(negotiator.language([]), undefined);
});

test("negotiator.language(array) when Accept-Language: *, en should return most preferred language", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*, en"]]),
  );
  assertStrictEq(negotiator.language(["en"]), "en");
  assertStrictEq(negotiator.language(["es", "en"]), "en");
});

test("negotiator.language(array) when Accept-Language: *, en;q=0 should return undefined for empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*, en;q=0"]]),
  );
  assertStrictEq(negotiator.language([]), undefined);
});

test("negotiator.language(array) when Accept-Language: *, en;q=0 should exclude en", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*, en;q=0"]]),
  );
  assertStrictEq(negotiator.language(["en"]), undefined);
  assertStrictEq(negotiator.language(["es", "en"]), "es");
});

test("negotiator.language(array) when Accept-Language: *;q=0.8, en, es should prefer en and es over everything", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*;q=0.8, en, es"]]),
  );
  assertStrictEq(negotiator.language(["en", "nl"]), "en");
  assertStrictEq(negotiator.language(["ro", "nl"]), "ro");
});

test("negotiator.language(array) when Accept-Language: en should return undefined for empty list", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Language", "en"]]));
  assertStrictEq(negotiator.language([]), undefined);
});

test("negotiator.language(array) when Accept-Language: en should return preferred langauge", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Language", "en"]]));
  assertStrictEq(negotiator.language(["en"]), "en");
  assertStrictEq(negotiator.language(["es", "en"]), "en");
});

test("negotiator.language(array) when Accept-Language: en should accept en-US, preferring en over en-US", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Language", "en"]]));
  assertStrictEq(negotiator.language(["en-US"]), "en-US");
  assertStrictEq(negotiator.language(["en-US", "en"]), "en");
  assertStrictEq(negotiator.language(["en", "en-US"]), "en");
});

test("negotiator.language(array) when Accept-Language: en;q=0 should return undefined for empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en;q=0"]]),
  );
  assertStrictEq(negotiator.language([]), undefined);
});

test("negotiator.language(array) when Accept-Language: en;q=0 should accept en-US, preferring en over en-US", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en;q=0"]]),
  );
  assertStrictEq(negotiator.language(["es", "en"]), undefined);
});

test("negotiator.language(array) when Accept-Language: en;q=0.8, es should return undefined for empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en;q=0.8, es"]]),
  );
  assertStrictEq(negotiator.language([]), undefined);
});

test("negotiator.language(array) when Accept-Language: en;q=0.8, es should return preferred langauge", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en;q=0.8, es"]]),
  );
  assertStrictEq(negotiator.language(["en"]), "en");
  assertStrictEq(negotiator.language(["en", "es"]), "es");
});

test("negotiator.language(array) when Accept-Language: en;q=0.9, es;q=0.8, en;q=0.7 should use highest perferred order on duplicate", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en;q=0.9, es;q=0.8, en;q=0.7"]]),
  );
  assertStrictEq(negotiator.language(["es"]), "es");
  assertStrictEq(negotiator.language(["en", "es"]), "en");
  assertStrictEq(negotiator.language(["es", "en"]), "en");
});

test("negotiator.language(array) when Accept-Language: en-US, en;q=0.8 should use prefer en-US over en", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US, en;q=0.8"]]),
  );
  assertStrictEq(negotiator.language(["en", "en-US"]), "en-US");
  assertStrictEq(negotiator.language(["en-GB", "en-US"]), "en-US");
  assertStrictEq(negotiator.language(["en-GB", "es"]), "en-GB");
});

test("negotiator.language(array) when Accept-Language: en-US, en-GB should prefer en-US", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US, en-GB"]]),
  );
  assertStrictEq(negotiator.language(["en-US", "en-GB"]), "en-US");
  assertStrictEq(negotiator.language(["en-GB", "en-US"]), "en-US");
});

test("negotiator.language(array) when Accept-Language: en-US;q=0.8, es should prefer es over en-US", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US;q=0.8, es"]]),
  );
  assertStrictEq(negotiator.language(["es", "en-US"]), "es");
  assertStrictEq(negotiator.language(["en-US", "es"]), "es");
  assertStrictEq(negotiator.language(["en-US", "en"]), "en-US");
});

test("negotiator.language(array) when Accept-Language: nl;q=0.5, fr, de, en, it, es, pt, no, se, fi, ro should use prefer fr over nl", () => {
  const negotiator = new Negotiator(
    new Headers(
      [["Accept-Language", "nl;q=0.5, fr, de, en, it, es, pt, no, se, fi, ro"]],
    ),
  );
  assertStrictEq(negotiator.language(["nl", "fr"]), "fr");
});

test("negotiator.languages() when no Accept-Language should return *", () => {
  const negotiator = new Negotiator(new Headers());
  assertEquals(negotiator.languages(), ["*"]);
});

test("negotiator.languages() when Accept-Language: * should return *", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Language", "*"]]));
  assertEquals(negotiator.languages(), ["*"]);
});

test("negotiator.languages() when Accept-Language: *, en should return *, en", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*, en"]]),
  );
  assertEquals(negotiator.languages(), ["*", "en"]);
});

test("negotiator.languages() when Accept-Language: *, en;q=0 should return *", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*, en;q=0"]]),
  );
  assertEquals(negotiator.languages(), ["*"]);
});

test("negotiator.languages() when Accept-Language: *;q=0.8, en, es should return *", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*;q=0.8, en, es"]]),
  );
  assertEquals(negotiator.languages(), ["en", "es", "*"]);
});

test("negotiator.languages() when Accept-Language: en should return *", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Language", "en"]]));
  assertEquals(negotiator.languages(), ["en"]);
});

test("negotiator.languages() when Accept-Language: en;q=0 should return empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en;q=0"]]),
  );
  assertEquals(negotiator.languages(), []);
});

test("negotiator.languages() when Accept-Language: en;q=0.8, es should return preferred languages", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en;q=0.8, es"]]),
  );
  assertEquals(negotiator.languages(), ["es", "en"]);
});

// test("negotiator.languages() when Accept-Language: en;q=0.9, es;q=0.8, en;q=0.7 should use highest perferred order on duplicate", () => {
//   const negotiator = new Negotiator(new Headers([["Accept-Language", "en;q=0.9, es;q=0.8, en;q=0.7"]]));
//   assertEquals(negotiator.languages(), ['en', 'es']);
// });

test("negotiator.languages() when Accept-Language: en-US, en;q=0.8 should return en-US, en", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US, en;q=0.8"]]),
  );
  assertEquals(negotiator.languages(), ["en-US", "en"]);
});

test("negotiator.languages() when Accept-Language: en-US, en-GB should return en-US, en-GB", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US, en-GB"]]),
  );
  assertEquals(negotiator.languages(), ["en-US", "en-GB"]);
});

test("negotiator.languages() when Accept-Language: en-US;q=0.8, es should return es, en-US", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US;q=0.8, es"]]),
  );
  assertEquals(negotiator.languages(), ["es", "en-US"]);
});

test("negotiator.languages() when Accept-Language: en-US;foo=bar;q=1, en-GB;q=1 should return en-US, en-GB", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US;foo=bar;q=1, en-GB;q=1"]]),
  );
  assertEquals(negotiator.languages(), ["en-US", "en-GB"]);
});

test("negotiator.languages() when Accept-Language: nl;q=0.5, fr, de, en, it, es, pt, no, se, fi, ro should use prefer fr over nl", () => {
  const negotiator = new Negotiator(
    new Headers(
      [["Accept-Language", "nl;q=0.5, fr, de, en, it, es, pt, no, se, fi, ro"]],
    ),
  );
  assertEquals(
    negotiator.languages(),
    ["fr", "de", "en", "it", "es", "pt", "no", "se", "fi", "ro", "nl"],
  );
});

test("negotiator.languages(array) when no Accept-Language should return original list", () => {
  const negotiator = new Negotiator(new Headers());
  assertEquals(negotiator.languages(["en"]), ["en"]);
  assertEquals(negotiator.languages(["es", "en"]), ["es", "en"]);
});

test("negotiator.languages(array) when Accept-Language: * should return original list", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Language", "*"]]));
  assertEquals(negotiator.languages(["en"]), ["en"]);
  assertEquals(negotiator.languages(["es", "en"]), ["es", "en"]);
});

test("negotiator.languages(array) when Accept-Language: *, en should return list in client-preferred order", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*, en"]]),
  );
  assertEquals(negotiator.languages(["en"]), ["en"]);
  assertEquals(negotiator.languages(["es", "en"]), ["en", "es"]);
});

test("negotiator.languages(array) when Accept-Language: *, en;q=0 should exclude en", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*, en;q=0"]]),
  );
  assertEquals(negotiator.languages(["en"]), []);
  assertEquals(negotiator.languages(["es", "en"]), ["es"]);
});

test("negotiator.languages(array) when Accept-Language: *;q=0.8, en, es should return preferred languages", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "*;q=0.8, en, es"]]),
  );
  assertEquals(
    negotiator.languages(
      ["fr", "de", "en", "it", "es", "pt", "no", "se", "fi", "ro", "nl"],
    ),
    ["en", "es", "fr", "de", "it", "pt", "no", "se", "fi", "ro", "nl"],
  );
});

test("negotiator.languages(array) when Accept-Language: en should return preferred languages", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Language", "en"]]));
  assertEquals(negotiator.languages(["en"]), ["en"]);
  assertEquals(negotiator.languages(["en", "es"]), ["en"]);
  assertEquals(negotiator.languages(["es", "en"]), ["en"]);
});

test("negotiator.languages(array) when Accept-Language: en should accept en-US, preferring en over en-US", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Language", "en"]]));
  assertEquals(negotiator.languages(["en-US"]), ["en-US"]);
  assertEquals(negotiator.languages(["en-US", "en"]), ["en", "en-US"]);
  assertEquals(negotiator.languages(["en", "en-US"]), ["en", "en-US"]);
});

test("negotiator.languages(array) when Accept-Language: en;q=0 should return nothing", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en;q=0"]]),
  );
  assertEquals(negotiator.languages(["en"]), []);
  assertEquals(negotiator.languages(["en", "es"]), []);
});

test("negotiator.languages(array) when Accept-Language: en;q=0.8, es should return preferred languages", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en;q=0.8, es"]]),
  );
  assertEquals(negotiator.languages(["en"]), ["en"]);
  assertEquals(negotiator.languages(["en", "es"]), ["es", "en"]);
  assertEquals(negotiator.languages(["es", "en"]), ["es", "en"]);
});

// test("negotiator.languages(array) when Accept-Language: en;q=0.9, es;q=0.8, en;q=0.7 should return preferred languages", () => {
//   const negotiator = new Negotiator(new Headers([["Accept-Language", "en;q=0.9, es;q=0.8, en;q=0.7"]]));
//   assertEquals(negotiator.languages(['en']), ['en']);
//   assertEquals(negotiator.languages(['en', 'es']), ['es', 'en']);
//   assertEquals(negotiator.languages(['es', 'en']), ['es', 'en']);
// });

test("negotiator.languages(array) when Accept-Language: en-US, en;q=0.8 should be case insensitive", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US, en;q=0.8"]]),
  );
  assertEquals(negotiator.languages(["en-us", "EN"]), ["en-us", "EN"]);
});

test("negotiator.languages(array) when Accept-Language: en-US, en;q=0.8 should prefer en-US over en", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US, en;q=0.8"]]),
  );
  assertEquals(negotiator.languages(["en-us", "EN"]), ["en-us", "EN"]);
});

test("negotiator.languages(array) when Accept-Language: en-US, en-GB should prefer en-US over en", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US, en-GB"]]),
  );
  assertEquals(negotiator.languages(["en-US", "en-GB"]), ["en-US", "en-GB"]);
  assertEquals(negotiator.languages(["en-GB", "en-US"]), ["en-US", "en-GB"]);
});

test("negotiator.languages(array) when Accept-Language: en-US;q=0.8, es should prefer en-US over en", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Language", "en-US;q=0.8, es"]]),
  );
  assertEquals(negotiator.languages(["en", "es"]), ["es", "en"]);
  assertEquals(
    negotiator.languages(["en", "es", "en-US"]),
    ["es", "en-US", "en"],
  );
});

test("negotiator.languages(array) when Accept-Language: nl;q=0.5, fr, de, en, it, es, pt, no, se, fi, ro should return preferred languages", () => {
  const negotiator = new Negotiator(
    new Headers(
      [["Accept-Language", "nl;q=0.5, fr, de, en, it, es, pt, no, se, fi, ro"]],
    ),
  );
  assertEquals(
    negotiator.languages(
      ["fr", "de", "en", "it", "es", "pt", "no", "se", "fi", "ro", "nl"],
    ),
    ["fr", "de", "en", "it", "es", "pt", "no", "se", "fi", "ro", "nl"],
  );
});
