import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { Cookies } from "quasar";
import { useTeacherStore } from "@/stores/teacher";
import { createAPI } from "@/boot/axios.js";
import hybridRoutesFunc from "/hybrid-routes-conf.js";
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({ store, ssrContext }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to) => {
    const hybridRoutes = hybridRoutesFunc();

    // define own interceptors run before nav guard resolution
    const authItercept = ({ data }) => {
      const teacherStore = useTeacherStore(store);
      if (data.hasOwnProperty("isLogged"))
        teacherStore.setIsLoggedAsTeacher(data.isLogged);
    };

    hybridRoutes.addIterceptURL("/auth/login", authItercept);
    hybridRoutes.addIterceptURL("/teacher**", authItercept);

    let route, hint, data;
    if (ssrContext && ssrContext.req && ssrContext.req.hybridRender) {
      // use data from hybridRender middleware
      route = ssrContext.req.hybridRender.route;
      hint = ssrContext.req.hybridRender.hint;
      data = ssrContext.req.hybridRender.data;
    } else {
      // get data about route
      const queryString = Object.entries(to.query)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const query = queryString.length > 0 ? `?${queryString}` : "";
      const queryObj = to.query;
      const pathname =
        to.path.endsWith("/") && to.path !== "/"
          ? to.path.slice(0, -1)
          : to.path;

      // initial name of final file (with last "/" stripped)
      // every route can redifine the name by its callback
      let filename = pathname;

      // find the best rule for route, currently the one defined last of all matching
      const bestMatch = hybridRoutes.routes.findLast(([regExp, route]) =>
        regExp.test(filename)
      );
      if (!bestMatch) return true;
      route = bestMatch[1];

      if (Object.hasOwn(route, "resFileHint")) {
        if (typeof route.resFileHint === "function") {
          const resFileHintParams = { pathname, query, queryObj, store };
          const cookies = process.env.SERVER
            ? Cookies.parseSSR(ssrContext)
            : Cookies;

          const cookieStr = Object.entries(cookies.getAll())
            .map(([key, value]) => `${key}=${value}`)
            .join("; ");

          let apiConfig = {};
          if (process.env.SERVER)
            apiConfig = { headers: { Cookie: cookieStr } };

          const api = createAPI(apiConfig);

          try {
            if (
              Object.hasOwn(route, "beforeNavigation") &&
              typeof route.beforeNavigation === "function"
            )
              resFileHintParams.data = await route.beforeNavigation({
                pathname,
                query,
                queryObj,
                api,
              });
            data = resFileHintParams.data;
          } catch (e) {
            console.log(e);
          }
          hint = await route.resFileHint(resFileHintParams);
        }
      }
    }

    if (route) {
      // call interceptor for working with stores if any
      const interceptor = hybridRoutes.interceptors.find(
        (i) => i.routeUrl === route.url
      );
      if (interceptor) interceptor.callback({ data });

      if (hint && hint.redirect) return hint.redirect; // redirect order
    }
  });

  Router.beforeEach(async (to) => {
    /*
    const teacherStore = useTeacherStore();
    const isTeacherPath = to.matched.some(
      (match) => match.path === "/teacher" || match.path === "/auth"
    );
    if (isTeacherPath) {
      let r = (await api.post("teacher/is-logged")).data;
      if (r.reqState !== null) console.log(r.reqState);

      if (r.result.hasOwnProperty("isLogged"))
        teacherStore.setIsLoggedAsTeacher(r.result.isLogged);

      if (teacherStore.isLoggedAsTeacher && to.name === "login")
        return { name: "schedule" };
      if (!teacherStore.isLoggedAsTeacher && to.name !== "login")
        return { name: "login" };
    }
    */
  });

  return Router;
});
