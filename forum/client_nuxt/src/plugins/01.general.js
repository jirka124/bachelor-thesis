import globalMixin from "@/mixins/global.js";

export default defineNuxtPlugin((nuxtApp) => {
  // provisional add-utils
  nuxtApp.vueApp.provide("isClient", typeof window !== "undefined");
  nuxtApp.vueApp.provide("isServer", typeof window === "undefined");

  // use global mixin through-out app
  nuxtApp.vueApp.mixin(globalMixin);
});
