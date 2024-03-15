/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js
const path = require("node:path");
const fs = require("fs").promises;

const { configure } = require("quasar/wrappers");

const prepareIndexSPA = async ({ quasarConf }) => {
  const {
    transformHtml,
  } = require("@quasar/app-vite/lib/helpers/html-template.js");
  const indexHTML = await fs.readFile(
    path.join(__dirname, `index.html`),
    "utf8"
  );

  const origMode = quasarConf.ctx.mode;
  const origModeName = quasarConf.ctx.modeName;

  quasarConf.ctx.mode = { spa: true };
  quasarConf.ctx.modeName = "spa";
  quasarConf.htmlVariables.MODE = "spa";

  let html = transformHtml(indexHTML, quasarConf);

  let outDir = path.join(__dirname, ".quasar/");
  if (quasarConf.ctx.prod) {
    outDir = path.join(__dirname, "dist/ssr/");

    const files = await fs.readdir(
      path.join(__dirname, `dist/ssr/client/assets`)
    );
    const jsRegex = /^index\.[a-z0-9]+\.js$/;
    const cssRegex = /^index\.[a-z0-9]+\.css$/;

    const indexJSFile = files.find((file) => jsRegex.test(file));
    const indexCSSFile = files.find((file) => cssRegex.test(file));

    const devEntry =
      "<script type=module src=/.quasar/client-entry.js></script>";
    const prodEntry = `
      <script type="module" crossorigin src="/assets/${indexJSFile}"></script>
      <link rel="stylesheet" href="/assets/${indexCSSFile}" />
    `;
    html = html.replace(devEntry, prodEntry);
  }

  await fs.mkdir(path.join(outDir, "hybrid_render/spa/"), { recursive: true });
  await fs.writeFile(path.join(outDir, `hybrid_render/spa/index.html`), html);

  quasarConf.ctx.mode = origMode;
  quasarConf.ctx.modeName = origModeName;
  quasarConf.htmlVariables.MODE = origModeName;
};

const preparePm2EcoSys = async ({ quasarConf }) => {
  // prepare pm2 ecosystem file for production run
  const ecoSysSrc = path.join(__dirname, `prod-ecosystem.config.js`);
  const ecoSysDest = path.join(__dirname, `dist/ssr/ecosystem.config.js`);
  const ecoSysStats = await fs.stat(ecoSysSrc).catch((e) => null);

  if (ecoSysStats) await fs.copyFile(ecoSysSrc, ecoSysDest);
};

const prepareSysEnv = async ({ quasarConf }) => {
  // prepare .env file based on used environment
  const usedEnvSrc = path.join(
    __dirname,
    `.env.${quasarConf.ctx.prod ? "production" : "development"}.local`
  );
  const usedEnvDest = path.join(__dirname, `dist/ssr/.env`);
  const usedEnvStats = await fs.stat(usedEnvSrc).catch((e) => null);

  if (usedEnvStats) await fs.copyFile(usedEnvSrc, usedEnvDest);
};

const prepareGenSSG = async ({ quasarConf }) => {
  // prepare script used for ssg-generation of pages
  const genSrc = path.join(__dirname, `ssg-generate.js`);
  const genDest = path.join(__dirname, `dist/ssr/ssg-generate.js`);
  const genStats = await fs.stat(genSrc).catch((e) => null);

  if (genStats) await fs.copyFile(genSrc, genDest);
};

module.exports = configure(function (ctx) {
  return {
    eslint: {
      // fix: true,
      // include: [],
      // exclude: [],
      // rawOptions: {},
      warnings: true,
      errors: true,
    },

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ["general", "axios"],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ["main.css"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
      // "roboto-font", // optional, you are not bound to it
      // "material-icons", // optional, you are not bound to it
      // "fontawesome-v6",
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16",
      },

      // workaround to allow using multiple .env files
      env: (async () => {
        let myEnv = {};
        const dotenv = require("dotenv");
        const dotenvExpand = require("dotenv-expand");

        myEnv = dotenv.config({
          path: path.join(
            __dirname,
            `.env.${ctx.prod ? "production" : "development"}.local`
          ),
        });
        dotenvExpand.expand(myEnv);
        return myEnv;
      })(),

      afterDev: async ({ quasarConf }) => {
        // prepare dev SPA client entry index file
        if (quasarConf.ctx.modeName === "ssr")
          await prepareIndexSPA({ quasarConf });
      },

      afterBuild: async ({ quasarConf }) => {
        if (quasarConf.ctx.modeName === "ssr") {
          /*  PREPARE PRODUCTION READY ASSETS  */

          // prepare pm2 ecosystem file for production run
          await preparePm2EcoSys({ quasarConf });

          // prepare .env file based on used environment
          await prepareSysEnv({ quasarConf });

          // prepare script used for ssg-generation of pages
          await prepareGenSSG({ quasarConf });

          // prepare prod SPA client entry index file
          await prepareIndexSPA({ quasarConf });
        }
      },

      alias: {
        "quasar/dist/quasar.css": path.resolve(
          __dirname,
          "./src/css/quasar.css"
        ),
      },
      vueRouterMode: "history", // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // analyze: true,
      // env: {},
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      extendViteConf(viteConf) {
        viteConf.envPrefix = "SO_CONNECT_";
        Object.assign(viteConf.resolve.alias, {
          "@": path.join(__dirname, "./src"),
        });
      },
      // viteVuePluginOptions: {},

      // vitePlugins: [
      //   [ 'package-name', { ..options.. } ]
      // ]
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      // https: true
      open: false, // opens browser window automatically
      port: 5173,
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {},

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ["Cookies"],
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#property-sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   registerServiceWorker: 'src-pwa/register-service-worker',
    //   serviceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 5173, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        "hybrid-render",
        "render", // keep this as last one
      ],
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: "generateSW", // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      useCredentialsForManifestTag: false,
      // useFilenameHashes: true,
      // extendGenerateSWOptions (cfg) {}
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      // specify the debugging port to use for the Electron app when running in development mode
      inspectPort: 5858,

      bundler: "packager", // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: "client_quasar",
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: ["my-content-script"],

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    },
  };
});
