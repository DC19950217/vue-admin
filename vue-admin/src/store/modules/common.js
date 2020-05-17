import {
  GetCategory,
  GetCategoryAll
} from "@/api/news";
const actions = {
  getInfoCategory(commit, repuestData) {
    return new Promise((resolve, reject) => {
      GetCategory({}).then(response => {
        resolve(response.data.data.data);
      }).catch(error => {
        reject(error)
      })
    })
  },
  getInfoCategoryAll(commit, repuestData) {
    return new Promise((resolve, reject) => {
      GetCategoryAll({}).then(response => {
        resolve(response.data.data);
      }).catch(error => {
        reject(error)
      })
    })
  }
}
export default {
  namespaced: true,
  actions
}