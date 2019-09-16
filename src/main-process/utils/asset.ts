import * as path from 'path';

const ASSET_PATH = path.resolve(__dirname, 'assets/');

export function getAssetPath(pathname: string) {
  return path.join(ASSET_PATH, pathname);
}
