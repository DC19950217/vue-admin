<template>
  <el-upload
    :action="config.action"
    class="avatar-uploader"
    :data="data.uploadKey"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="data.image" :src="data.image" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<script>
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import { global } from "@/utils/global_V3.0.js";
import { QiniuToKen } from "@/api/common.js";

export default {
  name: "uploadImg",
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    const { message } = global();
    const data = reactive({
      image: "",
      uploadKey: {
        token: "",
        key: ""
      }
    });

    //图片上传
    const handleAvatarSuccess = (res, file) => {
      let img = `${root.$store.getters["common/qiniuUrl"]}${res.key}`;
      data.image = img;
      emit("update:imgUrl", img);
    };
    const beforeAvatarUpload = file => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        message({
          type: "error",
          message: "上传头像图片只能是 JPG 格式!"
        });
      }
      if (!isLt2M) {
        message({
          type: "error",
          message: "上传头像图片大小不能超过 2MB!"
        });
      }
      let suffix = file.name;
      let key = encodeURI(`${suffix}`);
      data.uploadKey.key = key;
      return isJPG && isLt2M;
    };
    //获取七牛云token
    const getQiniuToKen = () => {
      let requestData = {
        accesskey: props.config.accesskey,
        secretkey: props.config.secretkey,
        buckety: props.config.buckety
      };
      QiniuToKen(requestData).then(response => {
        data.uploadKey.token = response.data.data.token;
      });
    };
    onMounted(() => {
      getQiniuToKen();
    });
    watch(
      () => props.imgUrl,
      value => {
        data.image = value;
      }
    );
    return {
      data,
      handleAvatarSuccess,
      beforeAvatarUpload
    };
  }
};
</script>
<style lang="scss">
</style>