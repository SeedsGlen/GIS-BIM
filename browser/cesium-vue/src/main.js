// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Cesium from 'cesium/Cesium'; 
import { Select, Option } from 'element-ui'

Vue.use(Select)
Vue.use(Option)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App } 
})
