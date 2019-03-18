import { createComponent, h } from '../../src';

const TodoList = props => createComponent({
  render: () => (
    h('form', {
      on: {
        submit: props.addItem,
      },
    }, [
      h('input', {
        hook: {
          insert: (vnode) => {
            vnode.elm.focus();
          },
        },
        on: {
          input: props.handleInput,
        },
        attrs: {
          placeholder: 'Task',

        },
        props: {
          value: props.currentItem.text,
        },
      }),
      h('button', {
        attrs: {
          type: 'submit',
        },
      }, 'Add Task'),
    ])
  ),
});

export default TodoList;
