import axios from "axios";

const API_PATH = import.meta.env
  ? import.meta.env.SO_CONNECT_SERVER_API_PATH
  : process.env
  ? process.env.SO_CONNECT_SERVER_API_PATH
  : null;

const createAPI = (opts = {}) => {
  return axios.create({
    baseURL: API_PATH,
    withCredentials: true,
    ...opts,
  });
};
const api = createAPI();

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      axios,
      api,
    },
  };
});

export { api, createAPI };
