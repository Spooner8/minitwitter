import { ref } from 'vue';

export function useLoginStatus() {
    const { api } = useApi();
    const isLoggedIn = ref(false);

    const checkLoginStatus = async () => {
        try {
            const response = await api.get('/api/auth/loginstatus');
            isLoggedIn.value = response.data.isLoggedIn;
        } catch (error) {
            console.error('Login status error:', error);
            isLoggedIn.value = false;
        }
    };

    return { isLoggedIn, checkLoginStatus };
}