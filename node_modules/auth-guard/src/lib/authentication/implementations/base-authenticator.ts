import { HotpService, TotpService } from 'final-otp';

import { ILogger } from '../../util';
import { Authenticator, AuthenticatorValidationResult } from '../interfaces/authenticator';
import { IUser } from './../../core/models/user';

export abstract class BaseAuthenticator implements Authenticator {
  protected hotpService = HotpService;
  protected totpService = TotpService;

  protected currentlyPendingUsers = new Map<string, IUser>();

  protected logger: ILogger;

  public constructor(logger: ILogger) {
    this.logger = logger;
  }

  public abstract prepareAuthenticationType(user: IUser, value?: any): IUser;
  public abstract isAuthenticationTypeMissing(user: IUser, value?: string): AuthenticatorValidationResult;

  protected registerPendingUser(user: IUser): void {
    this.currentlyPendingUsers.set(user.userId, user);
  }

  protected doCleanUp(userId: string): void {
    this.currentlyPendingUsers.delete(userId);
  }
}
