<template>
  <div id="app">
    <div id="header">
      <h1><router-link to="./"><img src="./assets/selenium-logo.png"/>Selenium Travis CI Dashboard</router-link></h1>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#header {
  background-color: #e0e0e0;
  position: relative;
  padding: 0 20px;
}

#header h1 {
  padding: 10px 0;
  font-size: 30px;
}

#header h1 a {
  text-decoration: none;
}

#header h1 a img {
  vertical-align: top;
  width: 40px;
  margin-right: 5px;
}
</style>
