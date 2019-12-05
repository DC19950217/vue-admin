<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          @click="toggleMenu(item)"
          :class="{ current: item.current }"
          v-for="(item, index) in menuTab"
          :key="index"
        >
          {{ item.txt }}
        </li>
      </ul>
      <!-- 表单 start -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="text"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="passwords"
          class="item-form"
          v-show="model === 'register'"
        >
          <label for="passwords">确认密码</label>
          <el-input
            id="passwords"
            type="text"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input
                type="text"
                v-model="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                :disabled="codeButtonStatus.status"
                type="success"
                class="block"
                @click="getSms()"
                >{{ codeButtonStatus.text }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            class="block login-btn"
            @click="submitForm('loginForm')"
            :disabled="loginButtonStatus"
            >{{ model === "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import sha1 from "js-sha1";
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVCode
} from "@/utils/validate";
import { GetSms, Register, Login } from "../../api/login";

export default {
  name: "login",
  setup(props, { refs, root }) {
    // 表单校验函数
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
      // 过滤后的数据
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6至20位数字+字母"));
      } else {
        callback();
      }
    };

    // 验证确认密码
    let validatePasswords = (rule, value, callback) => {
      // 如果模块值为login就直接验证通过
      if (model.value === "login") {
        callback();
      }
      // 过滤后的数据
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    // 验证验证码
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入验证码"));
      } else if (validateVCode(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };

    // 声明数据******************************************
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    // 隐藏确认密码
    const model = ref("login");
    // 登录或者注册按钮禁用状态
    const loginButtonStatus = ref(true);
    // 验证码按钮状态和文字
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });
    // 倒计时
    const timer = ref(null);

    // 表单绑定数据
    const ruleForm = reactive({
      username: "11111@163.com",
      password: "",
      passwords: "",
      code: ""
    });

    // 表单的验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });

    /**
     * 声明函数*************************************************
     */
    // 切换tab
    const toggleMenu = data => {
      menuTab.forEach(elem => {
        elem.current = false;
      });
      // 切换tab
      data.current = true;
      // 修改模块值
      model.value = data.type;
      resetFormData();
      clearCountDowmAndButton();
    };

    // 获取验证码
    const getSms = () => {
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空！！");
        return false;
      }
      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式有误，请重新输入！！");
        return false;
      }
      let requestData = {
        username: ruleForm.username,
        module: model.value
      };
      // 禁用获取验证码按钮和改变文字
      /*  codeButtonStatus.status = true;
      codeButtonStatus.text = "发送中"; */
      codeButtonStatuss({
        status: true,
        text: "发送中"
      });
      // 获取验证码
      GetSms(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          // 启用登录或者注册按钮
          loginButtonStatus.value = false;
          // 调用定时器
          countDown(60);
        })
        .catch(error => {
          if (error.resCode != 0) {
            /*  codeButtonStatus.status = false;
            codeButtonStatus.text = "获取验证码"; */
            codeButtonStatuss({
              status: false,
              text: "获取验证码"
            });
          }
        });
    };

    // 提交表单函数
    const submitForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          model.value === "login" ? login() : register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    // 登录
    const login = () => {
      let resquestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      Login(resquestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
        })
        .catch(error => {});
    };
    // 注册
    const register = () => {
      let resquestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
        module: "register"
      };
      Register(resquestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          toggleMenu(menuTab[0]);
          clearCountDowmAndButton();
        })
        .catch(error => {});
    };

    // 倒计时
    const countDown = number => {
      if (timer.value) {
        clearCountDowm();
      }

      let time = number;
      timer.value = setInterval(() => {
        if (time === 0) {
          clearCountDowm();
          /*  codeButtonStatus.status = false;
          codeButtonStatus.text = "重新发送"; */
          codeButtonStatuss({
            status: false,
            text: "重新发送"
          });
        } else {
          codeButtonStatus.text = `倒计时${time--}秒`;
        }
      }, 1000);
    };
    // 清除倒计时和还原按钮的默认状态
    const clearCountDowmAndButton = () => {
      // 还原按钮的默认状态
      /*  codeButtonStatus.status = false;
      codeButtonStatus.text = "获取验证码"; */
      codeButtonStatuss({
        status: false,
        text: "获取验证码"
      });
      clearCountDowm();
    };
    // 封装可复用状态函数
    // 清除倒计时
    const clearCountDowm = () => {
      clearInterval(timer.value);
    };
    // 清除表单数据
    const resetFormData = () => {
      // 重置表单数据
      refs["loginForm"].resetFields();
    };
    // 改变注册和登录按钮启用或者禁用状态
    // 改变获取验证码按钮的状态或者文字
    const codeButtonStatuss = params => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    };
    /**
     * 生命周期
     */
    // 挂在完成后
    onMounted(() => {});

    return {
      menuTab,
      model,
      loginButtonStatus,
      codeButtonStatus,
      timer,
      toggleMenu,
      clearCountDowmAndButton,
      countDown,
      submitForm,
      ruleForm,
      rules,
      getSms
    };
  }
};
</script>
<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  padding-top: 20px;
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
}
.current {
  background-color: rgba(0, 0, 0, 0.1);
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .block {
    width: 100%;
    display: block;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style> 