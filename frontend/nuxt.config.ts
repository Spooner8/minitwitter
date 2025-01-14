// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/google-fonts',
  ],
  googleFonts: {
    families: {
      Montserrat: true,
    },
  },
  devServer: {
    port: 4000,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:80',
      // apiBaseUrl: 'http://localhost:3000',
    },
  },
})