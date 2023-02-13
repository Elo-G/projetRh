import { Hotp } from './hotp-service';
import { Digits } from './utils';

/**
 * @deprecated
 */
export class Totp {
  private hotp = new Hotp();

  public create(secret: string, t1?: number, t0: number = 0, digits: Digits = 6): string {
    if (!t1) {
      t1 = Math.round(new Date().getTime() / 1000);
    }
    const timeSteps = Math.floor((t1 - t0) / 30);
    return this.hotp.create(secret, timeSteps, digits);
  }

  public verify(code: string, secret: string, t1?: number, t0: number = 0): boolean {
    if (code.length < 6 || code.length > 8) {
      throw new Error('Undefined length of code.');
    }
    if (!t1) {
      t1 = Math.round(new Date().getTime() / 1000);
    }
    const comparisons = [
      this.create(secret, t1, t0, code.length as Digits),
      this.create(secret, t1 + 30, t0, code.length as Digits),
      this.create(secret, t1 + 60, t0, code.length as Digits)
    ];
    return comparisons.some(comparison => comparison === code);
  }
}
