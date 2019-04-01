
const h = require('../vendors/snabbdom/h.js');
const isArray = require('lodash/isArray.js');
const isObject = require('lodash/isObject.js');
const isString = require('lodash/isString.js');
const map = require('lodash/map.js');
const get = require('lodash/get.js');
const has = require('lodash/has.js');
const isNull = require('lodash/isNull.js');
const isUndefined = require('lodash/isUndefined.js');

const toVNode = (textOrVNode) => {
  if (typeof (textOrVNode) === 'object') return textOrVNode;

  return {
    children: undefined,
    data: undefined,
    elm: undefined,
    key: undefined,
    sel: undefined,
    text: textOrVNode,
  };
};

const isVNode = (vnode) => {
  if (isObject(vnode) && has(vnode, 'children') && has(vnode, 'data') && has(vnode, 'sel') && has(vnode, 'elm') && has(vnode, 'key') && has(vnode, 'text')) {
    return true;
  }

  if (isObject(vnode) && has(vnode, 'children') && has(vnode, 'data') && has(vnode, 'sel')) {
    return true;
  }

  return false;
};

const trustHTML = (RawHTML) => {
  const AddHTML = vnode => (vnode.elm.innerHTML = RawHTML);
  const hook = {
    insert: AddHTML,
    update: AddHTML,
  };
  return h('div', {
    hook,
  });
};

const JsonToVNode = (json, context) => {
  if (isString(json)) {
    json = JSON.parse(json);
  }

  let children;

  if (isArray(json.children)) {
    children = map(json.children, c => JsonToVNode(c, context));
  } else if (isObject(json.children)) {
    children = [JsonToVNode(json.children, context)];
  } else if (isString(json.children) && json.children.match(/{{\s*[\w\.]+\s*}}/g)) {
    const ctx = get(context, json.children.match(/[\w\.]+/)[0]);

    if (isString(ctx)) {
      json.children = ctx;
    } else if (isArray(ctx)) {
      children = ctx;
    } else if (isObject(ctx)) {
      children = [ctx];
    }
  }

  return {
    children,
    data: {
      style: json.style,
      class: json.class,
      attrs: json.attrs,
      props: json.props,
    },
    elm: undefined,
    key: json.key,
    sel: json.tag,
    text: isString(json.children) ? json.children : undefined,
  };
};

const isDefinedValue = value => !isUndefined(value) && !isNull(value);

const isGhost = (vnode) => {
  if (isVNode(vnode)) {
    if (isDefinedValue(vnode.sc)) {
      return !(isDefinedValue(vnode.children) || isDefinedValue(vnode.text) || isDefinedValue(vnode.trustHTML));
    }

    return false;
  }

  return true;
};

const isDefinedChild = value => !isGhost(value) || (!isUndefined(value) && !isNull(value) && (isObject(value) ? isArray(value) : true));

module.exports.toVNode = toVNode;
module.exports.isVNode = isVNode;
module.exports.trustHTML = trustHTML;
module.exports.JsonToVNode = JsonToVNode;
module.exports.isDefinedValue = isDefinedValue;
module.exports.isGhost = isGhost;
module.exports.isDefinedChild = isDefinedChild;
