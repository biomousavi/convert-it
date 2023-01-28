// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
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
