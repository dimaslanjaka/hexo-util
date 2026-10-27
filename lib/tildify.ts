import os from 'node:os';
import path from 'node:path';

const homeDirectory = path.normalize(os.homedir());

/**
 * Replace the home directory prefix with `~`.
 *
 * @example
 * tildify('C:\\Users\\Alice\\Documents') // '~\\Documents'
 * tildify('/home/alice/Documents')       // '~/Documents'
 */
export default function tildify(absolutePath: string): string {
  const normalizedPath = path.normalize(absolutePath);

  // Preserve relative paths rather than resolving them against cwd.
  if (!path.isAbsolute(normalizedPath)) {
    return normalizedPath;
  }

  const relativePath = path.relative(homeDirectory, normalizedPath);

  // The path is the home directory itself.
  if (!relativePath) {
    return '~';
  }

  // Ensure the path is inside the home directory, not just a sibling
  // sharing the same string prefix.
  if (
    relativePath === '..'
    || relativePath.startsWith(`..${path.sep}`)
    || path.isAbsolute(relativePath)
  ) {
    return normalizedPath;
  }

  return path.join('~', relativePath);
}