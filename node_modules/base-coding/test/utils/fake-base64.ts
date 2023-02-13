import { Base64 } from '../../src';

export namespace FakeBase64 {
  export function encode(toEncode: string): string {
    return Base64.encode(toEncode);
  }

  export function decode(toDecode: string): string {
    return Base64.decode(toDecode);
  }
}
