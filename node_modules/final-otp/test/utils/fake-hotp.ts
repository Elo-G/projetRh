import { Digits, Hotp } from '../../src';

export class FakeHotp extends Hotp {
  public fakeHmac(secret: string, counter: number): string {
    return this.createHmac(secret, counter);
  }

  public fakeTruncate(hmac: string, digits: Digits = 6): string {
    return this.truncate(hmac, digits);
  }
}
