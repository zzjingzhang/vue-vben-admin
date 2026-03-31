import { requestClient } from '#/api/request';

export interface RoleItem {
  id: string;
  name: string;
  status: number;
  remark: string;
  createTime: string;
  permissions: string[];
}

export interface RoleListResult {
  items: RoleItem[];
  total: number;
}

export interface RoleListParams {
  page?: number;
  pageSize?: number;
  name?: string;
  id?: string;
  status?: number;
  remark?: string;
  startTime?: string;
  endTime?: string;
}

/**
 * 获取角色列表
 */
export async function getRoleListApi(params: RoleListParams) {
  return requestClient.get<RoleListResult>('/system/role/list', { params });
}
