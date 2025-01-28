import api from '@/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoansStore = defineStore('loans', () => {
    const loans = ref([]);
    const loading = ref(false);
    const error = ref();

    const getLoans = async () => {
        try {
            loading.value = true;
            const data = await api.getLoans();

            loans.value = data;
        } catch (err) {
            error.value = err.message || 'An unknown error occured';
        } finally {
            loading.value = false;
        }
    };

    const saveLoan = async (loan) => {
        try {
            loading.value = true;
            if (loan.id) {
                const data = await api.editLoan(loan);
                const filteredLoans = loans.value.filter((value) => value.id !== data.id);

                loans.value = [...filteredLoans, data];
            } else {
                const data = await api.addLoan(loan);

                loans.value = [...loans.value, data];
            }
        } catch (err) {
            error.value = err.message || 'An unknown error occured';
        } finally {
            loading.value = false;
        }
    };
    return { loans, loading, error, getLoans, saveLoan };
});
