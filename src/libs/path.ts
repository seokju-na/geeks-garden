import * as path from 'path';
import * as fileUrl from 'file-url';

export function encodePathAsUrl(...pathSegments: string[]): string {
  const resolvedPath = path.resolve(...pathSegments);
  return fileUrl(resolvedPath);
}
