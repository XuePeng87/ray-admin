<!-- 用户管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门树 -->
      <el-col :lg="4" :xs="24" class="mb-[12px]">
        <dept-tree v-model="queryParams.deptCode" @node-click="handleQuery" />
      </el-col>

      <!-- 用户列表 -->
      <el-col :lg="20" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户名" prop="name">
              <el-input
                v-model="queryParams.name"
                placeholder="用户名"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="创建时间">
              <el-date-picker
                class="!w-[240px]"
                v-model="dateTimeRange"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="截止时间"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleQuery"
                ><i-ep-search />搜索</el-button
              >
              <el-button @click="resetQuery">
                <i-ep-refresh />
                重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never" class="table-container">
          <template #header>
            <div class="flex justify-between">
              <div>
                <el-button
                  type="success"
                  @click="openDialog()"
                  v-hasPerm="['ray:system:users:create']"
                  ><i-ep-plus />新增</el-button
                >
              </div>
            </div>
          </template>

          <el-table v-loading="loading" :data="pageData">
            <el-table-column
              key="username"
              label="用户名"
              align="left"
              prop="name"
            />
            <el-table-column
              label="电话"
              width="180"
              align="left"
              prop="phoneNumber"
            />

            <el-table-column
              label="邮箱"
              width="220"
              align="left"
              prop="email"
            />
            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">{{
                  scope.row.status == 1 ? "启用" : "禁用"
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="left"
              prop="createTime"
              width="180"
            />
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  link
                  @click="resetPassword(scope.row)"
                  v-hasPerm="['ray:system:users:reset']"
                  ><i-ep-refresh-left />重置密码</el-button
                >
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="openDialog(scope.row.code)"
                  v-hasPerm="['ray:system:users:edit']"
                  ><i-ep-edit />编辑</el-button
                >
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="handleDelete(scope.row.code)"
                  v-hasPerm="['ray:system:users:delete']"
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
      </el-col>
    </el-row>

    <!-- 弹窗 -->
    <el-drawer
      v-model="dialog.visible"
      :title="dialog.title"
      :size="dialog.width"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      direction="rtl"
      class="custom-drawer"
      :before-close="handleClose"
      :show-close="false"
    >
      <template #header="{ titleId, titleClass }">
        <div class="custom-drawer-header">
          <h4 :id="titleId" :class="titleClass">{{ dialog.title }}</h4>
          <el-button type="primary" link @click="handleClose">
            <i-ep-close />
          </el-button>
        </div>
      </template>
      <!-- 用户新增/编辑表单 -->
      <el-form
        v-if="dialog.type === 'user-form'"
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input
            v-model="formData.phoneNumber"
            :readonly="formData.code != undefined"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="用户名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptCode">
          <el-tree-select
            v-model="formData.deptCode"
            placeholder="请选择所属部门"
            :data="deptList"
            filterable
            check-strictly
            :render-after-expand="false"
            :props="{ children: 'children', label: 'name', value: 'code' }"
          />
        </el-form-item>

        <el-form-item label="所属角色" prop="roleCodes">
          <el-select
            v-model="formData.roleCodes"
            multiple
            placeholder="请选择所属角色"
          >
            <el-option
              v-for="item in roleList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <!-- 底部操作按钮 -->
      <template #footer>
        <div class="drawer-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "User",
  inheritAttrs: false,
});

import UserAPI from "@/api/user";
import DeptAPI from "@/api/dept";
import RoleAPI from "@/api/role";
import {
  UserFormRequest,
  UserQueryRequest,
  UserResponse,
} from "@/api/user/model";

const queryFormRef = ref(ElForm); // 查询表单
const userFormRef = ref(ElForm); // 用户表单

const loading = ref(false); //  加载状态
const queryParams = reactive<UserQueryRequest>({
  offset: 1,
  limit: 10,
  deptCode: "",
});
const dateTimeRange = ref("");
const total = ref(0); // 数据总数
const pageData = ref<UserResponse[]>(); // 用户分页数据
const deptList = ref<OptionType[]>(); // 部门下拉数据源
const roleList = ref<OptionType[]>(); // 角色下拉数据源

watch(dateTimeRange, (newVal) => {
  if (newVal) {
    queryParams.beginCreateTime = newVal[0];
    queryParams.endCreateTime = newVal[1];
  }
});

// 弹窗对象
const dialog = reactive({
  visible: false,
  type: "user-form",
  width: 800,
  title: "",
});

// 用户表单数据
const formData = reactive<UserFormRequest>({
  status: 1,
});

// 用户导入数据
const importData = reactive({
  deptId: undefined,
  file: undefined,
  fileList: [],
});

// 校验规则
const rules = reactive({
  name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  deptCode: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
  roleCodes: [{ required: true, message: "所属角色不能为空", trigger: "blur" }],
  email: [
    { required: true, message: "邮箱不能为空", trigger: "blur" },
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  phoneNumber: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

/** 关闭侧边栏 */
function handleClose() {
  ElMessageBox.confirm("确认关闭？未保存的数据将会丢失", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      dialog.visible = false;
      closeDialog();
    })
    .catch(() => {});
}

/** 查询 */
function handleQuery() {
  loading.value = true;
  UserAPI.getUserPage(queryParams)
    .then((data) => {
      pageData.value = data.records;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  dateTimeRange.value = "";
  queryParams.offset = 1;
  queryParams.deptCode = undefined;
  queryParams.beginCreateTime = undefined;
  queryParams.endCreateTime = undefined;
  handleQuery();
}

/** 重置密码 */
function resetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt("请在文本框中输入【重置】来重置用户密码", "重置密码", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(({ value }) => {
    if (!value || value !== "重置") {
      // 检查密码是否为空或少于6位
      ElMessage.warning("请输入【重置】");
      return false;
    }
    UserAPI.resetPassword(row.code).then(() => {
      ElMessage.success("密码重置成功");
    });
  });
}

/** 加载部门下拉数据源 */
async function loadDeptOptions() {
  DeptAPI.getDeptTree().then((data) => {
    deptList.value = data;
  });
}

/** 家在角色下拉数据源 */
async function loadRoleOptions() {
  RoleAPI.getRoles().then((data) => {
    roleList.value = data;
  });
}

/**
 * 打开弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 * @param id 用户ID
 */
async function openDialog(code?: string) {
  dialog.visible = true;
  // 用户表单弹窗
  await loadDeptOptions();
  await loadRoleOptions();
  if (code) {
    dialog.title = "修改用户";
    UserAPI.getUserByCode(code).then((data) => {
      Object.assign(formData, { ...data });
    });
  } else {
    dialog.title = "新增用户";
  }
}

/**
 * 关闭弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 */
function closeDialog() {
  if (dialog.type === "user-form") {
    userFormRef.value.resetFields();
    userFormRef.value.clearValidate();
    formData.code = undefined;
    formData.status = 1;
  } else if (dialog.type === "user-import") {
    importData.file = undefined;
    importData.fileList = [];
  }
}

/** 表单提交 */
/** 表单提交 */
function handleSubmit() {
  userFormRef.value.validate((valid: any) => {
    if (valid) {
      const code = formData.code;
      loading.value = true;
      if (code) {
        UserAPI.updateUser(code, formData)
          .then(() => {
            ElMessage.success("修改用户成功");
            dialog.visible = false;
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserAPI.createUser(formData)
          .then(() => {
            ElMessage.success("新增用户成功");
            dialog.visible = false;
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 删除用户 */
function handleDelete(code: string) {
  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    UserAPI.deleteUserByCode(code).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>
