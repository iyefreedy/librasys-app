import api from '@/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBooksStore = defineStore('books', () => {
    const books = ref([]);
    const loading = ref(false);
    const error = ref();

    const getBooks = async () => {
        try {
            loading.value = true;

            const data = await api.getBooks();

            books.value = data;
        } catch (err) {
            error.value = err.message || 'An unknown error occured';
        } finally {
            loading.value = false;
        }
    };

    const saveBook = async (book) => {
        console.log(book);
        try {
            loading.value = true;
            if (book.id) {
                const data = await api.editBook(book);
                const filteredBooks = books.value.filter((value) => value.id !== book.id);
                books.value = [...filteredBooks, data];
            } else {
                const data = await api.addBook(book);
                books.value = [...books.value, data];
            }
        } catch (err) {
            console.log(err);
            error.value = err.message ?? 'An unknown error occured';
        } finally {
            loading.value = false;
        }
    };

    const removeBook = async (book) => {
        console.log(book);
        try {
            loading.value = true;
            await api.deleteBook(book);
            const filteredBooks = books.value.filter((value) => value.id !== book.id);
            books.value = filteredBooks;
        } catch (err) {
            console.log(err);
            error.value = err.message ?? 'An unknown error occured';
        } finally {
            loading.value = false;
        }
    };

    return { books, loading, error, getBooks, saveBook, removeBook };
});
