// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace ReactStore {
  type Payload = {
    [key: string]: any;
  };

  type ModuleState = {
    [key: string]: any;
  };

  type CommitContext = {
    type: string;
    payload?: Payload;
  };

  type Commit = (context: CommitContext) => ModuleState;

  type VerbContext = {
    state: ModuleState;
    commit: Commit;
  };

  type ModuleVerb = (context: VerbContext, payload?: Payload) => Promise<any>;

  type ModuleReducer = (state: ModuleState, payload?: Payload) => void;

  type Module = {
    state: ModuleState;
    verbs?: {
      [key: string]: ModuleVerb;
    };
    reducers?: {
      [key: string]: ModuleReducer;
    };
  };

  type CreateOptions = {
    modules: {
      [key: string]: Module;
    };
  };

  type DispatchContext = {
    type: string;
    payload?: Payload;
  };

  type Dispatch = (context: DispatchContext) => Promise<any>;

  type Store = {
    state: {
      [key: string]: ModuleState;
    };
    dispatch: Dispatch;
  };

  type UseReactStore = () => Store;

  type CreateReactStore = (
    options: CreateOptions
  ) => {
    ReactStoreProvider: React.FunctionComponent<any>;
    useReactStore: UseReactStore;
  };
}
