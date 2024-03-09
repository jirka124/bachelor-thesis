import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
import args from "./src/arg-parser.js";
import { fileStat, calcQuartiles } from "./src/utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lightConf = {
  extends: "lighthouse:default",
  settings: {
    onlyAudits: [
      "first-contentful-paint",
      "largest-contentful-paint",
      "first-meaningful-paint",
      "speed-index",
      "total-blocking-time",
      "max-potential-fid",
      "cumulative-layout-shift",
      "server-response-time",
      "interactive",
      "total-byte-weight",
      "network-requests",
      "mainthread-work-breakdown",
    ],
  },
};

/*
const lightConf = {
  extends: "lighthouse:default",
  settings: {
    onlyCategories: ["performance"],
  },
};
*/

const DEBUG = args.m === "debug";
const CONFIG = args.c || "empty";
const RUN_COUNT_DEBUG = 2;
const RUN_COUNT_BENCH = 10;

const genSet = new Set();

const {
  beforePerformPageTest,
  performAuth,
  reportName,
  beforeAuthUrls,
  afterAuthUrls,
} = await import(`./src/configs/${CONFIG}.js`);

const OUTPUT_DIR_ROOT = "reports";
const OUTPUT_DIR = path.join(OUTPUT_DIR_ROOT, reportName);

const performWebTest = async ({ browser, urls }) => {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    const runCount = DEBUG ? RUN_COUNT_DEBUG : RUN_COUNT_BENCH;

    if (Object.hasOwn(url, "sufix") && url.sufix.endsWith("_ISR")) {
      for (let i = 0; i < runCount; i++) {
        const modUrl = JSON.parse(JSON.stringify(url));
        modUrl.prefix = `RUN_${i}_`;
        modUrl.sufix = `${modUrl.sufix}_FIRST_PASS`;

        // for ex. clear ISR cache of page
        await beforePerformPageTest({ browser, url: modUrl });

        await performPageTest({ browser, url: modUrl });
      }

      for (let i = 0; i < runCount; i++) {
        const modUrl = JSON.parse(JSON.stringify(url));
        modUrl.prefix = `RUN_${i}_`;
        modUrl.sufix = `${modUrl.sufix}_SECOND_PASS`;
        await performPageTest({ browser, url: modUrl });
      }
    } else {
      for (let i = 0; i < runCount; i++) {
        const modUrl = JSON.parse(JSON.stringify(url));
        modUrl.prefix = `RUN_${i}_`;
        await performPageTest({ browser, url: modUrl });
      }
    }
  }
};

const performPageTest = async ({ browser, url }) => {
  // drop the port number from ID as its unique
  const parsedUrl = new URL(url.url);
  parsedUrl.port = "";
  const normUrl = parsedUrl.href;

  // Avoid double testing of page and notify about
  const reportName = `${url.prefix}${encodeURIComponent(normUrl)}${
    Object.hasOwn(url, "sufix") ? encodeURIComponent(url.sufix) : ""
  }.json`;
  if (genSet.has(reportName))
    return console.error(`Error: ${url.url} already tested!`);

  genSet.add(reportName);

  const { lhr } = await lighthouse(
    url.url,
    {
      port: new URL(browser.wsEndpoint()).port,
      output: "json",
    },
    lightConf
  );

  fs.writeFileSync(
    path.join(__dirname, OUTPUT_DIR, reportName),
    JSON.stringify(lhr, null, 2)
  );
};

const runBenchmark = async () => {
  const browser = await puppeteer.launch({
    headless: !DEBUG,
  });

  // delete the output folder if exists so output is always up to date
  const outDir = path.join(__dirname, OUTPUT_DIR);

  const folderStats = fileStat(outDir);

  if (folderStats && folderStats.isDirectory())
    fs.rmSync(outDir, { recursive: true });

  // create brand new output folder
  fs.mkdirSync(path.join(__dirname, OUTPUT_DIR), { recursive: true });

  // perform tests when not authenticated
  await performWebTest({ browser, urls: beforeAuthUrls });

  // perform authentication
  await performAuth({ browser });

  // perform tests when authenticated
  await performWebTest({ browser, urls: afterAuthUrls });

  await browser.close();
};

// count first quartile Q1, second quartile Q2 (median), third quartile Q3
const runAnalyze = () => {
  const audits = lightConf.settings.onlyAudits;
  const auditData = new Map();

  // resolve the results directory
  const reportDir = path.join(__dirname, OUTPUT_DIR);

  const folderStats = fileStat(reportDir);

  if (!folderStats || !folderStats.isDirectory()) return;

  // get list of all report files
  const reports = fs.readdirSync(reportDir);

  reports.map((report) => {
    // skip the group result file
    if (report === "group-result.json") return;

    // read file
    const json = JSON.parse(
      fs.readFileSync(path.join(reportDir, report), {
        encoding: "utf8",
        flag: "r",
      })
    );

    // extract data from file
    const data = {};

    audits.map((audit) => {
      if (audit === "network-requests")
        data[audit] = json.audits[audit].details.items.length;
      else data[audit] = json.audits[audit].numericValue;
    });

    // resolve the reportId by dropping RUN ID and URL decoding
    const dropRegExp = /^RUN_\d+_/;
    const reportId = decodeURIComponent(report.replace(dropRegExp, ""));

    // set extracted data to final analyze bundle
    let auditDataVal = auditData.get(reportId);
    if (!auditDataVal) {
      auditDataVal = [];
      auditData.set(reportId, auditDataVal);
    }

    auditDataVal.push(data);
  });

  // compute results Q1, Q2, Q3 for each data field
  auditData.forEach((auditDataVal, reportId) => {
    const results = {};

    audits.map((audit) => {
      const ad = auditDataVal.map((adv) => adv[audit]);

      results[audit] = calcQuartiles(ad.sort());
    });

    auditData.set(reportId, results);
  });

  fs.writeFileSync(
    path.join(__dirname, OUTPUT_DIR, "group-result.json"),
    JSON.stringify(Object.fromEntries(auditData.entries()), null, 2)
  );
};

