import { Hotp } from 'final-otp';
import sendmail from 'sendmail';

import { BaseAuthenticator } from './base-authenticator';
import { Random } from '../../helper';
import { AuthenticatorValidationResult } from '../interfaces/authenticator';
import { AuthenticationException } from '../../core/errors/authentication-exception';
import { IUser } from '../../core/models/user';
import { ILogger } from '../../util';
import { RegisterException } from '../../core/errors';
import { AuthenticationType } from '../../core/models/authentication-types';

export interface EmailAuthenticatorOptions {
  domain: string;
}

export class EmailAuthenticator extends BaseAuthenticator {
  private readonly sendMailFn = sendmail({});
  private readonly domain: string;

  public constructor(logger: ILogger, options: EmailAuthenticatorOptions) {
    super(logger);
    this.domain = options.domain;
  }

  public prepareAuthenticationType(user: IUser, value?: any): IUser {
    if (!value) {
      throw new RegisterException(AuthenticationType.EMAIL);
    }
    this.logger.log(`Speichere E-Mail-Adresse ${value}.`);
    user.email = { email: value };
    return user;
  }

  public isAuthenticationTypeMissing(user: IUser, value?: string): AuthenticatorValidationResult {
    if (!value) {
      this.prepareEmailAuthentication(user);
      return { missing: true };
    }
    const pendingUser = this.currentlyPendingUsers.get(user.userId);
    const hotp = pendingUser?.email.hotp as Hotp;
    this.logger.log(`HOTP "${value}" erhalten. HOTP "${hotp.value}" erwartet.`);
    if (!hotp.verify(value)) {
      throw new AuthenticationException('Email code is not correct!');
    }
    return { missing: false };
  }

  private prepareEmailAuthentication(user: IUser): void {
    const hotp = this.hotpService.create(
      (user.email.emailSecret as string) || Random.cryptoKey(),
      Random.randomNumber(8),
      {
        expiresIn: 600000
      }
    );
    user.email.hotp = hotp;
    this.sendEmailWithHotp(user.email.email as string, hotp!.value);
  }

  private sendEmailWithHotp(email: string, hotp: string): void {
    this.logger.log(`Sende an ${email} eine E-Mail mit folgendem HOTP: ${hotp}`);
    this.sendMailFn(
      {
        from: this.domain,
        to: email,
        subject: 'Bestätigung einer Authentifizierung',
        html: `Ihr Bestätigungs-Code lautet: ${hotp}\n\r\n\rDieser Code ist zehn Minuten lang gültig.`
      },
      (err, reply) => {
        if (err) {
          this.logger.error(err);
        }
        this.logger.debug(reply);
      }
    );
  }
}
