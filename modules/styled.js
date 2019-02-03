// ####### Declarations ##########
const h = require('../vendors/snabbdom/h.js');
const cssToJS = require('../utils/cssToJS.js');
const { forEach, isArray, isString, has } = require('lodash');
const { mergeWithFn, ss } = require('../utils/helpers.js');
const { isVNode } = require('../utils/vDomHelpers.js');

// ####### Helpers ##########
const getVNode = (sel = 'div', literals, ...expressions) => (data = {}, children) => {
  const style = cssWithProps(data.styled)(literals, ...expressions);
  const defprops = { style, styledProps: { css: cssWithPropsPlain(data.styled)(literals, ...expressions) } };

  if (!children && (isVNode(data) || isArray(data) || isString(data))) {
    return h(sel, defprops, data);
  }

  return h(sel, mergeWithFn(defprops, data), children);
};

const execFuncArgs = (arg, props) => {
  if (typeof arg === 'function') {
    if (getVNode().toString() === arg.toString()) {
      const vnode = arg();

      if (has(vnode, 'data.styledProps.css')) {
        return vnode.data.styledProps.css;
      }

      throw new Error('Cannot get property data.styledProps.css of given Vnode. Are you sure you passed styled component?');
    }

    if (props) {
      return ss(arg(props));
    }

    return ss(arg());
  }

  return arg;
};

const css = (literals, ...expressions) => {
  let styles = '';

  forEach(literals, (literal, i) => {
    if (expressions[i]) {
      styles += `${literal}${execFuncArgs(expressions[i])}`;
    } else {
      styles += literal;
    }
  });

  return cssToJS(styles);
};

const cssWithPropsPlain = props => (literals, ...expressions) => {
  let styles = '';

  forEach(literals, (literal, i) => {
    if (expressions[i]) {
      styles += `${literal}${execFuncArgs(expressions[i], props || {})}`;
    } else {
      styles += literal;
    }
  });

  return styles;
};

const cssWithProps = props => (literals, ...expressions) => cssToJS(cssWithPropsPlain(props)(literals, ...expressions));

const selector = (sel = 'div', literals, ...expressions) => getVNode(sel, literals, ...expressions);

