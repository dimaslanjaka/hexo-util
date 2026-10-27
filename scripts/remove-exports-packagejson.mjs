import fs from 'node:fs';
import path from 'node:path';

const PACKAGE_JSON_PATH = path.resolve(process.cwd(), 'package.json');

function removeExports() {
  try {
    const content = fs.readFileSync(PACKAGE_JSON_PATH, 'utf8');
    const pkg = JSON.parse(content);

    if (pkg.exports) {
      console.log('Removing "exports" from package.json...');
      delete pkg.exports;
      fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2) + '\n');
      console.log('Successfully removed "exports".');
    } else {
      console.log('"exports" not found in package.json, skipping.');
    }
  } catch (error) {
    console.error('Error removing exports from package.json:', error);
    throw error;
  }
}

removeExports();
