import { createComponent, h } from '../../src';

const TodoItems = props => createComponent({
  createTasks(item) {
    return h('li', {
      key: item.key,
      on: {
        click: () => props.deleteItem(item.key),
      },
    }, item.text);
  },
  render(state, component) {
    const todoEntries = props.entries;
    const listItems = todoEntries.map(component.items.createTasks);

    return h('ul', listItems);
  },
});

export default TodoItems;
