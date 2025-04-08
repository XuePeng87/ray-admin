<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="type" label="日志类型" class="search-form-inline">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择日志类型"
            clearable
          >
            <el-option :label="'登录日志'" :value="SysOperateLogType.ACCESS" />
            <el-option :label="'登出日志'" :value="SysOperateLogType.ERROR" />
          </el-select>
        </el-form-item>
        <el-form-item prop="module" label="模块名称">
          <el-input
            v-model="queryParams.module"
            placeholder="请输入模块名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="func" label="功能名称">
          <el-input
            v-model="queryParams.func"
            placeholder="请输入功能名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="ip" label="IP地址">
          <el-input
            v-model="queryParams.ip"
            placeholder="请输入IP地址"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="createTime" label="操作时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"
            ><i-ep-search />搜索</el-button
          >
          <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <el-table ref="dataTableRef" v-loading="loading" :data="logList">
        <el-table-column label="日志类型" align="center" width="100">
          <template #default="scope">
            <el-tag
              v-if="scope.row.type === SysOperateLogType.ACCESS"
              type="success"
              >操作日志</el-tag
            >
            <el-tag
              v-else-if="scope.row.type === SysOperateLogType.ERROR"
              type="info"
              >错误日志</el-tag
            >
            <el-tag v-else type="warning">未知类型</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="手机号"
          prop="phoneNumber"
          min-width="120"
          align="center"
        />
        <el-table-column label="模块名称" prop="module" min-width="120" />
        <el-table-column label="功能名称" prop="func" min-width="120" />
        <el-table-column label="操作" prop="action" min-width="120" />
        <el-table-column label="IP地址" prop="ip" min-width="120" />
        <el-table-column label="浏览器" prop="browser" min-width="120" />
        <el-table-column
          label="耗时(ms)"
          prop="exeTime"
          min-width="100"
          align="center"
          sortable
        />
        <el-table-column label="操作时间" prop="createTime" min-width="160" />
        <el-table-column label="操作" min-width="80" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              icon="view"
              link
              @click="handleDetail(scope.row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.offset"
        v-model:limit="queryParams.limit"
        @pagination="handleQuery"
      />
    </el-card>

    <!-- 详情侧边栏 -->
    <el-drawer
      v-model="detailDrawer.visible"
      :title="detailDrawer.title"
      size="500px"
      direction="rtl"
    >
      <div v-if="detailData && Object.keys(detailData).length > 0">
        <el-collapse v-model="activeCollapse" accordion>
          <el-collapse-item title="请求路径参数" name="param">
            <pre v-if="detailData.param">{{ detailData.param }}</pre>
            <el-empty v-else description="暂无数据" />
          </el-collapse-item>
          <el-collapse-item title="请求方法参数" name="args">
            <pre v-if="detailData.args">{{ detailData.args }}</pre>
            <el-empty v-else description="暂无数据" />
          </el-collapse-item>
          <el-collapse-item title="返回值" name="result">
            <pre v-if="detailData.result">{{ detailData.result }}</pre>
            <el-empty v-else description="暂无数据" />
          </el-collapse-item>
          <el-collapse-item title="错误信息" name="error">
            <pre v-if="detailData.error">{{ detailData.error }}</pre>
            <el-empty v-else description="暂无数据" />
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-empty v-else description="暂无详情数据" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElForm } from "element-plus";
import { OperationLogAPI } from "@/api/log";
import {
  OperateLogQueryRequest,
  OperateLogResponse,
  OperateLogDetailResponse,
  SysOperateLogType,
} from "@/api/log/model";

defineOptions({
  name: "OperateLog",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const loading = ref(false);
const total = ref(0);
const dateRange = ref<[string, string]>();
const logList = ref<OperateLogResponse[]>([]);
const currentLog = reactive<OperateLogResponse>({});
const detailData = ref<OperateLogDetailResponse>({});
const activeCollapse = ref("param"); // 默认打开第一项

const queryParams = reactive<OperateLogQueryRequest>({
  offset: 1,
  limit: 10,
});

const detailDrawer = reactive({
  visible: false,
  title: "操作日志详情",
});

/** 查询日志列表 */
function handleQuery() {
  loading.value = true;

  // 处理日期范围
  if (dateRange.value && dateRange.value.length === 2) {
    queryParams.beginCreateTime = dateRange.value[0];
    queryParams.endCreateTime = dateRange.value[1];
  } else {
    queryParams.beginCreateTime = undefined;
    queryParams.endCreateTime = undefined;
  }

  OperationLogAPI.getOperateLogPage(queryParams)
    .then((data) => {
      logList.value = data.records;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  dateRange.value = undefined;
  queryParams.offset = 1;
  queryParams.type = undefined;
  queryParams.beginCreateTime = undefined;
  queryParams.endCreateTime = undefined;
  handleQuery();
}

/** 查看详情 */
function handleDetail(row: OperateLogResponse) {
  loading.value = true;

  OperationLogAPI.getOperateLogDetail(row.id!)
    .then((data) => {
      Object.assign(currentLog, row);
      detailData.value = data || {};
      detailDrawer.visible = true;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 页面初始化 */
onMounted(() => {
  handleQuery();
});
</script>

<style scoped>
.search-form-inline .el-select {
  --el-select-width: 200px;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: 500;
}

pre {
  max-height: 300px;
  padding: 10px;
  overflow: auto;
  word-wrap: break-word;
  white-space: pre-wrap;
  background-color: #f8f8f8;
  border-radius: 4px;
}
</style>
