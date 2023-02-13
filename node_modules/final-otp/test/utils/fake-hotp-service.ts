import { Hotp } from '../../src/models';
import { HotpService } from '../../src';

export namespace FakeHotpService {
  const defaultSecret = '12345678901234567890';

  export function create(counter: number): Hotp {
    return HotpService.create(defaultSecret, counter) as Hotp;
  }
}
