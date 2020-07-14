import {
  assertEquals,
  assertStrictEquals,
} from "./deps.ts";
import Negotiator from "../mod.ts";

const { test } = Deno;

test("negotiator.encoding() when no Accept-Encoding should return identity", () => {
  const negotiator = new Negotiator(new Headers());
  assertStrictEquals(negotiator.encoding(), "identity");
});

test("negotiator.encoding() when Accept-Encoding: * should return *", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Encoding", "*"]]));
  assertStrictEquals(negotiator.encoding(), "*");
});

test("negotiator.encoding() when Accept-Encoding: *, gzip should return *", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*, gzip"]]),
  );
  assertStrictEquals(negotiator.encoding(), "*");
});

test("negotiator.encoding() when Accept-Encoding: *, gzip;q=0 should return *", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*, gzip;q=0"]]),
  );
  assertStrictEquals(negotiator.encoding(), "*");
});

test("negotiator.encoding() when Accept-Encoding: *;q=0 should return undefined", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*;q=0"]]),
  );
  assertStrictEquals(negotiator.encoding(), undefined);
});

test("negotiator.encoding() when Accept-Encoding: *;q=0, identity;q=1 should return identity", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*;q=0, identity;q=1"]]),
  );
  assertStrictEquals(negotiator.encoding(), "identity");
});

test("negotiator.encoding() when Accept-Encoding: identity should return identity", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "identity"]]),
  );
  assertStrictEquals(negotiator.encoding(), "identity");
});

test("negotiator.encoding() when Accept-Encoding: identity;q=0 should return undefined", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "identity;q=0"]]),
  );
  assertStrictEquals(negotiator.encoding(), undefined);
});

test("negotiator.encoding() when Accept-Encoding: gzip should return gzip", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Encoding", "gzip"]]));
  assertStrictEquals(negotiator.encoding(), "gzip");
});

test("negotiator.encoding() when Accept-Encoding: gzip, compress;q=0 should return gzip", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip, compress;q=0"]]),
  );
  assertStrictEquals(negotiator.encoding(), "gzip");
});

test("negotiator.encoding() when Accept-Encoding: gzip, deflate should return gzip", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip, deflate"]]),
  );
  assertStrictEquals(negotiator.encoding(), "gzip");
});

test("negotiator.encoding() when Accept-Encoding: gzip;q=0.8, deflate should return deflate", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip;q=0.8, deflate"]]),
  );
  assertStrictEquals(negotiator.encoding(), "deflate");
});

test("negotiator.encoding() when Accept-Encoding: gzip;q=0.8, identity;q=0.5, *;q=0.3 should return gzip", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip;q=0.8, identity;q=0.5, *;q=0.3"]]),
  );
  assertStrictEquals(negotiator.encoding(), "gzip");
});

test("negotiator.encoding(array) when no Accept-Encoding should return undefined for empty list", () => {
  const negotiator = new Negotiator(new Headers());
  assertStrictEquals(negotiator.encoding([]), undefined);
});

test("negotiator.encoding(array) when no Accept-Encoding should only match identity", () => {
  const negotiator = new Negotiator(new Headers());
  assertStrictEquals(negotiator.encoding(["identity"]), "identity");
  assertStrictEquals(negotiator.encoding(["gzip"]), undefined);
});

test("negotiator.encoding(array) when Accept-Encoding: * should return undefined for empty list", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Encoding", "*"]]));
  assertStrictEquals(negotiator.encoding([]), undefined);
});

test("negotiator.encoding(array) when Accept-Encoding: * should return first item in list", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Encoding", "*"]]));
  assertStrictEquals(negotiator.encoding(["identity"]), "identity");
  assertStrictEquals(negotiator.encoding(["gzip"]), "gzip");
  assertStrictEquals(negotiator.encoding(["gzip", "identity"]), "gzip");
});

test("negotiator.encoding(array) when Accept-Encoding: *, gzip should prefer gzip", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*, gzip"]]),
  );
  assertStrictEquals(negotiator.encoding(["identity"]), "identity");
  assertStrictEquals(negotiator.encoding(["gzip"]), "gzip");
  assertStrictEquals(negotiator.encoding(["compress", "gzip"]), "gzip");
});

test("negotiator.encoding(array) when Accept-Encoding: *, gzip;q=0 should exclude gzip", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*, gzip;q=0"]]),
  );
  assertStrictEquals(negotiator.encoding(["identity"]), "identity");
  assertStrictEquals(negotiator.encoding(["gzip"]), undefined);
  assertStrictEquals(negotiator.encoding(["compress", "gzip"]), "compress");
});

