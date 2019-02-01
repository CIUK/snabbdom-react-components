# This is not ready to use package, it is on test phase 😥 Test for fun, not for production.

## Please use carfully, as documentation need to be improved.

# snabbdom-react-components.js
React like, Snabbdom based, Virtual Dom framework for JavaScript Web Applications and set of simple interpretations of React loved helpers as Styled Components or Redux

## 0. Before you will start
This is the [**Career Interactive**](https://careerinteractive.org) project we have been developing inhouse. We are gratefull for all the Open Source project we came across and we deciced to open some of our code with the World.

We can't promise now to update this repository in regular basis until we will hear from you, as this is not the main repository for our purpose.

We are happy to collaborate with anyone who want to help develop this project 😊

We can promise one - as soon as you'll get into that, you will love how we redefined Snabbdom (if you're not familiar, see there: [Snabbdom](https://github.com/snabbdom/snabbdom)

**IMPORTANT: SRC is based on Snabbdom v0.5.0** as we have started to make core changes for our own usage, we were hooked for no hassle update.

## 1. Getting Started
To render siplest **SRC** (snabbdom-react-components 🤓) component, we will use Snabbdom vnode, eg. paragraph (c'mon every project need to have their own Hello World 😅). We will use the **mandatory** render method and snabbdom functions `h` and `patch`

```javascript
import createComponent, { h, patch } from 'snabbdom-react-component'

const component = createComponent({
  render: () => {
    return h('p', 'Hello World')
  }
})

patch(document.getElementById('root'), loader)
```

## 2. Lifecycle
One of the biggers benefits for using **SRC** is the React Based lifecycle mechanism which makes it so much easier to use in comparation to snabbdom hooks. Let's see how to use it. 

In this example, we will render a list of all the users, but for the time we don't have them, we will render loading message

```javascript
import createComponent, { h } from 'snabbdom-react-component'

const component = createComponent({
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

const component = createComponent({
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

const component = createComponent({
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

## More comming soon!

Made in London with ❤️ by [**Career Interactive**](https://careerinteractive.org) (by Szymon Pajka)