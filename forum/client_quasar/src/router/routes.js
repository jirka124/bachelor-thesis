const routes = [
  {
    path: "/",
    name: "",
    component: () => import("../layouts/GuestLayout.vue"),
    children: [
      {
        path: "home-guest",
        name: "home-guest",
        alias: "",
        component: () => import("../pages/HomeView.vue"),
      },
      {
        path: "search-guest",
        name: "search-guest",
        component: () => import("../pages/SearchView.vue"),
      },
      {
        path: "ask-guest",
        name: "ask-guest",
        component: () => import("../pages/AskQuestionView.vue"),
      },
      {
        path: "discuss-guest/:postId",
        name: "discuss-guest",
        component: () => import("../pages/DiscussionView.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
