import { BaseAuthenticator } from './base-authenticator';
import { AuthenticatorValidationResult } from '../interfaces/authenticator';
import { IUser } from '../../core/models/user';
import { AuthenticationException, RegisterException } from '../../core/errors';
import { AuthenticationType } from '../../core/models/authentication-types';

export class PasswordAuthenticator extends BaseAuthenticator {
  public prepareAuthenticationType(user: IUser, value?: string): IUser {
    if (!value) {
      throw new RegisterException(AuthenticationType.PASSWORD);
    }
    this.logger.log(`Speichere Passwort ${value}.`);
    user.password = value;
    return user;
  }

  public isAuthenticationTypeMissing(user: IUser, value?: string): AuthenticatorValidationResult {
    this.logger.debug(`Check a new user with user userId: ${user.userId}: `, user);
    this.logger.log('Ein Passwort ist erforderlich.');
    if (!value) {
      this.logger.debug('Password not provided!');
      return { missing: true };
    }
    this.logger.log(`Passwort "${value}" erhalten. Passwort "${user.password}" wurde erwartet.`);
    if (user.password !== value) {
      this.logger.debug(`Password does not match. Received: ${value} -- Expected: ${user.password}.`);
      throw new AuthenticationException('Username or password is incorrect.');
    }
    return { missing: false };
  }
}
