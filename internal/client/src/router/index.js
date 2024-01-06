import { createRouter, createWebHistory } from 'vue-router'
import { useTeacherStore } from '@/stores/teacher'
import { api } from '@/boot/axios.js'

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
          path: 'write-attend/:classId',
          name: 'write-attend',
          component: () => import('../views/teacher/WriteAttendanceView.vue')
        },
        {
          path: 'read-attend-choose',
          name: 'read-attend-choose',
          component: () => import('../views/teacher/ReadAttendanceChooseView.vue')
        },
        {
          path: 'read-attend/:classId',
          name: 'read-attend',
          component: () => import('../views/teacher/ReadAttendanceView.vue')
        },
        {
          path: 'edit-class-choose',
          name: 'edit-class-choose',
          component: () => import('../views/teacher/EditClassChooseView.vue')
        },
        {
          path: 'edit-class/:classId',
          name: 'edit-class',
          component: () => import('../views/teacher/EditClassView.vue')
        },
        {
          path: 'create-class',
          name: 'create-class',
          component: () => import('../views/teacher/CreateClassView.vue')
        },
        {
          path: 'edit-att/:attendId',
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

router.beforeEach(async (to) => {
  const teacherStore = useTeacherStore()
  const isTeacherPath = to.matched.some(
    (match) => match.path === '/teacher' || match.path === '/auth'
  )
  if (isTeacherPath) {
    let r = (await api.post('teacher/is-logged')).data
    if (r.reqState !== null) console.log(r.reqState)

    if (r.result.hasOwnProperty('isLogged')) teacherStore.setIsLoggedAsTeacher(r.result.isLogged)

    if (teacherStore.isLoggedAsTeacher && to.name === 'login') return { name: 'schedule' }
    if (!teacherStore.isLoggedAsTeacher && to.name !== 'login') return { name: 'login' }
  }
})

export default router
