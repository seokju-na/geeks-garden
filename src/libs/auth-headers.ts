export function makeBasicAuthHeader(username: string, password: string): string {
  const authBuf = Buffer.from(`${username}:${password}`);
  const auth = authBuf.toString('base64');

  return `Basic ${auth}`;
}

export function makeTokenAuthHeader(token: string): string {
  return `token ${token}`;
}
