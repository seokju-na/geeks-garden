import { use } from 'chai';
import spies from 'chai-spies';
import { createUserDummy } from '../../core/dummies';
import { User } from '../../core/user';
import { cleanupIpc } from '../testing/cleanup-ipc';
import { GithubService } from './github-service';
import { UserService } from './user-service';

use(spies);

describe('main-process/services/user-service', () => {
  let githubService: GithubService;
  let userService: UserService;

  const ensureUser = (user: User = createUserDummy()) => {
    (userService as any).user = user;
    return user;
  };

  cleanupIpc();

  beforeEach(() => {
    githubService = new GithubService();
    userService = new UserService(githubService);
  });

  describe('getUserContributionCalendar', () => {
    it('should response correctly', async () => {

    });
  });
});
