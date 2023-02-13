import { Digits } from '../utils';
import { Totp } from '../models/totp';
import { HotpService } from './hotp-service';

interface Args {
  timeStepSize?: number;
  t1?: number;
  digits?: Digits;
}

export namespace TotpService {
  export function create(secret: string, args?: Args): Totp {
    const digits = args?.digits ? args.digits : 6;
    const t1 = args?.t1 ? args.t1 : getT1();
    const timeStepSize = args?.timeStepSize ? args.timeStepSize : 30;
    const timeSteps = Math.floor(t1 / timeStepSize);
    const totp = HotpService.create(secret, timeSteps, { digits })!.value;
    return new Totp({
      secret,
      value: totp,
      timeStepSize,
      verifyFn: verify
    });
  }

  export function verify(code: string, secret: string, args?: Args): boolean {
    if (code.length < 6 || code.length > 8) {
      throw new Error('Undefined length of code.');
    }
    const t1 = args?.t1 ? args.t1 : getT1();
    const timeStepSize = args?.timeStepSize ? args.timeStepSize : 30;
    const comparisons = [
      create(secret, { t1, digits: code.length as Digits, timeStepSize }).value,
      create(secret, { t1: t1 + timeStepSize, digits: code.length as Digits, timeStepSize }).value,
      create(secret, { t1: t1 + 2 * timeStepSize, digits: code.length as Digits, timeStepSize }).value
    ];
    return comparisons.some(comparison => comparison === code);
  }

  function getT1(): number {
    return Math.round(new Date().getTime() / 1000);
  }
}
