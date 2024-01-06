import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import globalMixin from '@/mixins/global.js'
import bootAxios from '@/boot/axios.js'

const app = createApp(App)
const pinia = createPinia()

app.provide('isClient', typeof window !== 'undefined')
app.provide('isServer', typeof window === 'undefined')
app.use(pinia)
app.use(router)
app.mixin(globalMixin)

const boot = async () => {
  await bootAxios({ app, router, store: pinia })

  app.mount('#app')
}

try {
  boot()
} catch (e) {
  console.error(e)
  app.mount('#app')
}
