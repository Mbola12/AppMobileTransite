<script setup>
import ButtonRetour from "../components/ButtonRetour.vue";
import {ref, computed, onMounted} from "vue"
import {useRoute} from 'vue-router';
import axiosInstance from "../config/AxiosInstance.js";
import pathAPI from "../utils/pathAPI/pathAPI.js";
import toast from "../utils/toast.js";
import SearchBar from "@/components/SearchBar.vue";
import debounce from "lodash/debounce.js";
import FormUser from "@/components/Modal/FormUser.vue";
import { Modal } from 'ant-design-vue';
import {useI18n} from 'vue-i18n';
import localstorageService from "@/utils/localstorageService.js";
import FilterDashboard from "@/components/Modal/FilterDashboard.vue";
import CardDossier from "@/components/Card/CardDossier.vue";
import DossierDetailsModal from "@/components/Modal/DossierDetailsModal.vue";
const {t} = useI18n();

const route = useRoute();
const isContainer = computed(() => route.query.type === 'container');

const totalItems = ref(0);
const is_open = ref(false);
const filtre = ref({
    filter: '',
    date_debuts: new Date().toISOString().split('T')[0],
    date_fins: new Date().toISOString().split('T')[0],
    id_navire: '',
    nom_entrepot: '',
    id_client: localstorageService.getIDclient(),
    sort: 'id|asc',
    page: '1',
    per_page: '20',
    bill_of_lading: '',
    num_declration: '',
});


const data= ref([]);

const fetchData = async ()=> {
    const response = await axiosInstance.get(pathAPI.tableaubord.fetchAll,{params: filtre.value});
    data.value =response.data.data;
    totalItems.value = response.data.total;
}


const addData = ()=> {
    openModal();
}

const openModal = ()=> {
    is_open.value = true;
}

const closeModal= ()=> {
    is_open.value = false;
}
const debouncedFetchNavire = debounce(fetchData, 300);


const onSearch = (data)=> {
    filtre.value.date_debuts = data.fromDate;
    filtre.value.date_fins = data.toDate;
    filtre.value.id_navire = data.ship;
    filtre.value.nom_entrepot = data.warehouse;
    filtre.value.bill_of_lading = data.bill_of_lading;
    filtre.value.num_declration = data.num_declration;

    closeModal();
    fetchData();
}

const handlePageChange = (page) => {
    filtre.value.page = page;
    fetchData();
};

const isoToFrDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
};

const printLoading = ref(false);

const printSuivieenlevement = async () => {
    printLoading.value = true;
    try {
        const element = JSON.stringify({
            date_debut: isoToFrDate(filtre.value.date_debuts),
            date_fin: isoToFrDate(filtre.value.date_fins),
            id_navire: filtre.value.id_navire,
            nom_entrepot: filtre.value.nom_entrepot,
            bill_of_lading: filtre.value.bill_of_lading,
            colonne_critere: '',
            filter: filtre.value.filter,
        });
        const formulaire = new FormData();
        formulaire.append('element', element);
        const response = await axiosInstance.post(pathAPI.tableaubord.print, formulaire);
        if (response.data.success === true) {
            window.open(response.data.file_url, '_blank');
        } else {
            toast.showToast({msg: response.data.message || 'Erreur lors de la génération du PDF.', type: 'error'});
        }
    } catch (e) {
        toast.showToast({msg: 'Une erreur est survenue.', type: 'error'});
    } finally {
        printLoading.value = false;
    }
};

// --- Tableau de bord Container (Suivi des BL) ---
const currentYear = new Date().getFullYear();
const filtreContainer = ref({
    date_debut: `01/01/${currentYear}`,
    date_fin: `31/12/${currentYear}`,
    search: '',
});
const dossiersContainer = ref([]);
const containerPage = ref(1);
const containerTotalItems = ref(0);
const containerPerPage = 25;
const statutFiltre = ref(['en_cours', 'non_cloture', 'cloture']);
const statutLegende = computed(() => [
    {value: 'cloture', label: t('tableau_bord.statut_cloture'), colorClass: 'statut-cloture'},
    {value: 'en_cours', label: t('tableau_bord.statut_en_cours'), colorClass: 'statut-en-cours'},
    {value: 'non_cloture', label: t('tableau_bord.statut_non_cloture'), colorClass: 'statut-non-cloture'},
]);

