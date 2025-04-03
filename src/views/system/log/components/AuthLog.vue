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
            <el-option :label="'登录日志'" :value="SysAuthLogType.LOGIN" />
            <el-option :label="'登出日志'" :value="SysAuthLogType.LOGOUT" />
          </el-select>
        </el-form-item>
        <el-form-item prop="loginIp" label="登录IP">
          <el-input
            v-model="queryParams.loginIp"
            placeholder="请输入登录IP"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="createTime" label="登录时间">
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
              v-if="scope.row.type === SysAuthLogType.LOGIN"
              type="success"
              >登录日志</el-tag
            >
            <el-tag
              v-else-if="scope.row.type === SysAuthLogType.LOGOUT"
              type="info"
              >登出日志</el-tag
            >
            <el-tag v-else type="warning">未知类型</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="登录IP" prop="loginIp" min-width="120" />
        <el-table-column label="浏览器" prop="browser" min-width="120" />
        <el-table-column
          label="浏览器版本"
          prop="browserVersion"
          min-width="120"
        />
        <el-table-column label="浏览器引擎" prop="engine" min-width="120" />
        <el-table-column
          label="引擎版本"
          prop="engineVersion"
          min-width="120"
        />
        <el-table-column label="操作系统" min-width="120">
          <template #default="scope">
            {{ scope.row.os }} {{ scope.row.osVersion }}
          </template>
        </el-table-column>
        <el-table-column
          label="耗时(ms)"
          prop="exeTime"
          min-width="100"
          align="center"
        />
        <el-table-column label="操作时间" prop="createTime" min-width="160" />
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.offset"
        v-model:limit="queryParams.limit"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { AuthLogAPI } from "@/api/log";
import {
  SysAuthLogType,
  AuthLogQueryRequest,
  AuthLogResponse,
} from "@/api/log/model";

defineOptions({
  name: "AuthLog",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const loading = ref(false);
const total = ref(0);
const dateRange = ref<[string, string]>();
const logList = ref<AuthLogResponse[]>([]);
const currentLog = reactive<AuthLogResponse>({});

const queryParams = reactive<AuthLogQueryRequest>({
  offset: 1,
  limit: 10,
});

const detailDialog = reactive({
  visible: false,
  title: "登录日志详情",
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

  AuthLogAPI.getAuthLogPage(queryParams)
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
  queryParams.beginCreateTime = undefined;
  queryParams.endCreateTime = undefined;
  handleQuery();
}

/** 页面初始化 */
onMounted(() => {
  handleQuery();
});
</script>

<style scope>
.search-form-inline .el-select {
  --el-select-width: 200px;
}
</style>
