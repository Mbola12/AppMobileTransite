<script setup>
import Menu from "./Layouts/Menu.vue";
import LocalStorageService from "../utils/localstorageService.js";
import router from "../routes/router.js";
import MainAvatar from "./Layouts/MainAvatar.vue";
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const logOut = () => {
    LocalStorageService.removeItem('token_client');
    router.push({ name: 'Login' });
}

</script>

<template>
    <a-layout>
        <a-layout-content class="relative w-full h-screen max-w-screen-sm mx-auto my-auto">
            <div
                class=" text-white text-left p-8 bg-gradient-to-r from-primary to-secondary shadow-md rounded-b-[40px]">
                <div class="flex flex-wrap items-center justify-between gap-y-2 w-full mb-8">
                    <a-tooltip :title="t('menu.deconnexion')">
                        <a-button @click="logOut" shape="circle" size="large">
                            <font-awesome-icon icon="fa-solid fa-sign-out-alt" class="!me-0"/>
                        </a-button>
                    </a-tooltip>
                    <MainAvatar/>
                </div>
                <h2 class="text-2xl uppercase font-bold my-0 lg:my-4">{{ t('menu.menu_application')}}</h2>
                <p class="text-lg leading-relaxed">
                    {{ t('menu.texte_menu')}}
                </p>
            </div>
            <Menu class="place-content-center z-10 pt-8"/>
        </a-layout-content>
    </a-layout>
</template>

<style scoped>

</style>
