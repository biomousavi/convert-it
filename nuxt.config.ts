// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  ssr: false,
  css: ['vuetify/dist/vuetify.min.css'],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    // Vuetify vite treeshaking plugin
    (_, nuxt) => {
      // @ts-ignore
      nuxt.hooks.hook('vite:extendConfig', (config) => config?.plugins.push(vuetify()));
    },
  ],
});
