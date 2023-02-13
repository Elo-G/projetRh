import { AuthenticationType } from '../models/authentication-types';
import { BaseException } from './base-exception';
import { CredentialException } from './credential-exception';

export interface RegisterAdditionalData {
  [key: string]: { [key: string]: any } | undefined;
}

export class RegisterException extends BaseException implements CredentialException {
  private readonly type: AuthenticationType;
  private readonly additionalData: RegisterAdditionalData | null;

  public constructor(type: AuthenticationType, additionalData?: RegisterAdditionalData) {
    super(`To register with type ${type} there are additional data needed.`);

    this.type = type;
    this.additionalData = additionalData || null;
  }

  public getType(): AuthenticationType {
    return this.type;
  }

  public getData(): RegisterAdditionalData {
    return this.additionalData as RegisterAdditionalData;
  }
}
