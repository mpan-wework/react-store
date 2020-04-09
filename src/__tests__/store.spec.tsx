import React from 'react';
import { render, screen } from '@testing-library/react';
import { createReactStore } from '..';
import { ReactStore } from '../types';

async function mockPromise<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => data);
}

const opts: ReactStore.CreateOptions = {
  modules: {
    auth: {
      state: {
        loginToken: null,
        accessToken: null,
        refreshToken: null,
        user: null,
      },
      verbs: {
        login: async ({ commit }, payload): Promise<any> => {
          const { loginToken } = payload;
          const { accessToken, refreshToken } = await mockPromise({
            accessToken: `${loginToken}-la1`,
            refreshToken: `${loginToken}-lr1`,
          });
          commit({
            type: 'authenticated',
            payload: { loginToken, accessToken, refreshToken },
          });
          return { accessToken, refreshToken };
        },
        refresh: async ({ commit }, payload): Promise<any> => {
          const { accessToken: at, refreshToken: rt } = payload;
          const { accessToken, refreshToken } = await mockPromise({
            accessToken: `${at}-ra1`,
            refreshToken: `${rt}-rr1`,
          });
          commit({
            type: 'authenticated',
            payload: { accessToken, refreshToken },
          });
          return { accessToken, refreshToken };
        },
        user: async ({ commit }, payload): Promise<any> => {
          const { accessToken } = payload;
          const user = await mockPromise({
            name: `${accessToken}-u1`,
            accessToken,
          });
          commit({
            type: 'setUser',
            payload: { user },
          });
          return user;
        },
      },
      reducers: {
        authenticated: (state, payload): void => {
          if (payload.loginToken) {
            state.loginToken = payload.loginToken;
          }
          if (payload.accessToken) {
            state.accessToken = payload.accessToken;
          }
          if (payload.refreshToken) {
            state.refreshToken = payload.refreshToken;
          }
        },
        setUser: (state, payload): void => {
          state.user = payload.user;
        },
      },
    },
  },
};

test('ReactStore', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ReactStoreProvider, useReactStore } = createReactStore(opts);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const TestComponent: React.FunctionComponent = () => {
    const $store = useReactStore();

    return <div className="TestComponent">{$store.state.default.text}</div>;
  };

  render(
    <ReactStoreProvider>
      <TestComponent />
    </ReactStoreProvider>
  );

  expect(screen.queryByText(/HelloWorld/)).not.toBeNull();
});
