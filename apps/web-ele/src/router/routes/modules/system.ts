import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:settings',
      order: 100,
      title: $t('page.system.title'),
    },
    name: 'System',
    path: '/system',
    children: [
      {
        meta: {
          icon: 'lucide:user-cog',
          title: $t('page.system.role'),
        },
        name: 'RoleManagement',
        path: '/system/role',
        component: () => import('#/views/system/role/index.vue'),
      },
    ],
  },
];

export default routes;
