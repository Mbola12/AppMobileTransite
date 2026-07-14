<template>
    <div class="flex items-center gap-2 sm:gap-3">
        <!-- Bouton A propos : mis en avant à gauche, animé pour inciter au clic -->
        <a
            :href="A_PROPOS_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="relative flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-full bg-white text-primary text-xs sm:text-sm font-semibold shadow-md animate-glow-pulse hover:shadow-lg hover:scale-105 hover:brightness-95 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
            <span class="absolute -top-1 -right-1 flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow opacity-75"></span>
                <span class="relative inline-flex h-3 w-3 rounded-full bg-yellow"></span>
            </span>
            <font-awesome-icon icon="fa-solid fa-circle-info" class="animate-bounce"/>
            <span>{{ t('menu.a_propos') }}</span>
        </a>

        <!-- Séparation -->
        <a-divider type="vertical" class="!h-6 !border-white/40 !mx-0"/>

        <!-- Choix de la langue -->
        <div class="flex items-center gap-1.5 text-xs sm:text-sm font-medium select-none">
            <span
                class="cursor-pointer transition-colors"
                :class="currentLang === 'fr' ? 'text-white font-semibold' : 'text-white/60 hover:text-white'"
                @click="changeLangue('fr')"
            >
                FR
            </span>

            <span class="text-white/40">|</span>

            <span
                class="cursor-pointer transition-colors"
                :class="currentLang === 'en' ? 'text-white font-semibold' : 'text-white/60 hover:text-white'"
                @click="changeLangue('en')"
            >
                EN
            </span>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import LocalStorageService from "@/utils/localstorageService.js";
import {useI18n} from 'vue-i18n';

const {t, locale} = useI18n();
const currentLang = ref(locale.value);

const A_PROPOS_URL = 'https://transmaki.mg/';

const changeLangue = (lang) => {
    locale.value = lang;
    currentLang.value = lang;
    LocalStorageService.setItem('langue_transapp', lang);
}
</script>

<style scoped>

</style>
