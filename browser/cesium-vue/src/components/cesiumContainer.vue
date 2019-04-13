<template>
  <div>
    <toolbar @changeFuction="changeFuction"></toolbar>
    <div id="cesiumContainer"/>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import widgets from "cesium/Widgets/widgets.css";
import toolbar from "@/components/toolbar";

export default {
  name: "cesiumContainer",
  components: {
    toolbar: toolbar
  },
  data() {
    return {
      viewer: "",
      models: []
    };
  },
  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MTNmMWUzMy02OGE1LTQxMDktYTA5OS00NjQwMDE1NmUwMTgiLCJpZCI6ODgzMCwic2NvcGVzIjpbImFzbCIsImFzciIsImFzdyIsImdjIl0sImlhdCI6MTU1MjkwNzkzOH0.mQt1tjUe1fI51n2F_J_sMAurfRFaNouyJ4yFVTXB7pU";

    var terrainProvider = Cesium.createWorldTerrain();

    var viewer = new Cesium.Viewer("cesiumContainer", {
      scene3DOnly: true,
      navigationHelpButton: false,
      shouldAnimate: true,
      terrainProvider: terrainProvider
      // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
      //    url : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
      // }),
    });
    this.$data.viewer = viewer;
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.globe.enableLighting = true;

    let scene = viewer.scene;
    // 小车旋转角度
    let radian = Cesium.Math.toRadians(3.0);
    // 小车的速度
    let speed = 60;
    // 速度矢量
    let speedVector = new Cesium.Cartesian3();
    // 起始位置
    let position = Cesium.Cartesian3.fromDegrees(116.080591, 39.919141, 3000);

    // 用于设置小车方向
    let hpRoll = new Cesium.HeadingPitchRoll();
    let fixedFrameTransforms = Cesium.Transforms.localFrameToFixedFrameGenerator(
      "north",
      "west"
    );
    let model = Cesium.Model.fromGltf({
      url: "/static/models/Cesium_Air.glb",
      modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        hpRoll,
        Cesium.Ellipsoid.WGS84,
        fixedFrameTransforms
      ),
      minimumPixelSize: 128,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
    });

    let carPrimitive = scene.primitives.add(model);
    // Query the terrain height of two Cartographic positions

    // 小车状态标志
    let flag = {
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false
    };

    // 根据键盘按键返回标志
    function setFlagStatus(key, value) {
      switch (key.keyCode) {
        case 37:
          // 左
          flag.moveLeft = value;
          break;
        case 38:
          // 上
          flag.moveUp = value;
          break;
        case 39:
          // 右
          flag.moveRight = value;
          break;
        case 40:
          flag.moveDown = value;
          // 下
          break;
      }
    }
    function moveCar(isUP) {
      // 计算速度矩阵
      if (isUP > 0) {
        speedVector = Cesium.Cartesian3.multiplyByScalar(
          Cesium.Cartesian3.UNIT_X,
          speed,
          speedVector
        );
      } else {
        speedVector = Cesium.Cartesian3.multiplyByScalar(
          Cesium.Cartesian3.UNIT_X,
          -speed,
          speedVector
        );
      }
      // 根据速度计算出下一个位置的坐标
      position = Cesium.Matrix4.multiplyByPoint(
        carPrimitive.modelMatrix,
        speedVector,
        position
      );
      // console.log(position)
      // 小车移动
      Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        hpRoll,
        Cesium.Ellipsoid.WGS84,
        fixedFrameTransforms,
        carPrimitive.modelMatrix
      );
    }

    document.addEventListener("keydown", e => {
      setFlagStatus(e, true);
    });

    document.addEventListener("keyup", e => {
      setFlagStatus(e, false);
    });
    viewer.clock.onTick.addEventListener(clock => {
      if (flag.moveUp) {
        if (flag.moveLeft) {
          hpRoll.heading -= radian;
        }
        if (flag.moveRight) {
          hpRoll.heading += radian;
        }
        moveCar(true);
      }
      if (flag.moveDown) {
        if (flag.moveLeft) {
          hpRoll.heading -= radian;
        }
        if (flag.moveRight) {
          hpRoll.heading += radian;
        }
        moveCar(false);
      }
    });
  },
  methods: {
    cancelFuction: function(oldVal) {
      switch (oldVal) {
        case "1":
          this.$data.viewer.entities.remove(this.$data.models[0]);
          console.log(this.$data.models[0])
          console.log(this.$data.viewer.entities)
          break;
      }
    },
    chooseFuction: function(val) {
      switch (val) {
        case "1":
          console.log(val);
          this.distanceFuction(this.$data.viewer);
          break;
        case "2":
          console.log(val);
      }
    },
    changeFuction: function(status) {
      if (status.oldVal != "") {
        this.cancelFuction(status.oldVal);
        console.log("取消功能" + status.oldVal)
      }
      this.chooseFuction(status.val);
      console.log("选择功能" + status.val)
    },
    distanceFuction: function(viewer) {
      try {
        var model_line;
        var models = this.$data.models
        let PolyLinePrimitive = (function() {
          function _(positions) {
            this.options = {
              polyline: {
                id: "distance",
                show: true,
                positions: [],
                material: Cesium.Color.CORNFLOWERBLUE,
                width: 5,
                clampToGround: true,
                zIndex: 99
              },
              label: {
                text: textDisance,
                font: "18px sans-serif",
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -20),
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
              }
            };
            this.positions = positions;
            this._init();
          }

          _.prototype._init = function() {
            var _self = this;
            var _update = function() {
              return _self.positions;
            };
            var _update_label = function() {
              return _self.positions[_self.positions.length - 1].clone();
            };
            var _updateText = function() {
              return getSpaceDistance(_self.positions) + "米";
            };
            //实时更新polyline.positions
            this.options.polyline.positions = new Cesium.CallbackProperty(
              _update,
              false
            );
            this.options.position = new Cesium.CallbackProperty(
              _update_label,
              false
            );
            this.options.label.text = new Cesium.CallbackProperty(
              _updateText,
              false
            );
            model_line = new Cesium.Entity(this.options)
            viewer.entities.add(model_line);
            models[0] = model_line
          };

          return _;
        })();

        let scene = viewer.scene;
        let handler = new Cesium.ScreenSpaceEventHandler(
          viewer.scene._imageryLayerCollection
        );
        let positions = [];
        let distance = 0;
        let textDisance = distance + "米";
        let poly = undefined;

        handler.setInputAction(function(movement) {
          var cartesian = viewer.scene.pickPosition(movement.position);

          if (positions.length == 0) {
            positions.push(cartesian.clone());
          }
          positions.push(cartesian);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function(movement) {
          if (movement.endPosition.x === 0) {
            console.log(x);
          }
          var cartesian = viewer.scene.pickPosition(movement.endPosition);
          if (positions.length >= 2) {
            if (!Cesium.defined(poly)) {
              poly = new PolyLinePrimitive(positions);
            } else {
              positions.pop();
              // console.log(cartesian)
              if (cartesian) {
                cartesian.y += 1 + Math.random();
                positions.push(cartesian);
                distance = getSpaceDistance(positions);
                // console.log(distance);
              }
            }
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(movement) {
          handler.destroy();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        function getSpaceDistance(positions) {
          var distance = 0;
          for (var i = 0; i < positions.length - 1; i++) {
            var point1cartographic = Cesium.Cartographic.fromCartesian(
              positions[i]
            );
            var point2cartographic = Cesium.Cartographic.fromCartesian(
              positions[i + 1]
            );
            /**根据经纬度计算出距离**/
            var geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            var s = geodesic.surfaceDistance;
            //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
            //返回两点之间的距离
            s = Math.sqrt(
              Math.pow(s, 2) +
                Math.pow(
                  point2cartographic.height - point1cartographic.height,
                  2
                )
            );
            distance = distance + s;
          }
          return distance.toFixed(2);
        }
      } catch (err) {
        console.error(err);
        handler.destroy();
      }

      // setTimeout(function() {
      //   console.log(viewer.entities.getById("distance"));
      //   console.log(viewer.entities.values);
      // }, 10000);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>