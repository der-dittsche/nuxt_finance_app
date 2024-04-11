// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
        tailwindcss: {
            editorSupport: true
        },
        devtools: {enabled: true},
        modules: [
            '@nuxt/ui',
            '@nuxtjs/supabase'],
        supabase: {
            redirect: true,
        },
        runtimeConfig: {
            public: {
                baseUrl: process.env.BASE_URL ?? 'http://localhost:3000'
            }
        }
    }
)
