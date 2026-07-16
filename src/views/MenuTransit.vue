<script setup>
import {computed} from "vue";
import {useRouter} from 'vue-router';
import {MENUS_DATA} from "../components/Layouts/menu-data.js";
import {useI18n} from 'vue-i18n';
import localstorageService from "@/utils/localstorageService.js";

const props = defineProps({
    type: {
        type: String,
        required: true
    }
});

const role = localstorageService.getRole()
const {t} = useI18n();
const router = useRouter();

const translatedMenus = computed(() => {
    let menus = role === "administrateur"
        ? MENUS_DATA
        : MENUS_DATA.filter(menu => (menu.key === "scan_qr" || menu.key === 'Suivie'));

    if (props.type === "container") {
        menus = menus.filter(menu => menu.key !== "Dossier");
    }

    return menus.map(menu => ({
        ...menu,
        title: t(`menu.${menu.key.toLowerCase()}`) // Traduction dynamique du titre du menu
    }));
});

const title = computed(() => t(`menu.${props.type}`));

const goBack = () => {
    router.push('/');
};

const MenuClick = ({key}) => {
    router.push({name: key, query: {type: props.type}});
};
</script>

<template>
    <a-layout>
        <a-layout-content class="relative w-full h-screen max-w-screen-sm mx-auto my-auto">
            <div
                class="text-white text-left p-8 bg-gradient-to-r from-primary to-secondary shadow-md rounded-b-[40px]">
                <div class="flex items-center gap-4">
                    <a-button
                        type="text"
                        shape="circle"
                        size="large"
                        @click="goBack"
                        class="!text-white !cursor-pointer"
                    >
                        <font-awesome-icon icon="fa-solid fa-arrow-left" class="!me-0"/>
                    </a-button>
                    <h2 class="text-2xl uppercase font-bold my-0">{{ title }}</h2>
                </div>
            </div>

            <div class="!p-6 bg-gray-100 w-full rounded-t-3xl min-h-screen">
                <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <a-card
                        v-for="(item, index) in translatedMenus"
                        :key="index"
                        :bordered="false"
                        hoverable
                        @click="MenuClick(item)"
                        :class="item.color"
                        class="card_menu group flex items-center justify-center !cursor-pointer text-center hover:bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all duration-300 h-28"
                    >
                        <div class="flex flex-col items-center justify-center text-center py-8">
                            <font-awesome-icon
                                :icon="item.icon"
                                class="text-secondary text-4xl group-hover:text-white transition-all duration-300"
                            />
                            <span class="text-secondary text-lg group-hover:text-white transition-all duration-300">
                              {{ item.title }}
                            </span>
                        </div>
                    </a-card>
                </div>
            </div>
        </a-layout-content>
    </a-layout>
</template>

<style scoped>

</style>
