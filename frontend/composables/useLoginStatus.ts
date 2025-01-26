import { ref } from 'vue';
import axios from 'axios';

export function useLoginStatus() {
  const isLoggedIn = ref(false);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('/api/auth/loginstatus');
      isLoggedIn.value = response.data.isLoggedIn;
    } catch (error) {
      console.error('Login status error:', error);
      isLoggedIn.value = false;
    }
  };

  return { isLoggedIn, checkLoginStatus };
}