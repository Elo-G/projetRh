import { Base32 } from 'base-coding';
import crypto from 'crypto';

import { Digits, isBase32, addLeadingZeros, convertNumberIntoBytes } from '../utils';
import { Hotp } from '../models/hotp';

interface Args {
  digits?: Digits;
  expiresIn?: number;
}

export namespace HotpService {
  export function create(secret: string, counter: number, args?: Args): Hotp | undefined {
    const digits = args && args.digits ? args.digits : 6;
    const expiresIn = args?.expiresIn;
    if (isBase32(secret)) {
      secret = Base32.decode(secret);
    }
    if (!secret) {
      console.warn('No secret provided to generate an hotp.\n\r\n\rReturn.');
      return;
    }
    if (secret.length < 160) {
      console.warn('RFC4226 recommends, that the length of a secret is at least 160 bits.');
    }
    const hmacResult = createHmac(secret, counter);
    let hotp = truncate(hmacResult, digits);
    hotp = addLeadingZeros(hotp, digits);
    return new Hotp({ counter, secret, value: hotp, expiresIn, verifyFn: verify });
  }

  export function verify(code: string, secret: string, counter: number): boolean {
    if (code.length < 6 || code.length > 8) {
      throw new Error('Undefined length of code.');
    }
    const comparison = create(secret, counter, { digits: code.length as Digits });
    return comparison ? code === comparison.value : false;
  }

  function createHmac(secret: string, counter: number | string): string {
    if (typeof counter === 'string') {
      counter = parseInt(counter, 10);
    }
    return crypto
      .createHmac('sha1', secret)
      .update(Buffer.from(convertNumberIntoBytes(counter)))
      .digest('hex');
  }

  function truncate(hmacResult: string, digits: Digits = 6): string {
    const offset = (parseInt(hmacResult.slice(-2), 16) & 0xf) * 2;
    const binCode =
      ((parseInt(hmacResult.substr(offset, 2), 16) & 0x7f) << 24) |
      ((parseInt(hmacResult.substr(offset + 2, 2), 16) & 0xff) << 16) |
      ((parseInt(hmacResult.substr(offset + 4, 2), 16) & 0xff) << 8) |
      (parseInt(hmacResult.substr(offset + 6, 2), 16) & 0xff);
    const hotp = binCode % Math.pow(10, digits);
    return `${hotp}`;
  }
}
