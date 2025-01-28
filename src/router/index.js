import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/store/auth';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: {
                        auth: true
                    }
                },
                {
                    path: '/members',
                    name: 'members',
                    component: () => import('@/views/Members.vue'),
                    meta: {
                        auth: true
                    }
                },
                {
                    path: '/books',
                    name: 'books',
                    component: () => import('@/views/Books.vue'),
                    meta: {
                        auth: true
                    }
                },
                {
                    path: '/loans',
                    name: 'loans',
                    component: () => import('@/views/Loans.vue'),
                    meta: {
                        auth: true
                    }
                }
            ]
        },

        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue'),
            meta: {
                guest: true
            }
        }
    ]
});

router.beforeEach(async (to) => {
    const authStore = useAuthStore();

    await authStore.authenticate();

    if (authStore.user && to.meta.guest) {
        return { name: 'dashboard' };
    }

    if (!authStore.user && to.meta.auth) {
        return { name: 'login' };
    }
});

export default router;
