// const lazy = require('./lazy.js')
const styled = require('./styled.js')
const h = require('./vendors/snabbdom/h.js')
const createComponent = require('./component.js')
// const createAsyncComponent = require('./component-async.js')
const patch = require('./vendors/snabbdom/patch.js')

module.exports = createComponent
module.exports.h = h
// module.exports.lazy = lazy
module.exports.patch = patch
module.exports.styled = styled
// module.exports.createAsyncComponent = createAsyncComponent
