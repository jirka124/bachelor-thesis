import axios from "axios";

const API_PATH = process.env.ATT_TRACK_SERVER_API_PATH;

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

  const isTeacherPath = pathname.startsWith("/teacher");
  const isAuthPath = pathname.startsWith("/auth");
  if (isTeacherPath || isAuthPath) {
    const cookies = event.req.headers.cookie;

    const api = createAPI({
      headers: {
        Cookie: cookies,
      },
    });

    let r = (await api.post("teacher/is-logged")).data;
    if (r.reqState !== null) console.log(r.reqState);

    if (r.result.isLogged && pathname === "/auth/login")
      return await sendRedirect(event, "/teacher/schedule");
    if (!r.result.isLogged && pathname !== "/auth/login")
      return await sendRedirect(event, "/auth/login");
  }
});
