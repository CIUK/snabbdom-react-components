// ####### Declarations ##########
const h = require('./vendors/snabbdom/h.js')
const cssToJS = require('./utils/cssToJS.js')
const { forEach, isArray, isString, has } = require('lodash')
const { mergeWithFn, ss } = require('./utils/helpers.js')
const { isVNode } = require('./utils/vDomHelpers.js')

// ####### Helpers ##########
const getVNode = (sel = 'div', literals, ...expressions) => (data = {}, children) => {
  const style = cssWithProps(data.styled)(literals, ...expressions)
  const defprops = { style, styledProps: { css: cssWithPropsPlain(data.styled)(literals, ...expressions) } }

  if (!children && (isVNode(data) || isArray(data) || isString(data))) {
    return h(sel, defprops, data)
  }

  return h(sel, mergeWithFn(defprops, data), children)
}

const execFuncArgs = (arg, props) => {
  if (typeof arg === 'function') {
    if (getVNode().toString() === arg.toString()) {
      const vnode = arg()

      if (has(vnode, 'data.styledProps.css')) {
        return vnode.data.styledProps.css
      }

      throw new Error('Cannot get property data.styledProps.css of given Vnode. Are you sure you passed styled component?')
    }

    if (props) {
      return ss(arg(props))
    }

    return ss(arg())
  }

  return arg
}

const css = (literals, ...expressions) => {
  let styles = ``

  forEach(literals, (literal, i) => {
    if (expressions[i]) {
      styles += `${literal}${execFuncArgs(expressions[i])}`
    } else {
      styles += literal
    }
  })

  return cssToJS(styles)
}

const cssWithPropsPlain = (props) => (literals, ...expressions) => {
  let styles = ``

  forEach(literals, (literal, i) => {
    if (expressions[i]) {
      styles += `${literal}${execFuncArgs(expressions[i], props || {})}`
    } else {
      styles += literal
    }
  })

  return styles
}

const cssWithProps = (props) => (literals, ...expressions) => {
  return cssToJS(cssWithPropsPlain(props)(literals, ...expressions))
}

const selector = (sel = 'div', literals, ...expressions) => {
  return getVNode(sel, literals, ...expressions)
}

// ########### Functions ###########
const div = (literals, ...expressions) => selector('div', literals, ...expressions)
const span = (literals, ...expressions) => selector('span', literals, ...expressions)
const small = (literals, ...expressions) => selector('small', literals, ...expressions)

// ########### Composing export ###########
const styled = {
  div: div,
  span: span,
  small: small
}

// ########### Export ###########
module.exports = styled
module.exports.css = css
module.exports.cssWithProps = cssWithProps
module.exports.cssWithPropsPlain = cssWithPropsPlain
