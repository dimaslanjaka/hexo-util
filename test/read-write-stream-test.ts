'use strict';

import { PassThrough } from 'stream';
import { ReadWriteStream } from '../lib/read_write_stream';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

if (!existsSync(join(__dirname, '../tmp'))) {
  mkdirSync(join(__dirname, '../tmp'));
}

const streamer = new ReadWriteStream();

streamer.on('finish', () => {
  console.log('read', streamer.read());
});
streamer.write(Buffer.from('test write'));
console.log('streamer.write', String(streamer.read()));
streamer.flush();

// test read data
function readableListener() {
  let chunk: ReturnType<typeof streamer.read>;
  // console.log('Stream is readable (new data received in buffer)');
  // Use a loop to make sure we read all currently available data
  while ((chunk = streamer.read()) !== null) {
    console.log('Read', chunk.length, 'bytes of data...');
  }
}
streamer.push(Buffer.from('test read'));
streamer.on('readable', readableListener);
console.log('reader.read', String(streamer.read()));
// streamer.removeListener('readable', readableListener);
streamer.flush();

// test write data
const readStream = createReadStream(__filename);
const writeStream = createWriteStream(join(__dirname, '../tmp/dummy-write-stream.txt'));
const tunnel = new PassThrough();

let amount = 0;
tunnel.on('data', chunk => {
  amount += chunk.length;
  console.log('bytes:', amount);
});

readStream.pipe(streamer).pipe(tunnel).pipe(writeStream);
