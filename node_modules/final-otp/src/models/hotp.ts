type VerifyFn = (passedInCode: string, secret: string, counter: number) => boolean;

export interface HotpArgs {
  value: string;
  expiresIn?: number;
  secret: string;
  counter: number;
  verifyFn: VerifyFn;
}

export class Hotp {
  public readonly value: string;
  public readonly createdAt: number;
  public readonly expiresIn: number | undefined;
  public readonly secret: string;
  public readonly counter: number;

  private verifyFn: VerifyFn;

  public constructor(args: HotpArgs) {
    this.value = args.value;
    this.expiresIn = args.expiresIn;
    this.secret = args.secret;
    this.counter = args.counter;
    this.createdAt = new Date().getTime();
    this.verifyFn = args.verifyFn;
  }

  public verify(code: string): boolean {
    if (this.expiresIn && new Date().getTime() > this.createdAt + this.expiresIn) {
      return false;
    }
    return this.verifyFn(code, this.secret, this.counter);
  }
}
