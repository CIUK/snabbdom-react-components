// ####### Declarations ##########
const h = require('../vendors/snabbdom/h.js')
const patch = require('../vendors/snabbdom/patch.js')
const { defaultsDeepPreserveArrays, divideByProps } = require('../utils/helpers.js')
const { defaultsDeep, forEach, map, last, uniq, includes, concat, isFunction, isArray } = require('lodash')
const lazy = require('./lazy.js')

// ####### Defaults ##########

const CONSTS = {
  ACTION: {}
}

const state = {
  data: null,
  wait: false
}

const defaultParams = {
  key: null,
  render: null,
  async: false, // If true, component will be returned as a promise
  reducer: null,
  spinner: false,
  state: { ...state },
  delaySpinner: false, // If true, component spinner will appear with delay (for fast internet connection spinner will not be shown)
  ejectComponent: false, // If true, component will return object with actions and elm
  CONSTS: { ...CONSTS },
  componentDidInit: null,
  componentWillInit: null,
  componentDidMount: null,
  componentWillMount: null,
  componentDidUpdate: null,
  componentDidUnmount: null,
  componentWillUpdate: null,
  componentWillUnmount: null,
  shouldComponentUpdate: true,
  componentWillPrepatch: null,
  componentWillPostpatch: null,
  componentWillUpdateVNode: null,
  componentDidCreateViewObject: null,
  componentWillCreateViewObject: null
}

// ####### Component Helpers ##########

const loader = (params = {}) => {
  const { delaySpinner } = params

  const s = delaySpinner ? {
    style: {
      WebkitAnimationDuration: '0.5s',
      WebkitAnimationFillMode: 'both',
      WebkitAnimationDelay: '0.3s',
      WebkitAnimationName: 'fadeIn',
      animationDuration: '0.5s',
      animationFillMode: 'both',
      animationDelay: '0.3s',
      animationName: 'fadeIn'
    }
  } : {}

  return h('div', {
    style: {
      display: 'block',
      opacyty: '0',
      height: '32px',
      padding: '10px'
    },
    key: 'loader',
    ...s,
    ...params.loaderData
  }, 'loading...')
}

// ######## Actions ###########

const actions = (viewObject) => {
  const items = divideByProps(viewObject.params, defaultParams)[0]

  const getState = () => {
    return viewObject.actions.state
  }

  const setState = async (newState = {}, callback = null, updateView = true) => {
    console.log('Setting new state...')

    let state = newState
    let shouldComponentUpdate = true

    if (isFunction(newState)) {
      state = await newState(viewObject.actions.state)
    }

    viewObject.actions.state = defaultsDeepPreserveArrays(state, viewObject.actions.state)

    console.log('shouldComponentUpdate')
    if (isFunction(viewObject.actions.shouldComponentUpdate)) {
      shouldComponentUpdate = await !!viewObject.actions.shouldComponentUpdate(viewObject.actions.state, viewObject.actions)
    } else {
      shouldComponentUpdate = !!viewObject.actions.shouldComponentUpdate
    }

    if (shouldComponentUpdate) {
      if (updateView) {
        console.log('componentWillUpdate')
        if (viewObject.actions.componentWillUpdate && isFunction(viewObject.actions.componentWillUpdate)) {
          await viewObject.actions.componentWillUpdate(viewObject.actions.state, viewObject.actions, viewObject)
        }

        viewObject.nodes.view = patch(viewObject.nodes.view, viewObject.component.getViewComponent(viewObject.actions.state))

        console.log('componentDidUpdate')
        if (viewObject.actions.componentDidUpdate && isFunction(viewObject.actions.componentDidUpdate)) {
          await viewObject.actions.componentDidUpdate(viewObject.actions.state, viewObject.actions)
        }
      }
    }

    if (isFunction(callback)) {
      return callback(viewObject.actions.state, viewObject.actions)
    }

    return viewObject.actions.state
  }

  const forceUpdate = () => {
    setState()
  }

  const remount = () => {
    viewObject.nodes.view = patch(viewObject.nodes.view, createAsyncComponent(viewObject.params))
  }

  const dispatch = (action = { type: null, payload: {} }) => {
    if (viewObject.actions.reducer && isFunction(viewObject.actions.reducer)) {
      setState(async (prevState) => {
        let nextAction = action

        if (isFunction(nextAction)) {
          nextAction = nextAction(prevState)
        }

        const result = await viewObject.actions.reducer(prevState, nextAction, viewObject.actions)

        return result
      })
    } else {
      console.error('Please provide reducer function to use this functionality!')
    }
  }

  const useHook = (hook) => {
    const [items, defs] = divideByProps(hook, defaultParams)

    forEach(defs, (d, k) => {
      if (!viewObject.hooks[k]) {
        viewObject.hooks[k] = [viewObject.actions[k]]
      }

      viewObject.hooks[k].push(d)
    })

    forEach(items, (d, k) => {
      if (!viewObject.hooks.items) {
        viewObject.hooks.items = {}
      }

      if (!viewObject.hooks.items[k]) {
        viewObject.hooks.items[k] = [viewObject.actions.items[k]]
      }

      viewObject.hooks.items[k].push(d)
    })
  }

  const getLoader = () => loader(viewObject.params)

  return {
    items,
    useHook,
    remount,
    dispatch,
    getState,
    setState,
    getLoader,
    forceUpdate,
    ...viewObject.params
  }
}

