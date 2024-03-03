import axios from "axios";

const API_PATH = process.env.SO_CONNECT_SERVER_API_PATH;

const createAPI = (opts = {}) => {
  return axios.create({
    baseURL: API_PATH,
    withCredentials: true,
    ...opts,
  });
};

export default defineEventHandler(async (event) => {
  let url = new URL("http://none" + event.req.url);
  const pathname =
    url.pathname.endsWith("/") && url.pathname !== "/"
      ? url.pathname.slice(0, -1)
      : url.pathname;

  const isAppPath = pathname.startsWith("/app");

  if (isAppPath) {
    const cookies = event.req.headers.cookie;

    const api = createAPI({
      headers: {
        Cookie: cookies,
      },
    });

    let r = (await api.post("user/is-logged")).data;
    if (r.reqState !== null) console.log(r.reqState);

    if (
      r.result.isLogged &&
      (pathname === "/app/login" || pathname === "/app/signup")
    )
      return await sendRedirect(event, "/app/feed");
    if (!r.result.isLogged && pathname === "/app/c-post")
      return await sendRedirect(event, "/app/login");
  }
});
