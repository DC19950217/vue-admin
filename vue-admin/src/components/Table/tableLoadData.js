import {
  reactive
} from "@vue/composition-api";
import {
  requestUrl
} from "@/api/requestUrl";
import {
  loadTableData
} from "@/api/common";
export function loadData() {
  const tableData = reactive({
    item: []
  })
  const tableLoadData = (params) => {
    let requestJson = params;
    let requestData = {
      url: requestUrl[requestJson.url],
      method: requestJson.method,
      data: requestJson.data
    };
    loadTableData(requestData)
      .then(response => {
        let result = response.data.data.data;
        if (result && result.length > 0) {
          tableData.item = result;
        }
      })
      .catch(error => {});
  }
  return {
    tableData,
    tableLoadData
  }
}