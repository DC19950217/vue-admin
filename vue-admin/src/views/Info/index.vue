<template>
  <div id="info-warp">
    <el-row :gutter="16">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for="">类型：</label>
          <div class="warp-content">
            <el-select v-model="value" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="label-wrap date">
          <label for="">日期：&nbsp;&nbsp;</label>
          <div class="warp-content">
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
              style="width:100%;"
            >
            </el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="label-wrap key-work">
          <label for="">关键字：&nbsp;&nbsp;</label>
          <div class="warp-content">
            <el-select v-model="search_key" style="width:100%;">
              <el-option
                v-for="item in search_option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <el-input
          style="width:100%;"
          v-model="search_keyWork"
          placeholder="请输入内容"
        ></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" style="width:100%;">搜索</el-button>
      </el-col>
      <el-col :span="2" :push="3">
        <el-button type="danger" style="width:100%;">新增</el-button>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
  </div>
</template>
<script>
import { reactive, ref } from "@vue/composition-api";
export default {
  name: "InfoIndex",
  setup(props) {
    const options = reactive([
      {
        value: 1,
        label: "国际信息"
      },
      {
        value: 2,
        label: "国内信息"
      },
      {
        value: 3,
        label: "行业信息"
      }
    ]);
    //搜索关键字
    const search_option = reactive([
      {
        value: "id",
        label: "ID"
      },
      {
        value: "title",
        label: "标题"
      }
    ]);
    const value = ref("");
    const search_key = ref("id");
    const value2 = ref("");
    const search_keyWork = ref("");
    return {
      options,
      search_option,
      search_key,
      value,
      value2,
      search_keyWork
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(right, 93, 40);
  }
  &.key-work {
    @include labelDom(right, 60, 40);
  }
  label {
    color: #606266;
  }
}
</style>
