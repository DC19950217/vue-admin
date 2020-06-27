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
        prop="username"
      >
        <el-input
          v-model="data.form.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码："
        :label-width="data.formLabelWidth"
        prop="password"
      >
        <el-input
          v-model="data.form.password"
          type="password"
          placeholder="请输入6~20位数字+字母"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="姓名："
        :label-width="data.formLabelWidth"
        prop="truename"
      >
        <el-input
          v-model="data.form.truename"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="手机号："
        :label-width="data.formLabelWidth"
        prop="phone"
      >
        <el-input
          v-model.number="data.form.phone"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="地区："
        :label-width="data.formLabelWidth"
        prop="region"
      >
        <CityPickerVue :cityPickerData.sync="data.cityPickerData" />
      </el-form-item>
      <el-form-item
        label="是否启用："
        :label-width="data.formLabelWidth"
        prop="status"
      >
        <el-radio v-model="data.form.status" label="1">禁用</el-radio>
        <el-radio v-model="data.form.status" label="2">启用</el-radio>
      </el-form-item>
      <el-form-item
        label="角色："
        :label-width="data.formLabelWidth"
        prop="role"
      >
        <el-checkbox-group v-model="data.form.role">
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
import sha1 from "js-sha1";
// 中央事件
import Bus from "@/utils/bus";
import {
  reactive,
  ref,
  watch,
  onMounted,
  onBeforeMount
} from "@vue/composition-api";
import CityPickerVue from "@/components/CityPicker";
import { GetRole, UserAdd } from "@/api/user";
import { global } from "@/utils/global_V3.0.js";
export default {
  name: "dialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
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
        username: "",
        password: "",
        truename: "",
        phone: "",
        region: "",
        status: "1",
        role: []
      },

      // 城市数据
      cityPickerData: {},
      // 角色选择
      roleItem: []
    });
    const { message } = global();
    // 窗口关闭时
    const close = () => {
      data.dialog_info_flag = false;
      resetForm();
      emit("update:flag", false);
    };
    // 窗口打开，动画结束时
    const openDialog = () => {
      getRole();
    };
    // 添加信息
    const submit = () => {
      if (!data.form.username) {
        message({
          type: "error",
          message: "用户名不能为空！！"
        });
        return false;
      }
      if (!data.form.password) {
        message({
          type: "error",
          message: "密码不能为空！！"
        });
        return false;
      }
      if (!data.form.role.length === 0) {
        message({
          type: "error",
          message: "请选择角色类型！！"
        });
        return false;
      }
      // 简单深拷贝 JSON.parse(JSON.stringify(data.form))
      // 浅拷贝
      let requestData = Object.assign({}, data.form);
      requestData.role = requestData.role.join();
      requestData.password = sha1(requestData.password);
      requestData.region = JSON.stringify(data.cityPickerData);
      submitLoadingFn(true);
      UserAdd(requestData)
        .then(response => {
          message({
            type: "success",
            message: response.data.message
          });
          resetForm();
          submitLoadingFn(false);
        })
        .catch(error => {});
    };
    //清空表单
    const resetForm = () => {
      data.cityPickerData = {};
      refs.addInfoForm.resetFields();
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
