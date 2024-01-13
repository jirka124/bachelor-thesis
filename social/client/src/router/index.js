import { createRouter, createWebHistory } from 'vue-router'

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
          path: 'v-post/:postId',
          name: 'view-post',
          component: () => import('../views/ViewPostView.vue')
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

export default router
