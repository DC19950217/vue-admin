<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="label-wrap">
          <label for="">关键字：</label>
          <div class="warp-content">
            <el-row :gutter="16">
              <el-col :span="3">
                <SelectVue
                  :config="data.configOption"
                  :selectData.sync="data.selectData"
                />
              </el-col>
              <el-col :span="5">
                <el-input
                  v-model="data.key_word"
                  placeholder="请输入搜索的关键字"
                ></el-input>
              </el-col>
              <el-col :span="15">
                <el-button type="danger" @click="search">搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4"
        ><el-button
          type="danger"
          class="pull-right"
          @click="data.dialog_add = true"
          >添加用户</el-button
        ></el-col
      >
    </el-row>
    <div class="black-space-30"></div>
    <TableVue
      ref="userTable"
      :config="data.configTable"
      :tableRow.sync="data.tablerow"
    >
      <template v-slot:status="slotData">
        <el-switch
          @change="handlerSwitch(slotData.data)"
          v-model="slotData.data.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="2"
          inactive-value="1"
        >
        </el-switch>
      </template>
      <template v-slot:operation="slotData">
        <el-button type="danger" size="small" @click="handlerDel(slotData.data)"
          >删除</el-button
        >
        <el-button
          type="success"
          size="small"
          @click="handlerEdit(slotData.data)"
          >编辑</el-button
        >
      </template>
      <template v-slot:tobleFooterLeft>
        <el-button size="small" @click="handelBatchDel">批量删除</el-button>
      </template>
    </TableVue>
    <DialogAdd
      :flag.sync="data.dialog_add"
      :editData="data.editData"
      @refreshTableData="refreshData"
    />
  </div>
</template>
<script>
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
// 封装的方法
import { global } from "@/utils/global_V3.0.js";
// 组件
import SelectVue from "@/components/Select";
import TableVue from "@/components/Table";
import DialogAdd from "./dialog/add";
// 中央事件
import Bus from "@/utils/bus";

import { UserDel, UserActives } from "@/api/user";
export default {
  name: "userIndex",
  components: { SelectVue, TableVue, DialogAdd },
  setup(props, { root, refs }) {
    const { confirm, message } = global();
    const userTable = ref(null);
    const data = reactive({
      // table选择的数据
      tablerow: {},
      // 下来菜单的数据
      selectData: {},
      // 搜索关键字
      key_word: "",
      dialog_add: false,
      configOption: {
        init: ["name", "phone", "email"]
      },
      updateUserStatusFlag: false,
      configTable: {
        selection: true,
        tHead: [
          { label: "邮箱/用户名", field: "username", width: 180 },
          { label: "真实姓名", field: "truename", width: 100 },
          { label: "手机号", field: "phone", width: 110 },
          { label: "地区", field: "region" },
          { label: "角色", field: "role", width: 80 },
          {
            label: "禁启用状态",
            field: "status",
            columnType: "slot",
            slotName: "status",
            width: 100
          },
          {
            label: "操作",
            columnType: "slot",
            slotName: "operation"
          }
        ],
        // 请求接口URL
        requestData: {
          url: "getUserList",
          method: "post",
          data: {
            pageNumber: 1,
            pageSize: 10
          }
        },
        editData: {},
        paginationLayout: "total, sizes, prev, pager, next, jumper",
        paginationShow: true
      }
    });
    const operation = params => {
      console.log(params);
    };
    const handlerDel = params => {
      data.tablerow.idItem = [params.id];
      confirm({
        content: "确定删除选择的数据，确认后将无法恢复！！",
        fn: UserDelete
      });
    };
    // 删除数据
    const handelBatchDel = () => {
      let userId = data.tablerow.idItem;
      if (!userId || userId.length === 0) {
        message({
          message: "请勾选要删除的用户！！！",
          type: "error"
        });
        return false;
      }
      confirm({
        content: "确定删除选择的数据，确认后将无法恢复！！",
        fn: UserDelete
      });
    };
    // 删除用户封装方法
    const UserDelete = () => {
      UserDel({ id: data.tablerow.idItem })
        .then(response => {
          message({
            message: response.data.message,
            type: "success"
          });
          // 第一种触发子组件里面函数的方法
          // refs.userTable.refreshData();
          // 第二种触发子组件里面函数的方法
          refreshData();
        })
        .catch(error => {});
    };
    // 刷新用户列表
    const refreshData = () => {
      userTable.value.refreshData();
    };
    // 禁启用按钮状态
    const UserStatusFlagFn = flag => {
      data.updateUserStatusFlag = flag;
    };
    // 禁启用按钮
    const handlerSwitch = params => {
      if (data.updateUserStatusFlag) {
        return false;
      }
      UserStatusFlagFn(true);
      let requestData = {
        id: params.id,
        status: params.status
      };
      UserActives(requestData)
        .then(response => {
          message({
            message: response.data.message,
            type: "success"
          });
          UserStatusFlagFn(false);
        })
        .catch(error => {
          UserStatusFlagFn(false);
        });
    };
    // 编辑用户数据
    const handlerEdit = params => {
      data.dialog_add = true;
      data.editData = Object.assign({}, params);
    };
    // 搜索
    const search = () => {
      let requestData = {
        [data.selectData.value]: data.key_word
      };
      refs.userTable.paramsLoadData(requestData);
    };

    return {
      userTable,
      data,
      operation,
      handelBatchDel,
      handlerDel,
      refreshData,
      handlerSwitch,
      handlerEdit,
      search
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  @include labelDom(left, 60, 40);
}
</style>