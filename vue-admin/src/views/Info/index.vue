<template>
  <div id="info-warp">
    <el-row :gutter="16">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for="">类型：</label>
          <div class="warp-content">
            <el-select
              v-model="category_value"
              placeholder="请选择"
              style="width:100%;"
            >
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
              v-model="date_value"
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
      <el-col :span="4">
        <div class="label-wrap key-work">
          <label for="">关键字：</label>
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
        <el-button type="danger" size="medium" style="width:100%;"
          >搜索</el-button
        >
      </el-col>
      <el-col :span="2" :push="2">
        <el-button
          type="danger"
          size="medium"
          @click="dialog_info = true"
          style="width:100%;"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <!-- 表格数据 -->
    <el-table :data="table_data" border style="width:100%">
      <el-table-column type="selection" width="45"> </el-table-column>
      <el-table-column prop="title" label="标题" width="400"></el-table-column>
      <el-table-column
        prop="category"
        label="类型"
        width="110"
      ></el-table-column>
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="user" label="管理员" width="100"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="danger" size="mini">
            删除
          </el-button>
          <el-button type="success" size="mini" @click="dialog_info = true"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="black-space-30"></div>
    <!-- 底部分页 -->
    <el-row>
      <el-col :span="9">
        <el-button size="medium">批量删除</el-button>
      </el-col>
      <el-col :span="15">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :page-sizes="[10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next,jumper"
          :total="1000"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <!-- 新增的弹窗 -->
    <!-- 需要逻辑运算的时候就要用第一种 -->
    <!-- <DialogInfo :flag="dialog_info" @close="closeDialog" /> -->
    <!-- 不需要逻辑运算用这种有修饰器的 -->
    <DialogInfo :flag.sync="dialog_info" />
  </div>
</template>
<script>
import DialogInfo from "./dialog/info";
import { reactive, ref } from "@vue/composition-api";
export default {
  name: "InfoIndex",
  components: {
    DialogInfo
  },
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
    // 表格数据
    const table_data = reactive([
      {
        title: "白衣长城 绝不后退！ 一线党旗红 理上网来",
        category: "国内新闻",
        date: "2020-3-01",
        user: "dengchang"
      },
      {
        title: "国际社会关注中国战“疫” 向人民子弟兵致敬",
        category: "国内新闻",
        date: "2020-3-01",
        user: "dengchang"
      },
      {
        title: "正当防卫判决稀少，本就是生活的常态 | 特别策划（二）",
        category: "国内新闻",
        date: "2020-3-01",
        user: "dengchang"
      },
      {
        title: "湖北22人误服消毒片后集体中毒？官方回应：确有人中毒，正在调查",
        category: "国内新闻",
        date: "2020-3-01",
        user: "dengchang"
      }
    ]);
    // 信息弹窗标记
    const dialog_info = ref(false);
    // 你要选择的那个的信息分类
    const category_value = ref("");
    const search_key = ref("id");
    const date_value = ref("");
    const search_keyWork = ref("");
    // vue2.0 methods
    // 需要显示多少条数据
    const handleSizeChange = val => {
      console.log(1111);
    };
    // 下一页数据
    const handleCurrentChange = val => {
      console.log(2222);
    };

    return {
      // reactive
      options,
      search_option,
      table_data,
      // ref
      dialog_info,
      category_value,
      search_key,
      date_value,
      search_keyWork,
      // methods
      handleSizeChange,
      handleCurrentChange
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
}
</style>
