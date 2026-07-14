<script setup>
import {computed} from "vue";
import {useRouter} from 'vue-router';
import {TRANSIT_TYPES} from "./menu-data.js";
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const router = useRouter();

const translatedTypes = computed(() =>
    TRANSIT_TYPES.map(item => ({
        ...item,
        title: t(`menu.${item.key}`) // Traduction dynamique du titre
    }))
);

const goToType = ({key}) => {
    router.push({name: 'MenuType', params: {type: key}});
};
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 max-w-2xl mx-auto">
        <a-card
            v-for="item in translatedTypes"
            :key="item.key"
            :bordered="false"
            hoverable
            @click="goToType(item)"
            :class="item.color"
            class="card_transit group flex items-center justify-center !cursor-pointer text-center bg-gradient-to-br h-44 sm:h-52 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
            <div class="flex flex-col items-center justify-center gap-3 text-white">
                <font-awesome-icon
                    :icon="item.icon"
                    class="text-5xl drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                />
                <span class="text-xl font-bold uppercase tracking-wide">
                  {{ item.title }}
                </span>
            </div>
        </a-card>
    </div>
</template>

<style scoped>
.card_transit :deep(.ant-card-body) {
    @apply flex items-center justify-center h-full w-full;
}
</style>