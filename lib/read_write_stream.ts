import stream from 'stream';

/**
 * readable streamer
 * @see {@link https://www.jowanza.com/blog/2020/2/10/readable-writable-and-transformable-streams}
 */
export class ReadableStream extends stream.Readable {
  constructor() {
    super();
    stream.Readable.call(this, { objectMode: true }); // Janky as hell JS
  }

  _read(size?: number) {
    // console.log('Reading data in...');
    return super.read(size);
  }
}

/**
 * writable streamer
 * @see {@link https://www.jowanza.com/blog/2020/2/10/readable-writable-and-transformable-streams}
 */
export class WritableStream extends stream.Writable {
  constructor() {
    super();
    stream.Writable.call(this, { objectMode: true });
  }
  _write(chunk: unknown, encoding: BufferEncoding, callback: () => void) {
    // console.log('Writing a value: ' + chunk);
    return super.write(chunk, encoding, callback);
  }
}

function reverse(s: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: 'string'): string }) {
  return String(s).split('').reverse().join('');
}

/**
 * transformable streamer
 * @see {@link https://www.jowanza.com/blog/2020/2/10/readable-writable-and-transformable-streams}
 */
export class TransformableStream extends stream.Transform {
  private _reverse = reverse;
  constructor() {
    super();
    stream.Transform.call(this, { objectMode: true });
  }
  _transform(
    chunk:
      | WithImplicitCoercion<string>
      | {
          [Symbol.toPrimitive](hint: 'string'): string;
        },
    enc: BufferEncoding,
    callback: stream.TransformCallback
  ) {
    // this.push(_reverse(chunk));
    const buf = chunk instanceof Buffer ? chunk : Buffer.from(chunk, enc);
    this.push(buf);
    callback();
  }
}

/**
 * Read Write stream (independent)
 * @example
 * const streamer = new ReadWriteStream();
 * const content = Buffer.from('test');
 * streamer.on('finish', () => {
 *   console.log('read', streamer.read().toString() === content.toString());
 * });
 * streamer.write(content);
 * streamer.end();
 */
export class ReadWriteStream extends stream.Duplex {
  private _cache: Buffer[];
  private delay = 0;
  private bufferNull = Buffer.from([0x00]);

  /*
   * Class constructor will receive the injections as parameters.
   */
  constructor(delayTime?: number) {
    super();
    if (typeof delayTime === 'number' && delayTime > 0) this.delay = delayTime;
    this._cache = [];
  }

  _read() {
    // return Buffer.concat(this._cache);
  }

  _write(
    chunk:
      | WithImplicitCoercion<string>
      | {
          [Symbol.toPrimitive](hint: 'string'): string;
        },
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    const buf = chunk instanceof Buffer ? chunk : Buffer.from(chunk, encoding);
    this._cache.push(buf);
    this.push(chunk, encoding);
    setTimeout(callback, this.delay);
  }

  _transform(
    chunk:
      | WithImplicitCoercion<string>
      | {
          [Symbol.toPrimitive](hint: 'string'): string;
        },
    enc: BufferEncoding,
    callback: stream.TransformCallback
  ) {
    const buf = chunk instanceof Buffer ? chunk : Buffer.from(chunk, enc);
    this._cache.push(buf);
    this.push(buf);
    setTimeout(callback, this.delay);
  }

  // When all the data is done passing, it stops.
  _final() {
    this.push(null);
  }

  /**
   * empty all previous stream data
   */
  flush() {
    super.uncork();
    // empty cache
    this._cache.length = 0;
    this.emit('flush');
  }
}
