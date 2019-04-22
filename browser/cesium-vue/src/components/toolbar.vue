<template>
  <div class="toolbar">
    <el-select ref="select" v-model="value" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>


<script>
export default {
  name: "toolbar",
  data() {
    return {
      options: [
        {
          value: "1",
          label: "测距"
        },
        {
          value: "2",
          label: "小飞机"
        },
        {
          value: "3",
          label: "天气"
        },
        {
          value: "4",
          label: "平面裁剪"
        },
        {
          value: "5",
          label: "北京烤鸭"
        }
      ],
      value: ""
    };
  },
  mounted() {},
  methods: {

  },
  watch: {
    value(val, oldVal) {
      this.$refs["select"].blur()
      this.$emit('changeFuction',{val, oldVal})
    }
  }
};
</script>


<style scoped>
.toolbar {
  display: inline;
  position: absolute;
  left: 10px;
  top: 15px;
  z-index: 999;
}
</style>