type VerifyFn = (passedInCode: string, secret: string, args: { t1?: number; timeStepSize?: number }) => boolean;

export interface TotpArgs {
  secret: string;
  value: string;
  timeStepSize?: number;
  verifyFn: VerifyFn;
}

export class Totp {
  public readonly value: string;
  public readonly timeStepSize: number;
  public readonly secret: string;

  private verifyFn: VerifyFn;

  public constructor(args: TotpArgs) {
    this.value = args.value;
    this.secret = args.secret;
    this.timeStepSize = args.timeStepSize || 30;
    this.verifyFn = args.verifyFn;
  }

  public verify(code: string): boolean {
    return this.verifyFn(code, this.secret, { timeStepSize: this.timeStepSize });
  }
}
