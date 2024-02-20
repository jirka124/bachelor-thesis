/* NOTE: always edit .js not .cjs. ES version is serverd as rollup source for CJS version */

const routeList = () => {
  return {
    "/home-guest": { type: "ssg" },
    "/search-guest": { type: "ssg" },
    "/ask-guest": { type: "ssg" },
    "/discuss-guest/*": { type: "isr" },
    // "/admin/login": { type: "csr" },
    // default { type: "ssr" },
    // { type: "isr", ttl: null (never expire-should use on-demand) }
    // provide list of route suffixes with { type: "...", list: ["..."] }
  };
};

const hybridRoutes = () => {
  const routes = Object.entries(routeList()).map(([key, value]) => {
    // remove trailing / character if not / path
    let url = key.endsWith("/") && key !== "/" ? key.slice(0, -1) : key;

    // match a single * and resolve it as allow 1+ of not "/" chars
    // for /a/* will allow /a/b but not /a/b/c, ...
    url = url.replaceAll(/(?<!\*)\*(?!\*)/g, "[^/]+");

    // match a double ** preceded by / and resolve it as allow 1+ of any characters
    // for /a/** will allow /a/b and /a/b/c, ... but not /a
    url = url.replaceAll("/**", "/.+");

    // match a double ** and resolve it as allow 0+ of any characters
    // for /a** will allow /a and /a/b and /a/b/c, ...
    url = url.replaceAll("**", ".*");

    const regExp = new RegExp(`^${url}$`);
    return [regExp, { ...value, url: key }];
  });

  const obj = {
    routes,
    interceptors: [],
    addIterceptURL(routeUrl, callback) {
      const interceptorInd = this.interceptors.findIndex(
        (i) => i.routeUrl === routeUrl
      );
      if (interceptorInd < 0) this.interceptors.push({ routeUrl, callback });
    },
    delIterceptURL(routeUrl, callback) {
      const interceptorInd = this.interceptors.findIndex(
        (i) => i.routeUrl === routeUrl
      );
      if (interceptorInd > -1) this.interceptors.splice(interceptorInd, 1);
    },
  };

  return obj;
};

export default hybridRoutes;
