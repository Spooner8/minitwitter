export default defineNuxtRouteMiddleware(async () => {
  const { api } = useApi();

  try {
    const response = await api.get('/api/auth/loginstatus');
    if (!response.data.isLoggedIn) {
      return navigateTo('/login-required');
    }
  } catch (error) {
    console.error('Error checking login status:', error);
    return navigateTo('/login-required');
  }
});