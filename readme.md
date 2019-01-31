# THIS IS NOT READY TO USE PACKAGE, IT IS ON TEST PHASE. SORRY FOR CAPITALS, BUT I WANT YOU TO DO NOT USE IT NOW 😥
# self.js + helpers
Component builder for Snabbdom and set of React based helpers as Styled Components

## component.js
React based component builder for Snabbdom

### 1. Getting Started
To render a Snabbdom paragraph vnode, we will use the **mandatory** render method.
```javascript
import createComponent { h, patch } from 'snabbdom-react-component'

const component = createComponent({
  render: () => {
    return h('p', 'Hello World')
  }
})

patch(document.getElementById('root'), loader)
```

### 2. Lifecycle
One of the biggers benefits to use **self.js** is the React Based lifecycle mechanism which makes it so much easier to use in comparation to snabbdom hooks. Let's see how to use it. 

In this example, we will render a list of all the users, but for the time we don't have them, we will render loading message

```javascript
import createComponent { h } from 'snabbdom-react-component'

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
Along with component builder, self have build in Styled Components builder we all love from React. It is not as powerfull yet. yet ;)

If you're not familiar with styled comonents, read more here: https://styled-components.com

```javascript
import createComponent { styled } from 'snabbdom-react-component'

const Button = styled.button`
  color: ${props => !props.clicked ? '#fff' : '#4f4f4f'}
  background: ${props => !props.enabled ? '#aee174' : '#eee'}
`

const component = createComponent({
  state: {
    clicked: false
  },
  render: (state, component) => {
    return Button({
      styled: { clicked },
      on: {
        click: () => {
          component.setState({
            clicked: true
          })
        }
      }
    }, 'Click me')
  }
})
```

### 4. Reducers
Redux for good become one of the best state managing liblaries. Based on that, **self** has build-in simpler and easier, but powerfull reducer functionality

```javascript
import createComponent { styled } from 'snabbdom-react-component'

const Info = styled.button`
  color: #4f4f4f;
  font-size: 16px;
`
const List = styled.ul;
const ListEl = styled.li;

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
    const users = await Api.getActiveUsers()
    
    component.dispatch({ 
      type: 'ready',
      payload: users
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