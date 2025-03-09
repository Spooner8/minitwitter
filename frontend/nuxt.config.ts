// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-01-08',
    devtools: { enabled: true },
    ssr: false,
    modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxtjs/google-fonts'],
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
            apiBaseUrl: 'http://localhost:3000',
        },
    },
});
