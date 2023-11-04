import axios from 'axios'

const api = axios.create({ baseURL: `${import.meta.env.PLANT_LEVIT_SERVER_API_PATH}`, withCredentials: true })

export default ({ app }) => {
  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$api = api
}

export { api }