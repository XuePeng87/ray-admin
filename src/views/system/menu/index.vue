<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="菜单名称" prop="keywords">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入菜单名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"
            ><template #icon><i-ep-search /></template>搜索</el-button
          >
          <el-button @click="resetQuery">
            <template #icon><i-ep-refresh /></template>
            重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button type="success" @click="openDialog()">
          <template #icon><i-ep-plus /></template>
          新增</el-button
        >
      </template>

      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="code"
        highlight-current-row
        @row-click="onRowClick"
      >
        <el-table-column label="菜单名称" min-width="200">
          <template #default="scope">
            <svg-icon :icon-class="scope.row.icon" />
            {{ scope.row.name }}
          </template>
        </el-table-column>

        <el-table-column label="类型" align="center" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.type === 0" type="warning">目录</el-tag>
            <el-tag v-if="scope.row.type === 1" type="success">菜单</el-tag>
            <el-tag v-if="scope.row.type === 2" type="danger">按钮</el-tag>
            <el-tag v-if="scope.row.type === 3" type="info">外链</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="路由路径"
          align="left"
          width="150"
          prop="path"
        />

        <el-table-column
          label="组件路径"
          align="left"
          width="250"
          prop="component"
        />

        <el-table-column
          label="权限标识"
          align="center"
          width="250"
          prop="permission"
        />

        <el-table-column label="状态" align="center" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.visible === true" type="success"
              >显示</el-tag
            >
            <el-tag v-else type="info">隐藏</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="排序"
          align="center"
          width="80"
          prop="sequence"
        />

        <el-table-column fixed="right" align="center" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-if="scope.row.type == 0 || scope.row.type == 1"
              type="primary"
              link
              size="small"
              @click.stop="openDialog(scope.row.code)"
            >
              <i-ep-plus />新增
            </el-button>

            <el-button
              type="primary"
              link
              size="small"
              @click.stop="openDialog(undefined, scope.row.code)"
            >
              <i-ep-edit />编辑
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="handleDelete(scope.row.code)"
              ><i-ep-delete />
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      destroy-on-close
      append-to-body
      width="1000px"
      @close="closeDialog"
      top="5vh"
      :close-on-press-escape="false"
    >
      <el-form
        ref="menuFormRef"
        :model="formData"
        :rules="rules"
        label-width="160px"
      >
        <el-form-item label="父级菜单" prop="parentCode">
          <el-tree-select
            v-model="formData.parentCode"
            placeholder="选择上级菜单"
            :data="menuOptions"
            filterable
            check-strictly
            :render-after-expand="false"
            :props="{ children: 'children', label: 'name', value: 'code' }"
          />
        </el-form-item>

        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入菜单名称" />
        </el-form-item>

        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type" @change="onMenuTypeChange">
            <el-radio :value="0">目录</el-radio>
            <el-radio :value="1">菜单</el-radio>
            <el-radio :value="2">按钮</el-radio>
            <el-radio :value="3">外链</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.type === 3" label="外链地址" prop="path">
          <el-input v-model="formData.path" placeholder="请输入外链完整路径" />
        </el-form-item>

        <el-form-item
          v-if="formData.type == 0 || formData.type == 1"
          label="路由路径"
          prop="path"
        >
          <el-input
            v-if="formData.type == 0"
            v-model="formData.path"
            placeholder="system"
          />
          <el-input v-else v-model="formData.path" placeholder="user" />
        </el-form-item>

        <!-- 组件页面完整路径 -->
        <el-form-item
          v-if="formData.type == 1"
          label="页面路径"
          prop="component"
        >
          <el-input
            v-model="formData.component"
            placeholder="system/user/index"
            style="width: 95%"
          >
            <template v-if="formData.type == 1" #prepend>src/views/</template>
            <template v-if="formData.type == 1" #append>.vue</template>
          </el-input>
        </el-form-item>

        <el-form-item
          v-if="formData.type !== 2"
          prop="visible"
          label="显示状态"
        >
          <el-radio-group v-model="formData.visible">
            <el-radio :value="true">显示</el-radio>
            <el-radio :value="false">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="formData.type === 1 || formData.type === 2"
          label="是否始终显示"
        >
          <template #label>
            <div>
              是否始终显示
              <el-tooltip placement="bottom" effect="light">
                <template #content>
                  当设置为始终显示时，即使只有一个子菜单也会显示
                </template>
                <i-ep-QuestionFilled class="inline-block" />
              </el-tooltip>
            </div>
          </template>

          <el-radio-group v-model="formData.alwaysShow">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.type === 1" label="是否缓存">
          <el-radio-group v-model="formData.cacheable">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sequence">
          <el-input-number
            v-model="formData.sequence"
            style="width: 100px"
            controls-position="right"
            :min="0"
          />
        </el-form-item>

        <!-- 权限标识 -->
        <el-form-item
          v-if="formData.type == 1 || formData.type == 2"
          label="权限标识"
          prop="perm"
        >
          <el-input v-model="formData.permission" placeholder="sys:user:add" />
        </el-form-item>

        <el-form-item v-if="formData.type !== 2" label="图标" prop="icon">
          <!-- 图标选择器 -->
          <icon-select v-model="formData.icon" />
        </el-form-item>

        <el-form-item v-if="formData.type == 0" label="跳转路由">
          <el-input v-model="formData.redirect" placeholder="跳转路由" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Menu",
  inheritAttrs: false,
});

