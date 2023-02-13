import { BaseAuthenticator } from './base-authenticator';
import { Authentication } from '../authentication';
import { AuthenticatorValidationResult } from '../interfaces/authenticator';
import { IUser } from '../../core/models/user';
import { AuthenticationException, RegisterException } from '../../core/errors';
import { AuthenticationType } from '../../core/models/authentication-types';

export class TotpAuthenticator extends BaseAuthenticator {
  public prepareAuthenticationType(user: IUser, value?: string): IUser {
    if (!value) {
      throw new RegisterException(AuthenticationType.TOTP);
    }
    this.logger.log(`Speichere totp-URI:`, value);
    user.totp = { raw: value };
    return user;
  }

  public isAuthenticationTypeMissing(user: IUser, value?: string): AuthenticatorValidationResult {
    if (!value) {
      this.logger.log('Für eine Authentifizierung ist ein TOTP erforderlich.');
      this.prepareTotpAuthentication(user);
      return { missing: true };
    }
    this.logger.log(`TOTP "${value}" erhalten. Überprüfe dessen Richtigkeit.`);
    const pendingUser = this.currentlyPendingUsers.get(user.userId);
    const otpValues = Authentication.uriToOtp(pendingUser?.totp.raw as string);
    if (!this.totpService.verify(value, otpValues.secret)) {
      throw new AuthenticationException('TOTP codes do not match!');
    }
    this.doCleanUp(user.userId);
    return { missing: false };
  }

  private prepareTotpAuthentication(user: IUser): void {
    if (!user.totp) {
      throw new AuthenticationException(`User ${user.username} has to create a totp-uri, first!`);
    }
    const otpValues = Authentication.uriToOtp(user.totp.raw);
    const totp = this.totpService.create(otpValues.secret);
    user.totp.totp = totp;
    this.registerPendingUser(user);
  }
}
