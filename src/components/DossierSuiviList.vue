<script setup>
import {ref, computed, onMounted} from "vue";
import axiosInstance from "@/config/AxiosInstance.js";
import pathAPI from "@/utils/pathAPI/pathAPI.js";
import localstorageService from "@/utils/localstorageService.js";
import SearchBar from "@/components/SearchBar.vue";
import CardDossier from "@/components/Card/CardDossier.vue";
import DossierDetailsModal from "@/components/Modal/DossierDetailsModal.vue";
import debounce from "lodash/debounce.js";
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

const currentYear = new Date().getFullYear();
const filtre = ref({
    date_debut: `01/01/${currentYear}`,
    date_fin: `31/12/${currentYear}`,
    search: '',
});
const dossiers = ref([]);
const page = ref(1);
const totalItems = ref(0);
const perPage = 25;
const statutFiltre = ref(['en_cours', 'non_cloture']);
const statutLegende = computed(() => [
    {value: 'cloture', label: t('tableau_bord.statut_cloture'), colorClass: 'statut-cloture'},
    {value: 'en_cours', label: t('tableau_bord.statut_en_cours'), colorClass: 'statut-en-cours'},
    {value: 'non_cloture', label: t('tableau_bord.statut_non_cloture'), colorClass: 'statut-non-cloture'},
]);

const selectedBL = ref(null);
const isModalVisible = ref(false);
const dossierDetail = ref(null);

const fetchDossiers = async () => {
    const formulaire = new FormData();
    formulaire.append('date_debut', filtre.value.date_debut);
    formulaire.append('date_fin', filtre.value.date_fin);
    formulaire.append('search', filtre.value.search);
    formulaire.append('type_filtre', 'ouverture_bl_numero');
    formulaire.append('client_id', localstorageService.getIDclient());
    formulaire.append('page', page.value);
    formulaire.append('per_page', perPage);
    statutFiltre.value.forEach(statut => formulaire.append('statuts[]', statut));

    const response = await axiosInstance.post(pathAPI.dossier.dashboardsuiviebl, formulaire);
    dossiers.value = response.data.data;
    totalItems.value = response.data.total;
    page.value = response.data.current_page;
};

const debouncedFetch = debounce(() => {
    page.value = 1;
    fetchDossiers();
}, 300);

const toggleStatutFiltre = (statut) => {
    const index = statutFiltre.value.indexOf(statut);
    if (index === -1) {
        statutFiltre.value.push(statut);
    } else {
        statutFiltre.value.splice(index, 1);
    }
    page.value = 1;
    fetchDossiers();
};

const setFilter = () => {
    page.value = 1;
    fetchDossiers();
};

const resetFilter = () => {
    filtre.value = {
        date_debut: `01/01/${currentYear}`,
        date_fin: `31/12/${currentYear}`,
        search: '',
    };
    setFilter();
};

const handlePageChange = (newPage) => {
    page.value = newPage;
    fetchDossiers();
};

async function handleCardClick(ouverture_bl_numero) {
    try {
        const formulaire = new FormData();
        formulaire.append('numero_bl', ouverture_bl_numero);
        const response = await axiosInstance.post(pathAPI.dossier.getparbl, formulaire);
        dossierDetail.value = response.data[0];
        selectedBL.value = ouverture_bl_numero;
    } catch (e) {
        console.log(e);
    }
    isModalVisible.value = true;
}

function closeModal() {
    isModalVisible.value = false;
    selectedBL.value = null;
}

onMounted(() => {
    fetchDossiers();
});
</script>

<template>
    <div>
        <div class="mb-4 flex flex-col gap-3">
            <div class="flex gap-2">
                <a-date-picker
                    v-model:value="filtre.date_debut"
                    format="DD/MM/YYYY"
                    value-format="DD/MM/YYYY"
                    :placeholder="t('tableau_bord.du')"
                    class="w-1/2"
                />
                <a-date-picker
                    v-model:value="filtre.date_fin"
                    format="DD/MM/YYYY"
                    value-format="DD/MM/YYYY"
                    :placeholder="t('tableau_bord.au')"
                    class="w-1/2"
                />
            </div>

            <SearchBar v-model="filtre.search" @input="debouncedFetch"/>

            <div class="flex gap-2">
                <a-button type="primary" class="!bg-secondary !border-secondary !text-white" @click="setFilter">
                    <font-awesome-icon icon="fa-solid fa-search" class="mr-2"/>
                    {{t('tableau_bord.recherche')}}
                </a-button>
                <a-button @click="resetFilter">
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
                v-for="dossier in dossiers"
                :key="dossier.id"
                :statut="dossier.etat_dossier"
                :date="dossier.ouverture_date_arriver_formatted"
                :bl-numbers="dossier.ouverture_bl_numero"
                :nom-navire="dossier.ouverture_navire"
                :info_navire="dossier"
                @click="handleCardClick(dossier.ouverture_bl_numero)"
            />
        </div>

        <div class="text-center pt-4">
            <a-pagination
                v-model:current="page"
                :total="totalItems"
                :pageSize="perPage"
                @change="handlePageChange"
                show-less-items
            />
        </div>

        <DossierDetailsModal
            v-if="selectedBL"
            :open="isModalVisible"
            :navire="selectedBL"
            :Ouverture="dossierDetail"
            @close="closeModal"
        />
    </div>
</template>

<style scoped>
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
