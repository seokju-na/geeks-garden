import { spawn, SpawnOptions } from 'child_process';

/**
 * Async wrapper for 'child_process.spawn'
 * @param command
 * @param args
 * @param options
 */
export function spawnAsync(command: string, args?: string[], options?: SpawnOptions) {
  const task = spawn(command, args, options);

  return new Promise<void>((resolve, reject) => {
    task.stdout.setEncoding('utf8');
    task.stderr.setEncoding('utf8');

    task.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}
