import { createComponent, styled } from '../../src';

const Box = styled.div``;
const Label = styled.label``;
const InputField = styled.input`
  ${(props, data) => {
    data.attrs.type = 'text';
  }}
`;

const Input = params => createComponent({
  state: () => ({ value: params.value }),
  onInput: (e, state, component) => component.setState({ value: e.target.value }),
  render(state, component) {
    return Box([
      Label(params.label),
      InputField({
        on: {
          input: component.items.onInput,
        },
      }),
    ]);
  },
});

export default Input;
