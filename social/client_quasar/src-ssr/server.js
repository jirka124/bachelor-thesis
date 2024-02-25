/**
 * More info about this file:
 * https://v2.quasar.dev/quasar-cli-vite/developing-ssr/ssr-webserver
 *
 * Runs in Node context.
 */

/**
 * Make sure to yarn add / npm install (in your project root)
 * anything you import here (except for express and compression).
 */
import express from "express";
import compression from "compression";
import axios from "axios";
import fs from "fs";
import path from "path";
import {
  ssrClose,
  ssrCreate,
  ssrListen,
  ssrRenderPreloadTag,
  ssrServeStaticContent,
} from "quasar/wrappers";

import hybridRoutesFunc from "../hybrid-routes-conf.js";

const hybridRoutes = hybridRoutesFunc();

const ssgRoutes = hybridRoutes.routes
  .filter((r) => r[1].type === "ssg")
  .map((r) => {
    const route = r[1];
    if (Array.isArray(route.list) && route.list.length > 0) {
      return route.list.map((rr) => {
        let prefix = "";
        if (!route.url.includes("*") && !rr.startsWith(route.url))
          prefix = route.url;
        if (rr.startsWith("?")) return `${prefix}${rr}`;
        if (rr.startsWith("/")) return `${prefix}${rr}`;
        return `${prefix}/${rr}`;
      });
    } else if (route.url.includes("*"))
      console.log(
        `${route.url} is not primitive, please provide list of urls...`
      );
    return route.url;
  })
  .flat();

/**
 * Create your webserver and return its instance.
 * If needed, prepare your webserver to receive
 * connect-like middlewares.
 *
 * Should NOT be async!
 */
export const create = ssrCreate((/* { ... } */) => {
  const app = express();

  // attackers can use this header to detect apps running Express
  // and then launch specifically-targeted attacks
  app.disable("x-powered-by");

  // place here any middlewares that
  // absolutely need to run before anything else
  if (process.env.PROD) {
    app.use(compression());
  }

  return app;
});

/**
 * You need to make the server listen to the indicated port
 * and return the listening instance or whatever you need to
 * close the server with.
 *
 * The "listenResult" param for the "close()" definition below
 * is what you return here.
 *
 * For production, you can instead export your
 * handler for serverless use or whatever else fits your needs.
 */
export const listen = ssrListen(async ({ app, port, isReady }) => {
  await isReady();

  const server = app.listen(port, async () => {
    if (process.env.PROD) {
      console.log("Server listening at port " + port);
    }

    // check if generation is needed for any routes
    let shouldRunGenerate = ssgRoutes.length > 0;

    // check if gone through generation already for prod, if yes do not generate
    if (process.env.PROD && shouldRunGenerate) {
      const filePath = path.join(__dirname, "hybrid_render/ssg");
      const fileStats = await fs.promises.stat(filePath).catch((e) => null);
      if (fileStats) shouldRunGenerate = false;
    }

    // if dev then delete all ssg assets
    if (process.env.DEV && shouldRunGenerate)
      await fs.promises
        .rm(path.join(__dirname, "../hybrid_render/ssg"), {
          recursive: true,
        })
        .catch((e) => null);

    if (shouldRunGenerate) {
      // get details of running server
      const usedPort = server.address().port;
      let usedHostname = server.address().address;
      usedHostname =
        usedHostname === "0.0.0.0" || usedHostname === "::"
          ? "localhost"
          : usedHostname;

      // compose url pointing to the running server
      const urlPrefix = `http://${usedHostname}:${usedPort}`;

      // run ssg generation for every page
      await Promise.all(
        ssgRoutes.map(async (ssgRoute) => {
          //if(ssgRoute.)
          //list
          await axios.get(`${urlPrefix}${ssgRoute}`).catch((error) => {
            console.error("Error:", error);
          });
        })
      );

      // kill instance if was generating and is not dev
      if (process.env.PROD) process.exit(0);
    }
  });

  return server;
});

/**
 * Should close the server and free up any resources.
 * Will be used on development only when the server needs
 * to be rebooted.
 *
 * Should you need the result of the "listen()" call above,
 * you can use the "listenResult" param.
 *
 * Can be async.
 */
export const close = ssrClose(({ listenResult }) => {
  return listenResult.close();
});

const maxAge = process.env.DEV ? 0 : 1000 * 60 * 60 * 24 * 30;

/**
 * Should return middleware that serves the indicated path
 * with static content.
 */
export const serveStaticContent = ssrServeStaticContent((path, opts) => {
  return express.static(path, {
    maxAge,
    ...opts,
  });
});

const jsRE = /\.js$/;
const cssRE = /\.css$/;
const woffRE = /\.woff$/;
const woff2RE = /\.woff2$/;
const gifRE = /\.gif$/;
const webpRE = /\.webp$/;
const jpgRE = /\.jpe?g$/;
const pngRE = /\.png$/;

/**
 * Should return a String with HTML output
 * (if any) for preloading indicated file
 */
export const renderPreloadTag = ssrRenderPreloadTag((file) => {
  if (jsRE.test(file) === true) {
    return `<link rel="modulepreload" href="${file}" crossorigin>`;
  }

  if (cssRE.test(file) === true) {
    return `<link rel="stylesheet" href="${file}">`;
  }

  if (woffRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  }

  if (woff2RE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  }

  if (gifRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/gif">`;
  }

  if (webpRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/webp">`;
  }

  // disable preload of .jpg and .png as being used as backup for webp
  /*if (jpgRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  }*/

  /*if (pngRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/png">`;
  }*/

  return "";
});
