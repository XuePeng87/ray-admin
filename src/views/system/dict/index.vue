<!--字典类型-->

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="字典名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="字典名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()"
            ><i-ep-search />搜索</el-button
          >
          <el-button @click="resetQuery()"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button type="success" @click="openDialog()"
          ><i-ep-plus />创建</el-button
        >
        <el-button
          type="danger"
          :disabled="codes.length === 0"
          @click="handleDelete()"
          ><i-ep-delete />删除</el-button
        >
      </template>
      <el-table
        v-loading="loading"
        highlight-current-row
        :data="dictList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="字典名称" prop="name" width="200" />
        <el-table-column label="字典编码" prop="value" width="200" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="info">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center" />
        <el-table-column fixed="right" label="操作" align="center" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="openDictDialog(scope.row)"
              ><i-ep-Collection />字典项</el-button
            >
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="openDialog(scope.row.code)"
              ><i-ep-edit />编辑</el-button
            >
            <el-button
              type="primary"
              link
              size="small"
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

    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="closeDialog"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典编码" prop="value">
          <el-input v-model="formData.value" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            placeholder="字典类型备注"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!--字典数据弹窗-->
    <el-dialog
      v-model="dictDataDialog.visible"
      :title="dictDataDialog.title"
      width="1000px"
      @close="closeDictDialog"
    >
      <dict-item
        v-model:dictName="selectedDict.name"
        v-model:dictValue="selectedDict.value"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dict",
  inheritAttrs: false,
});

import DictAPI from "@/api/dict";

import { DictQueryRequest, DictResponse, DictRequest } from "@/api/dict/model";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const codes = ref<string[]>([]);
const total = ref(0);

const queryParams = reactive<DictQueryRequest>({
  offset: 1,
  limit: 10,
  sort: "createTime",
  order: "desc",
});

const dictList = ref<DictResponse[]>();

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<DictRequest>({
  status: 1,
});

const rules = reactive({
  name: [{ required: true, message: "请输入字典类型名称", trigger: "blur" }],
  value: [{ required: true, message: "请输入字典类型编码", trigger: "blur" }],
});

function handleQuery() {
  loading.value = true;
  DictAPI.getDictPage(queryParams)
    .then((data) => {
      dictList.value = data.records;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.offset = 1;
  handleQuery();
}

function handleSelectionChange(selection: any) {
  codes.value = selection.map((item: any) => item.code);
}

function openDialog(code?: string) {
  dialog.visible = true;
  if (code) {
    dialog.title = "修改字典";
    DictAPI.getDictByCode(code).then((data) => {
      console.info(data);
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "创建字典";
  }
}

function handleSubmit() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      loading.value = false;
      const dictCode = formData.code;
      if (dictCode) {
        DictAPI.updateDict(dictCode, formData)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        DictAPI.createDict(formData)
          .then(() => {
            ElMessage.success("创建成功");
            closeDialog();
            handleQuery();
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
}

function handleDelete(dictCode?: string) {
  const dictCodes: string[] = dictCode ? [dictCode] : codes.value;
  if (!dictCodes) {
    ElMessage.warning("请勾选删除项");
    return;
  }
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    DictAPI.deleteDictByCodes(dictCodes).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

const dictDataDialog = reactive({
  title: "",
  visible: false,
});

const selectedDict = reactive({ name: "", value: "" }); // 当前选中的字典类型

/** 打开字典数据弹窗 */
function openDictDialog(row: DictResponse) {
  dictDataDialog.visible = true;
  dictDataDialog.title = "【" + row.name + "】字典数据";

  selectedDict.name = row.name;
  selectedDict.value = row.value;
}

/**  关闭字典数据弹窗 */
function closeDictDialog() {
  dictDataDialog.visible = false;
}

onMounted(() => {
  handleQuery();
});
</script>
