import { expect } from 'chai';
import { encrypt, EncryptOptions, verify } from './encryption';

describe('libs/encryption', () => {
  it('should encrypt and verify.', async () => {
    const options: EncryptOptions = {
      algorithm: 'sha1',
      iteration: 10,
      keySize: 64,
      saltSize: 64,
    };

    const plainText = 'password';
    const { salt, encryptedText } = await encrypt(plainText, options);

    const isMatched = await verify(plainText, encryptedText, {
      ...options,
      salt,
    });

    expect(isMatched).to.equal(true);
  });
});
