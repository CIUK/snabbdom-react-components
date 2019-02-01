# snabbdom-react-components.js
React like, Snabbdom based, Virtual Dom framework for JavaScript Web Applications and set of simple interpretations of React loved helpers as Styled Components or Redux

## Please use carfully, as documentation need to be improved.

## 0. Before you will start
**SRC** (snabbdom-react-components 🤓) is the [**Career Interactive**](https://careerinteractive.org) project we have been developing inhouse. We are gratefull for all the Open Source project we came across and we deciced to open some of our code with the World.

We can't promise now to update this repository in regular basis until we will hear from you, as this is not the main repository for our purpose.

We are happy to collaborate with anyone who want to help develop this project 😊

We can promise one - as soon as you'll get into that, you will love how we redefined Snabbdom (if you're not familiar, see there: [Snabbdom](https://github.com/snabbdom/snabbdom)

**IMPORTANT: SRC is based on Snabbdom v0.5.0** as we have started to make core changes for our own usage, we were hooked for no hassle update.

## 1. Getting Started
To use **SRC**, download package using your package manager or download the latest relase.
```bash
# npm:
npm i -S snabbdom-react-components
# yarn:
yarn add snabbdom-react-components
```

To render siplest **SRC** component, we will use Snabbdom vnode, eg. paragraph. We will use the **mandatory** render method and snabbdom functions `h` and `patch`

Find more about `createComponent` function [here](#createComponent).

```javascript
import createComponent, { h, patch } from 'snabbdom-react-component'

const myComponent = createComponent({
  render: () => {
    return h('p', 'Hello World')
  }
})

patch(document.getElementById('root'), myComponent)
```

## 2. Lifecycle
One of the biggers benefits for using **SRC** is the React Based lifecycle mechanism which makes it so much easier to use in comparation to snabbdom hooks. Let's see how to use it. 

In this example, we will render a list of all the users, but for the time we don't have them, we will render loading message

```javascript
import createComponent, { h } from 'snabbdom-react-component'

const myComponent = createComponent({
  state: {
    users: []
  },
  componentDidMount: async (state, component) => {
    const users = await Api.getUsers()
    
    component.setState({ users })
  },
  render: (state, component) => {
    const { users } = state;

    if (!users.lenth) {
      return h('p', 'Fetching users...')
    }

    return h('ul', users.map(user => h('li', { key: user.id }, user.name)))
  }
})
```

### 3. Styled Components
Along with component builder, self have build in [Styled Components](https://styled-components.com) builder we all love from React. It is not as powerfull yet. Yet 😇

```javascript
import createComponent, { styled } from 'snabbdom-react-component'

const Button = styled.button`
  color: ${props => !props.toggled ? '#fff' : '#4f4f4f'};
  background: ${props => !props.toggled ? '#aee174' : '#eee'};
`

const myComponent = createComponent({
  state: {
    toggled: false
  },
  render: (state, component) => {
    const { toggled } = state

    return Button({
      styled: { toggled },
      on: {
        click: () => {
          component.setState((prevState) => ({
            toggled: !prevState.toggled
          }))
        }
      }
    }, 'Click me')
  }
})
```

### 4. Reducers
Redux for good become one of the best state managing liblaries. Based on that, **self** has build-in simpler and easier, but powerfull reducer functionality

```javascript
import createComponent, { styled } from 'snabbdom-react-component'

const Info = styled.button`
  color: #4f4f4f;
  font-size: 16px;
`
const List = styled.ul``;
const ListEl = styled.li``;

const FakeApi = (delay = 2000) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay)
  })
}

const myComponent = createComponent({
  state: {
    ready: false,
    users: []
  },
  reducer: (state, action) => {
    switch (action.type) {
      case 'ready': {
        return {
          ...state,
          ready: true,
          users: action.payload
        }
      }
      default: return state
    }
  },
  componentDidMount: async (state, component) => {
    await FakeApi()
    
    component.dispatch({ 
      type: 'ready',
      payload: [{id: 1, name: 'John', surname: 'Due'}]
    })
  },
  render: (state, component) => {
    const { ready, users } = state;

    if (!ready) {
      return Info('Wait...')
    }

    if (!users.length) {
      return Info('No users to show...')
    }

    return List(users.map(user => ListEl({ key: user.id }, user.name)))
  }
})
```

# API overview

## createComponent

This is the basic **SRC** function for creating statefull components. Take a look on all available methods and params. Below you will find FAQ for selected params.

### Params
```javascript
const myComponent = createComponent({
  // Use to introduce the initial state of your component. 
  state: 'object' || (params) => 'object', 
  // if provided, main render element will recieve this key (check below to learn about keys)
  key: 'String||null',
  // If true, component will be returned as a promise
  async: 'boolean',
  // If true, component will return instance of SRC, not a vnode.
  ejectComponent: 'boolean', 
  // Use to keep your reducer actions
  CONSTS: 'object', 
  // you can provide cases when your component should trigger rerender cycle.
  shouldComponentUpdate: 'boolean' || (nextState, nextComponent) => 'boolean',
  // Mandatory param. Provided vnodes will be rendered into DOM.
  render: (state, component) => 'vnode',
  // You can use that to build your state manager. Learn more above.
  reducer: (state, action, component) => 'vnode',
  // Triggers Snabbdom Init hook
  componentDidInit: (state, component) => undefined,
  // Triggers before the vnode is created
  componentWillInit: (state, component) => undefined,
  // Triggers Snabbdom Insert hook
  componentDidMount: (state, component) => undefined,
  // Triggers Snabbdom Create hook
  componentWillMount: (state, component) => undefined,
  // Triggers after the rerender cycle
  componentDidUpdate: (state, component) => undefined,
  // Triggers Snabbdom Remove hook
  componentDidUnmount: (state, component) => undefined,
  // Triggers before the rerender cycle
  componentWillUpdate: (state, component) => undefined,
  // Triggers Snabbdom Destroy hook
  componentWillUnmount: (state, component) => undefined,
  // Triggers Snabbdom Prepatch hook
  componentWillPrepatch: (state, component) => undefined,
  // Triggers Snabbdom Postpatch hook
  componentWillPostpatch: (state, component) => undefined,
  // Triggers after the vnode was created, but before the patch
  componentDidCreateViewObject: (state, component) => undefined,
  // Triggers after state was resolved
  componentWillCreateViewObject: (state) => undefined
})
```

### Component function
Almost all livecycle methods have available instance function.

```javascript
const component = {
  // Use to change component state
  setState: 'object' || (nextState) => 'object',
  // Returns the state of component
  getState: () => 'object',
  // All the custom methods you will provide will be placed on the items 'sandbox'
  items: 'object'
  // If you have created reusable component, you can later extend your new component with the resuable one. You will found more about the hooks later.  
  useHook: () => {}
  // You can remount the component
  remount,
  // If you have reducer, use this to dispatch actions
  dispatch,
  // Force update your component
  forceUpdate,
  // All the params will be provided there
  ...viewObject.params
})
```

### Learn more
- How to use key property: [Snabbdom Keys](https://github.com/snabbdom/snabbdom#key--string--number)

## More comming soon!

Made in London with ❤️ by [**Career Interactive**](https://careerinteractive.org) (by Szymon Pajka 👏)
