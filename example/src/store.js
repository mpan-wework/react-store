import createStore from '@mpan-wework/react-store';
import user from './user';

const modules = {
  user,
};

const { StoreProvider, useStore } = createStore(modules, true);

export { StoreProvider, useStore };
