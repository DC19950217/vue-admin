import {
  requestUrl
} from "@/api/requestUrl";
import {
  loadTableData
} from "@/api/common";
const tableLoadData = {
  data() {

  },
  created() {

  },
  mounted() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      let requestJson = this.tableConfig.requestData;
      let requestData = {
        url: requestUrl[requestJson.url],
        method: requestJson.method,
        data: requestJson.data
      };
      loadTableData(requestData)
        .then(response => {
          let result = response.data.data.data;
          if (result && result.length > 0) {
            this.tableData = result
            this.total = response.data.data.total
          }
        })
        .catch(error => {});
    }
  }
}
export default tableLoadData