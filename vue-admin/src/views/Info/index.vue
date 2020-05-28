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
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
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
        <el-button
          type="danger"
          size="medium"
          style="width:100%;"
          @click="getList"
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
    <el-table
      :data="table_data.item"
      v-loading="loadingData"
      border
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45"> </el-table-column>
      <el-table-column prop="title" label="标题" width="295"></el-table-column>
      <el-table-column
        prop="categoryId"
        label="类型"
        width="110"
        :formatter="toCategory"
      ></el-table-column>
      <el-table-column
        prop="createDate"
        label="日期"
        width="180"
        :formatter="toData"
      ></el-table-column>
      <el-table-column prop="user" label="管理员" width="100"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="deleteItem(scope.row.id)"
          >
            删除
          </el-button>
          <el-button type="success" size="mini" @click="editInfo(scope.row.id)"
            >编辑</el-button
          >
          <el-button type="success" size="mini" @click="detailed(scope.row)">
            编辑详情
          </el-button>
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
    <DialogInfo
      :flag.sync="dialog_info"
      :category="options.category"
      @getListEmit="getList"
    />
    <!-- 编辑的弹窗 -->
    <DialogEditInfo
      :flag.sync="dialog_info_edit"
      :category="options.category"
      :id="infoId"
      @getListEmit="getList"
    />
  </div>
</template>
<script>
import DialogInfo from "./dialog/info";
import DialogEditInfo from "./dialog/edit";
import { global } from "@/utils/global_V3.0.js";
import { GetCategory, GetList, DeleteInfo } from "@/api/news";
import { common } from "@/api/common";
import { timestampToTime } from "@/utils/common";
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
export default {
  name: "InfoIndex",
  components: {
    DialogInfo,
    DialogEditInfo
  },
  setup(props, { root }) {
    const { getInfoCategory, categoryItem } = common();
    const { confirm, message } = global();
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
    const dialog_info_edit = ref(false);
    // 你要选择的那个的信息分类
    const category_value = ref("");
    const search_key = ref("id");
    const date_value = ref("");
    const search_keyWork = ref("");
    const total = ref(0);
    const deleteInfoId = ref("");
    const loadingData = ref(false);
    const infoId = ref("");
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
    const deleteItem = id => {
      deleteInfoId.value = [id];
      confirm({
        content: "确定删除当前信息，确认后将无法恢复！！",
        tip: "警告",
        fn: confirmDelete
      });
    };
    // 删除所有选中的数据
    const deleteAll = () => {
      if (!deleteInfoId.value || deleteInfoId.length == 0) {
        message({
          type: "error",
          message: "请选择要删除的数据！！"
        });
        return false;
      }
      confirm({
        content: "确定删除选择的数据，确认后将无法恢复！！",
        fn: confirmDelete
      });
    };
    // 删除数据处理函数
    const confirmDelete = value => {
      DeleteInfo({ id: deleteInfoId.value }).then(respones => {
        message({
          type: "success",
          message: respones.data.message
        });
        deleteInfoId.value = "";
        getList();
      });
    };
    // 处理选中函数
    const handleSelectionChange = val => {
      let id = val.map(item => item.id);
      deleteInfoId.value = id;
    };
    // 搜索
    /*   const search = () => {
      let resquestData = formatData();
      getList();
    }; */
    // 搜索条件处理
    const formatData = () => {
      let resquestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      // 分类id
      if (category_value.value) {
        resquestData.categoryId = category_value.value;
      }
      // 日期
      if (date_value.value.length > 0) {
        requestData.startTime = date_value.value[0];
        requestData.endTime = date_value.value[1];
      }
      // 关键字
      if (search_keyWork.value) {
        resquestData[search_key.value] = search_keyWork.value;
      }

      return resquestData;
    };
    // 编辑数据
    const editInfo = id => {
      infoId.value = id;
      dialog_info_edit.value = true;
    };
    const getList = () => {
      /* let resquestData = {
        categoryId: "",
        startTime: "",
        endTime: "",
        title: "",
        id: "",
        pageNumber: page.pageNumber,
        pageSize: page.pageSize,
      }; */
      let resquestData = formatData();
      loadingData.value = true;
      GetList(resquestData)
        .then(respones => {
          let data = respones.data.data;
          // console.log(data);
          // 表格数据
          table_data.item = data.data;
          // 页码数量
          total.value = data.total;
          loadingData.value = false;
        })
        .catch(error => {
          loadingData.value = false;
          console.log(error);
        });
    };
    // 格式化时间
    const toData = (row, column, cellValue, index) => {
      return timestampToTime(row.createDate);
    };
    // 匹配分类
    const toCategory = row => {
      let categoryId = row.categoryId;
      let categoryData = options.category.filter(
        item => item.id == categoryId
      )[0];
      return categoryData.category_name;
    };
    // 信息详情
    const detailed = data => {
    /*   root.$store.commit("infoDetailed/SET_ID", data.id);
      root.$store.commit("infoDetailed/SET_TITLE", data.title); */
      root.$store.commit("infoDetailed/UPDATE_STATE_VALUE", {
        id: {
          value: data.id,
          sessionKey: "infoId",
          session: true
        },
        title: {
          value: data.title,
          sessionKey: "infoTitle",
          session: true
        }
      });
      /*  root.$router.push({
        path:`/infoDetailed/${data.id}/${data.title}`
      }) */
      root.$router.push({
        name: "InfoDetailed",
        params: {
          id: data.id,
          title: data.title
        }
      });
    };
    // 生命周期
    // 挂载完成时执行，（页面DOM元素完成时，实际完成）
    onMounted(() => {
      // vue3.0
      // getInfoCategory();
      // vuex
      root.$store.dispatch("common/getInfoCategoryAll").then(res => {
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
      dialog_info_edit,
      category_value,
      search_key,
      date_value,
      search_keyWork,
      total,
      loadingData,
      infoId,
      // methods
      handleSizeChange,
      handleCurrentChange,
      deleteItem,
      deleteAll,
      toData,
      toCategory,
      handleSelectionChange,
      getList,
      editInfo,
      detailed
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
