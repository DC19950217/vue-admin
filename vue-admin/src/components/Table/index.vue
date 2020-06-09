<template>
  <el-table
    :data="data.tableData"
    border
    style="width: 100%"
    @selection-change="handleSelectionChange"
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
</template>
<script>
import {
  reactive,
  ref,
  onMounted,
  watch,
  onBeforeMount
} from "@vue/composition-api";
import { requestUrl } from "@/api/requestUrl";
import { loadTableData } from "@/api/common";
export default {
  name: "tableVue",
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root }) {
    const data = reactive({
      tableConfig: {
        selection: true,
        recordCheckbox: false,
        requestData: {},
        tHead: []
      },
      tableData: [
        {
          email: "15218298951@163.com",
          name: "王小虎",
          phone: "13358957147",
          address: "上海市普陀区金沙江路 1518 弄",
          role: "超管"
        },
        {
          email: "15218298951@163.com",
          name: "王小虎",
          phone: "13358957147",
          address: "上海市普陀区金沙江路 1518 弄",
          role: "超管"
        }
      ]
    });
    let handleSelectionChange = () => {};
    let loadData = () => {
      let requestJson = data.tableConfig.requestData;
      let requestData = {
        url: requestUrl[requestJson.url],
        method: requestJson.method,
        data: requestJson.data
      };
      loadTableData(requestData)
        .then(response => {
          let result = response.data.data.data;
          if (result && result.length > 0) {
            data.tableData = result;
          }
        })
        .catch(error => {});
    };
    let initTableConfig = () => {
      let configData = props.config;
      let keys = Object.keys(data.tableConfig);
      for (let key in configData) {
        if (keys.includes(key)) {
          data.tableConfig[key] = configData[key];
        }
      }
    };
    onBeforeMount(() => {
      initTableConfig();
      loadData();
    });
    return {
      data,
      handleSelectionChange
    };
  }
};
</script>