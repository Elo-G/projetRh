import { Base32 } from '../../src';

export namespace FakeBase32 {
  export function encode(toEncode: string): string {
    return Base32.encode(toEncode);
  }

  export function decode(toDecode: string): string {
    return Base32.decode(toDecode);
  }
}
