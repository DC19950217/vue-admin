import {
  GetCategory
} from "@/api/news";
import {
  reactive
} from "@vue/composition-api";
export function common() {
  const categoryItem = reactive({
    item: []
  });
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
  return {
    getInfoCategory,
    categoryItem
  }
}