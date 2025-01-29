import { NuxtApp } from '@nuxt/types'

declare module '@nuxt/types' {
  interface NuxtApp {
    $axios: any
  }
}
