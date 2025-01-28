import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    if ((config.method === 'post' || config.method === 'put' || config.method === 'delete') && !Cookies.get('XSRF-TOKEN')) {
        return setCsrfCookie().then(() => config);
    }

    return config;
});

const setCsrfCookie = async () => {
    return api.get('/sanctum/csrf-cookie');
};

export default {
    async login({ email, password }) {
        return api.post('/login', { email, password });
    },
    async authentica() {
        return api.get('/api/user');
    },
    async getMembers() {
        const { data } = await api.get('/api/members');

        return data.data;
    },
    async addMember(member) {
        const { data } = await api.post('/api/members', member);

        return data.data;
    },
    async editMember(member) {
        const { data } = await api.put(`/api/members/${member.id}`, member);

        return data.data;
    },
    async deleteMember(member) {
        return await api.delete(`/api/members/${member.id}`);
    },
    async getBooks() {
        const { data } = await api.get('/api/books');

        return data.data;
    },
    async addBook(book) {
        const { data } = await api.post('/api/books', book);

        return data.data;
    },
    async editBook(book) {
        const { data } = await api.put(`/api/books/${book.id}`, book);

        return data.data;
    },
    async deleteBook(book) {
        return await api.delete(`/api/books/${book.id}`);
    },
    async getLoans() {
        const { data } = await api.get('/api/loans');

        return data.data;
    },
    async addLoan(loan) {
        const { data } = await api.post('/api/loans', loan);

        return data.data;
    },
    async editLoan(loan) {
        const { data } = await api.put(`/api/loans/${loan.id}`, loan);

        return data.data;
    },
    async deleteLoan(loan) {
        return await api.delete(`/api/loans/${loan.id}`);
    },
    async getLoanReturns() {
        const { data } = await api.get('/api/returns');

        return data.data;
    },
    async addLoanReturn(loanReturn) {
        const { data } = await api.post('/api/returns', loanReturn);

        return data.data;
    },
    async editLoanReturn(loanReturn) {
        const { data } = await api.put(`/api/returns/${loanReturn.id}`, loanReturn);

        return data.data;
    },
    async deleteLoanReturn(loanReturn) {
        return await api.delete(`/api/returns/${loanReturn.id}`);
    }
};
