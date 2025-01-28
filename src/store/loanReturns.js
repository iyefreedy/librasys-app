import api from '@/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoanReturnsStore = defineStore('loanReturns', () => {
    const loanReturns = ref([]);
    const loading = ref(false);
    const error = ref();

    const getLoanReturns = async () => {
        try {
            loading.value = true;
            const data = await api.getLoanReturns();

            loanReturns.value = data;
        } catch (err) {
            error.value = err.message || 'An unknown error occured';
        } finally {
            loading.value = false;
        }
    };

    const saveLoanReturns = async (loanReturn) => {
        try {
            loading.value = true;
            const { data } = await api.addLoanReturn(loanReturn);

            loanReturns.value = [...loanReturns.value, data];
        } catch (err) {
            error.value = err.message || 'An unknown error occured';
        } finally {
            loading.value = false;
        }
    };
    return { loanReturns, loading, error, getLoanReturns, saveLoanReturns };
});
