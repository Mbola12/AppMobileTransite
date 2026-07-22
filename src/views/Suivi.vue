<script setup>
import {ref, computed, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import ButtonRetour from "../components/ButtonRetour.vue";
import SearchBar from "../components/SearchBar.vue";
import CardSuiv from "../components/Card/CardSuiv.vue";
import SuiviDetailsModal from "../components/Modal/SuiviDetailsModal.vue";
import axiosInstance from "../config/AxiosInstance.js";
import pathAPI from "../utils/pathAPI/pathAPI.js";
import debounce from "lodash/debounce.js";
import {useI18n} from 'vue-i18n';
import localstorageService from "@/utils/localstorageService.js";
import FilterDashboard from "@/components/Modal/FilterDashboard.vue";
import toast from "@/utils/toast.js";
const {t} = useI18n();

const route = useRoute();
const isConventionnel = computed(() => route.query.type !== 'container');

const search = ref('');
const isModalVisible = ref(false);
const selectedCardNavire = ref(null);
const elementDetails= ref([]);
const totalItems = ref(0);
const is_open = ref(false);
const navires = ref([]);
const downloadingId = ref(null);

const filtre = ref({
    filter: '',
    date_debut: '',
    date_fin: '',
    sort: 'date_enlevement|desc',
    page: '1',
    per_page: '15',
    date_debuts: '',
    date_fins: '',
    client_id: localstorageService.getIDclient(),
})


const openModal = ()=> {
    is_open.value = true;
}

const closeModal= ()=> {
    is_open.value = false;
}

const fetchAll = async () => {

    try {
        const response = await axiosInstance.get(pathAPI.suivieenlevement.fetchAll, { params: filtre.value });
        navires.value = response.data.data;
        totalItems.value = response.data.total;
    } catch (e) {
        console.log(e)
    } finally {

    }
}
const handlePageChange = (page) => {
    filtre.value.page = page;
    fetchAll();
};

async function handleCardClick(id) {
    const link = pathAPI.suivieenlevement.detail+"/"+id
    const response = await axiosInstance.get(link);
    elementDetails.value = response.data.element;

    selectedCardNavire.value = id;
    isModalVisible.value = true;
}

function handleModalClose() {
    isModalVisible.value = false;
    selectedCardNavire.value = null;
}

async function handleDownloadReport(navire) {
    downloadingId.value = navire.id;
    try {
        const formulaire = new FormData();
        formulaire.append('id_suivie_enlevement', navire.id);
        const response = await axiosInstance.post(pathAPI.suivieenlevement.printElement, formulaire);
        if (response.data.success === true) {
            window.open(response.data.file_url, '_blank');
        } else {
            toast.showToast({msg: response.data.message || 'Erreur lors de la génération du rapport.', type: 'error'});
        }
    } catch (e) {
        toast.showToast({msg: 'Une erreur est survenue.', type: 'error'});
    } finally {
        downloadingId.value = null;
    }
}

const debouncedFetchNavire = debounce(fetchAll, 300);
const onSearch = (data)=> {
    filtre.value.date_debuts = data.fromDate;
    filtre.value.date_fins = data.toDate;

    closeModal();
    fetchAll();
}
const addData = ()=> {
    openModal();
}
onMounted(() => {
    fetchAll();
})
</script>

<template>
    <a-layout class="min-h-screen bg-secondary pt-16">

        <ButtonRetour :title="t('suivie.list_suivie_enlevement')"/>

        <a-layout-content class="!p-6 max-w-screen-2xl bg-gray-100 mx-auto w-full rounded-t-3xl">

            <div class="mb-2">
                <SearchBar v-model="filtre.filter" @input="debouncedFetchNavire"/>
            </div>
            <a-button @click="addData" class="!bg-primary !text-white hover:!bg-secondary hover:!text-white">
                <font-awesome-icon
                    icon="fa-solid fa-filter"
                    class="mr-2"
                />
                {{t('tableau_bord.filtrer_par')}}
            </a-button>

            <div class="grid grid-cols-1 sm:grid-cols-2 pt-6 md:grid-cols-3 lg:grid-cols-4 gap-12">
                <CardSuiv
                    v-for="navire in navires"
                    :key="navire.id"
                    :date="navire.date_enlevement_formatted"
                    :nom-navire="navire.nom_navire"
                    :show-menu="isConventionnel"
                    :download-loading="downloadingId === navire.id"
                    @click="handleCardClick(navire.id)"
                    @download-report="handleDownloadReport(navire)"
                    :class="selectedCardNavire === navire.id ? 'border-amber-200 shadow-lg' : ''"
                    statut=""/>
            </div>

            <div class="text-center pt-4">
                <a-pagination
                    v-model:current="(filtre.page)"
                    :total="totalItems"
                    :pageSize="parseInt(filtre.per_page)"
                    @change="handlePageChange"
                    show-less-items
                />
            </div>

            <SuiviDetailsModal
                v-if="selectedCardNavire"
                :open="isModalVisible"
                :navire="selectedCardNavire"
                :elements="elementDetails"
                @close="handleModalClose"/>
        </a-layout-content>

        <FilterDashboard :titre="t('tableau_bord.filtrer_par')"
                         :open="is_open" @close="closeModal"
                         @onSearch="onSearch"
                         :show_magasin="false"
                         :show_navire="false"
                         :show_bl="false"
                         :show_declaration="false"
        >

        </FilterDashboard>
    </a-layout>
</template>
