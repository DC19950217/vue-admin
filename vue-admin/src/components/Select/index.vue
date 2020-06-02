<template>
  <el-select v-model="data.selectValue" placeholder="请选择">
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
    }
  },
  setup(props, { root }) {
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
    let initOption = () => {
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
    onMounted(() => {
      initOption();
    });
    return {
      data
    };
  }
};
</script>

<style lang="scss" scoped>
</style>