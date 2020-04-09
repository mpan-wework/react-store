import { createContext, createElement } from 'react';
import { ReactStore } from './types';

export const createReactStore: ReactStore.CreateReactStore = (
  options: ReactStore.CreateOptions
) => {
  console.debug(options);
  const _context = createContext({});

  const ReactStoreProvider: React.FunctionComponent<any> = (props) =>
    createElement(_context.Provider, null, props.children);

  const useReactStore = (): ReactStore.Store => {
    console.debug('useStore');
    return {
      state: {
        default: {
          text: 'HelloWorld',
        },
      },
      dispatch: async (): Promise<void> => {
        return;
      },
    };
  };

  return {
    ReactStoreProvider,
    useReactStore,
  };
};
