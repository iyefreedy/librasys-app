<script setup>
import { useBooksStore } from '@/store/books';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';

const toast = useToast();
const booksStore = useBooksStore();

const book = ref({});
const selectedBooks = ref();
const booksDataTable = ref();
const bookDialog = ref(false);
const submitted = ref(false);
const deleteBookDialog = ref(false);
const deleteBooksDialog = ref(false);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    await booksStore.getBooks();
});

function editBook(item) {
    book.value = { ...item };
    bookDialog.value = true;
}

function confirmDeleteBook(item) {
    book.value = item;
    deleteBookDialog.value = true;
}

function exportCSV() {
    booksDataTable.value.exportCSV();
}

function openNew() {
    book.value = {};
    submitted.value = false;
    bookDialog.value = true;
}

function confirmDeleteSelected() {
    deleteBooksDialog.value = true;
}

function hideDialog() {
    bookDialog.value = false;
    submitted.value = false;
}

async function saveBook() {
    submitted.value = true;

    await booksStore.saveBook(book.value);

    bookDialog.value = false;
    book.value = {};
}

async function deleteBook() {
    await booksStore.removeBook(book.value);
    deleteBookDialog.value = false;

    book.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Member Deleted', life: 3000 });
}

async function deleteSelectedBooks() {
    for (let member of selectedBooks.value) {
        await booksStore.removeBook(member);
    }
    deleteBooksDialog.value = false;
    selectedBooks.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Members Deleted', life: 3000 });
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedBooks || !selectedBooks.length" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable ref="booksDataTable" :value="booksStore.books" v-model:selection="selectedBooks">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Books</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="title" header="Title" sortable style="min-width: 16rem"></Column>
                <Column field="year" header="Year" sortable style="min-width: 16rem"></Column>
                <Column field="author" header="Author" sortable style="min-width: 16rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editBook(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteBook(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="bookDialog" :style="{ width: '450px' }" header="Book Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="title" class="block font-bold mb-3">Title</label>
                    <InputText id="title" v-model.trim="book.title" required="true" autofocus :invalid="submitted && !book.title" fluid />
                    <small v-if="submitted && !book.title" class="text-red-500">Title is required.</small>
                </div>
                <div>
                    <label for="author" class="block font-bold mb-3">Author</label>
                    <InputText id="author" v-model.trim="book.author" required="true" autofocus :invalid="submitted && !book.author" fluid />
                    <small v-if="submitted && !book.author" class="text-red-500">Author is required.</small>
                </div>
                <div>
                    <label for="year" class="block font-bold mb-3">Year</label>
                    <InputText id="year" v-model.trim="book.year" required="true" autofocus :invalid="submitted && !book.year" fluid />
                    <small v-if="submitted && !book.year" class="text-red-500">Year is required.</small>
                </div>
                <div>
                    <label for="genre" class="block font-bold mb-3">Genre</label>
                    <InputText id="genre" v-model.trim="book.genre" required="true" autofocus :invalid="submitted && !book.genre" fluid />
                    <small v-if="submitted && !book.genre" class="text-red-500">Genre is required.</small>
                </div>
                <div>
                    <label for="copies" class="block font-bold mb-3">Copies</label>
                    <InputText id="copies" type="number" v-model="book.copies" required="true" autofocus :invalid="submitted && !book.copies" fluid />
                    <small v-if="submitted && !book.copies" class="text-red-500">Copies is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveBook" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteBookDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="book"
                    >Are you sure you want to delete <b>{{ book.title }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteBookDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteBook" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteBooksDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="book">Are you sure you want to delete the selected members?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteBooksDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedBooks" />
            </template>
        </Dialog>
    </div>
</template>
