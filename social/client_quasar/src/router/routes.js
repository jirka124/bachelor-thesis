
const routes = [
  {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomeView.vue')
    },
    {
      path: '/app',
      component: () => import('../layouts/AppLayout.vue'),
      children: [
        {
          path: 'feed',
          name: 'feed',
          alias: '',
          component: () => import('../pages/FeedView.vue')
        },
        {
          path: 'c-post',
          name: 'create-post',
          component: () => import('../pages/CreatePostView.vue')
        },
        {
          path: 'user/:userId',
          name: 'view-user',
          component: () => import('../pages/UserProfileView.vue')
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('../pages/LoginView.vue')
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('../pages/SignupView.vue')
        }
      ]
    },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
