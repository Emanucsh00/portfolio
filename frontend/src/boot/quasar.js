import { Dialog, Loading, Notify, Quasar } from 'quasar';
import 'quasar/dist/quasar.css';
import '@quasar/extras/material-icons/material-icons.css';

export function installQuasar(app) {
  app.use(Quasar, {
    plugins: {
      Dialog,
      Loading,
      Notify
    },
    config: {
      brand: {
        primary: '#69503C',
        secondary: '#907761',
        accent: '#F7F1E1',
        dark: '#3C3C3C',
        positive: '#907761',
        negative: '#735945',
        info: '#666666',
        warning: '#C7B69F'
      }
    }
  });
}
