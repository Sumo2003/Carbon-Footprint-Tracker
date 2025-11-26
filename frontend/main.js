import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'   // ✅ import router (new file we’ll make)

const app = createApp(App)

app.use(router)   // ✅ tell Vue to use the router
app.mount('#app')

