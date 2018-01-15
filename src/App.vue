<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
};
</script>

<style>
@import url('../static/fonts/iconic/css/material-design-iconic-font.min.css'); 
@import url('../static/fonts/font-awesome-4.7.0/css/font-awesome.min.css'); 
@import url('../static/css/util.css'); 

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

label {
  font-size: 1.5em;
}

/* responsive */
@media (max-width: 576px) {
  #app {
    margin-top: 20px;
  }
}
</style>
