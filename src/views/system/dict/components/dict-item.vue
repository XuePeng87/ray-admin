<!-- 字典项数据 -->
<template>
  <div class="app-container">
    <div class="search-container">
      <!-- 搜索表单 -->
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="字典项名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入字典项名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"
            ><i-ep-search />搜索</el-button
          >
          <el-button @click="resetQuery"> <i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <template #header>
        <el-button type="success" @click="openDialog()"
          ><i-ep-plus />新增</el-button
        >
        <el-button
          type="danger"
          :disabled="codes.length === 0"
          @click="handleDelete()"
          ><i-ep-delete />删除</el-button
        >
      </template>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="dictList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column label="字典项名称" prop="name" />
        <el-table-column label="字典项值" prop="value" />
        <el-table-column label="顺序" prop="sequence" align="center" />
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="openDialog(scope.row.code)"
              ><i-ep-edit />编辑</el-button
            >
            <el-button
              type="primary"
              link
              @click.stop="handleDelete(scope.row.code)"
              ><i-ep-delete />删除</el-button
            >
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

    <!-- 表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="closeDialog"
      :close-on-press-escape="false"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="字典项名称">{{ dictName }}</el-form-item>
        <el-form-item label="字典项名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入字典项名称" />
        </el-form-item>
        <el-form-item label="字典项值" prop="value">
          <el-input v-model="formData.value" placeholder="字典项值" />
        </el-form-item>
        <el-form-item label="排序" prop="sequence">
          <el-input-number
            v-model="formData.sequence"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "DictData",
  inheritAttrs: false,
});

import DictAPI from "@/api/dict";
import {
  DictItemQueryRequest,
  DictItemResponse,
  DictItemFormRequest,
} from "@/api/dict/model";

const props = defineProps({
  dictName: {
    type: String,
    default: () => {
      return "";
    },
  },
  dictValue: {
    type: String,
    default: () => {
      return "";
    },
  },
});

watch(
  () => props.dictValue,
  (newVal: string) => {
    queryParams.dictValue = newVal;
    formData.dictValue = newVal;
    resetQuery();
  }
);

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const codes = ref<string[]>([]);
const total = ref(0);

const queryParams = reactive<DictItemQueryRequest>({
  offset: 1,
  limit: 10,
  sort: "sequence",
  order: "asc",
  dictValue: props.dictValue,
});

const dictList = ref<DictItemResponse[]>();

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<DictItemFormRequest>({
  status: 1,
  dictValue: props.dictValue,
  sequence: 1,
});

const rules = reactive({
  name: [{ required: true, message: "请输入字典项名称", trigger: "blur" }],
  value: [{ required: true, message: "请输入字典项值", trigger: "blur" }],
  sequence: [{ required: true, message: "请输入排序值", trigger: "blur" }],
});

function handleQuery() {
  if (queryParams.dictValue) {
    loading.value = true;
    DictAPI.getDictItemPage(queryParams)
      .then((data) => {
        dictList.value = data.records;
        total.value = data.total;
      })
      .finally(() => (loading.value = false));
  }
}

function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.offset = 1;
  handleQuery();
}

function handleSelectionChange(selection: any) {
  codes.value = selection.map((item: any) => item.id);
}

function openDialog(code?: string) {
  dialog.visible = true;
  if (code) {
    dialog.title = "修改字典项";
    DictAPI.getDictItemByCode(code).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增字典项";
  }
}

function handleSubmit() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      loading.value = false;
      const dictItemCode = formData.code;
      if (dictItemCode) {
        DictAPI.updateDictItem(dictItemCode, formData)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        DictAPI.createDictItem(formData)
          .then(() => {
            ElMessage.success("新增成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

function closeDialog() {
  dialog.visible = false;
  resetForm();
}

function resetForm() {
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();

  formData.code = undefined;
  formData.status = 1;
  formData.sequence = 1;
  formData.dictValue = props.dictValue;
}

function handleDelete(dictItemCode?: string) {
  const dictItemCodes: string[] = dictItemCode ? [dictItemCode] : codes.value;
  if (!dictItemCodes) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    DictAPI.deleteDictItemByCodes(dictItemCodes).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>
