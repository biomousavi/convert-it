import { createVuetify } from 'vuetify';
import { mdi } from 'vuetify/iconsets/mdi-svg';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    icons: {
      defaultSet: 'mdi',
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#2c7ef9',
            background: '#f5f5f5',
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
