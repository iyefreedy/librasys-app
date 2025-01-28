<script setup>
import { useMembersStore } from '@/store/members';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';

const membersDataTable = ref();
const member = ref({});
const memberDialog = ref(false);
const submitted = ref(false);
const selectedMembers = ref();
const deleteMemberDialog = ref(false);
const deleteMembersDialog = ref(false);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const toast = useToast();
const membersStore = useMembersStore();

onMounted(async () => {
    await membersStore.getMembers();
});

function openNew() {
    member.value = {};
    submitted.value = false;
    memberDialog.value = true;
}

function confirmDeleteSelected() {
    deleteMembersDialog.value = true;
}

function editMember(mem) {
    member.value = { ...mem };
    memberDialog.value = true;
}

function confirmDeleteMember(mem) {
    member.value = mem;
    deleteMemberDialog.value = true;
}

function hideDialog() {
    memberDialog.value = false;
    submitted.value = false;
}

async function saveMember() {
    submitted.value = true;

    await membersStore.saveMember(member.value);

    memberDialog.value = false;
    member.value = {};
}

async function deleteMember() {
    await membersStore.removeMember(member.value);
    deleteMemberDialog.value = false;

    member.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Member Deleted', life: 3000 });
}

async function deleteSelectedMembers() {
    for (let member of selectedMembers.value) {
        await membersStore.removeMember(member);
    }
    deleteMembersDialog.value = false;
    selectedMembers.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Members Deleted', life: 3000 });
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedMembers || !selectedMembers.length" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>
            <DataTable ref="membersDataTable" :value="membersStore.members" v-model:selection="selectedMembers">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Members</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>

                <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>
                <Column field="email" header="Email" sortable style="min-width: 16rem"></Column>
                <Column field="phone" header="Phone" sortable style="min-width: 12rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editMember(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteMember(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="memberDialog" :style="{ width: '450px' }" header="Member Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="member.name" required="true" autofocus :invalid="submitted && !member.name" fluid />
                    <small v-if="submitted && !member.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Email</label>
                    <InputText id="email" type="email" v-model.trim="member.email" required="true" autofocus :invalid="submitted && !member.email" fluid />
                    <small v-if="submitted && !member.email" class="text-red-500">Email is required.</small>
                </div>
                <div>
                    <label for="phone" class="block font-bold mb-3">Phone</label>
                    <InputText id="phone" v-model.trim="member.phone" required="true" autofocus :invalid="submitted && !member.phone" fluid />
                    <small v-if="submitted && !member.phone" class="text-red-500">Phone is required.</small>
                </div>
                <div>
                    <label for="address" class="block font-bold mb-3">Address</label>
                    <Textarea id="address" v-model="member.address" required="true" rows="3" cols="20" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveMember" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteMemberDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="member"
                    >Are you sure you want to delete <b>{{ member.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteMemberDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteMember" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteMembersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="member">Are you sure you want to delete the selected members?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteMembersDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedMembers" />
            </template>
        </Dialog>
    </div>
</template>
