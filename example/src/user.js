export default {
  state: {
    name: '',
  },
  storeActions: {
    fetchUser: async ({ commit }, payload) => {
      const { url } = payload;
      const resp = await fetch(url);
      const user = await resp.json();
      commit({
        type: 'user/setUser',
        payload: { user },
      });
    },
  },
  reducer: (state, action) => {
    switch (action.type) {
      case 'user/setUser':
        const { user } = action.payload;
        return { ...state, name: user.name };
      default:
        console.error(action);
        return state;
    }
  },
};
