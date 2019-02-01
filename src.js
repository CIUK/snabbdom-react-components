const lazy = require('./modules/lazy.js')
const css = require('./modules/styled').css
const h = require('./vendors/snabbdom/h.js')
const styled = require('./modules/styled.js')
const patch = require('./vendors/snabbdom/patch.js')
const createComponent = require('./modules/component.js')
const cssWithProps = require('./modules/styled').cssWithProps
const createAsyncComponent = require('./modules/component-async.js')
const cssWithPropsPlain = require('./modules/styled').cssWithPropsPlain

module.exports = createComponent

module.exports.h = h
module.exports.css = css
module.exports.lazy = lazy
module.exports.patch = patch
module.exports.styled = styled
module.exports.cssWithProps = cssWithProps
module.exports.cssWithPropsPlain = cssWithPropsPlain
module.exports.createAsyncComponent = createAsyncComponent
