import { Digits } from '../../src';
import { FakeHotp } from './fake-hotp';
import { FakeTotp } from './fake-totp';

export namespace FakeUtils {
  const defaultSecret = '12345678901234567890';
  const hotp = new FakeHotp();
  const totp = new FakeTotp();

  export function createHotp(counter: number, secret: string = defaultSecret, digits: Digits = 6): string {
    return hotp.create(secret, counter, digits);
  }

  export function verifyHotp(code: string, counter: number, secret: string = defaultSecret): boolean {
    return hotp.verify(code, secret, counter);
  }

  export function createHmac(counter: number, secret: string = defaultSecret): string {
    return hotp.fakeHmac(secret, counter);
  }

  export function truncate(hmacResult: string): string {
    return hotp.fakeTruncate(hmacResult);
  }

  export function createTotp(t1?: number, secret: string = defaultSecret, t0: number = 0, digits: Digits = 8): string {
    return totp.create(secret, t1, t0, digits);
  }

  export function verifyTotp(code: string, t1: number, secret: string = defaultSecret, t0: number = 0): boolean {
    return totp.verify(code, secret, t1, t0);
  }
}
