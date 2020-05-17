# negotiator

An HTTP content negotiator for Deno. Based on `https://github.com/jshttp/negotiator`.

## API

```TypeScript
import Negotiator from "https://raw.githubusercontent.com/ako-deno/negotiator/master/mod.ts";
```

### Accept Negotiation

```TypeScript
const availableMediaTypes = ['text/html', 'text/plain', 'application/json'];

// The negotiator constructor receives a Headers object
const negotiator = new Negotiator(header)

// Let's say Accept header is 'text/html, application/*;q=0.2, image/jpeg;q=0.8'

const negotiator.mediaTypes()
// -> ['text/html', 'image/jpeg', 'application/*']

const negotiator.mediaTypes(availableMediaTypes)
// -> ['text/html', 'application/json']

const negotiator.mediaType(availableMediaTypes)
// -> 'text/html'
```

#### Methods

##### mediaType()

Returns the most preferred media type from the client.

##### mediaType(availableMediaType)

Returns the most preferred media type from a list of available media types.

##### mediaTypes()

Returns an array of preferred media types ordered by the client preference.

##### mediaTypes(availableMediaTypes)

Returns an array of preferred media types ordered by priority from a list of
available media types.

### Accept-Language Negotiation

```TypeScript
const negotiator = new Negotiator(header)

const availableLanguages = ['en', 'es', 'fr']

// Let's say Accept-Language header is 'en;q=0.8, es, pt'

const negotiator.languages()
// -> ['es', 'pt', 'en']

const negotiator.languages(availableLanguages)
// -> ['es', 'en']

const language = negotiator.language(availableLanguages)
// -> 'es'
```

#### Methods

##### language()

Returns the most preferred language from the client.

##### language(availableLanguages)

Returns the most preferred language from a list of available languages.

##### languages()

Returns an array of preferred languages ordered by the client preference.

##### languages(availableLanguages)

Returns an array of preferred languages ordered by priority from a list of
available languages.

### Accept-Charset Negotiation

```TypeScript
const availableCharsets = ['utf-8', 'iso-8859-1', 'iso-8859-5']

const negotiator = new Negotiator(header)

// Let's say Accept-Charset header is 'utf-8, iso-8859-1;q=0.8, utf-7;q=0.2'

const negotiator.charsets()
// -> ['utf-8', 'iso-8859-1', 'utf-7']

const negotiator.charsets(availableCharsets)
// -> ['utf-8', 'iso-8859-1']

const negotiator.charset(availableCharsets)
// -> 'utf-8'
```

#### Methods

##### charset()

Returns the most preferred charset from the client.

##### charset(availableCharsets)

Returns the most preferred charset from a list of available charsets.

##### charsets()

Returns an array of preferred charsets ordered by the client preference.

##### charsets(availableCharsets)

Returns an array of preferred charsets ordered by priority from a list of
available charsets.

### Accept-Encoding Negotiation

```TypeScript
const availableEncodings = ['identity', 'gzip']

const negotiator = new Negotiator(header)

// Let's say Accept-Encoding header is 'gzip, compress;q=0.2, identity;q=0.5'

const negotiator.encodings()
// -> ['gzip', 'identity', 'compress']

const negotiator.encodings(availableEncodings)
// -> ['gzip', 'identity']

const negotiator.encoding(availableEncodings)
// -> 'gzip'
```

#### Methods

##### encoding()

Returns the most preferred encoding from the client.

##### encoding(availableEncodings)

Returns the most preferred encoding from a list of available encodings.

##### encodings()

Returns an array of preferred encodings ordered by the client preference.

##### encodings(availableEncodings)

Returns an array of preferred encodings ordered by priority from a list of
available encodings.

## License

[MIT](LICENSE)
