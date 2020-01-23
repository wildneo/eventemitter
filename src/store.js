export default () => {
  const inner = new Map();
  const outer = {
    set: (key, data) => { inner.set(key, data); },
    get: (key) => inner.get(key),
    has: (key) => inner.has(key),
    clear: () => inner.clear(),
    remove: (key) => inner.delete(key),
    getStore: () => {
      const obj = {};
      inner.forEach((data, key) => {
        obj[key] = data;
      });

      return obj;
    },
  };

  return outer;
};
