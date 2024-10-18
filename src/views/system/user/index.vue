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
            <el-form-item label="关键字" prop="keywords">
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
                <el-button type="success" @click="openDialog('user-form')"
                  ><i-ep-plus />新增</el-button
                >
                <el-button
                  type="danger"
                  :disabled="removeIds.length === 0"
                  @click="handleDelete()"
                  ><i-ep-delete />删除</el-button
                >
              </div>
            </div>
          </template>

          <el-table
            v-loading="loading"
            :data="pageData"
            @selection-change="handleSelectionChange"
          >
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
                  ><i-ep-refresh-left />重置密码</el-button
                >
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="openDialog('user-form', scope.row.id)"
                  ><i-ep-edit />编辑</el-button
                >
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="handleDelete(scope.row.id)"
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
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      :width="dialog.width"
      append-to-body
      @close="closeDialog"
      :close-on-press-escape="false"
    >
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
          />
        </el-form-item>

        <el-form-item label="角色" prop="roleCodes">
          <el-select v-model="formData.roleCodes" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 弹窗底部操作按钮 -->
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
import type { UploadInstance } from "element-plus";

const queryFormRef = ref(ElForm); // 查询表单
const userFormRef = ref(ElForm); // 用户表单

const loading = ref(false); //  加载状态
const removeIds = ref([]); // 删除用户ID集合 用于批量删除
const queryParams = reactive<UserQueryRequest>({
  offset: 1,
  limit: 10,
});
const dateTimeRange = ref("");
const total = ref(0); // 数据总数
const pageData = ref<UserResponse[]>(); // 用户分页数据
const deptList = ref<OptionType[]>(); // 部门下拉数据源
const roleList = ref<OptionType[]>(); // 角色下拉数据源

watch(dateTimeRange, (newVal) => {
  if (newVal) {
    queryParams.startTime = newVal[0];
    queryParams.endTime = newVal[1];
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
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  deptCode: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
  roleCodes: [{ required: true, message: "用户角色不能为空", trigger: "blur" }],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  phoneNumber: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  UserAPI.getUserPage(queryParams)
    .then((data) => {
      console.log("handleQuery", data);
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
  queryParams.startTime = undefined;
  queryParams.endTime = undefined;
  handleQuery();
}

/** 行选中 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 重置密码 */
function resetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt(
    "请输入用户「" + row.username + "」的新密码",
    "重置密码",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    }
  ).then(({ value }) => {
    if (!value || value.length < 6) {
      // 检查密码是否为空或少于6位
      ElMessage.warning("密码至少需要6位字符，请重新输入");
      return false;
    }
    UserAPI.updatePassword(row.id, value).then(() => {
      ElMessage.success("密码重置成功，新密码是：" + value);
    });
  });
}

/** 加载角色下拉数据源 */
async function loadRoleOptions() {
  RoleAPI.getOptions().then((data) => {
    roleList.value = data;
  });
}

/** 加载部门下拉数据源 */
async function loadDeptOptions() {
  DeptAPI.getDeptTree().then((data) => {
    deptList.value = data;
  });
}

/**
 * 打开弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 * @param id 用户ID
 */
async function openDialog(type: string, id?: number) {
  dialog.visible = true;
  dialog.type = type;

  if (dialog.type === "user-form") {
    // 用户表单弹窗
    await loadDeptOptions();
    await loadRoleOptions();
    if (id) {
      dialog.title = "修改用户";
      UserAPI.getFormData(id).then((data) => {
        Object.assign(formData, { ...data });
      });
    } else {
      dialog.title = "新增用户";
    }
  } else if (dialog.type === "user-import") {
    // 用户导入弹窗
    dialog.title = "导入用户";
    dialog.width = 600;
    loadDeptOptions();
  }
}

/**
 * 关闭弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 */
function closeDialog() {
  dialog.visible = false;
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
const handleSubmit = useThrottleFn(() => {
  if (dialog.type === "user-form") {
    userFormRef.value.validate((valid: any) => {
      if (valid) {
        const userId = formData.id;
        loading.value = true;
        if (userId) {
          UserAPI.update(userId, formData)
            .then(() => {
              ElMessage.success("修改用户成功");
              closeDialog();
              resetQuery();
            })
            .finally(() => (loading.value = false));
        } else {
          UserAPI.add(formData)
            .then(() => {
              ElMessage.success("新增用户成功");
              closeDialog();
              resetQuery();
            })
            .finally(() => (loading.value = false));
        }
      }
    });
  } else if (dialog.type === "user-import") {
    if (!importData?.deptId) {
      ElMessage.warning("请选择部门");
      return false;
    }
    if (!importData?.file) {
      ElMessage.warning("上传Excel文件不能为空");
      return false;
    }
    UserAPI.import(importData?.deptId, importData?.file).then((data) => {
      ElMessage.success("导入用户成功");
      closeDialog();
      resetQuery();
    });
  }
}, 3000);

/** 删除用户 */
function handleDelete(id?: number) {
  const userIds = [id || removeIds.value].join(",");
  if (!userIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    UserAPI.deleteByIds(userIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>
