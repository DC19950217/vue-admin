<template>
  <div>
    <LayoutHeader />
    <LayoutMain />
    <LayoutNav />
  </div>
</template>
<script>
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import LayoutHeader from "./Components/Header";
import LayoutNav from "./Components/Nav";
import LayoutMain from "./Components/Main";
export default {
  name: "layout",
  components: {
    LayoutHeader,
    LayoutNav,
    LayoutMain
  },
  setup(props) {}
};
</script>
<style lang="scss" scoped>
</style>