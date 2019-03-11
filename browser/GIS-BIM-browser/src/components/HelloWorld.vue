<template>
  <div class="hello">
    <model-obj :backgroundAlpha="0" src="static/models/obj/people.obj"></model-obj>
  </div>
</template>

<script>

import { ModelObj } from 'vue-3d-model'  

export default {
  name: 'HelloWorld',
  components: {
    ModelObj
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
