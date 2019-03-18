<template>
  <div id="app">
    <router-view/>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

export default {
  name: 'App',
  mounted () {
    this.$nextTick(() => {
      const viewer = new Cesium.Viewer('cesiumContainer')
      console.log('viewer: ', viewer)
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
#app,#cesiumContainer {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
