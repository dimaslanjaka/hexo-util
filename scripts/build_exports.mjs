import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const defaultExports = {
  '.': {
    import: './dist/index.js',
    require: './dist/index.cjs',
    types: './dist/index.d.ts'
  },
  './highlight_alias.json': './highlight_alias.json',
  './dist/highlight_alias.json': './highlight_alias.json'
};

fs.readdirSync(path.join(__dirname, '../lib')).forEach((file) => {
  if (!file.startsWith('_') && !file.includes('highlight_esm')) {
    defaultExports[`./dist/${file.replace('.ts', '')}`] = {
      import: `./dist/${file.replace('.ts', '.js')}`,
      require: `./dist/${file.replace('.ts', '.cjs')}`,
      types: `./dist/${file.replace('.js', '.d.ts')}`
    };
  }
});

// Sort the exports to ensure consistent output
const sortedExports = Object.keys(defaultExports)
  .sort()
  .reduce((obj, key) => {
    obj[key] = defaultExports[key];
    return obj;
  }, {});

packageJson.exports = sortedExports;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
