import { expect } from 'chai';
import { makeBasicAuthHeader } from './auth-headers';

describe('libs/auth-header', () => {
  describe('makeBasicAuthHeader', () => {
    it('should return basic authorization header.', () => {
      const header = makeBasicAuthHeader('user', 'password');

      expect(header).to.equal('Basic dXNlcjpwYXNzd29yZA==');
    });
  });
});
