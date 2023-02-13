![CI](https://github.com/GabrielInTheWorld/base-js/workflows/CI/badge.svg)

# An implementation of Base16, Base32 and Base64

This is an implementation of Base16, Base32 and Base64 specified in [RFC 3548](https://tools.ietf.org/html/rfc3548).

## Installation

To install this package, simply run the following command:

`npm install base-coding`

Hint: This package already provides type-definitions.

## Usage

This package exports three namespaces: Base16, Base32 and Base64:

```ts
export namespace Base64 {
  export function encode(toEncode: string): string;
  export function decode(toDecode: string): string;
}

export namespace Base32 {
  export function encode(toEncode: string): string;
  export function decode(toDecode: string): string;
}

export namespace Base16 {
  export function encode(toEncode: string): string;
  export function decode(toDecode: string): string;
}
```

## License

MIT License
