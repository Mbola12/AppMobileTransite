import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router';
import LocalStorageService from "../utils/localstorageService.js";
import Dossier from "../views/Dossier.vue";
import Suivi from "../views/Suivi.vue";
import Camera from "../views/Camera.vue";
import Main from "../components/Main.vue";
import Navire from "../views/Navire.vue";
import Login from "../views/Login.vue";
import User from "../views/User.vue";
import TableauBord from "../views/TableauBord.vue";
import MenuTransit from "../views/MenuTransit.vue";

const routes = [
    {
        path: '/login',
        component: Login,
        name: 'Login',
    },
    {
        path: '/',
        component: Main,
        name: 'Main',
        meta: { requiresAuth: true },
    },
    {
        path: '/menu/:type',
        name: 'MenuType',
        meta: { requiresAuth: true },
        component: MenuTransit,
        props: true,
    },
    {
        path: '/navire',
        name: "Navire",
        meta: { key: 'Navire', requiresAuth: true },
        component: Navire,
    },
    {
        path: '/dossier',
        name: 'Dossier',
        meta: { key: 'Dossier', requiresAuth: true },
        component: Dossier,
    },
    {
        path: '/tableau_bord',
        name: 'Tableau_bord',
        meta: { key: 'Tableau_bord', requiresAuth: true },
        component: TableauBord,
    },
    {
        path: '/suivie',
        name: 'Suivie',
        meta: { key: 'Suivie', requiresAuth: true },
        component: Suivi,
    },
    {
        path: '/scan_qr',
        name: 'scan_qr',
        meta: { key: 'scan_qr', requiresAuth: true },
        component: Camera,
    },
    {
        path: '/user',
        name: 'user',
        meta: { key: 'user', requiresAuth: true },
        component: User,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// 🔒 Vérification de l'authentification avant chaque navigation
router.beforeEach((to, from, next) => {
    const token = LocalStorageService.getItem('token_client');
    if (to.meta.requiresAuth && !token) {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;
