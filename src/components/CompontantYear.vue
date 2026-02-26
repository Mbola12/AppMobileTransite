<script setup>
import { ref, defineProps, defineEmits, defineExpose } from 'vue'

const props = defineProps({
    year: {
        type: Array,
        required: true
    },
    activeYear: {
        type: [String, Number],
        default: null
    },
})

const showModal = ref(false)
const emit = defineEmits(['select-year'])

const openModal = () => {
    showModal.value = true
}

const selectYear = (annee) => {
    emit('select-year', annee)
    showModal.value = false
}

defineExpose({ openModal })
</script>

<template>
    <a-modal
        v-model:open="showModal"
        title="Sélectionner une année"
        :footer="null"
        centered
        :bodyStyle="{ padding: '24px', backgroundColor: '#f8fafc' }"
        destroy-on-close
    >
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
                v-for="(y, index) in year"
                :key="index"
                @click="selectYear(y.annee)"
                class="year-wrapper"
            >
                <div
                    class="year-card"
                    :class="{ 'active': y.annee == activeYear }"
                >
                    <span class="year-text">{{ y.annee }}</span>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<style scoped>
/* Conteneur pour gérer l'espacement et le clic */
.year-wrapper {
    cursor: pointer;
    perspective: 1000px;
}

.year-card {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border-radius: 14px;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.year-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: #334155;
    transition: color 0.3s;
}

/* État Hover (survol) */
.year-card:hover {
    transform: translateY(-4px);
    border-color: #2a7e85; /* Couleur teal claire */
    background-color: #f0f9f9;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* État Actif (Sélectionné) - Style "Teal" profond de ton image */
.year-card.active {
    background-color: #2a7e85; /* Le Teal de l'image */
    border-color: #1f5f65;
    box-shadow: 0 8px 20px rgba(42, 126, 133, 0.3);
}

.year-card.active .year-text {
    color: #ffffff;
}

/* Effet au clic (pression) */
.year-card:active {
    transform: scale(0.95);
}
</style>