test("negotiator.encoding(array) when Accept-Encoding: *;q=0 should return undefined for empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*;q=0"]]),
  );
  assertStrictEquals(negotiator.encoding([]), undefined);
});

test("negotiator.encoding(array) when Accept-Encoding: *;q=0 should match nothing", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*;q=0"]]),
  );
  assertStrictEquals(negotiator.encoding(["identity"]), undefined);
  assertStrictEquals(negotiator.encoding(["gzip"]), undefined);
});

test("negotiator.encoding(array) when Accept-Encoding: *;q=0, identity;q=1 should return undefined for empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*;q=0, identity;q=1"]]),
  );
  assertStrictEquals(negotiator.encoding([]), undefined);
});

test("negotiator.encoding(array) when Accept-Encoding: *;q=0, identity;q=1 should still match identity", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*;q=0, identity;q=1"]]),
  );
  assertStrictEquals(negotiator.encoding(["identity"]), "identity");
  assertStrictEquals(negotiator.encoding(["gzip"]), undefined);
});

test("negotiator.encoding(array) when Accept-Encoding: identity should return undefined for empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "identity"]]),
  );
  assertStrictEquals(negotiator.encoding([]), undefined);
});

test("negotiator.encoding(array) when Accept-Encoding: identity should only match identity", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "identity"]]),
  );
  assertStrictEquals(negotiator.encoding(["identity"]), "identity");
  assertStrictEquals(negotiator.encoding(["gzip"]), undefined);
});

test("negotiator.encoding(array) when Accept-Encoding: identity;q=0 should return undefined for empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "identity;q=0"]]),
  );
  assertStrictEquals(negotiator.encoding([]), undefined);
});

test("negotiator.encoding(array) when Accept-Encoding: identity;q=0 should match nothing", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "identity;q=0"]]),
  );
  assertStrictEquals(negotiator.encoding(["identity"]), undefined);
  assertStrictEquals(negotiator.encoding(["gzip"]), undefined);
});

test("negotiator.encoding(array) when Accept-Encoding: gzip should return undefined for empty list", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Encoding", "gzip"]]));
  assertStrictEquals(negotiator.encoding([]), undefined);
});

test("negotiator.encoding(array) when Accept-Encoding: gzip should return client-preferred encodings", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Encoding", "gzip"]]));
  assertStrictEquals(negotiator.encoding(["gzip"]), "gzip");
  assertStrictEquals(negotiator.encoding(["identity", "gzip"]), "gzip");
  assertStrictEquals(negotiator.encoding(["identity"]), "identity");
});

test("negotiator.encoding(array) when Accept-Encoding: gzip, compress;q=0 should not return compress", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip, compress;q=0"]]),
  );
  assertStrictEquals(negotiator.encoding(["compress"]), undefined);
  assertStrictEquals(negotiator.encoding(["deflate", "compress"]), undefined);
  assertStrictEquals(negotiator.encoding(["gzip", "compress"]), "gzip");
});

test("negotiator.encoding(array) when Accept-Encoding: gzip, deflate should return first client-preferred encoding", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip, deflate"]]),
  );
  assertStrictEquals(negotiator.encoding(["deflate", "compress"]), "deflate");
});

test("negotiator.encoding(array) when Accept-Encoding: gzip;q=0.8, deflate should return most client-preferred encoding", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip;q=0.8, deflate"]]),
  );
  assertStrictEquals(negotiator.encoding(["gzip"]), "gzip");
  assertStrictEquals(negotiator.encoding(["deflate"]), "deflate");
  assertStrictEquals(negotiator.encoding(["deflate", "gzip"]), "deflate");
});

test("negotiator.encoding(array) when Accept-Encoding: gzip;q=0.8, identity;q=0.5, *;q=0.3 should return most client-preferred encoding", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip;q=0.8, identity;q=0.5, *;q=0.3"]]),
  );
  assertStrictEquals(negotiator.encoding(["gzip"]), "gzip");
  assertStrictEquals(negotiator.encoding(["compress", "identity"]), "identity");
});

test("negotiator.encodings() when no Accept-Encoding should return identity", () => {
  const negotiator = new Negotiator(new Headers());
  assertEquals(negotiator.encodings(), ["identity"]);
});

test("negotiator.encodings() when Accept-Encoding: * should return *", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Encoding", "*"]]));
  assertEquals(negotiator.encodings(), ["*"]);
});

