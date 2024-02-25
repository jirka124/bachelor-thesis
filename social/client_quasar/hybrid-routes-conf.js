/* NOTE: always edit .js not .cjs. ES version is serverd as rollup source for CJS version */

const loggedUserBefNav = async ({ api }) => {
  // allows fetching data needed for resolving file hint
  let r = (await api.post("user/is-logged")).data;
  if (r.reqState !== null) console.log(r.reqState);

  if (r.result.hasOwnProperty("isLogged"))
    return { isLogged: r.result.isLogged };
  return { isLogged: false };
};

const loggedUserResHint = async ({ pathname, query, data }) => {
  // allows defining custom filenames for saved html files, redirecting or jumping to normal SSR render
  if (
    data &&
    data.isLogged &&
    (pathname === "/app/login" || pathname === "/app/signup")
  )
    return { redirect: "/app/feed" };
  if (
    data &&
    !data.isLogged &&
    pathname !== "/app/login" &&
    pathname !== "/app/signup" &&
    pathname !== "/app" &&
    pathname !== "/app/feed"
  )
    return { redirect: "/app/login" };
  return { filepath: pathname };
};

const routeList = () => {
  return {
    "/": { type: "ssg" },
    "/app**": {
      type: "ssg",
      list: ["/app/feed", "/app/c-post", "/app/login", "/app/signup"],
      beforeNavigation: loggedUserBefNav,
      resFileHint: loggedUserResHint,
    },
    "/app/user/*": {
      type: "isr",
      beforeNavigation: async ({ api, pathname }) => {
        // allows fetching data needed for resolving file hint
        const userId = parseInt(pathname.split("/").pop()) || null;

        let rPromise = api.post("user/is-logged");
        let nPromise = api.post("user/view-user-profile-prefetch", { userId });

        const [r, n] = (await Promise.all([rPromise, nPromise])).map(
          (res) => res.data
        );
        if (r.reqState !== null) console.log(r.reqState);
        if (n.reqState !== null) console.log(n.reqState);

        const data = {};
        data.isLogged = r.result.hasOwnProperty("isLogged")
          ? r.result.isLogged
          : false;
        data.userObj = n.result.hasOwnProperty("userObj")
          ? n.result.userObj
          : null;

        return data;
      },
      resFileHint: async ({ pathname, query, data }) => {
        // allows defining custom filenames for saved html files, redirecting or jumping to normal SSR render
        let access = "guest";
        if (data && data.userObj && data.userObj.accessLevel)
          access = data.userObj.accessLevel;

        return { filepath: pathname, filename: `${access}-view.html` };
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
