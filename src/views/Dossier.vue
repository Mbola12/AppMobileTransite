<script setup>
import ButtonRetour from "../components/ButtonRetour.vue";
import DossierSuiviList from "@/components/DossierSuiviList.vue";
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
</script>

<template>
    <a-layout class="min-h-screen bg-secondary pt-16">

        <ButtonRetour :title="t('dossier.liste_dossier')"/>

        <a-layout-content class="!p-6 max-w-screen-2xl bg-gray-100 mx-auto w-full rounded-t-3xl">
            <DossierSuiviList/>
        </a-layout-content>
    </a-layout>
</template>
