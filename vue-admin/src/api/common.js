import {
  GetCategory,
  GetCategoryAll
} from "@/api/news";
import {
  reactive
} from "@vue/composition-api";
export function common() {
  const categoryItem = reactive({
    item: []
  });
  // 获取分类
  const getInfoCategory = () => {
    GetCategory({})
      .then(response => {
        let data = response.data.data.data;
        categoryItem.item = data;
      })
      .catch(error => {
        console.log(error);
      });
  };
  // 获取所有分类（包含子级）
  const getInfoCategoryAll = () => {
    GetCategoryAll({})
      .then(response => {
        let data = response.data.data.data;
        categoryItem.item = data;
      })
      .catch(error => {
        console.log(error);
      });
  };
  return {
    getInfoCategory,
    getInfoCategoryAll,
    categoryItem
  }
}