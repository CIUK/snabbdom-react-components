const mergeWith = require('lodash/mergeWith.js');
const isArray = require('lodash/isArray.js');
const isFunction = require('lodash/isFunction.js');
const forEach = require('lodash/forEach.js');
const findKey = require('lodash/findKey.js');
const toArray = require('lodash/toArray.js');
const transform = require('lodash/transform.js');
const isEqual = require('lodash/isEqual.js');
const isObject = require('lodash/isObject.js');

const mergeWithFnCustomizer = (objValue, srcValue) => {
  if (isFunction(objValue) && isFunction(srcValue)) {
    return (...args) => {
      objValue(...args);
      srcValue(...args);
    };
  }
};

const mergeWithFn = (object, source) => mergeWith(object, source, mergeWithFnCustomizer);

const getPropertyByCaseInsensitiveKey = (o = {}, n = '') => {
  const k = findKey(o, (v, p) => p.toLowerCase() === n.toLowerCase());

  return o[k];
};

const differenceDeep = (object, base) => {
  function changes(object, base) {
    return transform(object, (result, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
};

const divideByProps = (object, base) => {
  const items = {};
  const rest = {};

  forEach(object, (o, k) => {
    if (!base.hasOwnProperty(k)) {
      items[k] = o;
    } else {
      rest[k] = o;
    }
  });

  return [items, rest];
};

function defaultsDeepPreserveArrays() {
  let output = {};

  toArray(arguments).reverse().forEach((item) => {
    mergeWith(output, item, (objectValue, sourceValue) => (isArray(sourceValue) ? sourceValue : undefined));
  });

  return output;
}

const so = (obj, dv) => (obj || dv || {});

const sa = (arr, dv) => (arr || dv || []);

const ss = (str, dv) => (str || dv || '');

module.exports.mergeWithFn = mergeWithFn;
module.exports.getPropertyByCaseInsensitiveKey = getPropertyByCaseInsensitiveKey;
module.exports.differenceDeep = differenceDeep;
module.exports.defaultsDeepPreserveArrays = defaultsDeepPreserveArrays;
module.exports.so = so;
module.exports.sa = sa;
module.exports.ss = ss;
module.exports.divideByProps = divideByProps;
