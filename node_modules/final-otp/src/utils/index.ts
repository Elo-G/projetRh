type Digits = 6 | 7 | 8;

function createArray(length: number, defaultValue: number = 0): number[] {
  const result: number[] = [];
  for (let i = 0; i < length; ++i) {
    result.push(defaultValue);
  }
  return result;
}

function convertNumberIntoBytes(toConvert: number): number[] {
  const bytes: number[] = createArray(8);
  for (let i = bytes.length - 1; i >= 0; --i) {
    bytes[i] = toConvert & 0xff;
    toConvert >>= 8;
  }
  return bytes;
}

function isBase32(input: string): boolean {
  const regex = /^[A-Z0-7]+=*$/g;
  return regex.test(input);
}

function addLeadingZeros(numberAsString: string, expectedLength: number): string {
  let result = numberAsString;
  while (result.length < expectedLength) {
    result = `0${result}`;
  }
  return result;
}

function addTrailingZerosByModulo(numberAsString: string, expectedLength: number): string {
  let result = numberAsString;
  while (result.length % expectedLength !== 0) {
    result = `${result}0`;
  }
  return result;
}

export { Digits, addLeadingZeros, addTrailingZerosByModulo, isBase32, createArray, convertNumberIntoBytes };
