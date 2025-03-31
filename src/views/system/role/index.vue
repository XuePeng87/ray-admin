<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="remark" label="角色描述">
          <el-input
            v-model="queryParams.remark"
            placeholder="请输入角色描述"
            clearable
            @keyup.enter="handleQuery"
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
      <template #header>
        <el-button type="success" @click="openDialog()"
          ><i-ep-plus />新增</el-button
        >
      </template>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="roleList"
        highlight-current-row
        border
      >
        <el-table-column label="角色名称" prop="name" min-width="100" />
        <el-table-column label="角色描述" prop="remark" width="200" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="排序"
          align="center"
          width="80"
          prop="sequence"
        />

        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="openMenuDialog(scope.row)"
            >
              <i-ep-position />分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              @click="openDialog(scope.row.code)"
            >
              <i-ep-edit />编辑
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              @click="handleDelete(scope.row.code)"
            >
              <i-ep-delete />删除
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

    <!-- 角色表单侧边栏 -->
    <el-drawer
      v-model="dialog.visible"
      :title="dialog.title"
      :size="500"
      direction="rtl"
      class="custom-drawer"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleDialogClose"
      :show-close="false"
    >
      <template #header="{ titleId, titleClass }">
        <div class="custom-drawer-header">
          <h4 :id="titleId" :class="titleClass">{{ dialog.title }}</h4>
          <el-button type="primary" link @click="handleDialogClose">
            <i-ep-close />
          </el-button>
        </div>
      </template>

      <el-form
        ref="roleFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色描述" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入角色描述" />
        </el-form-item>

        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sequence"
            controls-position="right"
            :min="0"
            style="width: 100px"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleDialogClose">取 消</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 分配菜单侧边栏  -->
    <el-drawer
      v-model="menuDialogVisible"
      :title="'【' + checkedRole.name + '】权限分配'"
      :size="800"
      direction="rtl"
      class="custom-drawer"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleMenuDialogClose"
      :show-close="false"
    >
      <template #header="{ titleId, titleClass }">
        <div class="custom-drawer-header">
          <h4 :id="titleId" :class="titleClass">
            {{ "【" + checkedRole.name + "】权限分配" }}
          </h4>
          <el-button type="primary" link @click="handleMenuDialogClose">
            <i-ep-close />
          </el-button>
        </div>
      </template>

      <el-scrollbar v-loading="loading" max-height="600px">
        <el-tree
          ref="menuRef"
          node-key="code"
          show-checkbox
          :data="menuList"
          :default-expand-all="true"
          :props="{ children: 'children', label: 'name' }"
        >
          <template #default="{ data }">
            {{ data.name }}
          </template>
        </el-tree>
      </el-scrollbar>

      <template #footer>
        <div class="drawer-footer">
          <el-button type="primary" @click="handleRoleMenuSubmit"
            >确 定</el-button
          >
          <el-button @click="handleMenuDialogClose">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import RoleAPI from "@/api/role";
import MenuAPI from "@/api/menu";

import {
  RoleResponse,
  RoleFormRequest,
  RoleQueryRequest,
} from "@/api/role/model";

defineOptions({
  name: "Role",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const roleFormRef = ref(ElForm);
const menuRef = ref(ElTree);

const loading = ref(false);
const total = ref(0);

const queryParams = reactive<RoleQueryRequest>({
  offset: 1,
  limit: 10,
});

const roleList = ref<RoleResponse[]>();

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<RoleFormRequest>({
  sequence: 1,
  status: 1,
  code: "",
  name: "",
});

const rules = reactive({
  remark: [{ required: true, message: "请输入角色描述", trigger: "blur" }],
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  //dataScope: [{ required: true, message: "请选择数据权限", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
});

const menuDialogVisible = ref(false);

const menuList = ref<OptionType[]>([]);

interface CheckedRole {
  code?: string;
  name?: string;
}
let checkedRole: CheckedRole = reactive({});

/** 查询 */
function handleQuery() {
  loading.value = true;
  RoleAPI.getRolePage(queryParams)
    .then((data) => {
      roleList.value = data.records;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}
/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.offset = 1;
  handleQuery();
}

/** 打开角色表单弹窗 */
function openDialog(code?: string) {
  dialog.visible = true;
  if (code) {
    dialog.title = "修改角色";
    RoleAPI.getRoleByCode(code).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增角色";
  }
}

/** 关闭角色表单侧边栏 */
function handleDialogClose() {
  ElMessageBox.confirm("确认关闭？未保存的数据将会丢失", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      closeDialog();
    })
    .catch(() => {});
}

/** 关闭菜单分配侧边栏 */
function handleMenuDialogClose() {
  ElMessageBox.confirm("确认关闭？未保存的数据将会丢失", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      menuDialogVisible.value = false;
    })
    .catch(() => {});
}

/** 角色保存提交 */
function handleSubmit() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const code = formData.code;
      if (code) {
        RoleAPI.updateRole(code, formData)
          .then(() => {
            ElMessage.success("修改成功");
            dialog.visible = false; // 添加此行
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        RoleAPI.createRole(formData)
          .then(() => {
            ElMessage.success("新增成功");
            dialog.visible = false; // 添加此行
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭表单弹窗 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/** 重置表单 */
function resetForm() {
  roleFormRef.value.resetFields();
  roleFormRef.value.clearValidate();

  formData.code = undefined;
  formData.sequence = 1;
  formData.status = 1;
}

/** 删除角色 */
function handleDelete(code: string) {
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    RoleAPI.deleteRoleByCode(code)
      .then(() => {
        ElMessage.success("删除成功");
        resetQuery();
      })
      .finally(() => (loading.value = false));
  });
}

/** 打开分配菜单弹窗 */
async function openMenuDialog(row: RoleResponse) {
  const code = row.code;
  if (code) {
    checkedRole = {
      code: row.code,
      name: row.name,
    };
    menuDialogVisible.value = true;
    loading.value = true;
    // 获取所有的菜单
    menuList.value = await MenuAPI.getFuncTree();
    // 回显角色已拥有的菜单
    RoleAPI.findFuncByCode(code)
      .then((data) => {
        const checkedMenuIds = data;
        checkedMenuIds.forEach((funcCode) =>
          menuRef.value.setChecked(funcCode, true, false)
        );
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

/** 角色分配菜单保存提交 */
function handleRoleMenuSubmit() {
  const code = checkedRole.code;
  if (code) {
    const checkedMenuCodes: string[] = menuRef.value
      .getCheckedNodes(false, true)
      .map((node: any) => node.code);
    RoleAPI.saveFuncToRole(code, checkedMenuCodes)
      .then(() => {
        ElMessage.success("分配权限成功");
        menuDialogVisible.value = false; // 确保此行存在
        resetQuery();
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

onMounted(() => {
  handleQuery();
});
</script>
