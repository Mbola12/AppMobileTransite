<script setup>
import {defineProps, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import localstorageService from "@/utils/localstorageService.js";
import pathAPI from "@/utils/pathAPI/pathAPI.js";
import axiosInstance from "@/config/AxiosInstance.js";
import toast from "@/utils/toast.js";
const {t} = useI18n();


const isModalVisible = ref(false);
const modalWidth= ref('520px');
const temp_index = ref(0);

const crudForm = ref({
    id: '',
    delivery_time: '',
    dechargement_entrepot: ''
});


const props = defineProps({
    open: {
        type: Boolean,
        required: true
    },
    navire: {
        type: Object,
        required: true
    },
    elements: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['close']);

const handleClose = () => {
    emit('close');
};

const menuItems = ref([
    {
        voyage: 'Voyage',
        nom_voyage: 1,
        heureDepart: 'Heure Départ',
        heure: '11:52',
        heureDechargement: 'Heure Déchargement',
        heureDech: '00:00',
        bl: 'BL',
        valeurBL: 1,
        transporteur: 'Transporteur',
        nom_transporteur: 'Transporteur 1',
        chauffeur: 'Nom Chauffeur',
        nom_chauffeur: 'Nom Chauffeur',
        numero_chauffeur: 'N° Chauffeur',
        num_chauffeur: '584758',
        permis: 'Permis',
        nom_permis: 'Non Permis',
        camion: 'N° Camion',
        numero_camion: '3548745',
        remorque: 'N° Remorque',
        numero_remorque: '54258TBA',
        destination: 'Destination',
        nom_destination: 'Tamatave',
        delivery_time: 'Delivery Time',
        time_delivery: '15:00',
        qteItems: [
            {label: 'BILL OF LADING', values: [100, 200, 300]},
            {label: 'N° Declaration', values: [12345, 67890, 11223]},
            {label: 'Qte D/T', values: [30, 25, 40]},
            {label: 'NBre SAC', values: [2, 3, 5]},
            {label: 'Nbre BIG BAG', values: [0, 1, 3]},
            {label: 'MARQUE', values: [1, 2, 3]},
            {label: 'BE', values: [5, 10, 15]}
        ]
    }
]);

const onSave = async () => {
    const formulaire = new FormData();
    formulaire.append('id', crudForm.value.id);
    formulaire.append('delivery_time', crudForm.value.delivery_time);
    formulaire.append('dechargement_entrepot', crudForm.value.dechargement_entrepot);

    const link = pathAPI.suivieenlevement.onUnloaded;
    const response = await axiosInstance.post(link, formulaire);
    if (response.data.error == ''){
        toast.showToast({msg: response.data.message, duration: 3, type: 'success'});
        props.elements[temp_index.value] = response.data.element[0];
        isModalVisible.value = false;
    }else{
        toast.showToast({msg: response.data.error, duration: 3, type: 'warning'})
    }
}
const toggle = async (item, index)=> {
    crudForm.value = {
        id: item.id,
        delivery_time: '',
        dechargement_entrepot: item.dechargement_entrepot,
    }
    isModalVisible.value = true;
    temp_index.value = index;
}

const getTonnage = (item) => {
    if (!item.details || !item.details.length) return 0;
    return item.details.reduce((sum, detail) => sum + (parseFloat(detail.qte_t) || 0), 0);
}
</script>

<template>
    <a-modal
        :open="open"
        :title="t('suivie.detail_navire')"
        @cancel="handleClose"
        :footer="null"
        width="100%"
        wrap-class-name="full-modal"
        class="modal_detail overflow-hidden"
    >

        <div v-for="(item, index) in elements" :key="index">

            <div class="w-full bg-white p-4 my-3 rounded-lg">
                <a-button
                    @click="toggle(item, index)"
                    :class="[
                        'flex items-center space-x-2 transition-all ',
                        item.delivery_time != '' ? 'bg-secondary text-white hover:!bg-secondary' : 'bg-gray-200 text-black hover:!bg-gray-200'
                    ]"
                >
                    <span>{{ t('suivie.decharge') }}</span>
                    <span v-show="item.delivery_time != ''">
                        <font-awesome-icon icon="fa-solid fa-check" class="!me-0"/>
                    </span>
                </a-button>
                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.voyage')}}</span>
                    <span class="text-white text-2xl font-bold bg-secondary px-2 py-1 rounded-tl-2xl">{{
                            item.voyage
                        }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.heure_depart')}}</span>
                    <span :class="[
                        'uppercase',
                        item.delivery_time != '' ? 'text-secondary ' : 'text-orange'
                    ]"
                    >{{ item.heure_depart }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.heure_dechargement')}}</span>
                    <span :class="[
                        'uppercase',
                        item.delivery_time != '' ? 'text-secondary ' : 'text-orange'
                    ]">{{ item.heure_dechargement }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.tonnage')}}</span>
                    <span :class="[
                        'uppercase',
                        item.delivery_time != '' ? 'text-secondary ' : 'text-orange'
                    ]">{{ getTonnage(item) }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.num_bl')}}</span>
                    <span :class="[
                        'uppercase',
                        item.delivery_time != '' ? 'text-secondary ' : 'text-orange'
                    ]">{{ item.bl }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.transporteur')}}</span>
                    <span :class="[
                        'uppercase',
                        item.delivery_time != '' ? 'text-secondary ' : 'text-orange'
                    ]">{{ item.transporteur }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.chauffeur')}}</span>
                    <span :class="[
                        'uppercase',
                        item.delivery_time != '' ? 'text-secondary ' : 'text-orange'
                    ]">{{ item.nom_chauffeur }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.num_chauffeur')}}</span>
                    <span :class="[
                        'uppercase',
                        item.delivery_time != '' ? 'text-secondary ' : 'text-orange'
                    ]">{{ item.num_chauffeur }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.permis')}}</span>
                    <span :class="[
                        'uppercase',
                        item.delivery_time != '' ? 'text-secondary ' : 'text-orange'
                    ]">{{ item.permis }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.num_camion')}}</span>
                    <span :class="[
                        'uppercase',
                        item.delivery_time != '' ? 'text-secondary ' : 'text-orange'
                    ]">{{ item.num_camion }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.num_remorque')}}</span>
                    <span :class="[
                        'uppercase',
                        item.delivery_time != '' ? 'text-secondary ' : 'text-orange'
                    ]">{{ item.num_remorque }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.destination')}}</span>
                    <span :class="[
                        'uppercase',
                        item.delivery_time != '' ? 'text-secondary ' : 'text-orange'
                    ]">{{ item.destination }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.delivery_time')}}</span>
                    <span :class="[
                        'uppercase',
                        item.delivery_time != '' ? 'text-secondary ' : 'text-orange'
                    ]">{{ item.delivery_time }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-black font-medium">{{t('suivie.dechargement_entrepot')}}</span>
                    <span :class="[
                        'uppercase',
                        item.delivery_time != '' ? 'text-secondary ' : 'text-orange'
                    ]"> {{ item.dechargement_entrepot }}</span>
                </div>

