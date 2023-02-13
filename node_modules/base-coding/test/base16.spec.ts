import { FakeBase16 } from './utils';

test('Base16 encode ""', () => {
  const encoded = FakeBase16.encode('');
  expect(encoded).toBe('');
});

test('Base16 encode "f"', () => {
  const encoded = FakeBase16.encode('f');
  expect(encoded).toBe('66');
});

test('Base16 encode "fo"', () => {
  const encoded = FakeBase16.encode('fo');
  expect(encoded).toBe('666F');
});

test('Base16 encode "foo"', () => {
  const encoded = FakeBase16.encode('foo');
  expect(encoded).toBe('666F6F');
});

test('Base16 encode "foob"', () => {
  const encoded = FakeBase16.encode('foob');
  expect(encoded).toBe('666F6F62');
});

test('Base16 encode "fooba"', () => {
  const encoded = FakeBase16.encode('fooba');
  expect(encoded).toBe('666F6F6261');
});

test('Base16 encode "foobar"', () => {
  const encoded = FakeBase16.encode('foobar');
  expect(encoded).toBe('666F6F626172');
});

test('Base16 decode "66"', () => {
  const decoded = FakeBase16.decode('66');
  expect(decoded).toBe('f');
});

test('Base16 decode "666F"', () => {
  const decoded = FakeBase16.decode('666F');
  expect(decoded).toBe('fo');
});

test('Base16 decode "666F6F"', () => {
  const decoded = FakeBase16.decode('666F6F');
  expect(decoded).toBe('foo');
});

test('Base16 decode "666F6F62"', () => {
  const decoded = FakeBase16.decode('666F6F62');
  expect(decoded).toBe('foob');
});

test('Base16 decode "666F6F6261"', () => {
  const decoded = FakeBase16.decode('666F6F6261');
  expect(decoded).toBe('fooba');
});

test('Base16 decode "666F6F626172"', () => {
  const decoded = FakeBase16.decode('666F6F626172');
  expect(decoded).toBe('foobar');
});
