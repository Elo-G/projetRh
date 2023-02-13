import { Base16 } from '../../src';

export namespace FakeBase16 {
  export function encode(toEncode: string): string {
    return Base16.encode(toEncode);
  }

  export function decode(toDecode: string): string {
    return Base16.decode(toDecode);
  }
}
