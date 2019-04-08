const lazy = require('./modules/lazy.js');
const h = require('./vendors/snabbdom/h.js');
const patch = require('./vendors/snabbdom/patch.js');
const createComponent = require('./modules/component.js');
const { createAsyncComponent, createAsyncComponentPlain } = require('./modules/component-async.js');
const { styled, css, cssWithProps, cssWithPropsPlain } = require('./modules/styled');

const snabbomReactComponents = {};

module.exports = snabbomReactComponents;

module.exports.h = h;
module.exports.css = css;
module.exports.lazy = lazy;
module.exports.patch = patch;
module.exports.styled = styled;
module.exports.cssWithProps = cssWithProps;
module.exports.createComponent = createComponent;
module.exports.cssWithPropsPlain = cssWithPropsPlain;
module.exports.createAsyncComponent = createAsyncComponent;
module.exports.createAsyncComponentPlain = createAsyncComponentPlain;
