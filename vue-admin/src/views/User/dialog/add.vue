<template>
  <el-dialog
    title="新增"
    :visible.sync="data.dialog_info_flag"
    @close="close"
    width="580"
    @opened="openDialog"
  >
    <el-form :model="data.form" :rules="data.rules" ref="addInfoForm">
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
        label="系统："
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
      <el-form-item label="按钮：" :label-width="data.formLabelWidth">
        <template v-if="data.btnPerm.length > 0">
          <!-- eslint-disable-next-line  -->
          <div v-for="item in data.btnPerm">
            <h4>{{ item.name }}</h4>
            <template v-if="item.perm && item.perm.length > 0">
              <el-checkbox-group v-model="data.form.btnPerm">
                <el-checkbox
                  v-for="buttons in item.perm"
                  :key="buttons.value"
                  :label="buttons.value"
                  >{{ buttons.name }}</el-checkbox
                >
              </el-checkbox-group>
            </template>
          </div>
        </template>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button
        type="danger"
        :loading="data.submitLoading"
        @click="submit('addInfoForm')"
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
import {
  GetPermButton,
  GetRole,
  GetSystem,
  UserAdd,
  UserEdit
} from "@/api/user";
import { global } from "@/utils/global_V3.0.js";
import { stripscript, validateEmail, validatePass } from "@/utils/validate";
export default {
  name: "dialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  components: { CityPickerVue },
  setup(props, { emit, root, refs }) {
    // 验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名！"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误！"));
      } else {
        callback();
      }
    };

    // 验证密码
    let validatePassword = (rule, value, callback) => {
      if (data.form.id && !value) {
        callback();
      }
      if ((data.form.id && value) || !data.form.id) {
        // 过滤后的数据
        if (value) {
          data.form.password = stripscript(value);
          value = data.form.password;
        }

        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (validatePass(value)) {
          callback(new Error("密码为6至20位数字+字母"));
        } else {
          callback();
        }
      }
    };
    const data = reactive({
      dialog_info_flag: false, //弹窗标记
      formLabelWidth: "90px",
      submitLoading: false, //按钮加载
      form: {
        //表单数据
        username: "1332524093@qq.com",
        password: "",
        truename: "dc",
        phone: "15218298951",
        region: "",
        status: "1",
        role: [],
        btnPerm: []
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        role: [{ required: true, message: "请选择角色", trigger: "change" }]
      },

      // 城市数据
      cityPickerData: {},
      // 角色选择
      roleItem: [],
      // 按钮
      btnPerm: []
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
      // 角色请求
      getRole();
      // 初始值处理
      let editData = props.editData;
      if (editData && editData.id) {
        editData.role = editData.role ? editData.role.split(",") : [];
        editData.btnPerm = editData.btnPerm ? editData.btnPerm.split(",") : [];
        for (let key in editData) {
          data.form[key] = editData.id ? editData[key] : "";
        }
      } else {
        data.form.id && delete data.form.id;
      }
    };
    // 添加信息
    const submit = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          // 简单深拷贝 JSON.parse(JSON.stringify(data.form))
          // 浅拷贝
          let requestData = Object.assign({}, data.form);
          requestData.role = requestData.role.join();
          requestData.btnPerm = requestData.btnPerm.join();
          requestData.region = JSON.stringify(data.cityPickerData);
          submitLoadingFn(true);

          if (requestData.id) {
            if (requestData.password) {
              requestData.password = sha1(requestData.password);
            } else {
              delete requestData.password;
            }
            userEditFn(requestData);
          } else {
            requestData.password = sha1(requestData.password);
            userAddFn(requestData);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    // 封装用户添加函数
    const userAddFn = requestData => {
      UserAdd(requestData)
        .then(response => {
          message({
            type: "success",
            message: response.data.message
          });
          submitLoadingFn(false);
          close();
          // 回传父组件刷新数据
          emit("refreshTableData");
        })
        .catch(error => {
          submitLoadingFn(false);
        });
    };
    // 封装用户编辑函数
    const userEditFn = requestData => {
      UserEdit(requestData)
        .then(response => {
          message({
            type: "success",
            message: response.data.message
          });
          submitLoadingFn(false);
          close();
          // 回传父组件刷新数据
          emit("refreshTableData");
        })
        .catch(error => {
          submitLoadingFn(false);
        });
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
      // 优化请求
     /*  if (data.roleItem.length > 0 && data.btnPerm.length > 0) {
        return false;
      } */
      if (data.roleItem.length === 0) {
        GetRole()
          .then(response => {
            let result = response.data.data;
            data.roleItem = result;
          })
          .catch(err => {});
      }
      if (data.btnPerm.length === 0) {
        GetPermButton()
          .then(response => {
            data.btnPerm = response.data.data;
          })
          .catch(err => {});
      }
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
