import cjsToEs from "rollup-plugin-cjs-es";

export default {
  input: "./hybrid-routes-conf.js",
  output: {
    file: "./hybrid-routes-conf.cjs",
    format: "cjs",
  },
  plugins: [cjsToEs()],
};
