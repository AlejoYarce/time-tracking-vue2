# Time Tracking Vue2 & Firebase

> Time Tracking Tool with Vue.js and Firebase


## Prerequisites

### Firebase
- Setup a Firebase Project [here](https://console.firebase.google.com/u/0/).
- Select **Add Firebase to your web app**.
- Copy the Firebase credentials.
```
const config = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN.firebaseapp.com',
  databaseURL: 'https://YOUR_AUTH_DOMAIN.firebaseio.com',
  projectId: 'YOUR_AUTH_DOMAIN',
  storageBucket: 'YOUR_AUTH_DOMAIN.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID'
};
```
- Replace the credentials in the [firebase-config.js](https://github.com/AlejoYarce/time-tracking-vue2/blob/master/src/firebase-config.js) file.


## Project Structure
- **components**
  - Tasks
  - Projects
- **pages**
  - Login
  - Home
- **router**
  - Handling routes with *index.js* file.
- **store**
  - Handling vuex store with *index.js* file.
- **App.vue**
- **firebase-config.js**
- **main.js**


## Build Setup

``` bash
# install dependencies
$ npm install

# run at localhost:9000
$ npm run dev
```
