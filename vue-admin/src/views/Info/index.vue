<template>
  <div id="info-warp">
    <el-row :gutter="16">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for="">分类：</label>
          <div class="warp-content">
            <el-select
              v-model="category_value"
              placeholder="请选择"
              style="width:100%;"
            >
              <el-option
                v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
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
    <el-table :data="table_data.item" border style="width:100%">
      <el-table-column type="selection" width="45"> </el-table-column>
      <el-table-column prop="title" label="标题" width="400"></el-table-column>
      <el-table-column
        prop="categoryId"
        label="类型"
        width="110"
      ></el-table-column>
      <el-table-column
        prop="createDate"
        label="日期"
        width="180"
      ></el-table-column>
      <el-table-column prop="user" label="管理员" width="100"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="danger" size="mini" @click="deleteItem">
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
        <el-button size="medium" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="15">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :page-sizes="[10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next,jumper"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <!-- 新增的弹窗 -->
    <!-- 需要逻辑运算的时候就要用第一种 -->
    <!-- <DialogInfo :flag="dialog_info" @close="closeDialog" /> -->
    <!-- 不需要逻辑运算用这种有修饰器的 -->
    <DialogInfo :flag.sync="dialog_info" :category="options.category" />
  </div>
</template>
<script>
import DialogInfo from "./dialog/info";
import { global } from "@/utils/global_V3.0.js";
import { GetCategory, GetList } from "@/api/news";
import { common } from "@/api/common";
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
export default {
  name: "InfoIndex",
  components: {
    DialogInfo
  },
  setup(props, { root }) {
    const { getInfoCategory, categoryItem } = common();
    const { confirm } = global();
    const options = reactive({
      category: []
    });
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
    const table_data = reactive({
      item: []
    });
    // 页码
    const page = reactive({
      pageNumber: 1,
      pageSize: 10
    });
    // 信息弹窗标记
    const dialog_info = ref(false);
    // 你要选择的那个的信息分类
    const category_value = ref("");
    const search_key = ref("id");
    const date_value = ref("");
    const search_keyWork = ref("");
    const total = ref(0);
    // vue2.0 methods
    // 需要显示多少条数据
    const handleSizeChange = val => {
      page.pageSize = val;
      getList();
    };
    // 下一页数据
    const handleCurrentChange = val => {
      page.pageNumber = val;
      getList();
    };
    // 是否删除信息确认弹窗
    const deleteItem = () => {
      confirm({
        content: "确定删除当前信息，确认后将无法恢复！！",
        tip: "警告",
        fn: confirmDelete,
        id: 1111111
      });
      /* root.confirm({
        content: "确定删除当前信息，确认后将无法恢复！！",
        tip: "警告",
        fn: confirmDelete,
        id: 1111111
      }); */
    };

    const deleteAll = () => {
      confirm({
        content: "确定删除选择的数据，确认后将无法恢复！！",
        fn: confirmDelete,
        id: 2222222
      });
    };
    const getList = () => {
      let resquestData = {
        categoryId: "",
        startTime: "",
        endTime: "",
        title: "",
        id: "",
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      GetList(resquestData)
        .then(respones => {
          let data = respones.data.data;
          console.log(data);
          // 表格数据
          table_data.item = data.data;
          // 页码数量
          total.value = data.total;
        })
        .catch(error => {
          console.log(error);
        });
    };

    const confirmDelete = value => {
      console.log(value);
    };
    // 生命周期
    // 挂载完成时执行，（页面DOM元素完成时，实际完成）
    onMounted(() => {
      // vue3.0
      // getInfoCategory();
      // vuex
      root.$store.dispatch("common/getInfoCategory").then(res => {
        options.category = res;
      });
      getList();
    });
    // 监听数据变化
    /*  watch(()=>categoryItem.item,(value)=>{
      options.category = value;
    }) */

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
      total,
      // methods
      handleSizeChange,
      handleCurrentChange,
      deleteItem,
      deleteAll
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
