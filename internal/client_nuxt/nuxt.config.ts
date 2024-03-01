const path = require("node:path");
const fs = require("fs").promises;

// load the ENV vars
const env = (() => {
  let myEnv = {};
  const dotenv = require("dotenv");
  const dotenvExpand = require("dotenv-expand");

  myEnv = dotenv.config({
    path: path.join(__dirname, `.env.${process.env.NODE_ENV}.local`),
  });
  dotenvExpand.expand(myEnv);
  return myEnv;
})();

const preparePm2EcoSys = async () => {
  // prepare pm2 ecosystem file for production run
  const ecoSysSrc = path.join(__dirname, `prod-ecosystem.config.js`);
  const ecoSysDest = path.join(
    __dirname,
    `.output/server/ecosystem.config.cjs`
  );
  const ecoSysStats = await fs.stat(ecoSysSrc).catch((e) => null);

  if (ecoSysStats) await fs.copyFile(ecoSysSrc, ecoSysDest);
};

const prepareSysEnv = async () => {
  // prepare .env file based on used environment
  const usedEnvSrc = path.join(__dirname, `.env.${process.env.NODE_ENV}.local`);
  const usedEnvDest = path.join(__dirname, `.output/server/.env`);
  const usedEnvStats = await fs.stat(usedEnvSrc).catch((e) => null);

  if (usedEnvStats) await fs.copyFile(usedEnvSrc, usedEnvDest);
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          // get Google Oswald font
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Oswald",
        },
      ],
      script: [
        {
          // get Fontawesome icons
          src: "https://kit.fontawesome.com/e84002e394.js",
          crossorigin: "anonymous",
          defer: true,
        },
      ],
    },
  },
  devServer: {
    port: 5173, // set development port
  },
  css: ["~/assets/main.css"], // require global CSS
  srcDir: "src/", // define own src directory (as in Vue.js)
  modules: ["@pinia/nuxt"], // integrate Pinia module
  hooks: {
    "vite:extendConfig"(config, { isClient, isServer }) {
      // Set environment variable prefix
      config.envPrefix = "ATT_TRACK_";
    },
    "pages:extend"(pages) {
      // alter the auto resolved name of layout prefixed pages to page only, etc...
      const route = pages.map((r) => {
        if (r.name.startsWith("auth-")) r.name = r.name.replace(/^auth-/, "");
        else if (r.name.startsWith("teacher-"))
          r.name = r.name.replace(/^teacher-/, "");

        if (r.name === "write-attend-classId") r.name = "write-attend";
        else if (r.name === "read-attend-classId") r.name = "read-attend";
        else if (r.name === "edit-class-classId") r.name = "edit-class";
        else if (r.name === "edit-att-attendId") r.name = "edit-att";

        if (r.name === "schedule") r.alias = "/teacher";
      });

      pages.push({ path: "/", redirect: "/teacher" });
    },
    async "nitro:build:public-assets"() {
      // generate production ready files
      await preparePm2EcoSys();
      await prepareSysEnv();
    },
  },
  // based on https://stackoverflow.com/questions/75849646/can-you-invalidate-swr-static-routes-depending-on-user-actions-using-hybrid-rend
  nitro: {
    // create nitro storage for isr pages using file-system structure
    storage: {
      db: {
        driver: "fs",
        base: "./.data/db",
      },
    },
  },
  // define rendering techniques on per page/pattern bases
  routeRules: {
    "/teacher/**": {
      ssr: false,
    },
  },
});
