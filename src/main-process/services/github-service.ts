import * as Octokit from '@octokit/rest';
import { IpcActionHandler, IpcActionServer } from '../../core/ipc';

@IpcActionServer('github')
export class GithubService {
  private rest: Octokit;

  @IpcActionHandler('a')
  async a() {
    return 10;
  }
}
