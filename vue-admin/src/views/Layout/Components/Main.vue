<template>
  <div id="main-wrap">
    <div class="main-content">
      <div class="content"><router-view /></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Main"
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#main-wrap {
  height: 100vh;
  /*   position: fixed;
  top: 75px;
  left: $navMenu;
  right: 0;
  bottom: 0;
  border: 30px solid #f7f7f7;
  border-bottom: none;
  -webkit-box-sizing: border; */
}
.main-content {
  width: 100%;
  height: 100%;
  // padding: $layoutHeader + 30 30px 0 $navMenu + 30;
  padding-top: $layoutHeader + 30;
  padding-right: 30px;
  // -webkit-box-sizing: border-box;
  // box-sizing: border-box;
  background-color: #f7f7f7;
  @include webkit(box-sizing, border-box);
  @include webkit(transition, all 0.3s ease 0s);
}
.open {
  .main-content {
    padding-left: $navMenu + 30;
  }
}
.close {
  .main-content {
    padding-left: $navMenuMin + 30;
  }
}
.content {
  width: 100%;
  height: 100%;
  padding: 30px 30px 0 30px;
  @include webkit(box-sizing, border-box);
  background-color: #fff;
}
</style>