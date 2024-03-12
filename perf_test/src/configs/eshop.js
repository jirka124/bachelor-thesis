import axios from "axios";
import args from "../arg-parser.js";
import { delay } from "../utils.js";

const stack = args.a;
const port = stack === "vue" && args.m === "bench" ? 5000 : 5173;

const REPORT_GROUP = `eshop_${stack}`;

const BEFORE_AUTH_URLS_DEBUG = [
  { url: `http://localhost:${port}/product/1`, sufix: "_ISR" },
];

const BEFORE_AUTH_URLS_BENCH = [
  { url: `http://localhost:${port}` },
  { url: `http://localhost:${port}/about` },
  { url: `http://localhost:${port}/stock` },
  { url: `http://localhost:${port}/stock?sortType=aplha-z` },
  { url: `http://localhost:${port}/product/1`, sufix: "_ISR" },
  { url: `http://localhost:${port}/admin/login` },
];

const AFTER_AUTH_URLS_DEBUG = [
  { url: `http://localhost:${port}/admin`, sufix: "_AUTH" },
];

const AFTER_AUTH_URLS_BENCH = [
  { url: `http://localhost:${port}/admin`, sufix: "_AUTH" },
];

export const reportName = REPORT_GROUP;

export const beforeAuthUrls =
  args.m === "debug" ? BEFORE_AUTH_URLS_DEBUG : BEFORE_AUTH_URLS_BENCH;

export const afterAuthUrls =
  args.m === "debug" ? AFTER_AUTH_URLS_DEBUG : AFTER_AUTH_URLS_BENCH;

export const performAuth = async ({ browser }) => {
  const page = await browser.newPage();

  // navigate to url
  await page.goto(`http://localhost:${port}/admin/login`, {
    waitUntil: "networkidle0",
  });

  // fill in name
  const loginIn1 = await page.waitForSelector(
    "#admin-login-fields > input:nth-of-type(1)"
  );
  await loginIn1.type("root");

  // fill in password
  const loginIn2 = await page.waitForSelector(
    "#admin-login-fields > input:nth-of-type(2)"
  );
  await loginIn2.type("root123");

  // submit login
  const submitBtn = await page.waitForSelector("#admin-login-page > .btn-1");
  await submitBtn.click();

  // wait for login action response
  await page.waitForResponse(
    (response) => response.url() === "http://localhost:5000/api/admin/login"
  );
};

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
