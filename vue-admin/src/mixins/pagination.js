const pagination = {
  data() {
    return {
      currentPage: 1,
      pageSize: 1,
      total: 0,
      pageSizes: [2, 20, 50, 100]
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    handleCurrentChange(val) {
      this.tableConfig.requestData.data.pageNumber = val
      this.getTableData()
    },
    handleSizeChange(val) {
      this.tableConfig.requestData.data.pageSize = val
      this.getTableData()
    }
  }
}
export default pagination