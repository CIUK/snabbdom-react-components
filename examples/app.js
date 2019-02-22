import lodash from 'lodash';
import { createComponent, patch, styled } from '../src';
import map from 'lodash/map';
import Todo from './todoApp/todo';
import TodoStyled from './todoAppStyled/todo';

window._ = lodash;

const AppBox = styled.div``;
const AppMenu = styled.ul``;
const AppMenuItem = styled.li`
  cursor: pointer;
`;
const EmptyApp = styled.span``;
const Break = styled.hr``;

const examples = {
  Todo,
  TodoStyled,
};

const App = createComponent({
  state: {
    selected: null,
  },
  changeApp: (nextApp, state, component) => component.setState({
    selected: nextApp,
  }),
  getAppsList: (state, component) => map(examples, (example, name) => AppMenuItem({
    on: {
      click: () => component.items.changeApp(name),
    },
  }, name)),
  getCurrentApp: (state) => {
    if (state.selected) {
      const nextViewGenerator = examples[state.selected];

      if (nextViewGenerator) {
        const nextView = nextViewGenerator();

        console.log('nextView', nextView);

        return nextView;
      }

      return EmptyApp('Nothing to show');
    }

    return EmptyApp('Select App');
  },
  render: (state, component) => AppBox([
    AppMenu(component.items.getAppsList()),
    Break(),
    component.items.getCurrentApp(),
  ]),
});

patch(document.getElementById('root'), App);