// ########### Composing export ###########
const styled = {
  a: (literals, ...expressions) => selector('a', literals, ...expressions),
  abbr: (literals, ...expressions) => selector('abbr', literals, ...expressions),
  address: (literals, ...expressions) => selector('address', literals, ...expressions),
  area: (literals, ...expressions) => selector('area', literals, ...expressions),
  article: (literals, ...expressions) => selector('article', literals, ...expressions),
  aside: (literals, ...expressions) => selector('aside', literals, ...expressions),
  audio: (literals, ...expressions) => selector('audio', literals, ...expressions),
  b: (literals, ...expressions) => selector('b', literals, ...expressions),
  base: (literals, ...expressions) => selector('base', literals, ...expressions),
  bdi: (literals, ...expressions) => selector('bdi', literals, ...expressions),
  bdo: (literals, ...expressions) => selector('bdo', literals, ...expressions),
  big: (literals, ...expressions) => selector('big', literals, ...expressions),
  blockquote: (literals, ...expressions) => selector('blockquote', literals, ...expressions),
  body: (literals, ...expressions) => selector('body', literals, ...expressions),
  br: (literals, ...expressions) => selector('br', literals, ...expressions),
  button: (literals, ...expressions) => selector('button', literals, ...expressions),
  canvas: (literals, ...expressions) => selector('canvas', literals, ...expressions),
  caption: (literals, ...expressions) => selector('caption', literals, ...expressions),
  cite: (literals, ...expressions) => selector('cite', literals, ...expressions),
  code: (literals, ...expressions) => selector('code', literals, ...expressions),
  col: (literals, ...expressions) => selector('col', literals, ...expressions),
  colgroup: (literals, ...expressions) => selector('colgroup', literals, ...expressions),
  data: (literals, ...expressions) => selector('data', literals, ...expressions),
  datalist: (literals, ...expressions) => selector('datalist', literals, ...expressions),
  dd: (literals, ...expressions) => selector('dd', literals, ...expressions),
  del: (literals, ...expressions) => selector('del', literals, ...expressions),
  details: (literals, ...expressions) => selector('details', literals, ...expressions),
  dfn: (literals, ...expressions) => selector('dfn', literals, ...expressions),
  dialog: (literals, ...expressions) => selector('dialog', literals, ...expressions),
  div: (literals, ...expressions) => selector('div', literals, ...expressions),
  dl: (literals, ...expressions) => selector('dl', literals, ...expressions),
  dt: (literals, ...expressions) => selector('dt', literals, ...expressions),
  em: (literals, ...expressions) => selector('em', literals, ...expressions),
  embed: (literals, ...expressions) => selector('embed', literals, ...expressions),
  fieldset: (literals, ...expressions) => selector('fieldset', literals, ...expressions),
  figcaption: (literals, ...expressions) => selector('figcaption', literals, ...expressions),
  figure: (literals, ...expressions) => selector('figure', literals, ...expressions),
  footer: (literals, ...expressions) => selector('footer', literals, ...expressions),
  form: (literals, ...expressions) => selector('form', literals, ...expressions),
  h1: (literals, ...expressions) => selector('h1', literals, ...expressions),
  h2: (literals, ...expressions) => selector('h2', literals, ...expressions),
  h3: (literals, ...expressions) => selector('h3', literals, ...expressions),
  h4: (literals, ...expressions) => selector('h4', literals, ...expressions),
  h5: (literals, ...expressions) => selector('h5', literals, ...expressions),
  h6: (literals, ...expressions) => selector('h6', literals, ...expressions),
  head: (literals, ...expressions) => selector('head', literals, ...expressions),
  header: (literals, ...expressions) => selector('header', literals, ...expressions),
  hgroup: (literals, ...expressions) => selector('hgroup', literals, ...expressions),
  hr: (literals, ...expressions) => selector('hr', literals, ...expressions),
  html: (literals, ...expressions) => selector('html', literals, ...expressions),
  i: (literals, ...expressions) => selector('i', literals, ...expressions),
  iframe: (literals, ...expressions) => selector('iframe', literals, ...expressions),
  img: (literals, ...expressions) => selector('img', literals, ...expressions),
  input: (literals, ...expressions) => selector('input', literals, ...expressions),
  ins: (literals, ...expressions) => selector('ins', literals, ...expressions),
  kbd: (literals, ...expressions) => selector('kbd', literals, ...expressions),
  keygen: (literals, ...expressions) => selector('keygen', literals, ...expressions),
  label: (literals, ...expressions) => selector('label', literals, ...expressions),
  legend: (literals, ...expressions) => selector('legend', literals, ...expressions),
  li: (literals, ...expressions) => selector('li', literals, ...expressions),
  link: (literals, ...expressions) => selector('link', literals, ...expressions),
  main: (literals, ...expressions) => selector('main', literals, ...expressions),
  map: (literals, ...expressions) => selector('map', literals, ...expressions),
  mark: (literals, ...expressions) => selector('mark', literals, ...expressions),
  marquee: (literals, ...expressions) => selector('marquee', literals, ...expressions),
  menu: (literals, ...expressions) => selector('menu', literals, ...expressions),
  menuitem: (literals, ...expressions) => selector('menuitem', literals, ...expressions),
  meta: (literals, ...expressions) => selector('meta', literals, ...expressions),
  meter: (literals, ...expressions) => selector('meter', literals, ...expressions),
  nav: (literals, ...expressions) => selector('nav', literals, ...expressions),
  noscript: (literals, ...expressions) => selector('noscript', literals, ...expressions),
  object: (literals, ...expressions) => selector('object', literals, ...expressions),
  ol: (literals, ...expressions) => selector('ol', literals, ...expressions),
  optgroup: (literals, ...expressions) => selector('optgroup', literals, ...expressions),
  option: (literals, ...expressions) => selector('option', literals, ...expressions),
  output: (literals, ...expressions) => selector('output', literals, ...expressions),
  p: (literals, ...expressions) => selector('p', literals, ...expressions),
  param: (literals, ...expressions) => selector('param', literals, ...expressions),
  picture: (literals, ...expressions) => selector('picture', literals, ...expressions),
  pre: (literals, ...expressions) => selector('pre', literals, ...expressions),
  progress: (literals, ...expressions) => selector('progress', literals, ...expressions),
  q: (literals, ...expressions) => selector('q', literals, ...expressions),
  rp: (literals, ...expressions) => selector('rp', literals, ...expressions),
  rt: (literals, ...expressions) => selector('rt', literals, ...expressions),
  ruby: (literals, ...expressions) => selector('ruby', literals, ...expressions),
  s: (literals, ...expressions) => selector('s', literals, ...expressions),
  samp: (literals, ...expressions) => selector('samp', literals, ...expressions),
  script: (literals, ...expressions) => selector('script', literals, ...expressions),
  section: (literals, ...expressions) => selector('section', literals, ...expressions),
  select: (literals, ...expressions) => selector('select', literals, ...expressions),
  small: (literals, ...expressions) => selector('small', literals, ...expressions),
  source: (literals, ...expressions) => selector('source', literals, ...expressions),
  span: (literals, ...expressions) => selector('span', literals, ...expressions),
  strong: (literals, ...expressions) => selector('strong', literals, ...expressions),
  style: (literals, ...expressions) => selector('style', literals, ...expressions),
  sub: (literals, ...expressions) => selector('sub', literals, ...expressions),
  summary: (literals, ...expressions) => selector('summary', literals, ...expressions),
  sup: (literals, ...expressions) => selector('sup', literals, ...expressions),
  table: (literals, ...expressions) => selector('table', literals, ...expressions),
  tbody: (literals, ...expressions) => selector('tbody', literals, ...expressions),
  td: (literals, ...expressions) => selector('td', literals, ...expressions),
  textarea: (literals, ...expressions) => selector('textarea', literals, ...expressions),
  tfoot: (literals, ...expressions) => selector('tfoot', literals, ...expressions),
  th: (literals, ...expressions) => selector('th', literals, ...expressions),
  thead: (literals, ...expressions) => selector('thead', literals, ...expressions),
  time: (literals, ...expressions) => selector('time', literals, ...expressions),
  title: (literals, ...expressions) => selector('title', literals, ...expressions),
  tr: (literals, ...expressions) => selector('tr', literals, ...expressions),
  track: (literals, ...expressions) => selector('track', literals, ...expressions),
  u: (literals, ...expressions) => selector('u', literals, ...expressions),
  ul: (literals, ...expressions) => selector('ul', literals, ...expressions),
  var: (literals, ...expressions) => selector('var', literals, ...expressions),
  video: (literals, ...expressions) => selector('video', literals, ...expressions),
  wbr: (literals, ...expressions) => selector('wbr', literals, ...expressions),
};

// ########### Export ###########
module.exports = { styled, css, cssWithProps, cssWithPropsPlain };
