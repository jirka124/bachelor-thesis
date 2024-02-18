const routes = [
  {
    path: "/admin",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      {
        path: "",
        name: "admin",
        component: () => import("pages/AdminView.vue"),
      },
      {
        path: "login",
        name: "admin-login",
        component: () => import("pages/AdminLoginView.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/HomeView.vue"),
      },
      {
        path: "stock",
        name: "stock",
        component: () => import("pages/StockView.vue"),
      },
      {
        path: "product/:productId",
        name: "product",
        component: () => import("pages/ProductView.vue"),
      },
      {
        path: "about",
        name: "about",
        component: () => import("pages/AboutView.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
