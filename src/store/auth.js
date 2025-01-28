import api from '@/api';
import router from '@/router';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const error = ref(null);
    const loading = ref(false);

    const login = async ({ email, password }) => {
        try {
            loading.value = true;

            await api.login({ email, password });

            router.push('/');
        } catch (error) {
            error.value = error.message || 'An unknow error occured';
        } finally {
            loading.value = false;
        }
    };

    const authenticate = async () => {
        try {
            loading.value = true;

            const { data } = await api.authentica();

            user.value = data;
        } catch (error) {
            error.value = error.message || 'An unknow error occured';
        } finally {
            loading.value = false;
        }
    };

    return { user, error, login, authenticate };
});
