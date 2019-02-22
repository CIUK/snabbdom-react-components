import { createComponent, h } from '../../src';
import TodoList from './todoList';
import TodoItems from './todoItems';

const Todo = (params = {}) => createComponent({
  key: 'todo',
  state: () => ({
    items: params.items || [],
    currentItem: { text: '', key: '' },
  }),
  deleteItem: (key, state, component) => {
    const filteredItems = state.items.filter(item => item.key !== key);

    component.setState({
      items: filteredItems,
    });
  },
  handleInput: (e, state, component) => {
    const itemText = e.target.value;
    const currentItem = { text: itemText, key: Date.now() };

    component.setState({
      currentItem,
    });
  },
  addItem: (e, state, component) => {
    e.preventDefault();
    const newItem = state.currentItem;

    if (newItem.text !== '') {
      const items = [...state.items, newItem];

      component.setState({
        items,
        currentItem: { text: '', key: '' },
      });
    }
  },
  render: (state, component) => h('div', [
    TodoList({
      addItem: component.items.addItem,
      handleInput: component.items.handleInput,
      currentItem: state.currentItem,
    }),
    TodoItems({
      entries: state.items,
      deleteItem: component.items.deleteItem,
    }),
  ]),
});

export default Todo;