<!--                <a-divider orientation="center">
                    <span class="text-secondary font-medium uppercase">{{t('suivie.liste_article')}}</span>
                </a-divider>-->


            </div>
        </div>
    </a-modal>

    <a-modal
        :open="isModalVisible"
        :title="t('suivie.decharge')"
        :width="modalWidth"
        @cancel="isModalVisible = false"
        class="modal_detail overflow-hidden"
        :footer="null"

    >
        <a-form
            :model="crudForm"
            name="basic"
            layout="vertical"
            @finish="onSave"
        >

            <a-form-item
                :label="t('suivie.dechargement_entrepot')"
                name="dechargement_entrepot"
                :rules="[{ required: true, message: t('suivie.error_dechargement') }]"
            >
                <a-input v-model:value="crudForm.dechargement_entrepot" placeholder="" />
            </a-form-item>

            <!-- Bouton de soumission -->
            <a-form-item>
                <a-button
                    type="primary"
                    html-type="submit"
                    class="w-full bg-secondary hover:!bg-primary text-white"
                >
                    {{t('user.save')}}
                </a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style>
.full-modal .ant-modal {
    top: 20px;
    margin: auto;
}

.ps__thumb-x {
    @apply h-[4px] bg-gray-400/30 rounded-md transition-all ease-in-out;
}

.ps--active-x .ps__thumb-x:hover {
    @apply !bg-secondary;
}

.ps--active-x .ps__rail-x {
    @apply !bg-transparent;
    color: #d4ddde;
}
table tr th {
    text-align: left!important;
}
</style>