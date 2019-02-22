import { createComponent, styled } from '../../src';

const ListBox = styled.ul``;
const ListItem = styled.li``;

const TodoItems = props => createComponent({
  createTasks(item) {
    return ListItem({
      key: item.key,
      on: {
        click: () => props.deleteItem(item.key),
      },
    }, item.text);
  },
  render(state, component) {
    const todoEntries = props.entries;
    const listItems = todoEntries.map(component.items.createTasks);

    return ListBox(listItems);
  },
});

export default TodoItems;
