import { AuthenticationType } from '../models/authentication-types';
import { IUser } from '../models/user';
import { BaseException } from './base-exception';
import { CredentialException } from './credential-exception';

export interface MissingAuthenticationTypeExceptionData {
  [key: string]: { [key: string]: any } | undefined;
}

export class MissingAuthenticationTypeException extends BaseException implements CredentialException {
  private readonly user: IUser;
  private readonly missingTypes: AuthenticationType[] = [];
  private readonly data: MissingAuthenticationTypeExceptionData = {};

  public constructor(user: IUser, missingTypes: MissingAuthenticationTypeExceptionData) {
    super(`Types ${Object.keys(missingTypes)} are missing in authentication by user: ${user.userId}`);
    this.user = user;
    this.missingTypes = Object.keys(missingTypes) as AuthenticationType[];
    this.data = missingTypes;
  }

  public getUser(): IUser {
    return this.user;
  }

  public getMissingTypes(): AuthenticationType[] {
    return this.missingTypes;
  }

  public getData(): MissingAuthenticationTypeExceptionData {
    return this.data;
  }
}