const selectedContainerBL = ref(null);
const isContainerModalVisible = ref(false);
const containerDossierDetail = ref(null);

const fetchContainerDossiers = async () => {
    const formulaire = new FormData();
    formulaire.append('date_debut', filtreContainer.value.date_debut);
    formulaire.append('date_fin', filtreContainer.value.date_fin);
    formulaire.append('search', filtreContainer.value.search);
    formulaire.append('type_filtre', 'ouverture_bl_numero');
    formulaire.append('client_id', localstorageService.getIDclient());
    formulaire.append('page', containerPage.value);
    formulaire.append('per_page', containerPerPage);
    statutFiltre.value.forEach(statut => formulaire.append('statuts[]', statut));

    const response = await axiosInstance.post(pathAPI.dossier.dashboardsuiviebl, formulaire);
    dossiersContainer.value = response.data.data;
    containerTotalItems.value = response.data.total;
    containerPage.value = response.data.current_page;
};

const debouncedFetchContainer = debounce(() => {
    containerPage.value = 1;
    fetchContainerDossiers();
}, 300);

const toggleStatutFiltre = (statut) => {
    const index = statutFiltre.value.indexOf(statut);
    if (index === -1) {
        statutFiltre.value.push(statut);
    } else {
        statutFiltre.value.splice(index, 1);
    }
    containerPage.value = 1;
    fetchContainerDossiers();
};

const setContainerFilter = () => {
    containerPage.value = 1;
    fetchContainerDossiers();
};

const resetContainerFilter = () => {
    filtreContainer.value = {
        date_debut: `01/01/${currentYear}`,
        date_fin: `31/12/${currentYear}`,
        search: '',
    };
    setContainerFilter();
};

const handleContainerPageChange = (page) => {
    containerPage.value = page;
    fetchContainerDossiers();
};

async function handleContainerCardClick(ouverture_bl_numero) {
    try {
        const formulaire = new FormData();
        formulaire.append('numero_bl', ouverture_bl_numero);
        const response = await axiosInstance.post(pathAPI.dossier.getparbl, formulaire);
        containerDossierDetail.value = response.data[0];
        selectedContainerBL.value = ouverture_bl_numero;
    } catch (e) {
        console.log(e);
    }
    isContainerModalVisible.value = true;
}

function closeContainerModal() {
    isContainerModalVisible.value = false;
    selectedContainerBL.value = null;
}

onMounted(() => {
    if (isContainer.value) {
        fetchContainerDossiers();
    } else {
        fetchData();
    }
})
</script>

