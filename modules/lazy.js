const h = require('../vendors/snabbdom/h.js');
const patch = require('../vendors/snabbdom/patch.js');
const { isFunction, isArray, isString } = require('lodash');

const getLoader = (waitComponent) => {
  let loader = waitComponent;

  if (isFunction(loader)) {
    loader = loader();

    if (!isArray(loader)) {
      loader = [loader];
    }
  }

  if (!isString(loader) && !isArray(loader)) {
    loader = [loader];
  }

  return loader;
};

const getKey = function () {
  return `${Math.random().toString(36).substr(2, 9)}.${Math.random().toString(36).substr(2, 9)}`;
};

const lazy = (lazyComponent, waitComponent) => params => h('div', {
  key: getKey(),
  hook: {
    insert: async (vnode) => {
      const view = await lazyComponent(params);
      patch(vnode, view);
    },
  },
}, getLoader(waitComponent));

module.exports = lazy;
