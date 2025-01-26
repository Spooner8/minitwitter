export function useCurrentUser() {
    interface IUser {
        id: number;
        username: string;
    }

    const { api } = useApi();
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