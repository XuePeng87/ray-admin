<template>
  <div class="app-container">
    <el-card shadow="never" class="tab-container">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane name="auth" label="登录日志">
          <auth-log />
        </el-tab-pane>
        <el-tab-pane name="operate" label="操作日志">
          <operate-log />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";

// 使用defineAsyncComponent异步导入组件
const AuthLog = defineAsyncComponent(() => import("./components/AuthLog.vue"));
const OperateLog = defineAsyncComponent(
  () => import("./components/OperateLog.vue")
);

defineOptions({
  name: "SystemLog",
  inheritAttrs: false,
});

// 当前激活的选项卡
const activeTab = ref("auth");
</script>

<style scoped>
.tab-container {
  margin-bottom: 20px;
}

.tab-container :deep(.el-tabs__content) {
  padding: 0;
}

/* 覆盖全局样式 */
:deep(.search-container) {
  padding: 18px 0 0 10px;
  margin-bottom: 10px;
  background-color: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
}

:deep(.table-container) {
  margin-top: 10px;
}
</style>
