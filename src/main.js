import { createPinia } from 'pinia'
import { createApp } from 'vue'

import i18n from '@/locales'
import router from '@/router'

import App from '@/App.vue'

import '@/assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

app.mount('#app')
