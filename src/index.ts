import {
  createContext,
  createElement,
  useContext,
  useReducer,
  useCallback,
} from 'react';

/* Reducer Types Start */
type ReducerState = {
  [key: string]: any;
};

type Payload = {
  [key: string]: any;
};

type ReducerAction = {
  type: string;
  payload?: Payload;
};

type Reducer = (state: ReducerState, action: ReducerAction) => ReducerState;

type ReducerDispatch = React.Dispatch<ReducerAction>;
/* Reducer Types End */

/* Store Types Start */
type StoreState = {
  [key: string]: ReducerState;
};

type StoreCommit = ReducerDispatch;

type StoreDispatch = (reducerAction: ReducerAction) => Promise<any>;

type StoreVerbContext = {
  state: ReducerState;
  rootState: StoreState;
  commit: StoreCommit;
};

type StoreVerb = (context: StoreVerbContext, payload: Payload) => Promise<any>;

type StoreVerbs = {
  [key: string]: StoreVerb;
};

type StoreModule = {
  state: StoreState;
  verbs?: StoreVerbs;
  reducer?: Reducer;
};

type StoreModules = {
  [key: string]: StoreModule;
};
/* Store Types End */

type Store = {
  state: StoreState;
  dispatch: StoreDispatch;
  commit: StoreCommit;
};

type StoreContext = React.Context<{ state: StoreState}>;

type StoreProviderProps = React.ProviderProps<Store>;

type StoreProvider = React.FunctionComponent<StoreProviderProps>;

type ExportType = {
  StoreProvider: StoreProvider;
  useStore: () => Store;
};

/* ================================================================ */

const createStore = (storeModules: StoreModules = {}, debug = false): ExportType => {
  const _initialState: StoreState = Object.keys(storeModules).reduce(
    (state, key) => ({
      ...state,
      [key]: storeModules[key].state,
    }),
    {},
  );

  const _reducer: Reducer = (state: ReducerState, reducerAction: ReducerAction) => {
    const { type } = reducerAction;
    if (!type || typeof type !== 'string') {
      console.error(reducerAction);
      return state;
    }

    const [actionModule] = reducerAction.type.split('/');
    const reducer = storeModules[actionModule]?.reducer;
    if (!reducer) {
      console.error(reducerAction);
      return state;
    }

    if (debug) {
      console.debug('commit', reducerAction);
    }
    const newModuleState = reducer(state[actionModule], reducerAction);
    return {
      ...state,
      [actionModule]: {
        ...state[actionModule],
        ...newModuleState,
      },
    };
  };

  const _storeWrap = (state: StoreState, commit: StoreCommit): StoreDispatch => {
    const storeDispatch: StoreDispatch = async (storeAction: ReducerAction): Promise<any> => {
      const { type, payload } = storeAction;
      if (!type || typeof type !== 'string') {
        console.error(storeAction);
        return null;
      }

      const [storeModule, storeActionName] = type.split('/');
      const moduleStoreAction =
        storeModules[storeModule]?.verbs?.[storeActionName];
      if (!moduleStoreAction) {
        console.error(storeAction);
        return null;
      }

      if (debug) {
        console.debug('dispatch', storeAction);
      }

      return moduleStoreAction(
        {
          state: state[storeModule],
          rootState: state,
          commit,
        },
        payload,
      );
    };

    return storeDispatch;
  };

  const _StoreContext: StoreContext = createContext({
    state: _initialState,
   });

  const StoreProvider: StoreProvider = (props: any) => {
    const children: Array<React.ReactNode> = props.children;
    const [state, dispatch] = useReducer<Reducer>(_reducer, _initialState);

    const storeDispatch = useCallback(_storeWrap(state, dispatch), [state]);

    const storeProps: StoreProviderProps = {
      value: {
        state,
        dispatch: storeDispatch,
        commit: dispatch,
      },
    };

    return createElement(
      _StoreContext.Provider,
      storeProps,
      children,
    );
  }

  const useStore = (): Store => useContext(_StoreContext) as Store;

  return { StoreProvider, useStore };
};

export default createStore;
