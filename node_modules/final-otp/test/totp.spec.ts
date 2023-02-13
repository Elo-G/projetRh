import { FakeUtils } from './utils';
import { FakeTotpService } from './utils/fake-totp-service';

test('Totp T 59', () => {
  const totp = FakeTotpService.create(59);
  expect(totp.value).toBe('94287082');
});

test('Totp T 1111111109', () => {
  const totp = FakeTotpService.create(1111111109);
  expect(totp.value).toBe('07081804');
});

test('Totp T 1111111111', () => {
  const totp = FakeTotpService.create(1111111111);
  expect(totp.value).toBe('14050471');
});

test('Totp T 1234567890', () => {
  const totp = FakeTotpService.create(1234567890);
  expect(totp.value).toBe('89005924');
});

test('Totp base32 secret', () => {
  const isCorrect = FakeTotpService.verify('875110', 1608712290, 'JBSWY3DPEBLW64TMMQ');
  expect(isCorrect).toBe(true);
});

test('Totp verify T + 0', () => {
  const t1 = Math.round(new Date().getTime() / 1000);
  const totp = FakeTotpService.create(t1);
  const isCorrect = FakeTotpService.verify(totp.value, t1);
  expect(isCorrect).toBe(true);
});

test('Verify self: T + 0', () => {
  const t1 = Math.round(new Date().getTime() / 1000);
  const totp = FakeTotpService.create(t1);
  expect(totp.verify(totp.value)).toBe(true);
});

test('Totp verify T + 30', () => {
  const t1 = Math.round(new Date().getTime() / 1000);
  const totp = FakeTotpService.create(t1 + 30);
  const isCorrect = FakeTotpService.verify(totp.value, t1);
  expect(isCorrect).toBe(true);
});

test('Verify self: T + 30', () => {
  const t1 = Math.round(new Date().getTime() / 1000);
  const totp = FakeTotpService.create(t1 + 30);
  expect(totp.verify(totp.value)).toBe(true);
});

test('Totp verify T + 60', () => {
  const t1 = Math.round(new Date().getTime() / 1000);
  const totp = FakeTotpService.create(t1 + 60);
  const isCorrect = FakeTotpService.verify(totp.value, t1);
  expect(isCorrect).toBe(true);
});

test('Verify self: T + 60', () => {
  const t1 = Math.round(new Date().getTime() / 1000);
  const totp = FakeTotpService.create(t1 + 60);
  expect(totp.verify(totp.value)).toBe(true);
});

test('Totp verify T + 90', () => {
  const t1 = Math.round(new Date().getTime() / 1000);
  const totp = FakeTotpService.create(t1 + 90);
  const isCorrect = FakeTotpService.verify(totp.value, t1);
  expect(isCorrect).toBe(false);
});

test('Verify self: T + 90', () => {
  const t1 = Math.round(new Date().getTime() / 1000);
  const totp = FakeTotpService.create(t1 + 90);
  expect(totp.verify(totp.value)).toBe(false);
});
