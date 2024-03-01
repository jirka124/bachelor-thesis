import { useAdminStore } from "@/stores/admin";
import { api } from "@/plugins/02.axios.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const adminStore = useAdminStore();
  const isAdminPath = to.path.startsWith("/admin");
  if (isAdminPath) {
    let r = (await api.post("admin/is-logged")).data;
    if (r.reqState !== null) console.log(r.reqState);

    if (r.result.hasOwnProperty("isLogged"))
      adminStore.setIsLoggedAsAdmin(r.result.isLogged);

    if (adminStore.isLoggedAsAdmin && to.name === "admin-login")
      return navigateTo({ name: "admin" });
    if (!adminStore.isLoggedAsAdmin && to.name !== "admin-login")
      return navigateTo({ name: "admin-login" });
  }
});
