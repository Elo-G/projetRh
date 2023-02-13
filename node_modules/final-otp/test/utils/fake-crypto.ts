import { sha1 as sha, addPaddingToMessage } from '../../src/crypto';

export namespace Crypto {
  export function createPaddedMessage(message: string): string {
    return addPaddingToMessage(message);
  }

  export function sha1(message: string): string {
    return sha(message);
  }
}
