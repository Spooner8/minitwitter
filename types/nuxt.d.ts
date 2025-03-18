import { AxiosInstance } from 'axios'

declare module '@nuxt/types' {
  interface NuxtApp {
    $axios: AxiosInstance
  }
}
