
const routes = [
  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/index/Login.vue'),
        name: 'login',
        meta: { screen: 'Login' },
      },
      {
        path: '/pesquisar',
        component: () => import('pages/index/Search.vue'),
        name: 'searchCertified',
        meta: { screen: 'SearchCertified' },
      },
    ],
  },
  {
    path: '/painel',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/dashboard/Index.vue'),
        meta: { screen: 'Início', requiresLogin: true },
      },
      {
        path: '/comunicacoes',
        name: 'comunications',
        component: () => import('pages/dashboard/Comunications.vue'),
        meta: { screen: 'Comunicações', requiresLogin: true },
      },
      {
        path: '/usuarios',
        name: 'users',
        component: () => import('pages/dashboard/Users.vue'),
        meta: { screen: 'Usuários', requiresLogin: true },
      },
      {
        path: '/relatorios',
        name: 'reports',
        component: () => import('pages/dashboard/Reports.vue'),
        meta: { screen: 'Relatórios', requiresLogin: true },
      },
      {
        path: '/pagamentos',
        name: 'payments',
        component: () => import('pages/dashboard/Payments.vue'),
        meta: { screen: 'Pagamentos', requiresLogin: true },
      },
      {
        path: '/conta',
        name: 'myAccount',
        component: () => import('pages/dashboard/MyAccount.vue'),
        meta: { screen: 'Minha Conta', requiresLogin: true },
      },
      {
        path: '/tabelas',
        name: 'tables',
        component: () => import('pages/dashboard/Tables.vue'),
        meta: { screen: 'Tabelas', requiresLogin: true },
      },
      {
        path: '/suporte',
        name: 'support',
        component: () => import('pages/dashboard/Support.vue'),
        meta: { screen: 'Suporte', requiresLogin: true },
      },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
