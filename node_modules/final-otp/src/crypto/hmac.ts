import { addLeadingZeros, addTrailingZerosByModulo } from '../utils';

const BLOCK_SIZE = 64;
const OUTPUT_LENGTH = 20;
const IPAD = 0x36;
const OPAD = 0x5c;

// /**
//  * Constants h0 - h4
//  */
// const h0 = 0x67452301;
// const h1 = 0xefcdab89;
// const h2 = 0x98badcfe;
// const h3 = 0x10325476;
// const h4 = 0xc3d2e1f0;

/**
 * Constants k0 - k3
 */
const k0 = 0x5a827999;
const k1 = 0x6ed9eba1;
const k2 = 0x8f1bbcdc;
const k3 = 0xca62c1d6;

export function hmac(key: string, message: string, hash: (text: string, ...args: string[]) => string): string {
  if (key.length < OUTPUT_LENGTH) {
    console.warn(`Key should be at least ${OUTPUT_LENGTH} bytes long`);
  }
  if (key.length > BLOCK_SIZE) {
    key = hash(key);
  }
  const ipad = IPAD.toString(16).repeat(BLOCK_SIZE);
  const opad = OPAD.toString(16).repeat(BLOCK_SIZE);
  return hash((parseInt(key) ^ parseInt(opad)).toString(), hash((parseInt(key) ^ parseInt(ipad)).toString(), message));
}

type Sha1Function = ((b: number, c: number, d: number) => number) | null;

export function sha1(message: string): string {
  /**
   * Constants h0 - h4
   */
  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;
  const paddedMessage = addPaddingToMessage(message);
  console.log('paddedMessage', paddedMessage, paddedMessage.length);
  const words: string[] = [];
  const numberWords: number[] = [];
  for (let i = 0; i < 16; ++i) {
    const word = paddedMessage.substr(i * 8, 8);
    console.log('word to words', word, parseInt(word, 16));
    words.push(word);
    numberWords.push(parseInt(word, 16));
  }
  for (let t = 16; t < 80; ++t) {
    const word = leftRotate(
      parseInt(words[t - 3], 16) ^
        parseInt(words[t - 8], 16) ^
        parseInt(words[t - 14], 16) ^
        parseInt(words[t - 16], 16),
      1
    );
    const nWord = leftRotate(numberWords[t - 3] ^ numberWords[t - 8] ^ numberWords[t - 14] ^ numberWords[t - 16], 1);
    console.log('word:', word, modulo(word, Math.pow(2, 32)));
    console.log('nWord', nWord, modulo(nWord, Math.pow(2, 32)));
    words.push(word.toString(16));
    numberWords.push(nWord);
  }
  console.log('words', words);
  console.log('nWords', numberWords);
  let a = h0;
  let b = h1;
  let c = h2;
  let d = h3;
  let e = h4;
  for (let t = 0; t < 80; ++t) {
    let fn: Sha1Function = null;
    let k = 0;
    if (t < 20) {
      k = k0;
      fn = f0;
    } else if (t < 40) {
      k = k1;
      fn = f1;
    } else if (t < 60) {
      k = k2;
      fn = f2;
    } else {
      k = k3;
      fn = f3;
    }
    const temp = (leftRotate(a, 5) + fn(b, c, d) + e + parseInt(words[t], 16) + k) | 0;
    e = d;
    d = c;
    c = leftRotate(b, 30);
    b = a;
    a = temp;
  }

  h0 = (h0 + a) | 0;
  h1 = (h1 + b) | 0;
  h2 = (h2 + c) | 0;
  h3 = (h3 + d) | 0;
  h4 = (h4 + e) | 0;
  console.log('hs', h0, h1, h2, h3, h4);
  const digest = h0 << 128 || h1 << 96 || h2 << 64 || h3 << 32 || h4;
  return digest.toString(16);
}

/**
 * Sha1 function 0 used for t := 0 - 19
 *
 * @param b The first number
 * @param c The second number
 * @param d The third number
 *
 * @returns The result
 */
function f0(b: number, c: number, d: number): number {
  return (b & c) | (~b & d);
}

/**
 * Sha1 function 1 used for t := 20 - 39
 *
 * @param b The first number
 * @param c The second number
 * @param d The third number
 *
 * @returns The result
 */
function f1(b: number, c: number, d: number): number {
  return b ^ c ^ d;
}

/**
 * Sha1 function 2 used for t := 40 - 59
 *
 * @param b The first number
 * @param c The second number
 * @param d The third number
 *
 * @returns The result
 */
function f2(b: number, c: number, d: number): number {
  return (b & c) | (b & d) | (c & d);
}

/**
 * Sha1 function 3 used for t := 60 - 79
 *
 * @param b The first number
 * @param c The second number
 * @param d The third number
 *
 * @returns The result
 */
function f3(b: number, c: number, d: number): number {
  return b ^ c ^ d;
}

function leftRotate(word: number, rotation: number): number {
  return (word << rotation) | (word >>> (32 - rotation));
}

export function addPaddingToMessage(message: string): string {
  const BITS_OF_LENGTH = 64;
  const SHA1_BITS = 512;
  const binary = toBinary(message) + '1';
  console.log('binary', binary);
  const length = message.length;
  const binaryLength = addLeadingZeros(length.toString(2), BITS_OF_LENGTH);
  console.log('length:', length, binaryLength);
  const paddedMessage = `${binary}${addLeadingZeros('', SHA1_BITS - (binary.length + BITS_OF_LENGTH))}${binaryLength}`;
  return convertBinaryToHex(paddedMessage);
}

function modulo(integer: number, base: number): number {
  if (integer < 0) {
    return integer + base;
  } else {
    return integer % base;
  }
}

function stringToHex(toConvert: string): string {
  let result = '';
  for (let i = 0; i < toConvert.length; ++i) {
    result = result.concat(toConvert.charCodeAt(i).toString(16));
  }
  return result;
}

function convertBinaryToDecimal(toConvert: string): string {
  let result = '';
  for (let i = 0; i < toConvert.length / 4; ++i) {
    result = result.concat(parseInt(toConvert.substr(i * 4, 4), 2).toString(10));
  }
  return result;
}

function convertBinaryToHex(toConvert: string): string {
  let result = '';
  for (let i = 0; i < toConvert.length / 4; ++i) {
    result = result.concat(parseInt(toConvert.substr(i * 4, 4), 2).toString(16));
  }
  return result;
}

function isNumber(input: string): boolean {
  return isHexal(input);
}

function isHexal(input: string): boolean {
  return /^[0-9A-F]+$/g.test(input);
}

function isOctal(input: string): boolean {
  return /^[0-7]+$/g.test(input);
}

function isDecimal(input: string): boolean {
  return /^[0-9]+$/g.test(input);
}

function isBinary(input: string): boolean {
  return /^[0-1]+$/g.test(input);
}

function getRadix(input: string): number {
  if (isBinary(input)) {
    return 2;
  }
  if (isOctal(input)) {
    return 8;
  }
  if (isDecimal(input)) {
    return 10;
  }
  if (isHexal(input)) {
    return 16;
  }
  throw new Error(`Not a number: ${input}`);
}

function toBinary(input: string): string {
  if (isBinary(input)) {
    return input;
  }
  const binary = [];
  for (let i = 0; i < input.length; ++i) {
    const char = input.charCodeAt(i).toString(2);
    binary.push(char);
  }
  return binary.join('');
}

function toNumber(input: string): number {
  return parseInt(input, getRadix(input));
}
