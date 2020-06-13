<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="label-wrap">
          <label for="">关键字：</label>
          <div class="warp-content">
            <el-row :gutter="16">
              <el-col :span="3">
                <SelectVue :config="data.configOption" />
              </el-col>
              <el-col :span="5">
                <el-input placeholder="请输入搜索的关键字"></el-input>
              </el-col>
              <el-col :span="15">
                <el-button type="danger">搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4"
        ><el-button type="danger" class="pull-right"
          >添加用户</el-button
        ></el-col
      >
    </el-row>
    <div class="black-space-30"></div>
    <TableVue :config="data.configTable">
      <template v-slot:status="slotData">
        <el-switch
          v-model="slotData.data.role"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </template>
      <template v-slot:operation="slotData">
        <el-button type="danger" size="small" @click="operation(slotData.data)"
          >删除</el-button
        >
        <el-button type="success" size="small" @click="operation(slotData.data)"
          >编辑</el-button
        >
      </template>
    </TableVue>
  </div>
</template>
<script>
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
import SelectVue from "@/components/Select";
import TableVue from "@/components/Table";
export default {
  name: "userIndex",
  components: { SelectVue, TableVue },
  setup(props) {
    const data = reactive({
      configOption: {
        init: ["name", "phone", "email"]
      },
      configTable: {
        selection: true,
        tHead: [
          { label: "邮箱/用户名", field: "email", width: 180 },
          { label: "真实姓名", field: "title", width: 100 },
          { label: "手机号", field: "phone", width: 110 },
          { label: "地区", field: "address" },
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
        paginationLayout: "total, sizes, prev, pager, next, jumper",
        paginationShow: true
      }
    });
    const operation = params => {
      console.log(params);
    };
    return {
      data,
      operation
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