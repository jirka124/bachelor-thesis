/* NOTE: always edit .js not .cjs. ES version is serverd as rollup source for CJS version */

const routeList = () => {
  return {
    "/": { type: "ssg" },
    "/stock": {
      type: "ssg",
      list: ["/", "?sortType=sell", "?sortType=aplha-a"],
      resFileHint: async ({ pathname, query, queryObj, data }) => {
        if (Object.hasOwn(queryObj, "sortType"))
          query = `?sortType=${queryObj.sortType}`;
        else query = "";

        return {
          filepath: `${pathname}`,
          filename: `${encodeURIComponent(query)}`,
          url: `${pathname}${query}`,
        };
      },
    },
    "/about": { type: "ssg" },
    "/product/*": { type: "isr" },
    "/admin**": {
      type: "csr",
      beforeNavigation: async ({ api }) => {
        // allows fetching data needed for resolving file hint
        let r = (await api.post("admin/is-logged")).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("isLogged"))
          return { isLogged: r.result.isLogged };
        return { isLogged: false };
      },
      resFileHint: async ({ pathname, query, data }) => {
        // allows defining custom filenames for saved html files, redirecting or jumping to normal SSR render
        if (data.isLogged && pathname === "/admin/login")
          return { redirect: "/admin" };
        if (!data.isLogged && pathname !== "/admin/login")
          return { redirect: "/admin/login" };
        return { filename: pathname };
      },
    },
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
