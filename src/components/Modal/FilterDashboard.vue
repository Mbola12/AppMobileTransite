<script setup>
import {defineProps, computed, ref, onMounted} from 'vue';

import {useI18n} from 'vue-i18n';
import axiosInstance from "@/config/AxiosInstance.js";
import pathAPI from "@/utils/pathAPI/pathAPI.js";
import toast from "@/utils/toast.js";
import localstorageService from "@/utils/localstorageService.js";
import AutocompleteComponent from "@/components/AutoCompleteComponent/AutocompleteComponent.vue";
import debounce from "lodash/debounce.js";

const {t} = useI18n();
const props = defineProps({
    open: {
        type: Boolean,
        required: true
    },
    titre: {
        type: String,
        required: true,
    },
    show_magasin: {
        type: Boolean,
        required: false,
        default: true,
    },
    show_navire: {
        type: Boolean,
        required: false,
        default: true,
    },
    show_bl: {
        type: Boolean,
        required: false,
        default: true,
    },
    show_declaration: {
        type: Boolean,
        required: false,
        default: true,
    }
});

const entrepots = ref([]);
const navires = ref([]);
const listBL = ref([]);
const listDeclaration = ref([]);


const fetchEntrepot = async ()=> {
    const response = await  axiosInstance.get(pathAPI.tableaubord.entrepot, {params: {id_client: localstorageService.getIDclient()}});
    entrepots.value = response.data;
}

const fetchNavire = async ()=> {
    const response = await axiosInstance.get(pathAPI.tableaubord.navire, {params: {id_client: localstorageService.getIDclient()}});
    navires.value = response.data;
}

const fetchBL = async () => {
    const response = await axiosInstance.get(pathAPI.bl.fetchByClientID, {params: {id_client: localstorageService.getIDclient() , ouverture_num_bl: filters.value.bill_of_lading}});
    listBL.value = response.data;
}

const fetchDeclration = async () => {
    const response = await axiosInstance.get(pathAPI.bl.fetchdeclaration, {params: {id_client: localstorageService.getIDclient() , declaration_bl: filters.value.num_declration}});
    listDeclaration.value = response.data;
}

const findBLNumero = debounce(fetchBL, 300);
const findDeclaration = debounce(fetchDeclration, 300);



const filters = ref({
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    ship: 0,
    warehouse: '',
    bill_of_lading: '',
    num_declration: '',
});

const emit = defineEmits(['close', 'onSearch']);

const handleClose = () => {
    emit('close');
};

const resetFiltre = () => {
    filters.value = {
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
        ship: 0,
        warehouse: ''
    }
    onFilter();
}
const onFilter = async () => {
    emit('onSearch', filters.value)
}

onMounted(() => {
    fetchEntrepot();
    fetchNavire();
    fetchBL();
    fetchDeclration();
})

</script>

<template>
    <a-modal
        :open="open"
        :title="titre"
        @cancel="handleClose"
        :footer="null"
        width="100%"
        wrap-class-name="full-modal"
        class="modal_detail overflow-hidden"
    >

        <div class="flex flex-col">
            <!-- Champ Date "Du" -->
            <a-form-item class="flex flex-col">
                <label class="font-medium mb-1">{{t('tableau_bord.du')}}</label>
                <a-date-picker v-model:value="filters.fromDate" format="DD/MM/YYYY" value-format="YYYY-MM-DD" class="w-full text-center"/>
            </a-form-item>

            <!-- Champ Date "Au" -->
            <a-form-item class="flex flex-col">
                <label class="font-medium mb-1">{{t('tableau_bord.au')}}</label>
                <a-date-picker v-model:value="filters.toDate" format="DD/MM/YYYY" value-format="YYYY-MM-DD"  class="w-full text-center"/>
            </a-form-item>


            <a-form-item class="flex flex-col">
                <label class="font-medium mb-1">{{t('tableau_bord.bol')}}</label>
<!--                <a-input
                    size="large"
                    type="default"
                    v-model:value="filters.bill_of_lading"
                    :placeholder="t('tableau_bord.bol')"
                    class="px-5 w-full text-center"
                >

                </a-input>-->
<!--                <AutocompleteComponent v-model="form.marque"
                                       :options="localMarqueVehicule"
                                       placeholder="Choisissez une marque"
                />-->
                <AutocompleteComponent :options="listBL" v-model:value="filters.bill_of_lading"
                                       :fieldConfig="{
                                                label: 'ouverture_bl_numero',
                                                value: 'ouverture_bl_numero',
                                                search: 'ouverture_bl_numero'
                                            }"
                                       @input="findBLNumero"
                />
            </a-form-item>

            <a-form-item class="flex flex-col">
                <label class="font-medium mb-1">{{t('tableau_bord.num_declration')}}</label>

                <AutocompleteComponent :options="listDeclaration" v-model:value="filters.num_declration"
                                       :fieldConfig="{
                                                label: 'declaration_bl',
                                                value: 'declaration_bl',
                                                search: 'declaration_bl'
                                            }"
                                       @input="findDeclaration"
                />
<!--                <a-input
                    size="large"
                    type="default"
                    v-model:value="filters.num_declration"
                    :placeholder="t('tableau_bord.num_declration')"
                    class="px-5 w-full text-center"
                >

                </a-input>-->
            </a-form-item>

            <!-- Sélection "Choix navire" -->
            <a-form-item class="flex flex-col" v-show="show_navire">
                <label class="font-medium mb-1">{{t('tableau_bord.navire')}}</label>
                <a-select v-model:value="filters.ship" :placeholder="t('tableau_bord.navire')" class="w-full text-center">
                    <a-select-option v-for="(n, index) in navires" :value="n.id" :key="index"> {{n.nom_navire}}</a-select-option>

                </a-select>
            </a-form-item>

            <!-- Sélection "Entrepôt" -->
            <a-form-item class="flex flex-col" v-show="show_magasin">
                <label class="font-medium mb-1">{{t('tableau_bord.entrepot')}}</label>
                <a-select v-model:value="filters.warehouse" :placeholder="t('tableau_bord.entrepot')" class="w-full text-center">
                    <a-select-option v-for="(n, index) in entrepots" :value="n.nom_entrepot" :key="index"> {{n.nom_entrepot}}</a-select-option>
                </a-select>
            </a-form-item>
        </div>


            <!-- Bouton de soumission -->
            <a-form-item>
                <div class="w-full">
                    <a-button
                        html-type="submit"
                        class="bg-red-500 hover:!bg-red-600 !text-white border-none w-1/2"
                        @click="resetFiltre"
                    >
                        {{t('tableau_bord.reset_filtre')}}
                    </a-button>

                    <a-button
                        type="primary"
                        html-type="submit"
                        @click="onFilter"
                        class="w-1/2 bg-secondary hover:!bg-primary text-white"
                    >
                        {{t('tableau_bord.recherche')}}
                    </a-button>
                </div>

            </a-form-item>

    </a-modal>
</template>

<style>
.full-modal .ant-modal {
    top: 20px;
    margin: auto;
}
</style>