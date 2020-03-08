import React from 'react';
import { StoreProvider } from './store';
import User from './User.jsx';

const App = () => {
  return <StoreProvider><div><User /></div></StoreProvider>;
};

export default App;
