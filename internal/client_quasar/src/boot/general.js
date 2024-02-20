import { boot } from "quasar/wrappers";
import globalMixin from "@/mixins/global.js";

export default boot(({ app, store, ssrContext }) => {
  // provisional add-utils
  app.provide("isClient", typeof window !== "undefined");
  app.provide("isServer", typeof window === "undefined");

  // use global mixin through-out app
  app.mixin(globalMixin);
});
