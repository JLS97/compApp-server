export function flattenObject(obj: any, prefix = ''): Record<string, unknown> {
  return Object.keys(obj).reduce((acc, key) => {
    const propName = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], propName));
    } else {
      acc[propName] = obj[key];
    }

    return acc;
  }, {});
}