test("negotiator.encodings() when Accept-Encoding: *, gzip should prefer gzip", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*, gzip"]]),
  );
  assertEquals(negotiator.encodings(), ["*", "gzip"]);
});

test("negotiator.encodings() when Accept-Encoding: *, gzip;q=0 should return *", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*, gzip;q=0"]]),
  );
  assertEquals(negotiator.encodings(), ["*"]);
});

test("negotiator.encodings() when Accept-Encoding: *;q=0 should return an empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*;q=0"]]),
  );
  assertEquals(negotiator.encodings(), []);
});

test("negotiator.encodings() when Accept-Encoding: *;q=0, identity;q=1 should return identity", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*;q=0, identity;q=1"]]),
  );
  assertEquals(negotiator.encodings(), ["identity"]);
});

test("negotiator.encodings() when Accept-Encoding: identity should return identity", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "identity"]]),
  );
  assertEquals(negotiator.encodings(), ["identity"]);
});

test("negotiator.encodings() when Accept-Encoding: identity;q=0 should return an empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "identity;q=0"]]),
  );
  assertEquals(negotiator.encodings(), []);
});

test("negotiator.encodings() when Accept-Encoding: gzip should return gzip, identity", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Encoding", "gzip"]]));
  assertEquals(negotiator.encodings(), ["gzip", "identity"]);
});

test("negotiator.encodings() when Accept-Encoding: gzip, compress;q=0 should not return compress", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip, compress;q=0"]]),
  );
  assertEquals(negotiator.encodings(), ["gzip", "identity"]);
});

test("negotiator.encodings() when Accept-Encoding: gzip, deflate should return client-preferred encodings", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip, deflate"]]),
  );
  assertEquals(negotiator.encodings(), ["gzip", "deflate", "identity"]);
});

test("negotiator.encodings() when Accept-Encoding: gzip;q=0.8, deflate should return client-preferred encodings", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip;q=0.8, deflate"]]),
  );
  assertEquals(negotiator.encodings(), ["deflate", "gzip", "identity"]);
});

test("negotiator.encodings() when Accept-Encoding: gzip;foo=bar;q=1, deflate;q=1 should return client-preferred encodings", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip;foo=bar;q=1, deflate;q=1"]]),
  );
  assertEquals(negotiator.encodings(), ["gzip", "deflate", "identity"]);
});

test("negotiator.encodings() when Accept-Encoding: gzip;q=0.8, identity;q=0.5, *;q=0.3 should return client-preferred encodings", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip;q=0.8, identity;q=0.5, *;q=0.3"]]),
  );
  assertEquals(negotiator.encodings(), ["gzip", "identity", "*"]);
});

test("negotiator.encodings(array) when no Accept-Encoding should return empty list for empty list", () => {
  const negotiator = new Negotiator(new Headers());
  assertEquals(negotiator.encodings([]), []);
});

test("negotiator.encodings(array) when no Accept-Encoding should only match identity", () => {
  const negotiator = new Negotiator(new Headers());
  assertEquals(negotiator.encodings(["identity"]), ["identity"]);
  assertEquals(negotiator.encodings(["gzip"]), []);
});

test("negotiator.encodings(array) when Accept-Encoding: * should return empty list for empty list", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Encoding", "*"]]));
  assertEquals(negotiator.encodings([]), []);
});

test("negotiator.encodings(array) when Accept-Encoding: * should return original list", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Encoding", "*"]]));
  assertEquals(negotiator.encodings(["identity"]), ["identity"]);
  assertEquals(negotiator.encodings(["gzip"]), ["gzip"]);
  assertEquals(
    negotiator.encodings(["gzip", "identity"]),
    ["gzip", "identity"],
  );
});

test("negotiator.encodings(array) when Accept-Encoding: *, gzip should prefer gzip", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*, gzip"]]),
  );
  assertEquals(negotiator.encodings(["identity"]), ["identity"]);
  assertEquals(negotiator.encodings(["gzip"]), ["gzip"]);
  assertEquals(
    negotiator.encodings(["compress", "gzip"]),
    ["gzip", "compress"],
  );
});

test("negotiator.encodings(array) when Accept-Encoding: *, gzip;q=0 should exclude gzip", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*, gzip;q=0"]]),
  );
  assertEquals(negotiator.encodings(["identity"]), ["identity"]);
  assertEquals(negotiator.encodings(["gzip"]), []);
  assertEquals(negotiator.encodings(["gzip", "compress"]), ["compress"]);
});

