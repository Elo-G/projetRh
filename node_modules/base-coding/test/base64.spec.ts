import { FakeBase64 } from './utils';

test('Base64 encode ""', () => {
  const encoded = FakeBase64.encode('');
  expect(encoded).toBe('');
});

test('Base64 encode "f"', () => {
  const encoded = FakeBase64.encode('f');
  expect(encoded).toBe('Zg==');
});

test('Base64 encode "fo"', () => {
  const encoded = FakeBase64.encode('fo');
  expect(encoded).toBe('Zm8=');
});

test('Base64 encode "foo"', () => {
  const encoded = FakeBase64.encode('foo');
  expect(encoded).toBe('Zm9v');
});

test('Base64 encode "foob"', () => {
  const encoded = FakeBase64.encode('foob');
  expect(encoded).toBe('Zm9vYg==');
});

test('Base64 encode "fooba"', () => {
  const encoded = FakeBase64.encode('fooba');
  expect(encoded).toBe('Zm9vYmE=');
});

test('Base64 encode "foobar"', () => {
  const encoded = FakeBase64.encode('foobar');
  expect(encoded).toBe('Zm9vYmFy');
});

test('Base64 decode "Zg=="', () => {
  const decoded = FakeBase64.decode('Zg==');
  expect(decoded).toBe('f');
});

test('Base64 decode "Zm8="', () => {
  const decoded = FakeBase64.decode('Zm8=');
  expect(decoded).toBe('fo');
});

test('Base64 decode "Zm9v"', () => {
  const decoded = FakeBase64.decode('Zm9v');
  expect(decoded).toBe('foo');
});

test('Base64 decode "Zm9vYg=="', () => {
  const decoded = FakeBase64.decode('Zm9vYg==');
  expect(decoded).toBe('foob');
});

test('Base64 decode "Zm9vYmE="', () => {
  const decoded = FakeBase64.decode('Zm9vYmE=');
  expect(decoded).toBe('fooba');
});

test('Base64 decode "Zm9vYmFy"', () => {
  const decoded = FakeBase64.decode('Zm9vYmFy');
  expect(decoded).toBe('foobar');
});
