import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from '#imports'
import type { AxiosInstance } from 'axios'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp()
  const $axios = nuxtApp.$axios as AxiosInstance

  try {
    const response = await $axios.get('/api/auth/loginstatus')
    if (!response.data.isLoggedIn) {
      return navigateTo('/login-required')
    }
  } catch (error) {
    console.error('Error checking login status:', error)
    return navigateTo('/login-required')
  }
})