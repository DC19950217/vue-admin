<template>
  <div id="category">
    <el-button type="danger" @click="addFirst">添加一级分类</el-button>
    <hr class="hr-e9e9e9" />
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category-wrap">
            <div
              class="category"
              v-for="firstItem in category.item"
              :key="firstItem.id"
            >
              <h4>
                <svg-icon icon-class="plus"></svg-icon>
                {{ firstItem.category_name }}
                <div class="button-group">
                  <el-button size="mini" type="danger" round>编辑</el-button>
                  <el-button size="mini" type="success" round
                    >添加子级</el-button
                  >
                  <el-button size="mini" round>删除</el-button>
                </div>
              </h4>
              <ul v-if="firstItem.children">
                <li
                  v-for="childrenItem in firstItem.children"
                  :key="childrenItem.id"
                >
                  {{ childrenItem.category_name }}
                  <div class="button-group">
                    <el-button size="mini" type="danger" round>编辑</el-button>
                    <el-button size="mini" round>删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <h4 class="menu-title">一级分类名称</h4>
          <el-form label-width="142px" class="form-wrap" ref="categoryForm">
            <el-form-item label="一级分类名称:" v-if="category_first_input">
              <el-input v-model="form.categoryName"></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称:" v-if="category_children_input">
              <el-input v-model="form.secCategoryName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                @click="submit"
                :loading="submit_button_loading"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { AddFirstCategory, GetCategory } from "@/api/news";
import { reactive, ref, onMounted } from "@vue/composition-api";
export default {
  name: "category",
  setup(props, { root, refs }) {
    // ref
    const category_first_input = ref(true);
    const category_children_input = ref(true);
    const submit_button_loading = ref(false);
    // reactive
    const form = reactive({
      categoryName: "",
      secCategoryName: ""
    });
    const category = reactive({
      item: []
    });
    // methods vue2.0
    // 添加一级分类
    const submit = () => {
      if (!form.categoryName) {
        root.$message({
          type: "error",
          message: "分类名称不能为空！！"
        });
        return false;
      }
      // 按钮加载状态
      // submit_button_loading.value = true;
      bottonLoading(true);
      // 添加一级分类
      AddFirstCategory({ categoryName: form.categoryName })
        .then(response => {
          let data = response.data;
          if (data.resCode === 0) {
            root.$message({
              type: "success",
              message: data.message
            });
            category.item.push(response.data.data);
          }
          // 按钮加载状态
          // submit_button_loading.value = false;
          // 清空form表单
          resetFields(false);
        })
        .catch(error => {
          // 按钮加载状态
          // submit_button_loading.value = true;
          resetFields(true);
          console.log(error);
        });
    };
    // 隐藏二级分类添加框
    const addFirst = () => {
      category_first_input.value = true;
      category_children_input.value = false;
    };
    // 获取一级分类资源
    const getCategory = () => {
      GetCategory({})
        .then(response => {
          let data = response.data.data.data;
          category.item = data;
        })
        .catch(error => {
          console.log(error);
        });
    };
    // 封装清除form表单
    const resetFields = flag => {
      bottonLoading(flag);
      form.categoryName = "";
      form.secCategoryName = "";
    };
    // 禁用按钮状态
    const bottonLoading = flag => {
      submit_button_loading.value = flag;
    };
    // 生命周期
    // 挂载完成时执行，（页面DOM元素完成时，实际完成）
    onMounted(() => {
      getCategory();
    });
    return {
      // ref
      category_first_input,
      category_children_input,
      submit_button_loading,
      // reactive
      form,
      category,
      // methods
      submit,
      addFirst
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles//config.scss";
.category-wrap {
  div:first-child {
    &::before {
      top: 20px;
    }
  }
  div:last-child {
    &::before {
      bottom: 21px;
    }
  }
}
.menu-title {
  line-height: 44px;
  padding-left: 22px;
  background-color: #f3f3f3;
}
.category {
  position: relative;
  line-height: 44px;
  cursor: pointer;
  &::before {
    content: "";
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    width: 32px;
    border-left: 1px dotted #000;
  }
  h4 {
    position: relative;
    padding-left: 40px;
  }
  svg {
    position: absolute;
    left: 14px;
    top: 15px;
    background-color: #fff;
    font-size: 17px;
  }
  li {
    position: relative;
    padding-left: 36px;
    margin-left: 24px;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 22px;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    @include webkit(transition, all 0.5s ease 0s);
    &:hover {
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
}
.button-group {
  display: none;
  position: absolute;
  right: 11px;
  top: 0;
  button {
    font-size: 12px;
  }
}
.form-wrap {
  width: 410px;
  padding-top: 26px;
}
.hr-e9e9e9 {
  width: calc(100%+60px);
  margin: 30px -30px 30px -30px;
  border: 0;
  border-bottom: 1px solid #e9e9e9;
}
</style>
