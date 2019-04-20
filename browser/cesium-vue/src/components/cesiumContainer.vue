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
      models: [],
      cityData: {}
    };
  },
  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MTNmMWUzMy02OGE1LTQxMDktYTA5OS00NjQwMDE1NmUwMTgiLCJpZCI6ODgzMCwic2NvcGVzIjpbImFzbCIsImFzciIsImFzdyIsImdjIl0sImlhdCI6MTU1MjkwNzkzOH0.mQt1tjUe1fI51n2F_J_sMAurfRFaNouyJ4yFVTXB7pU";
    // http://localhost:8080/static/AMap_adcode_citycode.json
    // http://localhost:8080/static/AMap_adcode_citycode.json
    var that = this;
    // this.axios
    // .get("/static/AMap_adcode_citycode.json")
    // .then(function(response) {
    //   // console.log(response.data.中文名)
    //   for(let key in response.data.中文名){
    //       that.$data.cityData[response.data.中文名[key]] = response.data.adcode[key]
    //   }
    //   console.log(that.$data.cityData)
    // })
    // .catch(function(error) {
    //   console.log(error);
    // });

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

    var rainParticleSize = scene.drawingBufferWidth / 80.0;
    var rainRadius = 100000.0;
    var rainImageSize = new Cesium.Cartesian2(
      rainParticleSize,
      rainParticleSize * 2.0
    );

    var rainSystem;

    var rainGravityScratch = new Cesium.Cartesian3();
    var rainUpdate = function(particle, dt) {
      rainGravityScratch = Cesium.Cartesian3.normalize(
        particle.position,
        rainGravityScratch
      );
      rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(
        rainGravityScratch,
        -1050.0,
        rainGravityScratch
      );

      particle.position = Cesium.Cartesian3.add(
        particle.position,
        rainGravityScratch,
        particle.position
      );

      var distance = Cesium.Cartesian3.distance(
        scene.camera.position,
        particle.position
      );
      if (distance > rainRadius) {
        particle.endColor.alpha = 0.0;
      } else {
        particle.endColor.alpha =
          rainSystem.endColor.alpha / (distance / rainRadius + 0.1);
      }
    };

    rainSystem = new Cesium.ParticleSystem({
      modelMatrix: new Cesium.Matrix4.fromTranslation(scene.camera.position),
      speed: -1.0,
      lifetime: 15.0,
      emitter: new Cesium.SphereEmitter(rainRadius),
      startScale: 1.0,
      endScale: 0.0,
      image: "/static/particle/circular_particle.png",
      emissionRate: 9000.0,
      startColor: new Cesium.Color(0.27, 0.5, 0.7, 0.0),
      endColor: new Cesium.Color(0.27, 0.5, 0.7, 0.98),
      imageSize: rainImageSize,
      updateCallback: rainUpdate
    });
    scene.primitives.add(rainSystem);
    // 小车旋转角度
    // let radian = Cesium.Math.toRadians(3.0);
    // // 小车的速度
    // let speed = 60;
    // // 速度矢量
    // let speedVector = new Cesium.Cartesian3();
    // // 起始位置
    // let position = Cesium.Cartesian3.fromDegrees(116.080591, 39.919141, 3000);

    // // 用于设置小车方向
    // let hpRoll = new Cesium.HeadingPitchRoll();
    // let fixedFrameTransforms = Cesium.Transforms.localFrameToFixedFrameGenerator(
    //   "north",
    //   "west"
    // );
    // let model = Cesium.Model.fromGltf({
    //   url: "/static/models/Cesium_Air.glb",
    //   modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
    //     position,
    //     hpRoll,
    //     Cesium.Ellipsoid.WGS84,
    //     fixedFrameTransforms
    //   ),
    //   minimumPixelSize: 128,
    //   heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
    // });

    // let carPrimitive = scene.primitives.add(model);
    // // Query the terrain height of two Cartographic positions

    // // 小车状态标志
    // let flag = {
    //   moveUp: false,
    //   moveDown: false,
    //   moveLeft: false,
    //   moveRight: false
    // };

    // // 根据键盘按键返回标志
    // function setFlagStatus(key, value) {
    //   switch (key.keyCode) {
    //     case 37:
    //       // 左
    //       flag.moveLeft = value;
    //       break;
    //     case 38:
    //       // 上
    //       flag.moveUp = value;
    //       break;
    //     case 39:
    //       // 右
    //       flag.moveRight = value;
    //       break;
    //     case 40:
    //       flag.moveDown = value;
    //       // 下
    //       break;
    //   }
    // }
    // function moveCar(isUP) {
    //   // 计算速度矩阵
    //   if (isUP > 0) {
    //     speedVector = Cesium.Cartesian3.multiplyByScalar(
    //       Cesium.Cartesian3.UNIT_X,
    //       speed,
    //       speedVector
    //     );
    //   } else {
    //     speedVector = Cesium.Cartesian3.multiplyByScalar(
    //       Cesium.Cartesian3.UNIT_X,
    //       -speed,
    //       speedVector
    //     );
    //   }
    //   // 根据速度计算出下一个位置的坐标
    //   position = Cesium.Matrix4.multiplyByPoint(
    //     carPrimitive.modelMatrix,
    //     speedVector,
    //     position
    //   );
    //   // console.log(position)
    //   // 小车移动
    //   Cesium.Transforms.headingPitchRollToFixedFrame(
    //     position,
    //     hpRoll,
    //     Cesium.Ellipsoid.WGS84,
    //     fixedFrameTransforms,
    //     carPrimitive.modelMatrix
    //   );
    // }

    // document.addEventListener("keydown", e => {
    //   setFlagStatus(e, true);
    // });

    // document.addEventListener("keyup", e => {
    //   setFlagStatus(e, false);
    // });
    // viewer.clock.onTick.addEventListener(clock => {
    //   if (flag.moveUp) {
    //     if (flag.moveLeft) {
    //       hpRoll.heading -= radian;
    //     }
    //     if (flag.moveRight) {
    //       hpRoll.heading += radian;
    //     }
    //     moveCar(true);
    //   }
    //   if (flag.moveDown) {
    //     if (flag.moveLeft) {
    //       hpRoll.heading -= radian;
    //     }
    //     if (flag.moveRight) {
    //       hpRoll.heading += radian;
    //     }
    //     moveCar(false);
    //   }
    // });
  },
  methods: {
    cancelFuction: function(oldVal) {
      switch (oldVal) {
        case "1":
          this.$data.viewer.entities.remove(this.$data.models[0]);
          console.log(this.$data.models[0]);
          console.log(this.$data.viewer.entities);
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
          break;
        case "3":
          this.getCursorPosition(this.$data.viewer);
          break;
      }
    },
    changeFuction: function(status) {
      if (status.oldVal != "") {
        this.cancelFuction(status.oldVal);
        console.log("取消功能" + status.oldVal);
      }
      this.chooseFuction(status.val);
      console.log("选择功能" + status.val);
    },
    distanceFuction: function(viewer) {
      try {
        var model_line;
        var models = this.$data.models;
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
            model_line = new Cesium.Entity(this.options);
            viewer.entities.add(model_line);
            models[0] = model_line;
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
    },
    getCursorPosition: function(viewer) {
      var that = this;
      //得到当前三维场景
      var scene = viewer.scene;
      //得到当前三维场景的椭球体s
      var ellipsoid = scene.globe.ellipsoid;
      var entity = viewer.entities.add({
        label: {
          show: false
        }
      });
      var longitudeString = null;
      var latitudeString = null;
      var height = null;
      var cartesian = null;
      // 定义当前场景的画布元素的事件处理
      var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
      handler.setInputAction(function(movement) {
        //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
        cartesian = viewer.camera.pickEllipsoid(
          movement.endPosition,
          ellipsoid
        );
        if (cartesian) {
          //将笛卡尔坐标转换为地理坐标
          var cartographic = ellipsoid.cartesianToCartographic(cartesian);
          //将弧度转为度的十进制度表示
          longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
          latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
          //获取相机高度
          height = Math.ceil(viewer.camera.positionCartographic.height);
          entity.position = cartesian;
          entity.label.show = true;
          entity.label.text =
            "(" + longitudeString + ", " + latitudeString + "," + height + ")";
        } else {
          entity.label.show = false;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
      handler.setInputAction(function(wheelment) {
        height = Math.ceil(viewer.camera.positionCartographic.height);
        entity.position = cartesian;
        entity.label.show = true;
        entity.label.text =
          "(" + longitudeString + ", " + latitudeString + "," + height + ")";
        if (height < 30000) {
          var pt1 = new Cesium.Cartesian2(0, 0);
          var pt2 = new Cesium.Cartesian2(500, 500);

          var pick1 = viewer.scene.globe.pick(
            viewer.camera.getPickRay(pt1),
            viewer.scene
          );
          var pick2 = viewer.scene.globe.pick(
            viewer.camera.getPickRay(pt2),
            viewer.scene
          );

          //将三维坐标转成地理坐标
          var geoPt1 = viewer.scene.globe.ellipsoid.cartesianToCartographic(
            pick1
          );
          var geoPt2 = viewer.scene.globe.ellipsoid.cartesianToCartographic(
            pick2
          );

          //地理坐标转换为经纬度坐标
          var point1 = [
            (geoPt1.longitude / Math.PI) * 180,
            (geoPt1.latitude / Math.PI) * 180
          ];
          var point2 = [
            (geoPt2.longitude / Math.PI) * 180,
            (geoPt2.latitude / Math.PI) * 180
          ];
          // point1 + point2

          that.axios
            .get("https://restapi.amap.com/v3/geocode/regeo", {
              params: {
                key: "c0d0f4490c8b9f64307a5b671ce69469",
                location: point1[0] + "," + point1[1]
              }
            })
            .then(function(response) {
              // console.log(response);
              if (response.data.status == "1") {
                that.axios
                  .get("https://restapi.amap.com/v3/weather/weatherInfo", {
                    params: {
                      key: "c0d0f4490c8b9f64307a5b671ce69469",
                      city: response.data.regeocode.addressComponent.adcode
                    }
                  })
                  .then(function(response) {
                    if (response.data.status == "1") {
                      console.log(response.data);
                      console.log(response.data.lives[0].weather);
                      if (response.data.lives[0].weather.indexOf("晴") != -1) {
                        // rain
                      } else if (
                        response.data.lives[0].weather.indexOf("雪") != -1
                      ) {
                      } else if (
                        response.data.lives[0].weather.indexOf("雾") != -1
                      ) {
                      } else if (
                        response.data.lives[0].weather.indexOf("晴") != -1
                      ) {
                      }
                    }
                  })
                  .catch(function(error) {
                    console.log(error);
                  });
                console.log(response.data.regeocode.formatted_address);
                // console.log(that.$data.cityData)
                // for(let key in that.$data.cityData){
                //   console.log(that.$data.cityData.中文名[key])
                // }

                //response.data.regeocode.district
              }
              // console.log(point1[0]+ ',' +point1[1])
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      }, Cesium.ScreenSpaceEventType.WHEEL);
      handler.setInputAction(function(movement) {
        handler.destroy();
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>