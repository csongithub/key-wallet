
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/CreateAccount.vue') },
      { path: '/login', component: () => import('pages/Login.vue') },
      { path: '/account_store', component: () => import('pages/AccountStore.vue') },
      { path: '/backup', component: () => import('pages/Backup.vue') },
      { path: '/change_password', component: () => import('pages/ChangePassword.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
