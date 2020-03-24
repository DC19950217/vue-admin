<template>
  <div id="category">
    <el-button type="danger" @click="addFirst({ type: 'category_first_add' })"
      >添加一级分类</el-button
    >
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
              <!-- 一级分类 -->
              <h4>
                <svg-icon icon-class="plus"></svg-icon>
                {{ firstItem.category_name }}
                <div class="button-group">
                  <el-button
                    size="mini"
                    type="danger"
                    round
                    @click="
                      editCategory({
                        data: firstItem,
                        type: 'category_first_edit'
                      })
                    "
                    >编辑</el-button
                  >
                  <el-button size="mini" type="success" round
                    >添加子级</el-button
                  >
                  <el-button
                    size="mini"
                    round
                    @click="deleteCategoryComfirm(firstItem.id)"
                    >删除</el-button
                  >
                </div>
              </h4>
              <!-- 子级分类 -->
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
          <h4 class="menu-title">一级分类编辑</h4>
          <el-form label-width="142px" class="form-wrap" ref="categoryForm">
            <el-form-item label="一级分类名称:" v-if="category_first_input">
              <el-input
                v-model="form.categoryName"
                :disabled="category_first_disabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称:" v-if="category_children_input">
              <el-input
                v-model="form.secCategoryName"
                :disabled="category_children_disabled"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                @click="submit"
                :loading="submit_button_loading"
                :disabled="submit_button_disabled"
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
import {
  AddFirstCategory,
  GetCategory,
  DeleteCategory,
  EditCategory
} from "@/api/news";
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
import { global } from "@/utils/global_V3.0.js";
import { common } from "@/api/common";
export default {
  name: "category",
  setup(props, { root, refs }) {
    const { getInfoCategory, categoryItem } = common();
    const { confirm } = global();
    // ref
    const category_first_input = ref(true);
    const category_children_input = ref(true);
    const submit_button_loading = ref(false);
    const category_first_disabled = ref(true);
    const category_children_disabled = ref(true);
    const submit_button_disabled = ref(true);
    const deleteId = ref("");
    const submit_button_type = ref("");
    // reactive
    const form = reactive({
      categoryName: "",
      secCategoryName: ""
    });
    const category = reactive({
      item: [],
      current: []
    });
    // methods vue2.0
    // 添加一级分类
    const submit = () => {
      if (submit_button_type.value == "category_first_add") {
        addFirstCategory();
      }
      if (submit_button_type.value == "category_first_edit") {
        editFirstCategory();
      }
    };
    const addFirstCategory = () => {
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
    const addFirst = params => {
      submit_button_type.value = params.type;
      console.log(submit_button_type.value);
      category_first_input.value = true;
      // 隐藏子级输入框;
      hideChildrenInput(false);
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
      resetFields(false);
    };
    // 获取一级分类资源(被优化)
   /*  const getCategory = () => {
      GetCategory({})
        .then(response => {
          let data = response.data.data.data;
          category.item = data;
        })
        .catch(error => {
          console.log(error);
        });
    }; */
    // 删除一级分类
    const deleteCategoryComfirm = categoryId => {
      deleteId.value = categoryId;
      confirm({
        content: "确定删除当前分类，确认后将无法恢复！！",
        tip: "警告",
        fn: deleteCategory,
        catchFn: () => {
          deleteId.value = "";
        }
      });
    };
    // 删除分类封装函数
    const deleteCategory = () => {
      DeleteCategory({ categoryId: deleteId.value })
        .then(response => {
          let data = response.data;
          console.log(data);
          if (data.resCode === 0) {
            // 第一种更新页面方法
            // 使用es6的findIndex找到这个id所在数组的下标
            /*  let index = category.item.findIndex(
              item => item.id == deleteId.value
            );
            // 删除数组指定元素
            category.item.splice(index, 1); */
            // 第二种更新页面方法
            // 使用es6的filter方法直接对比看数组里面的id和删除之后的有什么不同，如果对比的id不等于数组里面任意id就返回一个新的数组数据更新渲染到页面
            let newData = category.item.filter(
              item => item.id != deleteId.value
            );
            category.item = newData;
            root.$message({
              type: "success",
              message: data.message
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    };
    // 编辑分类
    const editCategory = params => {
      submit_button_type.value = params.type;
      console.log(submit_button_type.value);
      // 隐藏子级输入框
      hideChildrenInput(false);
      category_first_disabled.value = false;
      category_children_disabled.value = false;
      submit_button_disabled.value = false;
      form.categoryName = params.data.category_name;
      category.current = params.data;
    };
    const editFirstCategory = () => {
      if (category.current.length == 0) {
        root.$message({
          message: "未选择分类！！",
          type: "error"
        });
        return false;
      }
      let requestData = {
        id: category.current.id,
        categoryName: form.categoryName
      };
      EditCategory(requestData)
        .then(response => {
          let resdata = response.data;
          root.$message({
            message: resdata.message,
            type: "success"
          });
          category.current.category_name = resdata.data.data.categoryName;
          // let data = category.item.filter(
          //   item => item.id == category.current.id
          // );
          // data[0].category_name = resdata.data.data.categoryName;
          resetFields(false);
          category.current = [];
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
    // 隐藏子级输入框
    const hideChildrenInput = flag => {
      category_children_input.value = flag;
    };
    // 生命周期
    // 挂载完成时执行，（页面DOM元素完成时，实际完成）
    onMounted(() => {
      // getCategory();
      // 获取一级分类数据(vue3.0优化)
      // getInfoCategory();
      // vuex
      root.$store.dispatch('common/getInfoCategory').then(res=>{
        category.item = res;
      })
    });
    // 监听获取一级分类数据的变化
   /*  watch(
      () => categoryItem.item,
      value => {
        category.item = value;
      }
    ); */
    return {
      // ref
      category_first_input,
      category_children_input,
      submit_button_loading,
      category_first_disabled,
      category_children_disabled,
      submit_button_disabled,
      // reactive
      form,
      category,
      // methods
      submit,
      addFirst,
      deleteCategoryComfirm,
      editCategory
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
