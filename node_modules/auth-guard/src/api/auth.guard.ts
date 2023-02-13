import { AuthenticatorProvider } from './authenticator-provider';
import { AuthenticationCredential } from '../lib/core/models/authentication-credential';
import { IUser } from '../lib/core/models/user';
import {
  EmailAuthenticator,
  FidoAuthenticator,
  PasswordAuthenticator,
  TotpAuthenticator
} from '../lib/authentication/implementations';
import { Authenticator } from '../lib/authentication/interfaces';
import { AuthenticationType } from '../lib/core/models/authentication-types';
import { AuthenticationException, MissingAuthenticationTypeException } from '../lib/core/errors';
import { ILogger, Logger } from '../lib/util';

/**
 * Describes what information could be passed to the `AuthGuard`.
 */
export interface AuthenticationServerOptions {
  /**
   * Customizes output.
   */
  logger?: Partial<ILogger>;
  /**
   * Sets a domain, emails will go from.
   * Defaults to `authentication-server@example.com`.
   */
  domain?: string;
  /**
   * Sets a list of origins, that will be accepted by the fido-authenticator.
   * Defaults to `localhost:8000`.
   */
  expectedOrigins?: string | string[];
}

export class AuthGuard implements AuthenticatorProvider {
  private authenticators: { [key in AuthenticationType]?: Authenticator } = {};

  private readonly logger: ILogger;
  private readonly domain: string;
  private readonly expectedOrigins: string[];

  public constructor(options: AuthenticationServerOptions) {
    const { logger, domain, expectedOrigins } = options;
    const logHandler = logger || {};
    this.logger = {
      log: typeof logHandler.log === 'function' ? (...m) => logHandler.log!(...m) : (...m) => Logger.log(...m),
      warn: typeof logHandler.warn === 'function' ? (...m) => logHandler.warn!(...m) : (...m) => Logger.warn(...m),
      debug: typeof logHandler.debug === 'function' ? (...m) => logHandler.debug!(...m) : (...m) => Logger.debug(...m),
      error: typeof logHandler.error === 'function' ? (...m) => logHandler.error!(...m) : (...m) => Logger.error(...m)
    };
    this.domain = domain || 'authentication-server@example.com';
    this.expectedOrigins = expectedOrigins ? ([] as string[]).concat(expectedOrigins) : ['http://localhost:8000'];
    this.initAuthenticators();
  }

  public register(user: IUser, values?: AuthenticationCredential): IUser {
    if (!Object.keys(this.authenticators).length) {
      throw new AuthenticationException('No authenticators provided!');
    }
    for (const key of user.authenticationTypes) {
      if (!this.authenticators[key]) {
        throw new AuthenticationException(`Authenticator ${key} not provided!`);
      }
      user = (this.authenticators[key] as Authenticator).prepareAuthenticationType(user, values ? values[key] : null);
    }
    return user;
  }

  public login(user: IUser, values: AuthenticationCredential): void {
    const missingTypes: { [key in AuthenticationType]?: { [key: string]: any } } = {};

    if (!Object.keys(this.authenticators).length) {
      throw new AuthenticationException('No authenticators provided!');
    }
    for (const key of user.authenticationTypes) {
      if (!this.authenticators[key]) {
        throw new AuthenticationException(`Authenticator ${key} not provided!`);
      }
      const result = this.authenticators[key]?.isAuthenticationTypeMissing(user, values[key]);
      this.logger.debug('Result from authenticationType:', result);
      if (result?.missing) {
        missingTypes[key] = result.additionalData;
      }
    }
    if (!!Object.keys(missingTypes).length) {
      throw new MissingAuthenticationTypeException(user, missingTypes);
    }
  }

  public getAvailableAuthenticators(): AuthenticationType[] {
    return Object.keys(this.authenticators) as AuthenticationType[];
  }

  private initAuthenticators(): void {
    this.authenticators = {
      password: new PasswordAuthenticator(this.logger),
      totp: new TotpAuthenticator(this.logger),
      email: new EmailAuthenticator(this.logger, { domain: this.domain }),
      fido: new FidoAuthenticator(this.logger, { expectedOrigins: this.expectedOrigins })
    };
  }
}
