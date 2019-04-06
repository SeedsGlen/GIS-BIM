<template>
   <div id="cesiumContainer">
   </div>
</template>

<script>
import Cesium from 'cesium/Cesium'; 
import widgets from'cesium/Widgets/widgets.css';

export default {
  name: 'cesiumContainer',
  mounted(){
  	 Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MTNmMWUzMy02OGE1LTQxMDktYTA5OS00NjQwMDE1NmUwMTgiLCJpZCI6ODgzMCwic2NvcGVzIjpbImFzbCIsImFzciIsImFzdyIsImdjIl0sImlhdCI6MTU1MjkwNzkzOH0.mQt1tjUe1fI51n2F_J_sMAurfRFaNouyJ4yFVTXB7pU";
    var viewer = new Cesium.Viewer("cesiumContainer", {
      // scene3DOnly: true,
      // navigationHelpButton: false,
      terrainProvider: Cesium.createWorldTerrain()

      // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
      //    url : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
      // }),
      // terrainProvider: Cesium.createWorldTerrain()
    });
    // viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.globe.enableLighting = true;

    var tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(20119)
    });

    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset);
    var scene = viewer.scene;
    //   var entity = viewer.entities.add({
    //       position : Cesium.Cartesian3.fromDegrees(117.713936,39.027913, 0.0),
    //       model : {
    //           uri : '/static/models/VC.glb',
    //           scale: 200
    //       }
    //   });
    //   viewer.trackedEntity = entity;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>