test("negotiator.encodings(array) when Accept-Encoding: *;q=0 should always return empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*;q=0"]]),
  );
  assertEquals(negotiator.encodings([]), []);
  assertEquals(negotiator.encodings(["identity"]), []);
  assertEquals(negotiator.encodings(["gzip"]), []);
});

test("negotiator.encodings(array) when Accept-Encoding: *;q=0, identity;q=1 should still match identity", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "*;q=0, identity;q=1"]]),
  );
  assertEquals(negotiator.encodings([]), []);
  assertEquals(negotiator.encodings(["identity"]), ["identity"]);
  assertEquals(negotiator.encodings(["gzip"]), []);
});

test("negotiator.encodings(array) when Accept-Encoding: identity should return empty list for empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "identity"]]),
  );
  assertEquals(negotiator.encodings([]), []);
});

test("negotiator.encodings(array) when Accept-Encoding: identity should only match identity", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "identity"]]),
  );
  assertEquals(negotiator.encodings(["identity"]), ["identity"]);
  assertEquals(negotiator.encodings(["gzip"]), []);
});

test("negotiator.encodings(array) when Accept-Encoding: identity;q=0 should always return empty list", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "identity;q=0"]]),
  );
  assertEquals(negotiator.encodings([]), []);
  assertEquals(negotiator.encodings(["identity"]), []);
  assertEquals(negotiator.encodings(["gzip"]), []);
});

test("negotiator.encodings(array) when Accept-Encoding: gzip should return empty list for empty list", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Encoding", "gzip"]]));
  assertEquals(negotiator.encodings([]), []);
});

test("negotiator.encodings(array) when Accept-Encoding: gzip should be case insensitive, returning provided casing", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Encoding", "gzip"]]));
  assertEquals(negotiator.encodings(["GZIP"]), ["GZIP"]);
  assertEquals(negotiator.encodings(["gzip", "GZIP"]), ["gzip", "GZIP"]);
  assertEquals(negotiator.encodings(["GZIP", "gzip"]), ["GZIP", "gzip"]);
});

test("negotiator.encodings(array) when Accept-Encoding: gzip should return client-preferred encodings", () => {
  const negotiator = new Negotiator(new Headers([["Accept-Encoding", "gzip"]]));
  assertEquals(negotiator.encodings(["gzip"]), ["gzip"]);
  assertEquals(
    negotiator.encodings(["gzip", "identity"]),
    ["gzip", "identity"],
  );
  assertEquals(
    negotiator.encodings(["identity", "gzip"]),
    ["gzip", "identity"],
  );
  assertEquals(negotiator.encodings(["identity"]), ["identity"]);
});

test("negotiator.encodings(array) when Accept-Encoding: gzip, compress;q=0 should not return compress", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip, compress;q=0"]]),
  );
  assertEquals(negotiator.encodings(["gzip", "compress"]), ["gzip"]);
});

test("negotiator.encodings(array) when Accept-Encoding: gzip, deflate should return client-preferred encodings", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip, deflate"]]),
  );
  assertEquals(negotiator.encodings(["gzip"]), ["gzip"]);
  assertEquals(
    negotiator.encodings(["gzip", "identity"]),
    ["gzip", "identity"],
  );
  assertEquals(negotiator.encodings(["deflate", "gzip"]), ["gzip", "deflate"]);
  assertEquals(negotiator.encodings(["identity"]), ["identity"]);
});

test("negotiator.encodings(array) when Accept-Encoding: gzip;q=0.8, deflate should return client-preferred encodings", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip;q=0.8, deflate"]]),
  );
  assertEquals(negotiator.encodings(["gzip"]), ["gzip"]);
  assertEquals(negotiator.encodings(["deflate"]), ["deflate"]);
  assertEquals(negotiator.encodings(["deflate", "gzip"]), ["deflate", "gzip"]);
});

test("negotiator.encodings(array) when Accept-Encoding: gzip;q=0.8, identity;q=0.5, *;q=0.3 should return client-preferred encodings", () => {
  const negotiator = new Negotiator(
    new Headers([["Accept-Encoding", "gzip;q=0.8, identity;q=0.5, *;q=0.3"]]),
  );
  assertEquals(negotiator.encodings(["gzip"]), ["gzip"]);
  assertEquals(
    negotiator.encodings(["identity", "gzip", "compress"]),
    ["gzip", "identity", "compress"],
  );
});
