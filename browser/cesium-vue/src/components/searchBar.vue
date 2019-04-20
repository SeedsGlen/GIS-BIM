<template>
  <div class="searchBar" id="searchBar">
    <el-autocomplete
      popper-class="my-autocomplete"
      class="inline-input"
      v-model="state2"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      :trigger-on-focus="false"
      @select="handleSelect"
      clearable
    >
      <i class="el-icon-edit el-input__icon" slot="suffix"></i>
      <template slot-scope="{ item }">
        <div class="name">{{ item.value }}</div>
        <span class="addr">{{ item.address }}</span>
      </template>
    </el-autocomplete>
  </div>
</template>


<script>
export default {
  name: "searchBar",
  data() {
    return {
      cityData: "",
      state2: ""
    };
  },
  mounted() {
    var that = this;
    this.axios
      .get("/static/AMap.json")
      .then(function(response) {
        that.$data.cityData = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    querySearch(queryString, cb) {
      var results;
      this.axios
        .get("https://restapi.amap.com/v3/assistant/inputtips", {
          params: {
            key: "c0d0f4490c8b9f64307a5b671ce69469",
            keywords: queryString
          }
        })
        .then(function(response) {
          console.log(response);
          if (response.data.status == "1") {
            console.log(response);
            results = [];
            response.data.tips.map(function(item) {
              if (item.location != "") {
                console.log(item.name);
                results.push({
                  value: item.name,
                  address: item.district + item.address,
                  location: item.location
                });
              }
            });
            console.log(results);
            cb(results);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      // var results = queryString  ? this.cityData.filter(this.createFilter(queryString)) : this.cityData;
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      console.log(item);
      this.$emit("handleSearch", item.location);
    }
  }
};
</script>


<style scoped>
.searchBar {
  display: inline;
  position: absolute;
  right: 90px;
  top: 5px;
  z-index: 999;
}
.my-autocomplete > li {
    line-height: normal;
    padding: 7px;
}
.my-autocomplete .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
.my-autocomplete .addr {
      font-size: 12px;
      color: #b4b4b4;
    }
.my-autocomplete .highlighted .addr {
      color: #ddd;
    }
</style>