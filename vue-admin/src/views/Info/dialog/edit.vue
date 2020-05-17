<template>
  <el-dialog
    title="编辑"
    :visible.sync="data.dialog_info_flag"
    @close="close"
    width="580"
    @opened="openDialog"
  >
    <el-form :model="data.form">
      <el-form-item label="分类" :label-width="data.formLabelWidth">
        <el-select v-model="data.form.category" placeholder="请选择活动区域">
          <el-option
            v-for="item in data.categoryOption"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" :label-width="data.formLabelWidth">
        <el-input v-model="data.form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="概况" :label-width="data.formLabelWidth">
        <el-input type="textarea" v-model="data.form.content"></el-input>
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
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import { AddInfo, GetList, EditInfo } from "@/api/news";
import { global } from "@/utils/global_V3.0.js";
export default {
  name: "dialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit, root }) {
    const data = reactive({
      dialog_info_flag: false, //弹窗标记
      formLabelWidth: "70px",
      submitLoading: false, //按钮加载
      form: {
        //表单数据
        category: "",
        title: "",
        content: "",
      },
      categoryOption: [], //下拉分类
    });
    const { message } = global();
    const close = () => {
      data.dialog_info_flag = false;
      resetForm();
      emit("update:flag", false);
    };
    // 缓存父组件传过来的数据
    const openDialog = () => {
      data.categoryOption = props.category;
      getInfo();
    };
    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: props.id,
      };
      GetList(requestData)
        .then((respones) => {
          let responesData = respones.data.data.data[0];
          data.form = {
            category: responesData.categoryId,
            title: responesData.title,
            content: responesData.content,
          };
        })
        .catch((error) => {});
    };
    // 添加信息
    const submit = () => {
      let requestData = {
        id: props.id,
        categoryId: data.form.category,
        title: data.form.title,
        content: data.form.content,
      };
      if (!data.form.category) {
        message({
          type: "error",
          message: "分类不能为空！！",
        });
        return false;
      } else if (!data.form.title) {
        message({
          type: "error",
          message: "标题不能为空！！",
        });
        return false;
      } else if (!data.form.content) {
        message({
          type: "error",
          message: "内容不能为空！！",
        });
        return false;
      }
      submitLoadingFn(true);
      EditInfo(requestData)
        .then((response) => {
          let data = response.data;
          message({
            type: "success",
            message: data.message,
          });
          submitLoadingFn(false);
          emit("getListEmit");
        })
        .catch((error) => {
          console.log(error);
          submitLoadingFn(false);
        });
    };
    //清空表单
    const resetForm = () => {
      data.form.category = "";
      data.form.title = "";
      data.form.content = "";
    };
    // 禁用按钮
    const submitLoadingFn = (flag) => {
      data.submitLoading = flag;
    };

    onMounted(() => {});
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
      submit,
    };
  },
};
</script>
<style lang="scss" scoped></style>
