import { expect } from 'chai';
import fs from 'node:fs';
import * as hexoUtilSrc from '../lib/index.js';

describe('Test import module in dual environment', function() {
  this.timeout(30000); // Increase Mocha timeout to allow for module loading
  const libNames = Object.keys(hexoUtilSrc).filter(name => !name.startsWith('_'));

  it('imports ESM modules and exposes url_for()', async () => {
    const { importModules } = await import('./utils.cjs');
    const { lib, mode } = await importModules('esm');
    expect(lib).to.have.property('url_for').that.is.a('function');
    expect(mode).to.equal('esm');
    expect(lib.url_for).to.be.a('function');
    const result = lib.url_for('test/test-import.mjs');
    expect(result).to.be.a('string');
  });

  it('imports CJS modules and exposes url_for()', async () => {
    const { importModules } = await import('./utils.cjs');
    const { lib, mode } = await importModules('cjs');
    expect(lib).to.have.property('url_for').that.is.a('function');
    expect(mode).to.equal('cjs');
    expect(lib.url_for).to.be.a('function');
    const result = lib.url_for('test/test-import.mjs');
    expect(result).to.be.a('string');
  });

  it('does not require the ESM-only change-case package from CJS output', () => {
    const cjsSource = fs.readFileSync(new URL('../dist/camel_case_keys.cjs', import.meta.url), 'utf8');
    expect(cjsSource).not.to.match(/require\(['"]change-case['"]\)/);
  });

  it('imports ESM modules and exposes all public methods', async () => {
    const { importModules } = await import('./utils.cjs');
    const { lib, mode } = await importModules('esm');
    expect(mode).to.equal('esm');
    expect(typeof lib === 'object' || typeof lib === 'function').to.be.true;
    for (const name of libNames) {
      expect(lib).to.have.property(name);
      if (typeof lib[name] === 'function' && typeof hexoUtilSrc[name] === 'function') {
        // Accept both the original name and _Name (esbuild/tsup default export wrapper)
        const actualName = lib[name].name;
        const expectedName = hexoUtilSrc[name].name;
        if (actualName !== expectedName) {
          // Allow _Name as valid due to bundler wrapping
          expect(actualName).to.equal(`_${expectedName}`, `ESM Module ${name} function/class name should match the source or _${expectedName}`);
        } else {
          expect(actualName).to.equal(expectedName, `ESM Module ${name} function/class name should match the source`);
        }
      } else {
        // Skip comparing the 'default' property, which is a bundler artifact
        if (name === 'default') continue;
        expect(lib[name]).to.deep.equal(hexoUtilSrc[name], `ESM Module ${name} should match the source`);
      }
    }
  });

  it('imports CJS modules and exposes all public methods', async () => {
    const { importModules } = await import('./utils.cjs');
    const { lib, mode } = await importModules('cjs');
    expect(mode).to.equal('cjs');
    expect(typeof lib === 'object' || typeof lib === 'function').to.be.true;
    for (const name of libNames) {
      expect(lib).to.have.property(name);
      if (typeof lib[name] === 'function' && typeof hexoUtilSrc[name] === 'function') {
        // Accept both the original name and _Name (esbuild/tsup default export wrapper)
        const actualName = lib[name].name;
        const expectedName = hexoUtilSrc[name].name;
        if (actualName !== expectedName) {
          // Allow _Name as valid due to bundler wrapping
          expect(actualName).to.equal(`_${expectedName}`, `CJS Module ${name} function/class name should match the source or _${expectedName}`);
        } else {
          expect(actualName).to.equal(expectedName, `CJS Module ${name} function/class name should match the source`);
        }
      } else {
        // Skip comparing the 'default' property, which is a bundler artifact
        if (name === 'default') continue;
        expect(lib[name]).to.deep.equal(hexoUtilSrc[name], `CJS Module ${name} should match the source`);
      }
    }
  });
});
