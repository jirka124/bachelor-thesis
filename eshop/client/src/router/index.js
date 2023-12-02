import { createRouter, createWebHistory } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { api } from '@/boot/axios.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      component: () => import('../layouts/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'admin',
          component: () => import('../views/AdminView.vue')
        },
        {
          path: 'login',
          name: 'admin-login',
          component: () => import('../views/AdminLoginView.vue')
        }
      ]
    },
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue')
        },
        {
          path: 'stock',
          name: 'stock',
          component: () => import('../views/StockView.vue')
        },
        {
          path: 'product/:productId',
          name: 'product',
          component: () => import('../views/ProductView.vue')
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/AboutView.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to) => {
  const adminStore = useAdminStore()
  const isAdminPath = to.matched.some((match) => match.path === '/admin')
  if (isAdminPath) {
    let r = (await api.post('admin/is-logged')).data
    if (r.reqState !== null) console.log(r.reqState)

    if (r.result.hasOwnProperty('isLogged')) adminStore.setIsLoggedAsAdmin(r.result.isLogged)

    if (adminStore.isLoggedAsAdmin && to.name === 'admin-login') return { name: 'admin' }
    if (!adminStore.isLoggedAsAdmin && to.name !== 'admin-login') return { name: 'admin-login' }
  }
})

export default router
