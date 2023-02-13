import { CredentialLikeLogin, FidoService } from 'custom-fido-library';

import { ILogger } from '../../util';
import { AuthenticationException, RegisterException } from '../../core/errors';
import { AuthenticationType } from '../../core/models/authentication-types';
import { IUser } from '../../core/models/user';
import { AuthenticatorValidationResult } from '../interfaces/authenticator';
import { BaseAuthenticator } from './base-authenticator';
import { Base64 } from 'base-coding';

interface FidoAuthenticatorOptions {
  expectedOrigins: string[];
}

type Challenge = string;

function isCredentialObject(obj: object): boolean {
  return (
    obj.hasOwnProperty('id') &&
    obj.hasOwnProperty('rawId') &&
    obj.hasOwnProperty('response') &&
    obj.hasOwnProperty('type')
  );
}

export class FidoAuthenticator extends BaseAuthenticator {
  private pendingChallenges: { [userId: string]: Challenge } = {};

  private readonly expectedOrigins: string[];

  public constructor(logger: ILogger, options: FidoAuthenticatorOptions) {
    super(logger);
    this.expectedOrigins = options.expectedOrigins;
  }

  public isAuthenticationTypeMissing(user: IUser, value?: any): AuthenticatorValidationResult {
    if (!value) {
      const additionalData = FidoService.getLoginOptions(user.fido?.credentialId);
      this.logger.log(`Sende Challenge "${additionalData.challenge}" an Client.`);
      this.pendingChallenges[user.userId] = additionalData.challenge;
      return { missing: true, additionalData };
    } else {
      this.checkSignature(user, value);
      return { missing: false };
    }
  }

  public prepareAuthenticationType(user: IUser, value?: any): IUser {
    if (!value || !isCredentialObject(value)) {
      this.onChallenge(user, value);
    }
    if (value && isCredentialObject(value)) {
      return this.onResponse(user, value);
    }
    throw new AuthenticationException(`Unhandled value ${value} for user ${user.username}!`);
  }

  private onChallenge(user: IUser, value?: any): void {
    const additionalData = FidoService.getRegisterOptions({
      authenticatorAttachment: value?.authenticatorAttachment || 'cross-platform',
      username: user.username,
      rpName: value?.rpName,
      userId: user.userId
    });
    const id = additionalData.user.id;
    this.pendingChallenges[id] = additionalData.challenge as string;
    this.logger.log('Sende Challenge:', additionalData.challenge);
    throw new RegisterException(AuthenticationType.FIDO, { fido: additionalData });
  }

  private onResponse(user: IUser, value?: any): IUser {
    let challenge = '';
    try {
      const clientDataJSON = JSON.parse(Base64.decode(value.response.clientDataJSON));
      challenge = clientDataJSON.challenge;
    } catch (e) {
      this.logger.debug('Something went wrong during get challenge:', e);
    }
    this.logger.log(`Response erhalten.`, `Erwartete Challenge: ${this.pendingChallenges[user.userId]}`);
    user.fido = FidoService.verifyAttestationObject(value, {
      challenge: this.pendingChallenges[user.userId],
      origin: this.expectedOrigins
    });
    delete this.pendingChallenges[user.userId];
    return user;
  }

  private checkSignature(user: IUser, credential: CredentialLikeLogin): void {
    if (!user.fido || !user.fido.publicKeyPem) {
      throw new AuthenticationException(`A publickey is needed to authenticate with fido!`);
    }
    const expectations = {
      challenge: this.pendingChallenges[user.userId],
      counter: user.fido.counter,
      publicKeyPem: user.fido.publicKeyPem,
      origin: this.expectedOrigins
    };

    let challenge = '';
    try {
      const clientDataJSON = JSON.parse(Base64.decode(credential.response.clientDataJSON));
      challenge = clientDataJSON.challenge;
    } catch (e) {
      this.logger.debug('Something went wrong during get challenge:', e);
    }
    this.logger.log(`Response erhalten.`, `Erwartete Challenge: ${this.pendingChallenges[user.userId]}`);
    FidoService.verifySignature(credential, expectations);
    delete this.pendingChallenges[user.userId];
  }
}
