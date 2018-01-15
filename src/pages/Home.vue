<template>
  <div class="container row-container">
    <div>
      <h1>{{ title }}</h1>
      <button class="btn btn-outline-primary" v-on:click="logOut()">
        <i class="fa fa-sign-out"></i>
      </button>
    </div>
    <hr>
    <div class="row">
      <div class="col-xs-12 col-md-6 time-container">
        <tasks v-on:setUserTasks="receiveUserTasks"></tasks>
      </div>
      <div class="col-xs-12 col-md-6 time-container">
        <projects :userTasks="userTasks"></projects>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import Tasks from '@/components/Tasks';
import Projects from '@/components/Projects';
import store from '@/store';

export default {
  name: 'home',
  data() {
    return {
      userTasks: []
    };
  },
  components: {
    Tasks,
    Projects
  },
  methods: {
    receiveUserTasks(tasks) {
      this.userTasks = tasks;
    },
    logOut() {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Login' });
      });
    }
  },
  computed: {
    title() {
      return `Time Tracking by ${store.state.userDisplayName}`;
    }
  }
};
</script>

<style scoped>
h1 {
  color: #15116a;
}

.time-container {
  padding-top: 25px;
}

@media (min-width: 768px) {
  .row-container {
    width: 100%;
    max-width: 1200px;
  }
}

</style>
