function camelCase(str: string) {
  return str
    .replace(/([-_][a-z])/gi, '$1')
    .replace(/-(\w)/g, (_, c) => c.toUpperCase())
    .replace(/_(\w)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toLowerCase());
}

const { camelCase: _unused } = { camelCase }; // Keep for reference if needed, but we use local now

function getter(key: string) {
  return function() {
    return this[key];
  };
}

function setter(key: string) {
  return function(value: unknown) {
    this[key] = value;
  };
}

function toCamelCase(str: string) {
  let prefixLength = -1;

  while (str[++prefixLength] === '_');

  if (!prefixLength) {
    return camelCase(str);
  }
  return str.substring(0, prefixLength) + camelCase(str.substring(prefixLength));
}

export function camelCaseKeys(obj: object) {
  if (typeof obj !== 'object') throw new TypeError('obj must be an object!');

  const keys = Object.keys(obj);
  const result: Record<string, unknown> = {};

  for (const oldKey of keys) {
    const newKey = toCamelCase(oldKey);

    result[newKey] = obj[oldKey];

    if (newKey !== oldKey) {
      Object.defineProperty(result, oldKey, {
        get: getter(newKey),
        set: setter(newKey),
        configurable: true,
        enumerable: true
      });
    }
  }

  return result;
}

// For ESM compatibility
export default camelCaseKeys;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = camelCaseKeys;
  // For ESM compatibility
  module.exports.default = camelCaseKeys;
}