const componentFn = (viewObject) => {
  const getViewComponent = (newState) => {
    console.log('Getting view...')

    if (viewObject.actions.render && isFunction(viewObject.actions.render)) {
      let node = null

      // try {
      node = viewObject.actions.render(newState, viewObject.actions)
      // } catch (error) {
      //   throw new Error(error)
      // }

      if (!node) {
        return h('div', "It's looks like you're render function does not return any value!")
      }

      return node
    }

    return h('div', 'Nothing to render')
  }

  const getViewContext = () => {
    console.log('Finding view context...')

    if (viewObject.actions.spinner) {
      console.log('View context found: Spinner')
      return loader(viewObject.actions)
    }

    console.log('View context found: `render()` result')
    return getViewComponent(viewObject.actions.state)
  }

  const profileHook = (hook) => {
    const types = uniq(map(hook, h => {
      const type = typeof h

      if (type !== 'object') {
        return type
      }

      if (isArray(h)) {
        return 'array'
      }
    }))

    if (includes(types, 'function')) {
      return 'function'
    }

    if (includes(types, 'string')) {
      return 'string'
    }

    if (includes(types, 'number')) {
      return 'number'
    }

    if (includes(types, 'boolean')) {
      return 'boolean'
    }

    if (includes(types, 'array')) {
      return 'array'
    }

    return 'object'
  }

  const createCallStactReducer = (hook, name) => {
    const profile = profileHook(hook)

    if (profile === 'string' || profile === 'number' || profile === 'boolean') {
      return last(hook)
    }

    if (profile === 'array') {
      return concat(...hook)
    }

    if (profile === 'object') {
      return defaultsDeepPreserveArrays(...hook)
    }

    if (profile === 'function') {
      return function () {
        const result = {}
        let [state, component, action, ...rest] = arguments

        if (name === 'reducer') {
          const t = action
          action = component
          component = t
        }

        forEach(hook, (fn) => {
          let cmpnt = { ...component }

          if (result.hasOwnProperty(name)) {
            cmpnt[name] = () => result[name]
          }

          if (name === 'reducer') {
            result[name] = isFunction(fn) ? fn(state, action, cmpnt, ...rest) : fn
          } else {
            result[name] = isFunction(fn) ? fn(state, cmpnt, action, ...rest) : fn
          }
        })

        return result[name]
      }
    }
  }

  const registerHooks = () => {
    forEach(viewObject.hooks, (hook, name) => {
      if (name === 'items') {
        if (!viewObject.actions.items) {
          viewObject.actions.items = {}
        }

        forEach(hook, (h, n) => {
          viewObject.actions.items[n] = createCallStactReducer(h, n)
        })
      } else {
        viewObject.actions[name] = createCallStactReducer(hook, name)
      }
    })
  }

  return {
    getViewComponent,
    getViewContext,
    registerHooks
  }
}