<template>
    <a-layout class="min-h-screen bg-secondary pt-16">

        <ButtonRetour :title="t('tableau_bord.tableau_bord')"/>

        <a-layout-content v-if="isContainer" class="!p-6 max-w-screen-2xl bg-gray-100 mx-auto w-full rounded-t-3xl">
            <div class="mb-4 flex flex-col gap-3">
                <div class="flex gap-2">
                    <a-date-picker
                        v-model:value="filtreContainer.date_debut"
                        format="DD/MM/YYYY"
                        value-format="DD/MM/YYYY"
                        :placeholder="t('tableau_bord.du')"
                        class="w-1/2"
                    />
                    <a-date-picker
                        v-model:value="filtreContainer.date_fin"
                        format="DD/MM/YYYY"
                        value-format="DD/MM/YYYY"
                        :placeholder="t('tableau_bord.au')"
                        class="w-1/2"
                    />
                </div>

                <SearchBar v-model="filtreContainer.search" @input="debouncedFetchContainer"/>

                <div class="flex gap-2">
                    <a-button type="primary" class="!bg-secondary !border-secondary !text-white" @click="setContainerFilter">
                        <font-awesome-icon icon="fa-solid fa-search" class="mr-2"/>
                        {{t('tableau_bord.recherche')}}
                    </a-button>
                    <a-button @click="resetContainerFilter">
                        <font-awesome-icon icon="fa-solid fa-filter" class="mr-2"/>
                        {{t('tableau_bord.reset_filtre')}}
                    </a-button>
                </div>
            </div>

            <div class="statut-legend-bar mb-4">
                <span class="statut-legend-title">{{t('tableau_bord.statut_legende_titre')}}</span>
                <div class="statut-legend-items">
                    <button
                        type="button"
                        v-for="statut in statutLegende"
                        :key="statut.value"
                        class="statut-chip"
                        :class="[statut.colorClass, { 'statut-chip-inactive': statutFiltre.indexOf(statut.value) === -1 }]"
                        @click="toggleStatutFiltre(statut.value)"
                    >
                        <span class="statut-chip-dot"></span>
                        {{ statut.label }}
                        <font-awesome-icon v-if="statutFiltre.indexOf(statut.value) !== -1" icon="fa-solid fa-check" class="statut-chip-check"/>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <CardDossier
                    v-for="dossier in dossiersContainer"
                    :key="dossier.id"
                    :statut="dossier.etat_dossier"
                    :date="dossier.ouverture_date_arriver_formatted"
                    :bl-numbers="dossier.ouverture_bl_numero"
                    :nom-navire="dossier.ouverture_navire"
                    :info_navire="dossier"
                    @click="handleContainerCardClick(dossier.ouverture_bl_numero)"
                />
            </div>

            <div class="text-center pt-4">
                <a-pagination
                    v-model:current="containerPage"
                    :total="containerTotalItems"
                    :pageSize="containerPerPage"
                    @change="handleContainerPageChange"
                    show-less-items
                />
            </div>

            <DossierDetailsModal
                v-if="selectedContainerBL"
                :open="isContainerModalVisible"
                :navire="selectedContainerBL"
                :Ouverture="containerDossierDetail"
                @close="closeContainerModal"
            />
        </a-layout-content>

        <a-layout-content v-else class="!p-6 max-w-screen-2xl bg-gray-100 mx-auto w-full rounded-t-3xl">
            <div class="mb-6">
                <SearchBar v-model="filtre.filter" @input="debouncedFetchNavire"/>
            </div>
            <div class="flex gap-2">
                <a-button @click="addData" class="!bg-primary !text-white hover:!bg-secondary hover:!text-white">
                    <font-awesome-icon
                        icon="fa-solid fa-filter"
                        class="mr-2"
                    />
                    {{t('tableau_bord.filtrer_par')}}
                </a-button>

                <a-button @click="printSuivieenlevement" :loading="printLoading" :disabled="printLoading">
                    <font-awesome-icon
                        v-if="!printLoading"
                        icon="fa-solid fa-print"
                        class="mr-2"
                    />
                    {{t('tableau_bord.imprimer')}}
                </a-button>
            </div>

            <perfect-scrollbar class="h-full w-full pt-2 pb-4  overflow-hidden bg-blue-50 rounded-md">
                <div class="flex gap-1 whitespace-nowrap w-full">
                    <table class="w-full min-w-full border-collapse border border-gray-300">
                        <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-gray-300 px-3 py-2 text-left"> {{t('tableau_bord.tab_date')}}</th>
                            <th class="border border-gray-300 px-3 py-2 text-left">{{t('tableau_bord.tab_navire')}}</th>
                            <th class="border border-gray-300 px-3 py-2 text-left">{{t('tableau_bord.bol')}}</th>
                            <th class="border border-gray-300 px-3 py-2 text-left">{{t('tableau_bord.num_declration')}}</th>
                            <th class="border border-gray-300 px-3 py-2 text-left">{{t('tableau_bord.be')}}</th>
                            <th class="border border-gray-300 px-3 py-2 text-left">
                                {{t('tableau_bord.tab_entrepot')}}
                            </th>
                            <th class="border border-gray-300 px-3 py-2 text-left">
                                {{t('tableau_bord.marque')}}
                            </th>
                            <th class="border border-gray-300 px-3 py-2 text-left">
                                {{t('tableau_bord.qte_initiial')}}
                            </th>
                            <th class="border border-gray-300 px-3 py-2 text-left">
                                {{t('tableau_bord.qte_sortie')}}
                            </th>
                            <th class="border border-gray-300 px-3 py-2 text-left">
                                {{t('tableau_bord.nbre_bb')}}
                            </th>
                            <th class="border border-gray-300 px-3 py-2 text-left">
                                {{t('tableau_bord.nbre_sac')}}
                            </th>
                            <th class="border border-gray-300 px-3 py-2 text-left">
                                {{t('tableau_bord.qte_restant')}}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                      <tr v-for="(d, index_dt) in data" :key="index_dt">
                            <td class="border border-gray-300 px-3 py-2 text-left">
                                {{d.date_enlevement_formatted}}
                            </td>
                            <td class="border border-gray-300 px-3 py-2 text-left">
                                {{d.nom_navire}}
                            </td >
                            <td class="border border-gray-300 px-3 py-2 text-left">
                                {{d.num_bl}}
                            </td>
                            <td class="border border-gray-300 px-3 py-2 text-left">
                                {{d.declaration_bl}}
                            </td>
                            <td class="border border-gray-300 px-3 py-2 text-left">
                                {{d.be}}
                            </td>
                            <td class="border border-gray-300 px-3 py-2 text-center">
                                {{d.nom_entrepot}}
                            </td>
                            <td class="border border-gray-300 px-3 py-2 text-center">
                                {{d.reference_article}}
                            </td>
                            <td class="border border-gray-300 px-3 py-2 text-right">
                                {{d.qte_initial}}
                            </td>
                          <td class="border border-gray-300 px-3 py-2 text-right">
                              {{d.qte_t}}
                          </td>
                          <td class="border border-gray-300 px-3 py-2 text-right">
                              {{d.qte_sortie_bb}}
                          </td>
                          <td class="border border-gray-300 px-3 py-2 text-right">
                              {{d.qte_sortie_nbre_sac}}
                          </td>
                          <td class="border border-gray-300 px-3 py-2 text-right">
                              {{d.qte_restant}}
                          </td>
                        </tr>
                        </tbody>
                    </table>
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

            </perfect-scrollbar>


        </a-layout-content>

        <FilterDashboard v-if="!isContainer" :titre="t('tableau_bord.filtrer_par')"
                         :open="is_open" @close="closeModal"
                         @onSearch="onSearch"
        >

        </FilterDashboard>
    </a-layout>
