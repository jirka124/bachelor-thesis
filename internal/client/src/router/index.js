import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'teacher'
    },
    {
      path: '/teacher',
      component: () => import('../layouts/TeacherLayout.vue'),
      children: [
        {
          path: 'schedule',
          alias: '',
          name: 'schedule',
          component: () => import('../views/teacher/ScheduleView.vue')
        },
        {
          path: 'write-attend',
          name: 'write-attend',
          component: () => import('../views/teacher/WriteAttendanceView.vue')
        },
        {
          path: 'read-attend-choose',
          name: 'read-attend-choose',
          component: () => import('../views/teacher/ReadAttendanceChooseView.vue')
        },
        {
          path: 'read-attend',
          name: 'read-attend',
          component: () => import('../views/teacher/ReadAttendanceView.vue')
        },
        {
          path: 'edit-class-choose',
          name: 'edit-class-choose',
          component: () => import('../views/teacher/EditClassChooseView.vue')
        },
        {
          path: 'edit-class',
          name: 'edit-class',
          component: () => import('../views/teacher/EditClassView.vue')
        },
        {
          path: 'create-class',
          name: 'create-class',
          component: () => import('../views/teacher/CreateClassView.vue')
        },
        {
          path: 'edit-att',
          name: 'edit-att',
          component: () => import('../views/teacher/EditAttendantView.vue')
        },
        {
          path: 'create-att',
          name: 'create-att',
          component: () => import('../views/teacher/CreateAttendantView.vue')
        }
      ]
    },
    {
      path: '/auth',
      component: () => import('../layouts/AuthentizeLayout.vue'),
      children: [
        {
          path: 'login',
          alias: '',
          name: 'login',
          component: () => import('../views/authentize/LoginView.vue')
        }
      ]
    }
  ]
})

export default router
