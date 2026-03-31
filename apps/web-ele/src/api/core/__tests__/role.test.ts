import { describe, expect, it, vi } from 'vitest';

import type { RoleListParams, RoleListResult } from '../role';

import { getRoleListApi } from '../role';

// Mock requestClient
vi.mock('#/api/request', () => ({
  requestClient: {
    get: vi.fn(),
  },
}));

describe('role api', () => {
  describe('getRoleListApi', () => {
    it('should fetch role list with default params', async () => {
      const { requestClient } = await import('#/api/request');
      const mockResponse: RoleListResult = {
        items: [
          {
            id: '1',
            name: 'Admin',
            status: 1,
            remark: 'Administrator role',
            createTime: '2024-01-01 00:00:00',
            permissions: ['menu1', 'menu2'],
          },
        ],
        total: 1,
      };

      vi.mocked(requestClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getRoleListApi({});

      expect(requestClient.get).toHaveBeenCalledWith('/system/role/list', {
        params: {},
      });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch role list with search params', async () => {
      const { requestClient } = await import('#/api/request');
      const mockResponse: RoleListResult = {
        items: [
          {
            id: '2',
            name: 'User',
            status: 0,
            remark: 'User role',
            createTime: '2024-01-02 00:00:00',
            permissions: ['menu3'],
          },
        ],
        total: 1,
      };

      vi.mocked(requestClient.get).mockResolvedValueOnce(mockResponse);

      const params: RoleListParams = {
        page: 1,
        pageSize: 10,
        name: 'User',
        id: '2',
        status: 0,
        remark: 'test',
        startTime: '2024-01-01',
        endTime: '2024-12-31',
      };

      const result = await getRoleListApi(params);

      expect(requestClient.get).toHaveBeenCalledWith('/system/role/list', {
        params,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch role list with fuzzy search by name', async () => {
      const { requestClient } = await import('#/api/request');
      const mockResponse: RoleListResult = {
        items: [
          {
            id: '3',
            name: 'SuperAdmin',
            status: 1,
            remark: 'Super admin role',
            createTime: '2024-01-03 00:00:00',
            permissions: ['menu1', 'menu2', 'menu3'],
          },
        ],
        total: 1,
      };

      vi.mocked(requestClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getRoleListApi({ name: 'Admin' });

      expect(requestClient.get).toHaveBeenCalledWith('/system/role/list', {
        params: { name: 'Admin' },
      });
      expect(result.items[0]?.name).toContain('Admin');
    });

    it('should fetch role list with status filter', async () => {
      const { requestClient } = await import('#/api/request');
      const mockResponse: RoleListResult = {
        items: [
          {
            id: '4',
            name: 'DisabledRole',
            status: 0,
            remark: 'Disabled role',
            createTime: '2024-01-04 00:00:00',
            permissions: [],
          },
        ],
        total: 1,
      };

      vi.mocked(requestClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getRoleListApi({ status: 0 });

      expect(requestClient.get).toHaveBeenCalledWith('/system/role/list', {
        params: { status: 0 },
      });
      expect(result.items[0]?.status).toBe(0);
    });

    it('should fetch role list with pagination', async () => {
      const { requestClient } = await import('#/api/request');
      const mockResponse: RoleListResult = {
        items: Array.from({ length: 10 }, (_, i) => ({
          id: String(i + 1),
          name: `Role${i + 1}`,
          status: i % 2 === 0 ? 1 : 0,
          remark: `Remark ${i + 1}`,
          createTime: '2024-01-01 00:00:00',
          permissions: [],
        })),
        total: 100,
      };

      vi.mocked(requestClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getRoleListApi({ page: 2, pageSize: 10 });

      expect(requestClient.get).toHaveBeenCalledWith('/system/role/list', {
        params: { page: 2, pageSize: 10 },
      });
      expect(result.items).toHaveLength(10);
      expect(result.total).toBe(100);
    });

    it('should fetch role list with date range filter', async () => {
      const { requestClient } = await import('#/api/request');
      const mockResponse: RoleListResult = {
        items: [
          {
            id: '5',
            name: 'NewRole',
            status: 1,
            remark: 'New role',
            createTime: '2024-06-15 00:00:00',
            permissions: ['menu1'],
          },
        ],
        total: 1,
      };

      vi.mocked(requestClient.get).mockResolvedValueOnce(mockResponse);

      const params: RoleListParams = {
        startTime: '2024-06-01',
        endTime: '2024-06-30',
      };

      const result = await getRoleListApi(params);

      expect(requestClient.get).toHaveBeenCalledWith('/system/role/list', {
        params,
      });
      expect(result.total).toBe(1);
    });

    it('should handle empty result', async () => {
      const { requestClient } = await import('#/api/request');
      const mockResponse: RoleListResult = {
        items: [],
        total: 0,
      };

      vi.mocked(requestClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getRoleListApi({ name: 'NonExistentRole' });

      expect(requestClient.get).toHaveBeenCalledWith('/system/role/list', {
        params: { name: 'NonExistentRole' },
      });
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });
});
