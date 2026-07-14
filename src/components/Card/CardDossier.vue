<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
const {t} = useI18n();

const props = defineProps({
    statut: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    nomNavire: {
        type: String,
        required: true
    },
    blNumbers: {
        type: String,
        required: true
    },
    info_navire: {
        type: Object,
        required: true
    }
});

// Meme code couleur que CardInfoBL.vue (MA_TRANSIT) :
// vert = cloture, bleu = arrivee proche (< 7 jours), gris = non cloture,
// jaune = liquide (prioritaire sur les 3 autres).
const statusClass = computed(() => {
    if (Number(props.statut) > 0) return 'is_green';
    if (props.info_navire?.etat_arrivee === 'notif3Days') return 'notif3Days';
    return 'is_pending';
});

const isLiquide = computed(() => !!props.info_navire?.liquidation_date_liquidation);

const statusLabel = computed(() => {
    if (statusClass.value === 'is_green') return t('tableau_bord.statut_cloture');
    if (statusClass.value === 'notif3Days') return t('tableau_bord.statut_en_cours');
    return t('tableau_bord.statut_non_cloture');
});

const getQteClass = (qte) => qte > 0 ? 'qte-restant' : 'qte-cloturee';
</script>

<template>
    <a-card
        class="w-full card_navire hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        :class="[statusClass, isLiquide ? 'is_liquide' : '']"
    >
        <div class="relative p-6">
            <span class="status-badge">
                REP : {{ info_navire.numero_repertoire }}
            </span>

            <div class="dossier-number pr-24">
                {{ statusLabel }}
            </div>

            <div class="dossier-details">
                <div class="detail-row">
                    <span class="detail-label">{{ t('dossier.numero_bl') }}</span>
                    <span class="detail-value">{{ blNumbers }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">{{ t('dossier.numero_facture') }}</span>
                    <span class="detail-value">****</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">{{ t('dossier.date_creation') }}</span>
                    <span class="detail-value">{{ info_navire.ouverture_date_dossier_formatted }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">{{ t('dossier.date_arrivee') }}</span>
                    <span class="detail-value">{{ date }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">{{ t('dossier.navire') }}</span>
                    <span class="detail-value">{{ nomNavire }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">{{ t('dossier.marchandise') }}</span>
                    <span class="detail-value">{{ info_navire.ouverture_articles }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">{{ t('dossier.poids') }}</span>
                    <span class="detail-value">{{ info_navire.ouverture_poids_net }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">{{ t('dossier.nbre_conteneur') }}</span>
                    <span class="detail-value text-bold">{{ info_navire.total_tc }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">{{ t('dossier.type_container') }}</span>
                    <span class="detail-value text-bold">{{ info_navire.type_container }}</span>
                </div>
                <div class="detail-row" v-if="info_navire.declaration_declaration">
                    <span class="detail-label">{{ t('dossier.numero_declration') }}</span>
                    <span class="detail-value">{{ info_navire.declaration_declaration }} {{ info_navire.declaration_date_formatted ? 'Du ' + info_navire.declaration_date_formatted : '' }}</span>
                </div>
            </div>

            <div v-if="info_navire.articles && info_navire.articles.length > 0" class="list_article">
                <div v-for="(article, index) in info_navire.articles" :key="index" class="article-row">
                    <span class="article-label">{{ article.reference_article }}</span>
                    <span :class="getQteClass(article.qte_restant)">
                        <font-awesome-icon v-if="article.qte_restant == 0" icon="fa-solid fa-circle-check" class="me-1"/>
                        {{ article.qte_restant != 0 ? article.qte_restant : '' }}
                    </span>
                </div>
            </div>

            <div v-if="info_navire.document_associer && info_navire.document_associer.length > 0" class="list_document">
                <table class="w-full text-sm">
                    <thead>
                        <tr>
                            <th class="text-left">{{ t('dossier_detail.colonne_document') }}</th>
                            <th class="text-left">{{ t('dossier_detail.colonne_statut') }}</th>
                            <th class="text-left">{{ t('dossier_detail.colonne_date') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(doc, index) in info_navire.document_associer" :key="index">
                            <td>{{ doc.nom_document }}</td>
                            <td>{{ doc.statut }}</td>
                            <td>{{ doc.date_reception }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </a-card>

</template>

<style scoped>
.card_navire {
    @apply z-0 relative overflow-hidden;
}

.card_navire :deep(.ant-card-body) {
    @apply !p-0;
}

.card_navire::before {
    content: "";
    @apply z-0 absolute -top-5 -right-2 bg-primary bg-opacity-10 brightness-125 h-32 w-32 rounded-full;
}

/* Meme code couleur que CardInfoBL.vue (MA_TRANSIT) */
.is_green {
    background: #def6e4;
}

.notif3Days {
    background: rgba(42, 153, 241, 0.42);
}

.is_pending {
    background: #eef1f5;
}

.is_liquide {
    background: #fff8e1 !important;
    border: 1px solid #ffe082 !important;
}

/* Meme liste d'elements que CardInfoBL.vue (MA_TRANSIT) */
.status-badge {
    position: absolute;
    top: 18px;
    right: 15px;
    padding: 4px 10px;
    border-radius: 15px;
    font-size: 13px;
    color: #3a2626;
    background-color: rgba(255, 255, 255, 0.6);
    font-weight: bold;
    z-index: 1;
}

.dossier-number {
    font-size: 18px;
    font-weight: 700;
    color: #076360;
    margin-bottom: 8px;
    text-transform: uppercase;
}

.dossier-details {
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    padding-top: 12px;
    margin-top: 12px;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 14px;
}

.detail-label {
    color: #495057;
    font-weight: 600;
    white-space: nowrap;
}

.detail-value {
    color: #212529;
    font-weight: 500;
    text-align: right;
}

.text-bold {
    font-weight: 700 !important;
}

.list_article {
    border-top: 2px solid rgba(0, 0, 0, 0.08);
    padding-top: 8px;
    margin-top: 8px;
}

.article-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 0;
    font-size: 14px;
}

.article-label {
    color: #343a40;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 10px;
}

.qte-restant, .qte-cloturee {
    font-weight: 700;
    min-width: 40px;
    text-align: right;
    padding: 2px 8px;
    border-radius: 4px;
    white-space: nowrap;
}

.qte-restant {
    color: #dc3545;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
}

.qte-cloturee {
    color: #155724;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
}

.list_document {
    border-top: 2px solid rgba(0, 0, 0, 0.08);
    padding-top: 8px;
    margin-top: 8px;
    overflow-x: auto;
}

.list_document table {
    border-collapse: collapse;
}

.list_document th, .list_document td {
    padding: 6px 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
