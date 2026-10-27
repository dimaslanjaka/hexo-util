import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import tildify from '../lib/tildify.js';

describe('tildify', () => {
  const home = path.normalize(os.homedir());

  it('should replace the home directory with ~', () => {
    assert.equal(tildify(home), '~');
  });

  it('should replace the home directory prefix', () => {
    const filepath = path.join(home, 'Documents', 'post.md');

    assert.equal(
      tildify(filepath),
      path.join('~', 'Documents', 'post.md')
    );
  });

  it('should handle paths directly inside the home directory', () => {
    const filepath = path.join(home, 'post.md');

    assert.equal(
      tildify(filepath),
      path.join('~', 'post.md')
    );
  });

  it('should not replace paths outside the home directory', () => {
    const filepath = path.resolve(home, '..', 'other', 'post.md');

    assert.equal(tildify(filepath), filepath);
  });

  it('should not replace paths sharing the home directory prefix', () => {
    const filepath = path.join(
      path.dirname(home),
      `${path.basename(home)}-other`,
      'post.md'
    );

    assert.equal(tildify(filepath), filepath);
  });

  it('should normalize paths before replacing the home directory', () => {
    const filepath = path.join(home, 'Documents', '.', 'drafts', '..', 'post.md');

    assert.equal(
      tildify(filepath),
      path.join('~', 'Documents', 'post.md')
    );
  });

  it('should preserve relative paths', () => {
    const filepath = path.join('Documents', 'post.md');

    assert.equal(tildify(filepath), filepath);
  });

  it('should handle the home directory with a trailing separator', () => {
    const filepath = home + path.sep;

    assert.equal(tildify(filepath), '~');
  });
});
