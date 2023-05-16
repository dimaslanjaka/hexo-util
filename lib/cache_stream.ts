import { Transform, TransformCallback } from 'stream';

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
    callback: TransformCallback
  ) {
    const buf = chunk instanceof Buffer ? chunk : Buffer.from(chunk, enc);
    this._cache.push(buf);
    this.push(buf);
    callback();
  }

  getCache() {
    return Buffer.concat(this._cache);
  }
}

export = CacheStream;
