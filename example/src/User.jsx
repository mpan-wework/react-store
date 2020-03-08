import React, { useCallback, useEffect } from 'react';
import { useStore } from './store';

const User = () => {
  const { state, dispatch } = useStore();

  const randomUser = useCallback(async () => dispatch({
    type: 'user/fetchUser',
    payload: {
      url: `https://jsonplaceholder.typicode.com/users/${1 + Math.floor(Math.random() * Math.floor(9))}`,
    },
  }), [])

  useEffect(() => {
    randomUser();
  }, []);

  return (
    <div>
      <div>{state.user.name || 'Loading'}</div>
      <button onClick={randomUser}>Random</button>
    </div>
  );
};

export default User;
