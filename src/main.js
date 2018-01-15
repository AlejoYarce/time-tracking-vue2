import Vue from 'vue';
import firebase from 'firebase';
import Vuefire from 'vuefire';
import VModal from 'vue-js-modal';

import App from './App';
import router from './router';
import store from './store';
import config from './firebase-config';

Vue.config.productionTip = false;
Vue.use(Vuefire);
Vue.use(VModal);

const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.database();
const dbRef = db.ref('users');
Vue.prototype.$firebaseRef = dbRef;

let app;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = /* eslint-disable no-new */
      new Vue({
        el: '#app',
        router,
        store,
        template: '<App/>',
        components: { App }
      });
  }
});
