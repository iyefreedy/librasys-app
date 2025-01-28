import api from '@/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMembersStore = defineStore('members', () => {
    const members = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const getMembers = async () => {
        try {
            loading.value = true;
            const data = await api.getMembers();

            members.value = data;
        } catch (err) {
            error.value = err.message ?? 'An unknown error occured';
        } finally {
            loading.value = false;
        }
    };

    const saveMember = async (member) => {
        console.log(member);
        try {
            loading.value = true;
            if (member.id) {
                const data = await api.editMember(member);
                const filteredMembers = members.value.filter((value) => value.id !== member.id);
                members.value = [...filteredMembers, data];
            } else {
                const data = await api.addMember(member);
                members.value = [...members.value, data];
            }
        } catch (err) {
            console.log(err);
            error.value = err.message ?? 'An unknown error occured';
        } finally {
            loading.value = false;
        }
    };

    const removeMember = async (member) => {
        console.log(member);
        try {
            loading.value = true;
            await api.deleteMember(member);
            const filteredMembers = members.value.filter((value) => value.id !== member.id);
            members.value = filteredMembers;
        } catch (err) {
            console.log(err);
            error.value = err.message ?? 'An unknown error occured';
        } finally {
            loading.value = false;
        }
    };

    return { members, getMembers, saveMember, removeMember };
});
