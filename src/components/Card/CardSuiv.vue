<script setup>
import {useI18n} from 'vue-i18n';
const {t} = useI18n();

defineProps({
    date: {
        type: String,
        required: true
    },
    nomNavire: {
        type: String,
        required: true
    },
    showMenu: {
        type: Boolean,
        default: false
    },
    downloadLoading: {
        type: Boolean,
        default: false
    },
});

defineEmits(['download-report']);
</script>

<template>
    <div class="relative w-full">
        <!-- Élément absolu derrière la carte (haut et bas) -->
        <div
            class="flex items-center justify-center absolute -top-2 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-primary rounded-t-3xl transition-all duration-300 group-hover:w-72 group-hover:h-3 z-0"></div>
        <div
            class="flex items-center justify-center absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-primary rounded-b-3xl transition-all duration-300 group-hover:w-72 group-hover:h-3 z-0"></div>

        <!-- Carte principale -->
        <a-card
            hoverable
            class="!border-none group hover:bg-gradient-to-r from-primary to-secondary relative w-full bg-white card_navire transition-all duration-300 cursor-pointer p-8 z-10"
        >
            <a-dropdown v-if="showMenu" :trigger="['click']" placement="bottomRight" @click.stop class="card_suiv_menu">
                <a-button
                    type="text"
                    size="small"
                    class="three-dot-btn"
                    :loading="downloadLoading"
                    @click.stop
                >
                    <font-awesome-icon v-if="!downloadLoading" icon="fa-solid fa-ellipsis-vertical"/>
                </a-button>
                <template #overlay>
                    <a-menu @click="$emit('download-report')">
                        <a-menu-item key="telecharger_rapport">
                            <font-awesome-icon icon="fa-solid fa-download" class="mr-2"/>
                            {{ t('suivie.telecharger_rapport') }}
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
            <a-card-meta class="w-full pt-4">
                <template #avatar>
                    <!-- Icône avec animation -->
                    <font-awesome-icon
                        class="me-0 text-6xl text-gray-100 group-hover:text-white transition-all duration-300 group-hover:scale-110"
                        icon="fa-solid fa-ship"
                    />
                </template>
                <template #title>
          <span
              class="text-lg text-secondary group-hover:text-yellow transition-all duration-300 text-left font-normal"
          >
            {{t('dossier.navire')}}
          </span>
                </template>
                <template #description>
          <span
              class="text-base font-medium text-gray-600 group-hover:text-white transition-all duration-300"
          >
            {{ nomNavire }}
          </span>
                </template>
            </a-card-meta>

            <!-- Étiquette au centre (haut) -->
            <div
                class="flex items-center justify-center absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-primary shadow-md rounded-b-[80px] text-center px-3 z-10 transition-transform duration-300 group-hover:scale-105"
            >
                <span class="text-lg text-white font-medium">{{ date }}</span>
            </div>
        </a-card>
    </div>
</template>

<style scoped>
.card_navire {
    @apply relative z-10 rounded-lg shadow-md;
}

.card_navire :deep(.ant-card-body) {
    @apply !p-0;
}

.card_suiv_menu {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 20;
}

.three-dot-btn {
    padding: 2px 6px !important;
    height: auto !important;
    color: #3a2626 !important;
}
</style>