// compare all of similar groups and generate a final report
// add an average category composed of app mean
// for each category includes below or above average percentage
// and total sum of all percentages
/*
scenerioId: {
  groupId: {
    reportId: {
      auditId: {
        q1: Number,
        q1-perc: Number,
        ...
      }
    }
  }
}
*/
const runCompare = () => {
  const finalData = new Map();

  // READ report groups in OUTPUT_DIR_ROOT
  const reportsDir = path.join(__dirname, OUTPUT_DIR_ROOT);

  const folderStats = fileStat(reportsDir);

  // harvest and group data
  if (!folderStats || !folderStats.isDirectory()) return;
  const reports = fs.readdirSync(reportsDir);

  // go through each group and join its results with results of similar categories
  reports.map((report) => {
    // ignore the final reports
    if (report === "final-result.json") return;
    if (report === "final-result-short.json") return;

    // check if group-result.json exists
    const groupFileStats = fileStat(
      path.join(reportsDir, report, "group-result.json")
    );

    if (!groupFileStats) return;

    // READ the result of group
    const json = JSON.parse(
      fs.readFileSync(path.join(reportsDir, report, "group-result.json"), {
        encoding: "utf8",
        flag: "r",
      })
    );

    // resolve the scenerio ID by dropping group
    const scenerioId = report.replace(/_nuxt|_quasar|_vue/, "");

    // join results with similar scenerios
    let finalDataVal = finalData.get(scenerioId);
    if (!finalDataVal) {
      finalDataVal = {};
      finalData.set(scenerioId, finalDataVal);
    }

    finalDataVal[report] = json;
  });

  // perform operations on top of data
  finalData.forEach((scenerioObj, scenerioId) => {
    const avgGroupObj = {};

    // calculate the average of similar groups
    Object.entries(scenerioObj).map(([groupId, groupObj]) => {
      Object.entries(groupObj).map(([reportId, reportObj]) => {
        Object.entries(reportObj).map(([auditId, auditObj]) => {
          Object.entries(auditObj).map(([qId, qVal]) => {
            if (!Object.hasOwn(avgGroupObj, reportId))
              avgGroupObj[reportId] = {};
            if (!Object.hasOwn(avgGroupObj[reportId], auditId))
              avgGroupObj[reportId][auditId] = {};
            if (!Object.hasOwn(avgGroupObj[reportId][auditId], qId))
              avgGroupObj[reportId][auditId][qId] = 0;

            avgGroupObj[reportId][auditId][qId] += qVal;
          });
        });
      });
    });

    // end calculation of average of similar groups
    Object.entries(avgGroupObj).map(([reportId, reportObj]) => {
      Object.entries(reportObj).map(([auditId, auditObj]) => {
        Object.entries(auditObj).map(([qId, qVal]) => {
          avgGroupObj[reportId][auditId][qId] /=
            Object.entries(scenerioObj).length;
        });
      });
    });

    // set the avg object to final result obj
    scenerioObj.average = avgGroupObj;

    // compute the below/above average for each of similar groups
    Object.entries(scenerioObj).map(([groupId, groupObj]) => {
      Object.entries(groupObj).map(([reportId, reportObj]) => {
        Object.entries(reportObj).map(([auditId, auditObj]) => {
          Object.entries(auditObj).map(([qId, qVal]) => {
            const avgVal = avgGroupObj[reportId][auditId][qId];
            auditObj[`${qId}-perc`] = ((qVal - avgVal) / avgVal) * 100;
          });
        });
      });
    });
  });

  // save the full final report
  fs.writeFileSync(
    path.join(__dirname, OUTPUT_DIR_ROOT, "final-result.json"),
    JSON.stringify(Object.fromEntries(finalData.entries()), null, 2)
  );

  // perform operations on top of data
  finalData.forEach((scenerioObj, scenerioId) => {
    // join audits of all reports of scenerio group and calculate average of it
    Object.entries(scenerioObj).map(([groupId, groupObj]) => {
      const reportJoinAudits = {};

      Object.entries(groupObj).map(([reportId, reportObj]) => {
        Object.entries(reportObj).map(([auditId, auditObj]) => {
          Object.entries(auditObj).map(([qId, qVal]) => {
            if (!Object.hasOwn(reportJoinAudits, auditId))
              reportJoinAudits[auditId] = {};
            if (!Object.hasOwn(reportJoinAudits[auditId], qId))
              reportJoinAudits[auditId][qId] = 0;

            reportJoinAudits[auditId][qId] += qVal;
          });
        });
      });

      const reportCount = Object.keys(groupObj).length;

      // delete reports so that only audits will remain in each group
      Object.keys(groupObj).map((reportId) => delete groupObj[reportId]);

      // end calculation of average for similar groups and set result to bundle
      Object.entries(reportJoinAudits).map(([auditId, auditObj]) => {
        Object.entries(auditObj).map(([qId, qVal]) => {
          reportJoinAudits[auditId][qId] /= reportCount;
          groupObj[auditId] = auditObj;
        });
      });
    });
  });

  // save the short final report
  fs.writeFileSync(
    path.join(__dirname, OUTPUT_DIR_ROOT, "final-result-short.json"),
    JSON.stringify(Object.fromEntries(finalData.entries()), null, 2)
  );
};

// start the code execution
const start = async () => {
  if (args.compare) return runCompare();

  await runBenchmark();
  runAnalyze();
};

await start();