// ########### Composing View ###########

const createAsyncComponent = async (params = defaultParams) => {
  defaultsDeep(params, defaultParams)

  if (isFunction(params.state)) {
    params.state = await params.state(params)
  }

  if (params.componentWillCreateViewObject && isFunction(params.componentWillCreateViewObject)) {
    console.log('componentWillCreateViewObject')
    params.componentWillCreateViewObject(params.state)
  }

  const viewObject = {
    hooks: {},
    actions: null,
    params: params,
    component: null,
    nodes: {
      view: null
    }
  }

  viewObject.actions = actions(viewObject)
  viewObject.component = componentFn(viewObject)

  if (viewObject.actions.componentWillInit && isFunction(viewObject.actions.componentWillInit)) {
    console.log('componentWillInit')
    viewObject.actions.componentWillInit(viewObject.actions.state, viewObject.actions)
  }

  viewObject.component.registerHooks()

  viewObject.nodes.view = viewObject.component.getViewContext()
  viewObject.nodes.view.key = params.key

  viewObject.nodes.view.data = {
    ...viewObject.nodes.view.data,
    hook: {
      init: () => {
        console.log('init')
        if (viewObject.actions.componentDidInit && isFunction(viewObject.actions.componentDidInit)) {
          viewObject.actions.componentDidInit(viewObject.actions.state, viewObject.actions)
        }
      },
      create: () => {
        console.log('componentWillMount')
        if (viewObject.actions.componentWillMount && isFunction(viewObject.actions.componentWillMount)) {
          viewObject.actions.componentWillMount(viewObject.actions.state, viewObject.actions)
        }
      },
      prepatch: () => {
        console.log('prepatch')
        if (viewObject.actions.componentWillPrepatch && isFunction(viewObject.actions.componentWillPrepatch)) {
          viewObject.actions.componentWillPrepatch(viewObject.actions.state, viewObject.actions)
        }
      },
      // update: () => {
      //   console.log('update')
      //   if (viewObject.actions.componentWillUpdateVNode && isFunction(viewObject.actions.componentWillUpdateVNode)) {
      //     viewObject.actions.componentWillUpdateVNode(viewObject.actions.state, viewObject.actions)
      //   }
      // },
      postpatch: () => {
        console.log('postpatch')
        if (viewObject.actions.componentWillPostpatch && isFunction(viewObject.actions.componentWillPostpatch)) {
          viewObject.actions.componentWillPostpatch(viewObject.actions.state, viewObject.actions)
        }
      },
      insert: () => {
        console.log('componentDidMount')
        if (viewObject.actions.componentDidMount && isFunction(viewObject.actions.componentDidMount)) {
          viewObject.actions.componentDidMount(viewObject.actions.state, viewObject.actions)
        }
      },
      destroy: () => {
        console.log('componentWillUnmount')
        if (viewObject.actions.componentWillUnmount && isFunction(viewObject.actions.componentWillUnmount)) {
          viewObject.actions.componentWillUnmount(viewObject.actions.state, viewObject.actions)
        }
      },
      remove: (vnode, removeCallback) => {
        console.log('componentDidUnmount')
        if (viewObject.actions.componentDidUnmount && isFunction(viewObject.actions.componentDidUnmount)) {
          viewObject.actions.componentDidUnmount(viewObject.actions.state, viewObject.actions)
        }

        return removeCallback()
      }
    }
  }

  if (viewObject.actions.componentDidCreateViewObject && isFunction(viewObject.actions.componentDidCreateViewObject)) {
    console.log('componentDidCreateViewObject')
    viewObject.actions.componentDidCreateViewObject(viewObject.actions.state, viewObject.actions)
  }

  if (viewObject.actions.async) {
    if (viewObject.actions.ejectComponent) {
      return Promise.resolve(viewObject)
    }

    return Promise.resolve(viewObject.nodes.view)
  }

  if (viewObject.actions.ejectComponent) {
    return viewObject
  }

  return viewObject.nodes.view
}

// ######### Export ###########

module.exports = lazy(createAsyncComponent, loader)
