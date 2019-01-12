<template>
  <div id="app">
    <div id="header">
      <h1><router-link to="/"><img src="./assets/selenium-logo.png"/>Selenium Travis CI Dashboard</router-link></h1>
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
body, html {
  height: 100%;
  padding: 0;
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  font-family: "Roboto",Helvetica,sans-serif;
  background-color: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4 {
  margin: 0;
}

table {
  margin: 5px;
  padding-right: 10px;
  width: 100%;
}

tr:hover {
  background-color: #f0f0ff;
}

th {
  background-color: #c8c8ff;
  padding: 2px 5px;
  text-align: left;
}

td {
  margin: 5px;
  border-bottom: 1px solid #e0e0e0;
  padding: 2px 5px;
  padding-right: 25px;
  cursor: pointer;
  vertical-align: top;
  white-space: nowrap;
}

td.can-wrap {
  white-space: normal;
}

.flex {
  display: flex;
}

.hidden {
  display: none;
}

.fas, .fab, .far {
  margin-right: 5px;
}

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

.sidebar h2 {
  padding: 5px 0 0 20px;
  font-size: 16px;
}

.sidebar ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 120px;
}

.sidebar ul li {
  width: 90px;
  padding: 0 15px;
  display: block;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
}

.sidebar ul li.active {
  font-weight: bold;
}

.sidebar ul li:hover {
  background-color: #555 !important;
  color: white !important;
}

.passed {
  color: green;
}

.started, .running {
  color: orange;
}

.skipped {
  color: #c0c0c0;
}

.failed, .errored {
  color: red;
}

fieldset {
  border: 1px solid #e8e8e8;
  margin: 0 7px;
}

legend {
  color: #999999;
}

div.icon {
  display: inline;
}
</style>
