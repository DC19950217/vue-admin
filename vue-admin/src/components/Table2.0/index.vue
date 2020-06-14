<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- 多选框 -->
      <el-table-column v-if="tableConfig.selection" type="selection" width="55">
      </el-table-column>

      <template v-for="item in tableConfig.tHead">
        <el-table-column
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
          v-if="item.columnType === 'slot'"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <!-- 文本数据渲染 -->
        <el-table-column
          v-else
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
        >
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="tableConfig.paginationShow"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="tableConfig.paginationLayout"
      :total="total"
      background
    >
    </el-pagination>
  </div>
</template>
<script>
import tableLoadData from "@/mixins/tableLoadData";
import pagination from "@/mixins/pagination";
export default {
  name: "tableVue",
  mixins: [tableLoadData, pagination],
  data() {
    return {
      tableConfig: {
        selection: true,
        recordCheckbox: false,
        requestData: {},
        tHead: [],
        paginationLayout: "total, sizes, prev, pager, next, jumper",
        paginationShow: true
      },
      tableData: []
    };
  },
  methods: {
    initTableConfig() {
      let configData = this.config;
      let keys = Object.keys(this.tableConfig);
      for (let key in configData) {
        if (keys.includes(key)) {
          this.tableConfig[key] = configData[key];
        }
      }
    },
    handleSelectionChange() {},
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  beforeMount() {
    this.initTableConfig();
  },
  mounted() {}
};
</script>