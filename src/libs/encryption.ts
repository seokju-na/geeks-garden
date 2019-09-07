import { pbkdf2, randomBytes } from 'crypto';
import { promisify } from 'util';

const randomBytesAsync = promisify(randomBytes);
const pbkdf2Async = promisify(pbkdf2);

export interface EncryptOptions {
  /** @default sha512 */
  algorithm?: string;
  iteration: number;
  keySize: number;
  saltSize: number;
}

interface VerifyOptions extends Omit<EncryptOptions, 'saltSize'> {
  salt: Buffer;
}

async function createSaltBuffer(size: number): Promise<Buffer> {
  return await randomBytesAsync(size);
}

export async function encrypt(plainText: string, options: EncryptOptions) {
  const { algorithm = 'sha512', iteration, keySize, saltSize } = options;
  const salt = await createSaltBuffer(saltSize);
  const key = await pbkdf2Async(plainText, salt, iteration, keySize, algorithm);

  return {
    salt,
    encryptedText: key.toString('base64'),
  };
}

export async function verify(plainText: string, encryptedText: string, options: VerifyOptions) {
  const { algorithm = 'sha512', salt, iteration, keySize } = options;
  const key = await pbkdf2Async(plainText, salt, iteration, keySize, algorithm);

  return key.toString('base64') === encryptedText;
}
