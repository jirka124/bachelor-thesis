import axios from "axios";
import args from "../arg-parser.js";
import { delay } from "../utils.js";

const stack = args.a;
const port = stack === "vue" ? 5000 : 5173;

const REPORT_GROUP = `social_${stack}`;

const BEFORE_AUTH_URLS_DEBUG = [{ url: `http://localhost:${port}` }];

const BEFORE_AUTH_URLS_BENCH = [
  { url: `http://localhost:${port}` },
  { url: `http://localhost:${port}/app/login` },
  { url: `http://localhost:${port}/app/signup` },
  { url: `http://localhost:${port}/app/feed` },
  { url: `http://localhost:${port}/app/user/1`, sufix: "_ISR" },
];

const AFTER_AUTH_URLS_DEBUG = [
  { url: `http://localhost:${port}/app/feed`, sufix: "_AUTH" },
];

const AFTER_AUTH_URLS_BENCH = [
  { url: `http://localhost:${port}/app/feed`, sufix: "_AUTH" },
  { url: `http://localhost:${port}/app/c-post`, sufix: "_AUTH" },
  { url: `http://localhost:${port}/app/user/1`, sufix: "_AUTH_OWN_ISR" },
  { url: `http://localhost:${port}/app/user/2`, sufix: "_AUTH_OTHER_ISR" },
];

export const reportName = REPORT_GROUP;

export const beforeAuthUrls =
  args.m === "debug" ? BEFORE_AUTH_URLS_DEBUG : BEFORE_AUTH_URLS_BENCH;

export const afterAuthUrls =
  args.m === "debug" ? AFTER_AUTH_URLS_DEBUG : AFTER_AUTH_URLS_BENCH;

export const performAuth = async ({ browser }) => {
  const page = await browser.newPage();

  // navigate to url
  await page.goto(`http://localhost:${port}/app/login`, {
    waitUntil: "networkidle0",
  });

  // fill in name
  const loginIn1 = await page.waitForSelector(
    "#login-form-ins > input:nth-of-type(1)"
  );
  await loginIn1.type("root");

  // fill in password
  const loginIn2 = await page.waitForSelector(
    "#login-form-ins > input:nth-of-type(2)"
  );
  await loginIn2.type("root123");

  // submit login
  const submitBtn = await page.waitForSelector("#login-form > .btn-1");
  await submitBtn.click();

  // wait for login action response
  await page.waitForResponse(
    (response) => response.url() === "http://localhost:5000/api/user/login"
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
