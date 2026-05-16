import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { installAxios } from './boot/axios';
import { initializeFirebase } from './boot/firebase';
import { installQuasar } from './boot/quasar';
import router from './router';
import './styles/app.scss';

const app = createApp(App);
const pinia = createPinia();

initializeFirebase();
app.use(pinia);
installQuasar(app);
installAxios(app, pinia);
app.use(router);
app.mount('#app');