</template>


<style scoped >
#qr-code-scanner {
    width: 100%;
    margin: 0 auto;
}

/* --- Légende / filtre de statut (Tableau de bord Container) --- */
/* Aligné sur MA_TRANSIT/frontend/src/views/TableauBord/TableauBord.vue */
.statut-legend-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 14px 18px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 12px;
}

.statut-legend-title {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #6c757d;
    white-space: nowrap;
}

.statut-legend-items {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.statut-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    border: 1.5px solid transparent;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.statut-chip-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}

.statut-chip-check {
    font-size: 11px;
    margin-left: 2px;
}

.statut-chip-inactive {
    opacity: 0.5;
    background: white !important;
    box-shadow: none;
}

.statut-cloture {
    border-color: #a3e0b8;
    color: #1e7b3a;
}
.statut-cloture .statut-chip-dot { background: #2e7d32; }
.statut-cloture:not(.statut-chip-inactive) { background: #def6e4; }

.statut-en-cours {
    border-color: #a9d4f7;
    color: #17679e;
}
.statut-en-cours .statut-chip-dot { background: #2a99f1; }
.statut-en-cours:not(.statut-chip-inactive) { background: rgba(42, 153, 241, 0.18); }

.statut-non-cloture {
    border-color: #ced4da;
    color: #495057;
}
.statut-non-cloture .statut-chip-dot { background: #6c757d; }
.statut-non-cloture:not(.statut-chip-inactive) { background: #eef1f5; }

.statut-chip:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 576px) {
    .statut-legend-bar {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>