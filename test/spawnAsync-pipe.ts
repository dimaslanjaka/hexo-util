'use strict';

import { spawnAsync } from '../lib/spawnAsync';

spawnAsync('git', ['remote', '-v'], { stdio: 'pipe', cwd: __dirname }).then(piped => {
  console.log(piped.stdout.includes('/hexo-util'));

  spawnAsync('git', ['remote', '-v'], { stdio: 'inherit', cwd: __dirname }).then(console.log);
});


