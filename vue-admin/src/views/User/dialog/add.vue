<template>
  <el-dialog
    title="新增"
    :visible.sync="data.dialog_info_flag"
    @close="close"
    width="580"
    @opened="openDialog"
  >
    <el-form :model="data.form" ref="addInfoForm">
      <el-form-item
        label="用户名："
        :label-width="data.formLabelWidth"
        prop="category"
      >
        <el-input
          v-model="data.form.title"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="姓名："
        :label-width="data.formLabelWidth"
        prop="title"
      >
        <el-input v-model="data.form.title" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item
        label="手机号："
        :label-width="data.formLabelWidth"
        prop="content"
      >
        <el-input
          v-model="data.form.title"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="地区："
        :label-width="data.formLabelWidth"
        prop="content"
      >
        <!--  <CityPickerVue
          :cityPickerLevel="['province', 'city', 'area']"
          :cityPickerData.sync="data.cityPickerData"
        /> -->
        <CityPickerVue :cityPickerData.sync="data.cityPickerData" />
      </el-form-item>
      <el-form-item
        label="是否启用："
        :label-width="data.formLabelWidth"
        prop="content"
      >
        <el-radio v-model="data.roleStatus" label="1">禁用</el-radio>
        <el-radio v-model="data.roleStatus" label="2">启用</el-radio>
      </el-form-item>
      <el-form-item
        label="角色："
        :label-width="data.formLabelWidth"
        prop="content"
      >
        <el-checkbox-group v-model="data.roleCode">
          <el-checkbox
            v-for="item in data.roleItem"
            :label="item.role"
            :key="item.role"
            >{{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="danger" :loading="data.submitLoading" @click="submit"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import {
  reactive,
  ref,
  watch,
  onMounted,
  onBeforeMount
} from "@vue/composition-api";
import CityPickerVue from "@/components/CityPicker";
import { AddInfo } from "@/api/news";
import { GetRole } from "@/api/user";
import { global } from "@/utils/global_V3.0.js";
export default {
  name: "dialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    }
  },
  components: { CityPickerVue },
  setup(props, { emit, root, refs }) {
    const data = reactive({
      dialog_info_flag: false, //弹窗标记
      formLabelWidth: "90px",
      submitLoading: false, //按钮加载
      form: {
        //表单数据
        category: "",
        title: "",
        content: ""
      },
      categoryOption: [], //下拉分类
      // 城市数据
      cityPickerData: {},
      // 是否启用状态
      roleStatus: "1",
      // 角色
      roleCode: ["A"],
      // 角色选择
      roleItem: []
    });
    const { message } = global();
    const close = () => {
      data.dialog_info_flag = false;
      resetForm();
      emit("update:flag", false);
    };
    // 窗口打开，动画结束时
    const openDialog = () => {
      getRole();
      data.categoryOption = props.category;
    };
    // 添加信息
    const submit = () => {
      let requestData = {
        category: data.form.category,
        title: data.form.title,
        content: data.form.content
      };
      if (!data.form.category) {
        message({
          type: "error",
          message: "分类不能为空！！"
        });
        return false;
      } else if (!data.form.title) {
        message({
          type: "error",
          message: "标题不能为空！！"
        });
        return false;
      } else if (!data.form.content) {
        message({
          type: "error",
          message: "内容不能为空！！"
        });
        return false;
      }
      submitLoadingFn(true);
      AddInfo(requestData)
        .then(response => {
          let requestData = response.data;
          message({
            type: "success",
            message: requestData.message
          });
          submitLoadingFn(false);
          emit("getListEmit");
          resetForm();
        })
        .catch(error => {
          console.log(error);
          submitLoadingFn(false);
        });
    };
    //清空表单
    const resetForm = () => {
      refs.addInfoForm.resetFields();
      /*  data.form.category = "";
      data.form.title = "";
      data.form.content = ""; */
    };
    // 禁用按钮
    const submitLoadingFn = flag => {
      data.submitLoading = flag;
    };
    // 请求角色
    const getRole = () => {
      GetRole()
        .then(response => {
          let result = response.data.data;
          data.roleItem = result;
        })
        .catch(err => {});
    };
    watch(() => {
      data.dialog_info_flag = props.flag;
    });
    return {
      // reactive
      data,
      // ref
      // vue2.0 methods
      close,
      openDialog,
      submit
    };
  }
};
</script>
<style lang="scss" scoped></style>
