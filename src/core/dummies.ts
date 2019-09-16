import { User } from './user';

export function createUserDummy(partial: Partial<User> = {}): User {
  return {
    username: 'seokju-na',
    displayName: 'Seokju Na',
    email: 'seokju.me@gmail.com',
    profileUrl: 'https://github.com/seokju-na',
    ...partial,
  };
}
