import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:settings',
      order: 100,
      title: '系统管理',
    },
    name: 'System',
    path: '/system',
    children: [
      {
        meta: {
          icon: 'lucide:user-check',
          title: '角色管理',
        },
        name: 'RoleManage',
        path: '/system/role',
        component: () => import('#/views/system/role/index.vue'),
      },
    ],
  },
];

export default routes;
