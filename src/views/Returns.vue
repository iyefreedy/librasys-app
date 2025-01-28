<script setup>
import { useLoanReturnsStore } from '@/store/loanReturns';
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';

const loanReturnsStore = useLoanReturnsStore();

const loanDataTable = ref();
const loanReturn = ref({});
const loanReturnDialog = ref(false);
const submitted = ref(false);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    await loanReturnsStore.getLoanReturns();
});

function openNew() {
    loanReturn.value = {};
    submitted.value = false;
    loanReturnDialog.value = true;
}

function exportCSV() {
    loanDataTable.value.exportCSV();
}

function hideDialog() {
    loanReturnDialog.value = false;
    submitted.value = false;
}

async function saveLoan() {
    submitted.value = true;

    await loanReturnsStore.saveLoanReturns(loanReturn.value);

    loanReturnDialog.value = false;
    loanReturn.value = {};
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable ref="loanDataTable" :value="loansStore.loans">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Loans</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="member.name" header="Member" style="min-width: 16rem"></Column>
                <Column field="book.title" header="Book" style="min-width: 16rem"></Column>
                <Column field="loan_date" header="Loan Date">Loan Date</Column>
                <Column field="due_date" header="Due Date">Due Date</Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="loanReturnDialog" :style="{ width: '450px' }" header="Loan Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="member_id" class="block font-bold mb-3">Member</label>
                    <Select id="member_id" v-model="loanReturn.member_id" :options="membersStore.members" filter option-value="id" optionLabel="name" placeholder="Select a member" fluid></Select>
                </div>
                <div>
                    <label for="book_id" class="block font-bold mb-3">Book</label>
                    <Select id="book_id" v-model="loanReturn.book_id" :options="booksStore.books" filter option-value="id" optionLabel="title" placeholder="Select a book" fluid></Select>
                </div>
                <div>
                    <label for="loan_date" class="block font-bold mb-3">Loan Date</label>
                    <DatePicker id="loan_date" v-model="loanReturn.loan_date" fluid></DatePicker>
                </div>
                <div>
                    <label for="due_date" class="block font-bold mb-3">Due Date</label>
                    <DatePicker id="due_date" v-model="loanReturn.due_date" fluid></DatePicker>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveLoan" />
            </template>
        </Dialog>
    </div>
</template>