import MenuAPI from "@/api/menu";
import {
  FuncQueryRequest,
  FuncFormRequest,
  FuncResponse,
} from "@/api/menu/model";

const queryFormRef = ref(ElForm);
const menuFormRef = ref(ElForm);

const loading = ref(false);
const dialog = reactive({
  title: "",
  visible: false,
});

const queryParams = reactive<FuncQueryRequest>({});
const menuList = ref<FuncResponse[]>([]);

const menuOptions = ref<OptionType[]>([]);

const formData = reactive<FuncFormRequest>({
  parentCode: "0",
  visible: true,
  sequence: 1,
  type: 1,
  alwaysShow: false,
  cacheable: false,
});

const rules = reactive({
  parentCode: [{ required: true, message: "请选择顶级菜单", trigger: "blur" }],
  name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
  path: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
  component: [{ required: true, message: "请输入组件路径", trigger: "blur" }],
  visible: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
});

const selectedRowFuncCode = ref<string | undefined>();

const menuCacheData = reactive({
  type: -1,
  path: "",
});

/**
 * 查询
 */
function handleQuery() {
  // 重置父组件
  loading.value = true;
  MenuAPI.getFuncTree(queryParams)
    .then((data) => {
      menuList.value = data;
    })
    .then(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

/**行点击事件 */
function onRowClick(row: FuncResponse) {
  selectedRowFuncCode.value = row.code;
}

/**
 * 打开表单弹窗
 *
 * @param parentId 父菜单ID
 * @param menuId 菜单ID
 */
function openDialog(parentCode?: string, code?: string) {
  MenuAPI.getFuncTree()
    .then((data) => {
      menuOptions.value = [
        {
          code: "0",
          name: "一级菜单",
          children: data,
        },
      ];
    })
    .then(() => {
      dialog.visible = true;
      if (code) {
        dialog.title = "编辑菜单";
        MenuAPI.getFuncByCode(code).then((data) => {
          Object.assign(formData, data);
          menuCacheData.type = data.type;
          menuCacheData.path = data.path ?? "";
        });
      } else {
        dialog.title = "新增菜单";
        formData.parentCode = parentCode;
      }
    });
}

/** 菜单类型切换事件处理 */
function onMenuTypeChange() {
  console.info(formData.type);
  // 如果菜单类型改变，清空路由路径；未改变在切换后还原路由路径
  if (formData.type !== menuCacheData.type) {
    formData.path = "";
  } else {
    formData.path = menuCacheData.path;
  }
}

/** 菜单保存提交 */
function submitForm() {
  menuFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      const code = formData.code;
      if (code) {
        MenuAPI.update(code, formData).then(() => {
          ElMessage.success("修改成功");
          closeDialog();
          handleQuery();
        });
      } else {
        MenuAPI.add(formData).then(() => {
          ElMessage.success("新增成功");
          closeDialog();
          handleQuery();
        });
      }
    }
  });
}

/** 删除菜单 */
function handleDelete(code: string) {
  if (!code) {
    ElMessage.warning("请勾选删除项");
    return false;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      MenuAPI.deleteByCode(code).then(() => {
        ElMessage.success("删除成功");
        handleQuery();
      });
    })
    .catch(() => ElMessage.info("已取消删除"));
}

/** 关闭弹窗 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/** 重置表单 */
function resetForm() {
  menuFormRef.value.resetFields();
  menuFormRef.value.clearValidate();

  formData.code = undefined;
  formData.parentCode = "0";
  formData.visible = true;
  formData.sequence = 1;
  formData.permission = undefined;
  formData.component = undefined;
  formData.path = undefined;
  formData.redirect = undefined;
  formData.alwaysShow = false;
  formData.cacheable = false;
}

onMounted(() => {
  handleQuery();
});
</script>
