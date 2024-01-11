import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: () => import('../layouts/GuestLayout.vue'),
      children: [
        {
          path: 'home-guest',
          name: 'home-guest',
          alias: '',
          component: () => import('../views/HomeView.vue')
        },
        {
          path: 'search-guest',
          name: 'search-guest',
          component: () => import('../views/SearchView.vue')
        },
        {
          path: 'ask-guest',
          name: 'ask-guest',
          component: () => import('../views/AskQuestionView.vue')
        },
        {
          path: 'discuss-guest/:postId',
          name: 'discuss-guest',
          component: () => import('../views/DiscussionView.vue')
        }
      ]
    }
  ]
})

export default router
