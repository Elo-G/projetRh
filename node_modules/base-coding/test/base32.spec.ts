import { FakeBase32 } from './utils';

test('Base32 encode "f"', () => {
  const encoded = FakeBase32.encode('f');
  expect(encoded).toBe('MY======');
});

test('Base32 encode "fo"', () => {
  const encoded = FakeBase32.encode('fo');
  expect(encoded).toBe('MZXQ====');
});

test('Base32 encode "foo"', () => {
  const encoded = FakeBase32.encode('foo');
  expect(encoded).toBe('MZXW6===');
});

test('Base32 encode "foob"', () => {
  const encoded = FakeBase32.encode('foob');
  expect(encoded).toBe('MZXW6YQ=');
});

test('Base32 encode "fooba"', () => {
  const encoded = FakeBase32.encode('fooba');
  expect(encoded).toBe('MZXW6YTB');
});

test('Base32 encode "foobar"', () => {
  const encoded = FakeBase32.encode('foobar');
  expect(encoded).toBe('MZXW6YTBOI======');
});

test('Base32 decode "MY======"', () => {
  const decoded = FakeBase32.decode('MY======');
  expect(decoded).toBe('f');
});

test('Base32 decode "MZXQ===="', () => {
  const decoded = FakeBase32.decode('MZXQ====');
  expect(decoded).toBe('fo');
});

test('Base32 decode "MZXW6==="', () => {
  const decoded = FakeBase32.decode('MZXW6===');
  expect(decoded).toBe('foo');
});

test('Base32 decode "MZXW6YQ="', () => {
  const decoded = FakeBase32.decode('MZXW6YQ=');
  expect(decoded).toBe('foob');
});

test('Base32 decode "MZXW6YTB"', () => {
  const decoded = FakeBase32.decode('MZXW6YTB');
  expect(decoded).toBe('fooba');
});

test('Base32 decode "MZXW6YTBOI======"', () => {
  const decoded = FakeBase32.decode('MZXW6YTBOI======');
  expect(decoded).toBe('foobar');
});

test('Base32 decode "JBSWY3DPEBLW64TMMQ"', () => {
  const decoded = FakeBase32.decode('JBSWY3DPEBLW64TMMQ');
  expect(decoded).toBe('Hello World');
});
