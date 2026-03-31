<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  ElButton,
  ElCard,
  ElCol,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElPagination,
  ElRow,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';

import { getRoleListApi } from '#/api';

interface RoleItem {
  id: string;
  name: string;
  status: number;
  remark: string;
  createTime: string;
  permissions: string[];
}

const loading = ref(false);
const tableData = ref<RoleItem[]>([]);
const total = ref(0);

const searchForm = reactive({
  name: '',
  id: '',
  status: undefined as number | undefined,
  remark: '',
  createTime: [] as Date[],
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
});

const isExpanded = ref(false);

const statusOptions = [
  { label: '已启用', value: 1 },
  { label: '已禁用', value: 0 },
];

async function fetchData() {
  loading.value = true;
  try {
    const params: Record<string, any> = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
    };

    if (searchForm.name) {
      params.name = searchForm.name;
    }
    if (searchForm.id) {
      params.id = searchForm.id;
    }
    if (searchForm.status !== undefined) {
      params.status = searchForm.status;
    }
    if (searchForm.remark) {
      params.remark = searchForm.remark;
    }
    if (searchForm.createTime && searchForm.createTime.length === 2) {
      params.startTime = searchForm.createTime[0]?.toISOString().split('T')[0];
      params.endTime = searchForm.createTime[1]?.toISOString().split('T')[0];
    }

    const res = await getRoleListApi(params);
    tableData.value = res.items || [];
    total.value = res.total || 0;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.currentPage = 1;
  fetchData();
}

function handleReset() {
  searchForm.name = '';
  searchForm.id = '';
  searchForm.status = undefined;
  searchForm.remark = '';
  searchForm.createTime = [];
  pagination.currentPage = 1;
  fetchData();
}

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

function handleEdit(row: RoleItem) {
  ElMessage.info(`编辑角色: ${row.name}`);
}

async function handleDelete(row: RoleItem) {
  try {
    await ElMessageBox.confirm(`确定要删除角色 "${row.name}" 吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    ElMessage.success('删除成功');
    fetchData();
  } catch {
    // 用户取消删除
  }
}

function handleSizeChange(val: number) {
  pagination.pageSize = val;
  fetchData();
}

function handleCurrentChange(val: number) {
  pagination.currentPage = val;
  fetchData();
}

function getStatusType(status: number) {
  return status === 1 ? 'success' : 'danger';
}

function getStatusLabel(status: number) {
  return status === 1 ? '已启用' : '已禁用';
}

onMounted(() => {
  fetchData();
});
</script>

<template>
  <Page :title="$t('page.system.role')">
    <ElCard class="mb-4" shadow="never">
      <ElForm :model="searchForm" label-width="80px">
        <ElRow :gutter="16">
          <ElCol :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <ElFormItem label="角色名称">
              <ElInput v-model="searchForm.name" clearable placeholder="请输入角色名称" />
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <ElFormItem label="角色ID">
              <ElInput v-model="searchForm.id" clearable placeholder="请输入角色ID" />
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <ElFormItem label="状态">
              <ElSelect v-model="searchForm.status" clearable placeholder="请选择状态">
                <ElOption
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol v-if="isExpanded" :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <ElFormItem label="备注">
              <ElInput v-model="searchForm.remark" clearable placeholder="请输入备注" />
            </ElFormItem>
          </ElCol>
          <ElCol v-if="isExpanded" :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <ElFormItem label="创建时间">
              <ElDatePicker
                v-model="searchForm.createTime"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="daterange"
                value-format="YYYY-MM-DD"
              />
            </ElFormItem>
          </ElCol>
          <ElCol
            :xs="24"
            :sm="24"
            :md="isExpanded ? 24 : 8"
            :lg="isExpanded ? 24 : 6"
            :xl="isExpanded ? 24 : 6"
          >
            <ElFormItem>
              <div class="flex w-full justify-end gap-2">
                <ElButton type="primary" @click="handleSearch"> 搜索 </ElButton>
                <ElButton @click="handleReset">重置</ElButton>
                <ElButton link type="primary" @click="toggleExpand">
                  {{ isExpanded ? '收起' : '展开' }}
                  <i
                    :class="isExpanded ? 'el-icon el-icon-arrow-up' : 'el-icon el-icon-arrow-down'"
                  />
                </ElButton>
              </div>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
    </ElCard>

    <ElCard shadow="never">
      <ElTable v-loading="loading" :data="tableData" stripe>
        <ElTableColumn label="角色名称" min-width="150" prop="name" />
        <ElTableColumn label="角色ID" min-width="280" prop="id" />
        <ElTableColumn label="状态" min-width="100" prop="status">
          <template #default="{ row }">
            <ElTag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" min-width="200" prop="remark" show-overflow-tooltip />
        <ElTableColumn label="创建时间" min-width="180" prop="createTime" />
        <ElTableColumn fixed="right" label="操作" min-width="150">
          <template #default="{ row }">
            <ElButton link type="primary" @click="handleEdit(row)"> 修改 </ElButton>
            <ElButton link type="danger" @click="handleDelete(row)"> 删除 </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>

      <div class="mt-4 flex justify-end">
        <ElPagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </ElCard>
  </Page>
</template>

<style scoped>
:deep(.el-form-item__content) {
  justify-content: flex-end;
}
</style>
