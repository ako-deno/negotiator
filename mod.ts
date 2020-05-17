/*!
 * Based on https://github.com/jshttp/negotiator/blob/master/index.js
 * Copyright(c) 2012 Federico Romero
 * Copyright(c) 2012-2014 Isaac Z. Schlueter
 * Copyright(c) 2015 Douglas Christopher Wilson
 * Copyright(c) 2020 Henry Zhuang
 * MIT Licensed
 */

import { preferredCharsets } from "./src/charset.ts";
import { preferredEncodings } from "./src/encoding.ts";

class Negotiator {
  constructor(headers: Headers) {
    this.headers = headers;
  }
  private headers: Headers;

  charset(available?: string[]): string {
    const set = this.charsets(available);
    return set && set[0];
  }

  charsets(available?: string[]): string[] {
    return preferredCharsets(this.headers.get("accept-charset"), available);
  }

  encoding(available?: string[]): string {
    const set = this.encodings(available);
    return set && set[0];
  }

  encodings(available?: string[]): string[] {
    return preferredEncodings(this.headers.get("accept-encoding"), available);
  }
}

export default Negotiator;
