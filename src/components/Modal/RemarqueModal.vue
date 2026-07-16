<script setup>
import {ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import axiosInstance from "@/config/AxiosInstance.js";
import pathAPI from "@/utils/pathAPI/pathAPI.js";
import toast from "@/utils/toast.js";
import localstorageService from "@/utils/localstorageService.js";

const {t} = useI18n();

const props = defineProps({
    open: {
        type: Boolean,
        required: true
    },
    dossierId: {
        type: [Number, String],
        required: true
    }
});

const emit = defineEmits(['close', 'success']);

const form = ref({remarque: ''});
const submitting = ref(false);

watch(() => props.open, (isOpen) => {
    if (isOpen) {
        form.value.remarque = '';
    }
});

const handleClose = () => {
    emit('close');
};

const onFinish = async () => {
    submitting.value = true;
    try {
        const formulaire = new FormData();
        formulaire.append('dossier_id', props.dossierId);
        formulaire.append('client_id', localstorageService.getIDclient());
        formulaire.append('remarque', form.value.remarque);

        const response = await axiosInstance.post(pathAPI.notification.save, formulaire);
        if (response.data.error === '') {
            toast.showToast({msg: response.data.message, type: 'success'});
            emit('success');
            emit('close');
        } else {
            toast.showToast({msg: response.data.error, type: 'warning'});
        }
    } finally {
        submitting.value = false;
    }
};
</script>

<template>
    <a-modal
        :open="open"
        :title="t('dossier.ajouter_remarque')"
        @cancel="handleClose"
        :footer="null"
    >
        <a-form
            :model="form"
            layout="vertical"
            @finish="onFinish"
        >
            <a-form-item
                :label="t('dossier.remarque')"
                name="remarque"
                :rules="[{ required: true, message: t('dossier.error_remarque') }]"
            >
                <a-textarea
                    v-model:value="form.remarque"
                    :rows="4"
                    :placeholder="t('dossier.remarque_placeholder')"
                />
            </a-form-item>

            <a-form-item>
                <a-button
                    type="primary"
                    html-type="submit"
                    :loading="submitting"
                    class="w-full bg-secondary hover:!bg-primary text-white"
                >
                    {{t('user.save')}}
                </a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
