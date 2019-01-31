const mergeWith = require('lodash/mergeWith.js')
const isArray = require('lodash/isArray.js')
const isFunction = require('lodash/isFunction.js')
const forEach = require('lodash/forEach.js')
const findKey = require('lodash/findKey.js')
const toArray = require('lodash/toArray.js')
const transform = require('lodash/transform.js')
const isEqual = require('lodash/isEqual.js')
const isObject = require('lodash/isObject.js')

const createNestedObject = (obj, keyPath, value) => {
  const lastKeyIndex = keyPath.length - 1
  for (let i = 0; i < lastKeyIndex; ++i) {
    const key = keyPath[i]
    if (!(key in obj)) { obj[key] = {} }
    obj = obj[key]
  }
  obj[keyPath[lastKeyIndex]] = value
}

const multiFn = (fns, ...args) => {
  if (fns) {
    if (Array.isArray(fns)) {
      fns.forEach((fn) => fn(...args))
    } else {
      return fns(...args)
    }
  }
}

const composeFn = (fns) => () => multiFn(fns)

const mergeWithArrayCustomizer = (objValue, srcValue) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}
const mergeWithArray = (object, source) => mergeWith(object, source, mergeWithArrayCustomizer)

const mergeWithFnCustomizer = (objValue, srcValue) => {
  if (isFunction(objValue) && isFunction(srcValue)) {
    return (...args) => {
      objValue(...args)
      srcValue(...args)
    }
  }
}
const mergeWithFn = (object, source) => mergeWith(object, source, mergeWithFnCustomizer)

const objectToUrl = (o) => {
  let q = ''
  let i = 0

  forEach(o, (v, k) => {
    q += (i === 0 ? '?' : '&') + k + '=' + v
    i++
  })

  return q
}

const toPrice = (n, currency) => {
  return currency + '' + n.toFixed(2).replace(/./g, (c, i, a) => {
    return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c
  })
}

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const escapeICS = (s) => {
  return s.replace(/,/g, '\\,').replace(/:/g, '\\:').replace(/;/g, '\\;')
}

const getPropertyByCaseInsensitiveKey = (o = {}, n = '') => {
  const k = findKey(o, (v, p) => {
    return p.toLowerCase() === n.toLowerCase()
  })

  return o[k]
}

const delayApi = (delay = 2000) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay)
  })
}

const differenceDeep = (object, base) => {
  function changes (object, base) {
    return transform(object, function (result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value
      }
    })
  }
  return changes(object, base)
}

const divideByProps = (object, base) => {
  const items = {}
  const rest = {}

  forEach(object, (o, k) => {
    if (!base.hasOwnProperty(k)) {
      items[k] = o
    } else {
      rest[k] = o
    }
  })

  return [items, rest]
}

function defaultsDeepPreserveArrays() {
  let output = {}

  toArray(arguments).reverse().forEach(item => {
    mergeWith(output, item, (objectValue, sourceValue) => {
      return isArray(sourceValue) ? sourceValue : undefined
    })
  })

  return output
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const so = (obj, dv) => (obj || dv || {})

const sa = (arr, dv) => (arr || dv || [])

const ss = (str, dv) => (str || dv || '')

const toSnakeCase = (s) => {
  var upperChars = s.match(/([A-Z])/g)
  if (!upperChars) {
    return s
  }

  var str = s.toString()
  for (var i = 0, n = upperChars.length; i < n; i++) {
    str = str.replace(new RegExp(upperChars[i]), '_' + upperChars[i].toLowerCase())
  }

  if (str.slice(0, 1) === '_') {
    str = str.slice(1)
  }

  str = str.replace('i_d', 'id')

  return str
}

const withShared = (obj, pms) => {
  if (!obj.shared) {
    obj.shared = {}
  }

  if (!obj.shared.params) {
    obj.shared.params = pms
  }

  if (!obj.state) {
    obj.state = {}
  }

  return obj
}


module.exports.createNestedObject = createNestedObject;
module.exports.multiFn = multiFn;
module.exports.composeFn = composeFn;
module.exports.mergeWithArray = mergeWithArray;
module.exports.mergeWithFn = mergeWithFn;
module.exports.objectToUrl = objectToUrl;
module.exports.toPrice = toPrice;
module.exports.capitalize = capitalize;
module.exports.escapeICS = escapeICS;
module.exports.getPropertyByCaseInsensitiveKey = getPropertyByCaseInsensitiveKey;
module.exports.delayApi = delayApi;
module.exports.differenceDeep = differenceDeep;
module.exports.defaultsDeepPreserveArrays = defaultsDeepPreserveArrays;
module.exports.so = so;
module.exports.sa = sa;
module.exports.ss = ss;
module.exports.toSnakeCase = toSnakeCase;
module.exports.withShared = withShared;
module.exports.asyncForEach = asyncForEach;
module.exports.divideByProps = divideByProps;

