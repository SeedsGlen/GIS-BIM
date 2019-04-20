// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Cesium from 'cesium/Cesium'; 
import { Select, Option, Autocomplete, Icon} from 'element-ui'
import axios from 'axios'

Vue.prototype.axios = axios;

Vue.use(Select)
Vue.use(Option)
Vue.use(Autocomplete)
Vue.use(Icon)
/* eslint-disable no-new */
Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
      if (this[i] == val) return i;
  }
  return -1;
};

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
      this.splice(index, 1);
  }
}
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App } 
})
