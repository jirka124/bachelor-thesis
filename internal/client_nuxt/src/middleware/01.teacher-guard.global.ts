import { useTeacherStore } from "@/stores/teacher";
import { createAPI } from "@/plugins/02.axios.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const teacherStore = useTeacherStore();
  const isTeacherPath = to.path.startsWith("/teacher");
  const isAuthPath = to.path.startsWith("/auth");

  if (isTeacherPath || isAuthPath) {
    let opts = {};

    if (process.server) {
      const cookies = useRequestHeaders(["cookie"]).cookie;
      opts = {
        headers: {
          Cookie: cookies,
        },
      };
    }

    const api = createAPI(opts);

    let r = (await api.post("teacher/is-logged")).data;
    if (r.reqState !== null) console.log(r.reqState);

    if (r.result.hasOwnProperty("isLogged"))
      teacherStore.setIsLoggedAsTeacher(r.result.isLogged);

    if (teacherStore.isLoggedAsTeacher && to.name === "login")
      return navigateTo({ name: "schedule" });
    if (!teacherStore.isLoggedAsTeacher && to.name !== "login")
      return navigateTo({ name: "login" });
  }
});
