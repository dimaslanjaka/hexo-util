import { Transform } from 'stream';

class CacheStream extends Transform {
  _cache: Buffer[];

  constructor() {
    super();

    this._cache = [];
  }

  _transform(
    chunk:
      | WithImplicitCoercion<string>
      | {
          [Symbol.toPrimitive](hint: 'string'): string;
        },
    enc: BufferEncoding,
    callback: () => void
  ) {
    const buf = chunk instanceof Buffer ? chunk : Buffer.from(chunk, enc as BufferEncoding);
    this._cache.push(buf);
    this.push(buf);
    callback();
  }

  getCache() {
    return Buffer.concat(this._cache);
  }
}

export = CacheStream;
