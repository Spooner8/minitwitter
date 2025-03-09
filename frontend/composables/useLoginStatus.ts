import { ref } from 'vue';

/**
 * @description
 * This composable is responsible for checking if the user is logged in by making a request to the server.
 * 
 * @returns {Object} an object containing the ref for the login status and the function to check the login status.
 */
export function useLoginStatus(): { isLoggedIn: globalThis.Ref<boolean, boolean>, checkLoginStatus: () => Promise<void> } {
    const api = useApi();
    const isLoggedIn = ref(false);

    /**
     * @description
     * Checks if the user is logged in by making a request to the server.
     * Sets the value of isLoggedIn to true if the user is logged in.
     */ 
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