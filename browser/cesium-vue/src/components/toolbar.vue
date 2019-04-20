<template>
  <div class="toolbar">
    <el-select v-model="value" placeholder="请选择">
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
          label: "双皮奶"
        },
        {
          value: "3",
          label: "鼠标当前经纬度"
        },
        {
          value: "4",
          label: "龙须面"
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