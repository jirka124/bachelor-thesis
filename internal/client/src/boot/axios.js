import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.ATT_TRACK_SERVER_API_PATH}`,
  withCredentials: true
})

export default ({ app }) => {
  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$api = api
}

export { api }
