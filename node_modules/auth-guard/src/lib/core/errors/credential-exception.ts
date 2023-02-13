export interface CredentialException {
  getData(): { [key: string]: { [key: string]: any } | undefined };
}
