import { ChildProcess, SpawnOptions } from 'child_process';
import spawn from 'cross-spawn';
import { ReadWriteStream } from './read_write_stream';

/**
 * Spawn asynchronously.
 * * asynchronously with stdio friendly
 * * can await until spawn finished while using stdio `inherits`
 * * can return stdout, stderr while using stdio `inherits`
 * @description
 * @param command - Command.
 * @param args - Arguments.
 * @param options Spawn Options.
 * @returns Return Promise.
 */
export function spawnAsync(command: string, args: SpawnOptions | string[], options?: SpawnOptions) {
  return new Promise(
    (resolve: (args: { stdout: string; stderr: string; err: string | null | string[]; output: string }) => unknown) => {
      let stdout = '';
      let stderr = '';
      let child: ChildProcess;
      if (Array.isArray(args)) {
        // the `args is Arguments
        child = spawn(command, args, options);
      } else {
        // the `args` is SpawnOptions
        options = args;
        if (options?.stdio === 'inherit') {
          // https://stackoverflow.com/a/75364238/6404439
          options.stdio = ['inherit', 'pipe', 'pipe']; // ['pipe', 'inherit', 'inherit'];
        }
        child = spawn(command, options);
      }

      if (options?.stdio === 'inherit') {
        child.stdout = new ReadWriteStream();
        child.stderr = new ReadWriteStream();
        // please node that this is not a full replacement for 'inherit'
        // the child process can and will detect if stdout is a pty and change output based on it
        // the terminal context is lost & ansi information (coloring) etc will be lost
        // child.stdout.pipe(process.stdout);
        // child.stderr.pipe(process.stderr);
        process.stdout.pipe(child.stdout as ReadWriteStream);
      }

      // Capture stdout
      if (child.stdout) {
        child.stdout.setEncoding('utf8');
        child.stdout.on('data', data => {
          stdout += data;
        });
      }

      // Capture stderr
      if (child.stderr) {
        child.stderr.setEncoding('utf8');
        child.stderr.on('data', data => {
          stderr += data;
        });
      }

      child.on('close', (code, signal) => {
        // Should probably be 'exit', not 'close'
        /* if (code !== 0) {
              console.log('[ERROR]', command, ...args, 'dies with code', code, 'signal', signal);
          }*/
        // Process completed
        resolve({
          stdout,
          stderr,
          err:
            code !== 0
              ? [command, Symbol.iterator in args ? [...args] : args, 'dies with code', code, 'signal', signal].join(
                ' '
              )
              : null,
          output: `${stdout}\n\n${stderr}`
        });
      });

      /*
      child.on('error', function (err) {
          // Process creation failed
          resolve(err);
      });*/
    }
  );
}
