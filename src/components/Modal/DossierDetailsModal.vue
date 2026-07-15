<script setup>
import {defineProps, computed, ref} from 'vue';
import SearchBar from "../SearchBar.vue";
import {baseUrl} from "../../config/AxiosInstance.js";
import debounce from "lodash/debounce.js";
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const props = defineProps({
    open: {
        type: Boolean,
        required: true
    },
    navire: {
        type: Object,
        required: true
    },
    Ouverture: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['close']);
const search = ref('')
const handleClose = () => {
    emit('close');
};

const getDocumentUrl = (nom_piece_jointe, name) => {
    const paths = {
        FACTURE: baseUrl + "/upload/dossier/facture/",
        TRESORERIE: baseUrl + "/upload/dossier/tresorerie/",
    };

    const sub_link = paths[name] || baseUrl + "/upload/dossier/";
    return sub_link + nom_piece_jointe;
};

const show_document = (nom_piece_jointe, name) => {
    if (!nom_piece_jointe) return;
    window.open(getDocumentUrl(nom_piece_jointe, name), '_blank');
};

const previewOpen = ref(false);
const previewName = ref('');
const previewUrl = ref('');

const preview_document = (nom_piece_jointe, name) => {
    if (!nom_piece_jointe) return;
    previewName.value = name;
    previewUrl.value = getDocumentUrl(nom_piece_jointe, name);
    previewOpen.value = true;
};

const closePreview = () => {
    previewOpen.value = false;
    previewUrl.value = '';
};

const downloadZip = (id) => {
    window.open(baseUrl + "/dossier/downloadzip/" + id, '_blank');
}

const menuItems = ref([

    {name: 'BL', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.ouverture_bl_attachement},
    {name: 'Surestarie', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.chargement_surestarie_attachement},
    {name: 'Invoice', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.ouverture_invoice_attachement},
    {name: 'Packing list', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.ouverture_packing_list_attachement},
    {name: 'Bsc', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.ouverture_bsc_attachement},
    {name: 'Dom', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.ouverture_dom_attachement},
    {name: 'Caution', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.chargement_caution_attachement},

    {name: 'Déclaration', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.declaration_attachement},
    {name: 'Frais de DOSSIERS', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.chargement_dossier_attachment},
    {name: 'BAD', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.chargement_BAD_attachement},
    {name: 'Mictsl ( débarq)', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.chargement_mictsl_attachment},
    {name: 'Restitution ( Drop)', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.chargement_restitution_attachement},
    {name: 'Magasinage', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.chargement_magasinage_attachement},
    {name: 'Photos du visite', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.chargement_piece_jointe_visite},

    {name: 'Overstays', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.chargement_onverstays_attachement},
    {name: 'EHDN', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.chargement_EHDN_attachament},
    {name: 'Environnement', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.chargement_environnement_attachement},
    {name: 'Gate', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.chargement_gate_remis_attachement},
    {name: 'DC', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.liquidation_montant_doc_attachement},
    {name: 'AMENDE', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.liquidation_amende_attachement},
    {name: 'FACTURE', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.facture},
    {name: 'TRESORERIE', icon: "fa-solid fa-file-pdf", dossier: props.Ouverture.tresorerie},
]);

const filteredMenuItems = computed(() => {
    return menuItems.value.filter(item =>
        item.name.toLowerCase().includes(search.value.toLowerCase())
    );
});

const debouncedSearch = debounce(() => {
    filteredMenuItems.value;
}, 300);
</script>

<template>
    <a-modal
        :open="open"
        :title="t('dossier_detail.suivie_document')"
        @cancel="handleClose"
        :footer="null"
        width="100%"
        wrap-class-name="full-modal"
        class="modal_detail overflow-hidden"
    >
        <div class="mb-3">
            <SearchBar v-model="search" @input="debouncedSearch"/>
        </div>

        <div class="flex items-center justify-between">
            <span class="text-base text-black font-medium">{{t('dossier_detail.list_document')}}</span>
            <a-tooltip :title="t('dossier_detail.telecharger_tout')" placement="left">
                <a-button type="default"
                          :disabled="Ouverture.id<=0" @click="downloadZip(Ouverture.id)"
                          class="!text-white bg-primary hover:bg-secondary !border-none transition duration-300">
                    <font-awesome-icon class="me-0" icon="fa-solid fa-download"/>
                </a-button>
            </a-tooltip>
        </div>
        <div v-for="(item, index) in filteredMenuItems" :key="index">
            <div
                class="relative w-full group bg-white px-4 py-6 my-3 rounded-lg hover:shadow-md  border border-transparent hover:border-primary transition duration-300">
                <div class="flex items-center justify-between flex-wrap gap-2 ml-8">
                    <span class="text-base text-gray-800 group-hover:text-primary font-normal">{{ item.name }}</span>
                    <a-space>
                        <a-space class="text-black font-medium">
                            <font-awesome-icon v-show="!(item.dossier != '' && item.dossier !=null)"  class="me-0 text-base text-red-500" icon="fa-solid fa-circle-xmark"/>
                            <font-awesome-icon v-show="(item.dossier != '' && item.dossier !=null)" class="me-0 text-base text-green-600" icon="fa-solid fa-circle-check"/>
                        </a-space>
                        <a-tooltip :title="t('dossier_detail.voir')" placement="left">
                            <a-button type="default"
                                      :disabled="!(item.dossier != '' && item.dossier !=null)"
                                      @click="preview_document(item.dossier, item.name)"
                                      class="!text-white group bg-primary hover:bg-secondary !border-none transition duration-300">
                                <font-awesome-icon class="me-0"
                                                   icon="fa-solid group-hover:text-white transition-all duration-300 fa-eye"/>
                            </a-button>
                        </a-tooltip>
                        <a-tooltip :title="t('dossier_detail.telecharger')" placement="left">
                            <a-button type="default"
                                      :disabled="!(item.dossier != '' && item.dossier !=null)"
                                      @click="show_document(item.dossier, item.name)"
                                      class="!text-white group bg-primary hover:bg-secondary !border-none transition duration-300">
                                <font-awesome-icon class="me-0"
                                                   icon="fa-solid group-hover:text-white transition-all duration-300 fa-download"/>
                            </a-button>
                        </a-tooltip>
                    </a-space>
                </div>
                <div
                    class="absolute top-1/2 left-3 transform -translate-y-1/2 -translate-x-1/2 bg-primary border-[8px] border-[#EFF6FF] p-2 rounded-md transition duration-300">
                    <font-awesome-icon class="me-0 text-white text-2xl" :icon="item.icon"/>
                </div>
            </div>
        </div>
    </a-modal>

    <a-modal
        :open="previewOpen"
        :title="previewName"
        @cancel="closePreview"
        :footer="null"
        width="80%"
        wrap-class-name="preview-modal"
        class="modal_preview overflow-hidden"
    >
        <div class="preview-container">
            <iframe v-if="previewUrl" :src="previewUrl" class="preview-frame" title="document-preview"></iframe>
        </div>
    </a-modal>
</template>

<style>
.full-modal .ant-modal {
    top: 20px;
    margin: auto;
}

.preview-modal .ant-modal {
    top: 20px;
    margin: auto;
}

.preview-container {
    width: 100%;
    height: 75vh;
}

.preview-frame {
    width: 100%;
    height: 100%;
    border: none;
}
</style>