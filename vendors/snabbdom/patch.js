var snabbdom = require('./snabbdom.js')
var snabbdomClass = require('./modules/class.js')
var snabbdomProps = require('./modules/props.js')
var snabbdomAtrributes = require('./modules/attributes.js')
var snabbdomStyle = require('./modules/style.js')
var snabbdomEventlisteners = require('./modules/eventlisteners.js')

module.exports = snabbdom.init([snabbdomClass, snabbdomProps, snabbdomAtrributes, snabbdomStyle, snabbdomEventlisteners])
