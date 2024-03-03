import { useUserStore } from "@/stores/user";
import { createAPI } from "@/plugins/02.axios.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  const isAppPath = to.path.startsWith("/app");

  if (isAppPath) {
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

    let r = (await api.post("user/is-logged")).data;
    if (r.reqState !== null) console.log(r.reqState);

    if (r.result.hasOwnProperty("isLogged"))
      userStore.setIsLogged(r.result.isLogged);

    if (userStore.isLogged && (to.name === "login" || to.name === "signup"))
      return navigateTo({ name: "feed" });
    if (!userStore.isLogged && to.name === "create-post")
      return navigateTo({ name: "login" });
  }
});
