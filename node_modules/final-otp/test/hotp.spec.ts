import { FakeUtils } from './utils';
import { FakeHotpService } from './utils/fake-hotp-service';

test('Truncate method', () => {
  const hmac = '1f8698690e02ca16618550ef7f19da8e945b555a';
  const hotp = FakeUtils.truncate(hmac);
  expect(hotp).toBe('872921');
});

test('Hmac Counter 0', () => {
  const hmac = FakeUtils.createHmac(0);
  expect(hmac).toBe('cc93cf18508d94934c64b65d8ba7667fb7cde4b0');
});

test('Hmac Counter 1', () => {
  const hmac = FakeUtils.createHmac(1);
  expect(hmac).toBe('75a48a19d4cbe100644e8ac1397eea747a2d33ab');
});

test('Hmac Counter 2', () => {
  const hmac = FakeUtils.createHmac(2);
  expect(hmac).toBe('0bacb7fa082fef30782211938bc1c5e70416ff44');
});

test('Hmac Counter 3', () => {
  const hmac = FakeUtils.createHmac(3);
  expect(hmac).toBe('66c28227d03a2d5529262ff016a1e6ef76557ece');
});

test('Hmac Counter 4', () => {
  const hmac = FakeUtils.createHmac(4);
  expect(hmac).toBe('a904c900a64b35909874b33e61c5938a8e15ed1c');
});

test('HOTP Counter 0', () => {
  const hotp = FakeHotpService.create(0);
  expect(hotp.value).toBe('755224');
});

test('Verify: HOTP Counter 0', () => {
  const hotp = FakeHotpService.create(0);
  expect(hotp.verify('755224')).toBe(true);
});

test('HOTP Counter 1', () => {
  const hotp = FakeHotpService.create(1);
  expect(hotp.value).toBe('287082');
});

test('Verify: HOTP Counter 1', () => {
  const hotp = FakeHotpService.create(1);
  expect(hotp.verify('287082')).toBe(true);
});

test('HOTP Counter 2', () => {
  const hotp = FakeHotpService.create(2);
  expect(hotp.value).toBe('359152');
});

test('Verify: HOTP Counter 2', () => {
  const hotp = FakeHotpService.create(2);
  expect(hotp.verify('359152')).toBe(true);
});

test('HOTP Counter 3', () => {
  const hotp = FakeHotpService.create(3);
  expect(hotp.value).toBe('969429');
});

test('Verify: HOTP Counter 3', () => {
  const hotp = FakeHotpService.create(3);
  expect(hotp.verify('969429')).toBe(true);
});

test('HOTP Counter 4', () => {
  const hotp = FakeHotpService.create(4);
  expect(hotp.value).toBe('338314');
});

test('Verify: HOTP Counter 4', () => {
  const hotp = FakeHotpService.create(4);
  expect(hotp.verify('338314')).toBe(true);
});
