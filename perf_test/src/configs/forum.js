import axios from "axios";
import args from "../arg-parser.js";
import { delay } from "../utils.js";

const stack = args.a;
const port = stack === "vue" && args.m === "bench" ? 5000 : 5173;

const REPORT_GROUP = `forum_${stack}`;

const BEFORE_AUTH_URLS_DEBUG = [{ url: `http://localhost:${port}` }];

const BEFORE_AUTH_URLS_BENCH = [
  { url: `http://localhost:${port}` },
  { url: `http://localhost:${port}/ask-guest` },
  { url: `http://localhost:${port}/search-guest` },
  { url: `http://localhost:${port}/discuss-guest/1`, sufix: "_ISR" },
];

const AFTER_AUTH_URLS_DEBUG = [];

const AFTER_AUTH_URLS_BENCH = [];

export const reportName = REPORT_GROUP;

export const beforeAuthUrls =
  args.m === "debug" ? BEFORE_AUTH_URLS_DEBUG : BEFORE_AUTH_URLS_BENCH;

export const afterAuthUrls =
  args.m === "debug" ? AFTER_AUTH_URLS_DEBUG : AFTER_AUTH_URLS_BENCH;

export const performAuth = async ({ browser }) => {};

export const beforePerformPageTest = async ({ browser, url }) => {
  // skip for vue as no ISR endpoint exists
  if (stack === "vue") return;

  const urlObj = new URL(url.url);

  // send route invalidation to SSR API
  await axios.post(
    `http://localhost:${port}/api/path-reinv`,
    {
      secret: "03BnAni__ge5BlŁDE$GG541E",
      paths: [`${urlObj.pathname}${urlObj.search}`],
    },
    { withCredentials: true }
  );

  // give ISR time to invalidate route, TEMP workaround
  await delay(2000);
};

export default {
  beforePerformPageTest,
  performAuth,
  reportName,
  beforeAuthUrls,
  afterAuthUrls,
};
