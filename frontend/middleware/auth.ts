import axios from 'axios'

export default defineNuxtRouteMiddleware(async () => {
  try {
    const response = await axios.get('/api/auth/loginstatus')
    if (!response.data.isLoggedIn) {
      return navigateTo('/login-required');
    }
  } catch (error) {
    console.error('Error checking login status:', error);
    return navigateTo('/login-required');
  }
});