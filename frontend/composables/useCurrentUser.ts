/**
 * @description
 * This composable is responsible for getting the current user from the server.
 * 
 * @returns {Object} an object with a referance to the current user and a function to get the current user.
 */
interface IUser {
    id: number;
    username: string;
}

export function useCurrentUser(): { currentUser: Ref<IUser | null>, getCurrentUser: () => Promise<void> } {

    const api = useApi();
    const currentUser: Ref<IUser | null> = ref(null);

    const getCurrentUser = async () => {
        try {
            const response = await api.get('api/auth/loginstatus');
            currentUser.value = response.data.user;
        } catch (error) {
            console.error('Login status error:', error);
            currentUser.value = null;
        }
    };

    return { currentUser, getCurrentUser };
}