import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { api } from '@/boot/axios.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/app',
      component: () => import('../layouts/AppLayout.vue'),
      children: [
        {
          path: 'feed',
          name: 'feed',
          alias: '',
          component: () => import('../views/FeedView.vue')
        },
        {
          path: 'c-post',
          name: 'create-post',
          component: () => import('../views/CreatePostView.vue')
        },
        {
          path: 'user/:userId',
          name: 'view-user',
          component: () => import('../views/UserProfileView.vue')
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/LoginView.vue')
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('../views/SignupView.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const isAppPath = to.matched.some((match) => match.path === '/app')
  if (isAppPath) {
    let r = (await api.post('user/is-logged')).data
    if (r.reqState !== null) console.log(r.reqState)

    if (r.result.hasOwnProperty('isLogged')) userStore.setIsLogged(r.result.isLogged)

    if (userStore.isLogged && (to.name === 'login' || to.name === 'signup')) return { name: 'feed' }
    if (!userStore.isLogged && to.name === 'create-post') return { name: 'login' }
  }
})

export default router
