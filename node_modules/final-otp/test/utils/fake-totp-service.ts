import { TotpService } from '../../src';
import { Totp } from '../../src/models';

export namespace FakeTotpService {
  const defaultSecret = '12345678901234567890';

  export function create(t1: number, secret: string = defaultSecret): Totp {
    return TotpService.create(secret, { t1, digits: 8 });
  }

  export function verify(code: string, t1: number, secret: string = defaultSecret): boolean {
    return TotpService.verify(code, secret, { t1 });
  }
}
