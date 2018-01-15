import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    authenticated: false,
    userDisplayName: null,
    uid: null
  },
  actions: {
    async  LOGIN({ commit }) {
      const provider = new firebase.auth.TwitterAuthProvider();
      await firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          const { user } = result;
          commit('LOGIN_MUTATION', user);
        });
    },
    SET_AUTHENTICATED({ commit }, currentUser) {
      commit('LOGIN_MUTATION', currentUser);
    }
  },
  mutations: {
    LOGIN_MUTATION: (state, user) => {
      if (user) {
        state.userDisplayName = user.displayName;
        state.uid = user.uid;
      }
      state.authenticated = user || false;
    }
  }
});

export default store;
