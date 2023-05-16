'use strict';

import { expect } from 'chai';
import { ReadWriteStream } from '../lib/read_write_stream';
import { describe, it } from 'mocha';
import { Readable } from 'stream';

// to run single test
// npm run test-single -- "ReadWriteStream"

describe('ReadWriteStream', () => {
  it('write()', done => {
    const streamer = new ReadWriteStream();
    const expectedBuffer = Buffer.from('test read');
    let bytes = Buffer.from('');
    streamer.on('data', chunk => {
      bytes = Buffer.concat([bytes, chunk]);
    });
    streamer.write(expectedBuffer);
    expect(String(streamer.read())).to.equal(String(expectedBuffer));
    streamer.on('end', () => {
      try {
        expect(bytes).to.deep.equal(expectedBuffer);
        done();
      } catch (err) {
        done(err);
      }
    });
    streamer.end();
  });

  it('read()', done => {
    const streamer = new ReadWriteStream();
    const expectedBuffer = Buffer.from('test');
    let bytes = Buffer.from('');

    streamer.on('data', chunk => {
      bytes = Buffer.concat([bytes, chunk]);
    });

    streamer.on('end', () => {
      try {
        expect(bytes).to.deep.equal(expectedBuffer);
        done();
      } catch (err) {
        done(err);
      }
    });

    streamer.push(expectedBuffer);
    streamer.end();
  });

  it('using stream.Readable', done => {
    const streamer = new ReadWriteStream();
    const reader = new Readable();
    const expectedBuffer = Buffer.from('test');
    let bytes = Buffer.from('');

    streamer.on('data', chunk => {
      bytes = Buffer.concat([bytes, chunk]);
    });

    streamer.on('end', () => {
      try {
        expect(bytes).to.deep.equal(expectedBuffer);
        done();
      } catch (err) {
        done(err);
      }
    });

    reader.pipe(streamer);
    reader.push(expectedBuffer);
    reader.push(null);
  });
});
