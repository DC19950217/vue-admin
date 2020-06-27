<template>
  <div>
    <el-table
      :data="data.tableData"
      border
      style="width: 100%"
      @selection-change="thatSlectCheckbox"
    >
      <!-- 多选框 -->
      <el-table-column
        v-if="data.tableConfig.selection"
        type="selection"
        width="55"
      >
      </el-table-column>

      <template v-for="item in data.tableConfig.tHead">
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
    <div class="table-footer">
      <el-row>
        <el-col :span="4">
          <slot name="tobleFooterLeft"></slot>
        </el-col>
        <el-col :span="20">
          <el-pagination
            class="pull-right"
            v-if="data.tableConfig.paginationShow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageData.currentPage"
            :page-sizes="pageData.pageSizes"
            :page-size="pageData.pageSize"
            :layout="data.tableConfig.paginationLayout"
            :total="pageData.total"
            background
          >
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  reactive,
  ref,
  onMounted,
  watch,
  onBeforeMount
} from "@vue/composition-api";
import { loadData } from "./tableLoadData";
import { paginationHook } from "./paginationHook";
export default {
  name: "tableVue",
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    tableRow: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    const { tableData, tableLoadData } = loadData();
    const {
      pageData,
      handleSizeChange,
      handleCurrentChange,
      totalCount
    } = paginationHook();
    const data = reactive({
      tableConfig: {
        selection: true,
        recordCheckbox: false,
        requestData: {},
        tHead: [],
        paginationLayout: "total, sizes, prev, pager, next, jumper",
        paginationShow: true
      },
      tableData: []
    });
    const thatSlectCheckbox = val => {
      let rowData = {
        idItem: val.map(item => item.id)
      };
      emit("update:tableRow", rowData);
    };
    // 初始化table配置项，匹配相同的key，如果存在则替换
    let initTableConfig = () => {
      let configData = props.config;
      let keys = Object.keys(data.tableConfig);
      for (let key in configData) {
        if (keys.includes(key)) {
          data.tableConfig[key] = configData[key];
        }
      }
    };
    const refreshData = () => {
      tableLoadData(data.tableConfig.requestData);
    };
    /*  watch(
      () => tableData.item,
      (newValue, oldValue) => (data.tableData = newValue)
    ); */
    // 数据渲染
    watch(
      [() => tableData.item, () => tableData.total],
      ([tableData, total]) => {
        data.tableData = tableData;
        totalCount(total);
      }
    );
    watch(
      [() => pageData.currentPage, () => pageData.pageSize],
      ([currentPage, pageSize]) => {
        let requestData = data.tableConfig.requestData;
        if (requestData.data) {
          requestData.data.pageNumber = currentPage;
          requestData.data.pageSize = pageSize;
          tableLoadData(data.tableConfig.requestData);
        }
      }
    );
    onBeforeMount(() => {
      initTableConfig();
      tableLoadData(data.tableConfig.requestData);
    });
    return {
      data,
      thatSlectCheckbox,
      pageData,
      handleSizeChange,
      handleCurrentChange,
      totalCount,
      refreshData
    };
  }
};
</script>
<style lang="scss" scoped>
.table-footer {
  padding: 15px 0;
}
</style>