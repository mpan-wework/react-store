# react-store
React Store

[![npm version](https://badge.fury.io/js/%40mpan-wework%2Freact-store.svg)](https://badge.fury.io/js/%40mpan-wework%2Freact-store)

Usage

~~~javascript
// user.js
export default {
  state: {
    name: null,
  },
  storeActions: {
    fetchUser: async ({ commit }, payload) => {
      const resp = await fetch('/user.json');
      const user = await resp.json();
      commit({
        type: 'user/setName',
        payload: { name: user.name },
      });
    },
  },
  reducer: (state, action) => {
    switch (action.type) {
      case 'user/setName':
        const { name } = action.payload;
        return { ...state, name };
      default:
        console.error(action);
        return state;
    }
  },
};

// store.js
import createStore from '@mpan-wework/react-store';
import user from './user';

const modules = {
  user,
};

const { StoreProvider, useStore } = createStore(modules);

export { StoreProvider, useStore };

// User.js
import React, { useEffect } from 'react';
import { useStore } from './store';

const User = () => {
  const { state, dispatch } = useStore();
  useEffect(() => {
    dispatch({ type: 'user/fetchUser' });
  }, []);

  return <div>{state.user.name}</div>;
};

export default User;

// App.js
import React from 'react';
import { StoreProvider } from './store';
import User from './User';

class App extends React.Component {
  render() {
    return (
      <StoreProvider>
        <div>
          <User />
        </div>
      </StoreProvider>
    );
  }
}
~~~
