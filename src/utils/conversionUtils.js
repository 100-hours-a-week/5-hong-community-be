// snake case -> camel case
const snakeToCamel = (obj) => {
  return transformKeys(obj, (key) => key.replace(/(_\w)/g, (matches) => matches[1].toUpperCase()));
};

// camel case -> snake case
const camelToSnake = (obj) => {
  return transformKeys(obj, (key) => key.replace(/([A-Z])/g, (matches) => `_${matches[0].toLowerCase()}`));
};

const transformKeys = (obj, transformFn) => {
  if (!obj) return;

  return Object.keys(obj).reduce((newObj, key) => {
    const newKey = transformFn(key);
    newObj[newKey] = obj[key];
    return newObj;
  }, {});
};

module.exports = {
  snakeToCamel,
  camelToSnake,
};
