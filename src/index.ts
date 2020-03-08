import { createContext, createElement, useContext, useReducer } from 'react';

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

type StoreContext = {
  state: ReducerState;
  rootState: StoreState;
  commit: StoreCommit;
};

type StoreAction = (context: StoreContext, payload: Payload) => Promise<any>;

type StoreActions = {
  [key: string]: StoreAction;
};

type StoreModule = {
  state: StoreState;
  storeActions?: StoreActions;
  reducer?: Reducer;
};

type StoreModules = {
  [key: string]: StoreModule;
};
/* Store Types End */

type StoreProviderProps = {
  children: Array<React.ReactNode>;
};

type ExportType = {
  StoreProvider: React.FunctionComponent;
  useStore: any;
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
        storeModules[storeModule]?.storeActions?.[storeActionName];
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

  const _StoreContext = createContext({
    state: _initialState,
   });

  const StoreProvider: React.FunctionComponent = (props: StoreProviderProps) => {
    const { children } = props;
    const [state, dispatch] = useReducer<Reducer>(_reducer, _initialState);

    const storeProps = {
      value: {
        state,
        dispatch: _storeWrap(state, dispatch),
        commit: dispatch,
      },
    };

    return createElement(
      _StoreContext.Provider,
      storeProps,
      children,
    );
  }

  const useStore = (): any => useContext(_StoreContext);

  return { StoreProvider, useStore };
};

export default createStore;
