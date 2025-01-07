<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入部门名称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="handleQuery">
            <i-ep-search />
            搜索
          </el-button>
          <el-button @click="resetQuery"> <i-ep-refresh />重置 </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button
          type="success"
          @click="openDialog('0', undefined)"
          v-hasPerm="['ray:system:depts:create']"
          ><i-ep-plus />创建</el-button
        >
      </template>

      <el-table
        v-loading="loading"
        :data="deptList"
        row-key="code"
        default-expand-all
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="name" label="部门名称" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sequence" label="排序" width="100" />

        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="scope">
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="openDialog(scope.row.code, undefined)"
              v-hasPerm="['ray:system:depts:create']"
              ><i-ep-plus />新增
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="openDialog(scope.row.parentCode, scope.row.code)"
              v-hasPerm="['ray:system:depts:edit']"
              ><i-ep-edit />编辑
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="handleDelete(scope.row.code)"
              v-hasPerm="['ray:system:depts:delete']"
            >
              <i-ep-delete />删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="600px"
      @closed="closeDialog"
      :close-on-press-escape="false"
    >
      <el-form
        ref="deptFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="上级部门" prop="parentCode">
          <el-tree-select
            v-model="formData.parentCode"
            placeholder="选择上级部门"
            :data="deptOptions"
            filterable
            check-strictly
            :render-after-expand="false"
            :props="{ children: 'children', label: 'name', value: 'code' }"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="显示排序" prop="sequence">
          <el-input-number
            v-model="formData.sequence"
            controls-position="right"
            style="width: 100px"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="部门状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"> 确 定 </el-button>
          <el-button @click="closeDialog"> 取 消 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dept",
  inheritAttrs: false,
});

import DeptAPI from "@/api/dept";
import {
  DeptResponse,
  DeptFormRequest,
  DeptQueryRequest,
} from "@/api/dept/model";

const queryFormRef = ref(ElForm);
const deptFormRef = ref(ElForm);

const loading = ref(false);
const codes = ref<string[]>([]);
const dialog = reactive({
  title: "",
  visible: false,
});

const queryParams = reactive<DeptQueryRequest>({});
const deptList = ref<DeptResponse[]>();
const deptOptions = ref<OptionType[]>();
const formData = reactive<DeptFormRequest>({
  status: 1,
  sequence: 1,
});

const rules = reactive({
  parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
  name: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
  sequence: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  DeptAPI.getDeptTree(queryParams).then((result) => {
    deptList.value = result;
    loading.value = false;
  });
}

/**重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  codes.value = selection.map((item: any) => item.id);
}

/** 获取部门下拉数据  */
async function loadDeptOptions() {
  DeptAPI.getDeptTree().then((data) => {
    deptOptions.value = [
      {
        code: "0",
        name: "一级部门",
        children: data,
      },
    ];
  });
}

/**
 * 打开弹窗
 *
 * @param parentId 父部门ID
 * @param deptId 部门ID
 */
async function openDialog(parentCode?: string, code?: string) {
  await loadDeptOptions();
  dialog.visible = true;
  if (code) {
    dialog.title = "修改部门";
    DeptAPI.getDeptByCode(code).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增部门";
    formData.parentCode = parentCode ?? "0";
  }
}

/** 表单提交 */
function handleSubmit() {
  deptFormRef.value.validate((valid: any) => {
    if (valid) {
      const code = formData.code;
      loading.value = true;
      if (code) {
        DeptAPI.updateDept(code, formData)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        DeptAPI.createDept(formData)
          .then(() => {
            ElMessage.success("新增成功");
            closeDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 删除部门 */
function handleDelete(code?: string) {
  const deptIds = [code || codes.value].join(",");

  if (!deptIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm(`确认删除已选中的数据项?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    DeptAPI.deleteByIds(deptIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

/** 关闭弹窗 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/** 重置表单  */
function resetForm() {
  deptFormRef.value.resetFields();
  deptFormRef.value.clearValidate();

  formData.code = undefined;
  formData.parentCode = "0";
  formData.status = 1;
  formData.sequence = 1;
}

onMounted(() => {
  handleQuery();
});
</script>
