import { createComponent, styled } from '../../src';

const FormBox = styled.form``;
const Input = styled.input``;
const Button = styled.button``;

const TodoList = props => createComponent({
  render: () => (
    FormBox({
      on: {
        submit: props.addItem,
      },
    }, [
      Input({
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
      Button({
        attrs: {
          type: 'submit',
        },
      }, 'Add Task'),
    ])
  ),
});

export default TodoList;
