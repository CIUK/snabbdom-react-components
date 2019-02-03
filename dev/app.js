import { createComponent, patch, h } from '../src';

const app = createComponent({
  test(custom, state, component) {
    console.log(custom, state, component);
  },
  render(state, component) {
    component.items.test('hello');
    return h('div', 'hello');
  },
});

patch(document.getElementById('root'), app);
