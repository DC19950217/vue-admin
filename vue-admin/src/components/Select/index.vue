<template>
  <el-select v-model="data.selectValue" placeholder="请选择" @change="select">
    <el-option
      v-for="item in data.initOption"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    ></el-option>
  </el-select>
</template>
<script>
import { reactive, ref, onMounted, watch } from "@vue/composition-api";

export default {
  name: "Select",
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    selectData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    const data = reactive({
      selectValue: "",
      initOption: [],
      option: [
        { value: "name", label: "姓名" },
        { value: "phone", label: "手机号" },
        { value: "email", label: "邮箱" },
        { value: "id", label: "ID" },
        { value: "title", label: "标题" }
      ]
    });
    // 初始化下拉选择
    const initOption = () => {
      let initData = props.config.init;
      let optionArr = [];
      if (initData.length === 0) {
        return false;
      }
      initData.forEach(item => {
        let arr = data.option.filter(elem => elem.value == item); //filter匹配成功是最后一个数组，需要取下标第一个
        if (arr.length > 0) {
          optionArr.push(arr[0]);
        }
      });
      if (optionArr.length === 0) {
        return false;
      }
      // 初始化赋值
      data.initOption = optionArr;
      // 初始化默认赋值
      data.selectValue = optionArr[0].value;
    };
    // 选择触发
    const select = val => {
      let filterData = data.option.filter(item => item.value == val)[0];
      emit("update:selectData", filterData);
    };
    onMounted(() => {
      initOption();
    });
    return {
      data,
      select
    };
  }
};
</script>

<style lang="scss" scoped>
</style>