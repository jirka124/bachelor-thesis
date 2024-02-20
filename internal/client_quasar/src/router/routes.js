const routes = [
  {
    path: "/",
    redirect: "teacher",
  },
  {
    path: "/teacher",
    component: () => import("../layouts/TeacherLayout.vue"),
    children: [
      {
        path: "schedule",
        alias: "",
        name: "schedule",
        component: () => import("../pages/teacher/ScheduleView.vue"),
      },
      {
        path: "write-attend/:classId",
        name: "write-attend",
        component: () => import("../pages/teacher/WriteAttendanceView.vue"),
      },
      {
        path: "read-attend-choose",
        name: "read-attend-choose",
        component: () =>
          import("../pages/teacher/ReadAttendanceChooseView.vue"),
      },
      {
        path: "read-attend/:classId",
        name: "read-attend",
        component: () => import("../pages/teacher/ReadAttendanceView.vue"),
      },
      {
        path: "edit-class-choose",
        name: "edit-class-choose",
        component: () => import("../pages/teacher/EditClassChooseView.vue"),
      },
      {
        path: "edit-class/:classId",
        name: "edit-class",
        component: () => import("../pages/teacher/EditClassView.vue"),
      },
      {
        path: "create-class",
        name: "create-class",
        component: () => import("../pages/teacher/CreateClassView.vue"),
      },
      {
        path: "edit-att/:attendId",
        name: "edit-att",
        component: () => import("../pages/teacher/EditAttendantView.vue"),
      },
      {
        path: "create-att",
        name: "create-att",
        component: () => import("../pages/teacher/CreateAttendantView.vue"),
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("../layouts/AuthentizeLayout.vue"),
    children: [
      {
        path: "login",
        alias: "",
        name: "login",
        component: () => import("../pages/authentize/LoginView.vue"),
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
