<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  ElButton,
  ElCard,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElPagination,
  ElSelect,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';

interface RoleItem {
  id: string;
  name: string;
  status: number;
  remark: string;
  createTime: string;
}

const expanded = ref(false);
const loading = ref(false);
const tableData = ref<RoleItem[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const searchForm = ref({
  name: '',
  id: '',
  status: '',
  remark: '',
  createTime: [] as string[],
});

const mockData = ref<RoleItem[]>([]);

const generateMockData = () => {
  const data: RoleItem[] = [];
  const statuses = [0, 1];
  const names = [
    '超级管理员',
    '管理员',
    '普通用户',
    '访客',
    '系统维护',
    '审计员',
    '内容管理员',
    '财务专员',
  ];
  const remarks = [
    '系统默认角色',
    '负责系统管理',
    '普通用户权限',
    '访客权限',
    '维护系统',
    '审计角色',
    '管理内容',
    '财务相关',
  ];

  for (let i = 0; i < 100; i++) {
    const date = new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
    );
    data.push({
      id: `ROLE-${String(i + 1000).padStart(4, '0')}`,
      name: names[i % names.length],
      status: statuses[i % 2],
      remark: remarks[i % remarks.length],
      createTime: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`,
    });
  }
  return data;
};

const fetchData = () => {
  loading.value = true;
  setTimeout(() => {
    let filteredData = [...mockData.value];

    if (searchForm.value.name) {
      filteredData = filteredData.filter((item) =>
        item.name.includes(searchForm.value.name),
      );
    }

    if (searchForm.value.id) {
      filteredData = filteredData.filter((item) =>
        item.id.includes(searchForm.value.id),
      );
    }

    if (searchForm.value.status !== '') {
      filteredData = filteredData.filter(
        (item) => item.status === Number(searchForm.value.status),
      );
    }

    if (searchForm.value.remark) {
      filteredData = filteredData.filter((item) =>
        item.remark.includes(searchForm.value.remark),
      );
    }

    if (
      searchForm.value.createTime &&
      searchForm.value.createTime.length === 2
    ) {
      const [startDate, endDate] = searchForm.value.createTime;
      filteredData = filteredData.filter((item) => {
        const itemDate = item.createTime.split(' ')[0];
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    total.value = filteredData.length;
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    tableData.value = filteredData.slice(start, end);
    loading.value = false;
  }, 500);
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

const handleReset = () => {
  searchForm.value = {
    name: '',
    id: '',
    status: '',
    remark: '',
    createTime: [],
  };
  handleSearch();
};

const handleEdit = (row: RoleItem) => {
  ElMessage.info(`修改角色: ${row.name}`);
};

const handleDelete = (row: RoleItem) => {
  ElMessage.success(`删除角色: ${row.name}`);
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  fetchData();
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  fetchData();
};

onMounted(() => {
  mockData.value = generateMockData();
  fetchData();
});
</script>

<template>
  <Page description="管理系统角色权限" title="角色管理">
    <ElCard class="mb-4">
      <ElForm :model="searchForm" inline label-width="80px">
        <ElFormItem label="角色名称">
          <ElInput
            v-model="searchForm.name"
            placeholder="请输入角色名称"
            clearable
            style="width: 200px"
          />
        </ElFormItem>
        <ElFormItem label="角色ID">
          <ElInput
            v-model="searchForm.id"
            placeholder="请输入角色ID"
            clearable
            style="width: 200px"
          />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 200px"
          >
            <ElOption label="已启用" :value="1" />
            <ElOption label="已禁用" :value="0" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem v-if="expanded" label="备注">
          <ElInput
            v-model="searchForm.remark"
            placeholder="请输入备注"
            clearable
            style="width: 200px"
          />
        </ElFormItem>
        <ElFormItem v-if="expanded" label="创建时间">
          <ElDatePicker
            v-model="searchForm.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 400px"
          />
        </ElFormItem>
        <ElFormItem>
          <ElSpace>
            <ElButton type="primary" @click="handleSearch">搜索</ElButton>
            <ElButton @click="handleReset">重置</ElButton>
            <ElButton type="primary" link @click="expanded = !expanded">
              {{ expanded ? '收起' : '展开' }}
            </ElButton>
          </ElSpace>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <ElCard>
      <ElTable :data="tableData" v-loading="loading" stripe style="width: 100%">
        <ElTableColumn label="角色名称" prop="name" />
        <ElTableColumn label="角色ID" prop="id" />
        <ElTableColumn label="状态" prop="status">
          <template #default="{ row }">
            <ElTag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '已启用' : '已禁用' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" prop="remark" />
        <ElTableColumn label="创建时间" prop="createTime" />
        <ElTableColumn label="操作" width="150">
          <template #default="{ row }">
            <ElSpace>
              <ElButton
                type="primary"
                link
                size="small"
                @click="handleEdit(row)"
              >
                修改
              </ElButton>
              <ElButton
                type="danger"
                link
                size="small"
                @click="handleDelete(row)"
              >
                删除
              </ElButton>
            </ElSpace>
          </template>
        </ElTableColumn>
      </ElTable>
      <div class="flex justify-end mt-4">
        <ElPagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </ElCard>
  </Page>
</template>
