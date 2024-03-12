import args from "../arg-parser.js";

const stack = args.a;
const port = stack === "vue" && args.m === "bench" ? 5000 : 5173;

const REPORT_GROUP = `presentation_${stack}`;

const BEFORE_AUTH_URLS_DEBUG = [{ url: `http://localhost:${port}` }];

const BEFORE_AUTH_URLS_BENCH = [{ url: `http://localhost:${port}` }];

const AFTER_AUTH_URLS_DEBUG = [];

const AFTER_AUTH_URLS_BENCH = [];

export const reportName = REPORT_GROUP;

export const beforeAuthUrls =
  args.m === "debug" ? BEFORE_AUTH_URLS_DEBUG : BEFORE_AUTH_URLS_BENCH;

export const afterAuthUrls =
  args.m === "debug" ? AFTER_AUTH_URLS_DEBUG : AFTER_AUTH_URLS_BENCH;

export const performAuth = async ({ browser }) => {};

export const beforePerformPageTest = async ({ browser, url }) => {};

export default {
  beforePerformPageTest,
  performAuth,
  reportName,
  beforeAuthUrls,
  afterAuthUrls,
};
