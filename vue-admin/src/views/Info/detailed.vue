<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="信息分类">
      <el-select v-model="form.categoryId">
        <el-option
          v-for="item in data.category"
          :key="item.id"
          :value="item.id"
          :label="item.category_name"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="新闻标题:">
      <el-input v-model="form.title"> </el-input>
    </el-form-item>

    <el-form-item label="缩略图:">
      <UploadImg :imgUrl.sync="form.imgUrl" :config="uploadImgConfig" />
    </el-form-item>

    <el-form-item label="发布日期:">
      <el-date-picker
        type="date"
        v-model="form.createDate"
        placeholder="选择日期"
        disabled
      ></el-date-picker>
    </el-form-item>

    <el-form-item label="详细内容:">
      <quillEditor
        v-model="form.content"
        ref="myQuillEditor"
        :options="data.editorOption"
        @change="onEditorChange($event)"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit" :loading="data.submitLoading"
        >保存</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script>
import {
  reactive,
  ref,
  watch,
  onMounted,
  onActivated
} from "@vue/composition-api";
import { GetList, EditInfo } from "@/api/news";
import { timestampToTime } from "@/utils/common";
// 富文本
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { global } from "@/utils/global_V3.0.js";
import UploadImg from "@/components/UploadImg";

export default {
  name: "infoDetailed",
  components: {
    quillEditor,
    UploadImg
  },
  setup(props, { root }) {
    const { message } = global();
    // 图片上传配置
    const uploadImgConfig = reactive({
      action: "http://up-z2.qiniup.com",
      accesskey: "Avh-EZZAa4TxqPQZsEW42fXBUbTMFi-RKSZTRKJj",
      secretkey: "l9AXtnhCVkZexXNRcmHXzmecXiCUiLynwGboMeUw",
      buckety: "webjshtml"
    });
    const data = reactive({
      id: root.$route.params.id || root.$store.getters["infoDetailed/infoId"],
      category: [],
      editorOption: {},
      submitLoading: false,
      uploadKey: {
        token: "",
        key: ""
      }
    });
    const form = reactive({
      categoryId: "",
      title: "",
      createDate: "",
      content: "",
      imgUrl: ""
    });
    // 获取分类数据
    const getInfoCategory = () => {
      root.$store.dispatch("common/getInfoCategoryAll").then(res => {
        data.category = res;
      });
    };
    // 获取当前ID的信息
    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: data.id
      };
      GetList(requestData).then(response => {
        let responseData = response.data.data.data[0];
        form.categoryId = responseData.categoryId;
        form.title = responseData.title;
        form.createDate = timestampToTime(responseData.createDate);
        form.content = responseData.content;
        form.imgUrl = responseData.imgUrl;
      });
    };
    // 保存信息
    const submit = () => {
      let requestData = {
        id: data.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        imgUrl: form.imgUrl
      };
      submitLoadingFn(true);
      EditInfo(requestData)
        .then(response => {
          let data = response.data;
          message({
            type: "success",
            message: data.message
          });
          submitLoadingFn(false);
        })
        .catch(error => {
          console.log(error);
          submitLoadingFn(false);
        });
    };
    // 禁用按钮
    const submitLoadingFn = flag => {
      data.submitLoading = flag;
    };
    // 富文本内容发生变化
    const onEditorChange = event => {
      console.log(event);
    };
    onMounted(() => {
      getInfoCategory();
    });
    onActivated(() => {
      data.id =
        root.$route.params.id || root.$store.getters["infoDetailed/infoId"];
      getInfo();
    });
    return {
      data,
      form,
      submit,
      uploadImgConfig,
      onEditorChange
    };
  }
};
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: auto;
  display: block;
}
</style>