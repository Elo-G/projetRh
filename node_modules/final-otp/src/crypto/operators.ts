export function XOR(a: number, b: number): string {
  const binaryA = a.toString(2);
  const binaryB = b.toString(2);
  let binaryResult = '';
  for (let i = 0; i < binaryA.length; ++i) {
    const xor = parseInt(binaryA[i] + binaryB[i], 10) % 2;
    binaryResult = binaryResult.concat(xor.toString());
  }
  return binaryResult;
}
