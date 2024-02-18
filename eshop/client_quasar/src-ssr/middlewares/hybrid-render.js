import { ssrMiddleware } from "quasar/wrappers";
import { Cookies } from "quasar";
import { createAPI } from "../../src/boot/axios.js";
import bodyParser from "body-parser";
const fs = require("fs").promises;
const path = require("path");
const hybridRoutes = require("../../hybrid-routes-conf.cjs")();

const resHubSrc = process.env.PROD ? "hybrid_render" : ".quasar/hybrid_render";

const renderPage = async ({ route, fullFilepath, render, req, res, next }) => {
  let html = null;
  try {
    html = await render({ req, res });

    // ensure lazy-save of page if is not ssg
    if (route.type !== "ssg") {
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    }
  } catch (e) {
    console.error(e);
    return next();
  }
  if (html !== null) {
    await fs.mkdir(path.dirname(fullFilepath), { recursive: true });
    await fs.writeFile(fullFilepath, html);
  }
  if (route.type === "ssg") {
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  }
};

export default ssrMiddleware(({ app, resolve, render, serve }) => {
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.post("/api/path-reinv", async (req, res, next) => {
    if (
      Object.hasOwn(req.body, "secret") &&
      req.body.secret === process.env.PLANT_LEVIT_SERVER_ON_DEMAND_SECRET &&
      Object.hasOwn(req.body, "paths")
    ) {
      if (Array.isArray(req.body.paths)) {
        req.body.paths.map(async (path) => {
          let url = new URL("http://none" + path);
          const pathname =
            url.pathname.endsWith("/") && url.pathname !== "/"
              ? url.pathname.slice(0, -1)
              : url.pathname;

          // find the best rule for route, currently the one defined last of all matching
          const bestMatch = hybridRoutes.routes.findLast(([regExp, route]) =>
            regExp.test(pathname)
          );
          if (bestMatch) {
            const route = bestMatch[1];
            if (
              Object.hasOwn(route, "resFileHint") &&
              typeof route.resFileHint === "function"
            ) {
              // delete all .html files in folder
              const fullFolderpath = resolve.root(
                resHubSrc,
                route.type,
                pathname
              );
              const fileStats = await fs
                .stat(fullFolderpath)
                .catch((e) => null);

              if (fileStats && fileStats.isDirectory()) {
                await fs
                  .readdir()
                  .filter((fname) => fname.endsWith(".html"))
                  .map((fname) => {
                    fs.unlink(path.join(fullFolderpath, fname));
                  });
              }
            } else {
              // delete only the index.html
              const fullFilepath = resolve.root(
                resHubSrc,
                route.type,
                pathname,
                "index.html"
              );
              const fileStats = await fs.stat(fullFilepath).catch((e) => null);
              if (fileStats) fs.unlink(fullFilepath);
            }
          }
        });
      } else if (req.body.paths === "REINV_ALL") {
        const fullFolderpath = resolve.root(resHubSrc, "isr");
        fs.stat(fullFolderpath)
          .then((fileStats) => {
            if (fileStats && fileStats.isDirectory())
              fs.rm(fullFolderpath, { recursive: true });
          })
          .catch((e) => null);
      }

      res.sendStatus(200);
    } else res.sendStatus(403);
  });

  app.use(async (req, res, next) => {
    req.hybridRender = req.hybridRender || {};

    // evaluate resources that do not need pathname normalization and skip them
    const toSkip = [".js", ".css", ".woff2", ".jpg", ".png", ".webp"];
    if (toSkip.some((ext) => req.path.endsWith(ext))) return next();

    let url = new URL("http://none" + req.originalUrl);
    const query = url.search;
    const queryObj = Object.fromEntries(url.searchParams.entries());
    const pathname =
      url.pathname.endsWith("/") && url.pathname !== "/"
        ? url.pathname.slice(0, -1)
        : url.pathname;

    // initial name of final file (with last "/" stripped)
    // every route can redifine the name by its callback
    let filename = null,
      filepath = pathname;

    // find the best rule for route, currently the one defined last of all matching
    const bestMatch = hybridRoutes.routes.findLast(([regExp, route]) =>
      regExp.test(filepath)
    );
    if (bestMatch) {
      const route = bestMatch[1];

      if (Object.hasOwn(route, "resFileHint")) {
        if (typeof route.resFileHint === "function") {
          const resFileHintParams = { pathname, query, queryObj };
          const cookies = Cookies.parseSSR({ req, res });

          const cookieStr = Object.entries(cookies.getAll())
            .map(([key, value]) => `${key}=${value}`)
            .join("; ");

          const api = createAPI({
            headers: {
              Cookie: cookieStr,
            },
          });

          try {
            if (
              Object.hasOwn(route, "beforeNavigation") &&
              typeof route.beforeNavigation === "function"
            ) {
              resFileHintParams.data = await route.beforeNavigation({
                pathname,
                query,
                queryObj,
                api,
              });
              req.hybridRender.data = resFileHintParams.data;
            }
          } catch (e) {
            console.log(e);
          }
          const hint = await route.resFileHint(resFileHintParams);

          if (hint.redirect) return res.redirect(hint.redirect); // redirect order
          if (hint.filepath === null) return next(); // skip action, go to SSR
          if (Object.hasOwn(hint, "url")) req.hybridRender.ownUrl = hint.url;
          if (Object.hasOwn(hint, "filename")) filename = hint.filename;
          if (Object.hasOwn(hint, "filepath")) filepath = hint.filepath;
        }
      }

      req.hybridRender.filepath = filepath;
      req.hybridRender.filename = filename;
      req.hybridRender.route = route;
    }
    next();
  });

  // process hybrid routing (ISR, SSG, CSR)
  app.get(resolve.urlPath("*"), async (req, res, next) => {
    if (req.hybridRender && req.hybridRender.route) {
      const route = req.hybridRender.route;

      req.hybridRender.initialUrl = req.url;

      if (route.type === "csr") {
        const fullFilepath = resolve.root(resHubSrc, "spa/index.html");
        const fileStats = await fs.stat(fullFilepath).catch((e) => null);

        if (fileStats) return res.sendFile(fullFilepath);
        throw new Error("could not send SPA index.html");
      } else if (route.type === "ssg" || route.type === "isr") {
        // Resolve defined filepath if defined, if not default to pathname of url
        let filepath = req.hybridRender.filepath;
        if (!req.hybridRender.filepath) {
          let url = new URL("http://none" + req.originalUrl);
          filename =
            url.pathname.endsWith("/") && url.pathname !== "/"
              ? url.pathname.slice(0, -1)
              : url.pathname;
        }

        // Resolve defined filename if defined and make sure it is .html, if not default to index.html
        let filename = req.hybridRender.filename;
        if (!req.hybridRender.filename) filename = "index.html";
        else if (!filename.endsWith(".html")) filename = `${filename}.html`;

        // set requested url to defined one, or leave only the pathname section
        if (req.hybridRender.ownUrl) req.url = req.hybridRender.ownUrl;
        else req.url = filepath;

        const fullFilepath = resolve.root(
          resHubSrc,
          route.type,
          filepath,
          filename
        );
        const fileStats = await fs.stat(fullFilepath).catch((e) => null);

        let renderRequired = !fileStats;
        if (
          route.type === "isr" &&
          fileStats &&
          route.ttl !== null &&
          route.ttl !== undefined
        ) {
          // ttl in secs if not undefined or null meaning never expire
          const ttl = Number(route.ttl) || 0;
          if ((new Date() - new Date(fileStats.mtime)) / 1000 > ttl)
            renderRequired = true;
        }

        if (!renderRequired) return res.sendFile(fullFilepath);
        else await renderPage({ route, fullFilepath, render, req, res, next });
      } else next();
    } else next();
  });

  // Reset initial URL for the purpose of SSR render resolvement
  app.get(resolve.urlPath("*"), async (req, res, next) => {
    if (req.hybridRender.initialUrl) req.url = req.hybridRender.initialUrl;
    next();
  });
});
