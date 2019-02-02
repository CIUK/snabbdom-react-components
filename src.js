const lazy = require('./modules/lazy.js')
const h = require('./vendors/snabbdom/h.js')
const patch = require('./vendors/snabbdom/patch.js')
const createComponent = require('./modules/component.js')
const createAsyncComponent = require('./modules/component-async.js')
const { styled, css, cssWithProps, cssWithPropsPlain } = require('./modules/styled')

const snabbomReactComponents = {
  h: h,
  css: css,
  lazy: lazy,
  patch: patch,
  styled: styled,
  cssWithProps: cssWithProps,
  createComponent: createComponent,
  cssWithPropsPlain: cssWithPropsPlain,
  createAsyncComponent: createAsyncComponent
}

module.exports = snabbomReactComponents
