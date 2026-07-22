
export const MENUS_DATA = [
    { key: "Tableau_bord", title: "Tableau de bord", icon: "fa-solid fa-table-columns", color: "bg-white" },
    { key: "Dossier", title: "Dossier", icon: "fa-solid fa-folder", color: "bg-white" },
    { key: "Navire", title: "Navire", icon: "fa-solid fa-ship", color: "bg-white" },
    { key: "Suivie", title: "Suivi", icon: "fa-solid fa-truck", color: "bg-white" },
    { key: "scan_qr", title: "Scan QR", icon: "fa-solid fa-camera", color: "bg-white" },
    { key: "user", title: "Utilisateur", icon: "fa-solid fa-user", color: "bg-white" },
];

// Types de transit affichés sur le menu principal (Menu.vue)
export const TRANSIT_TYPES = [
    { key: "container", icon: "fa-solid fa-box", color: "from-primary to-secondary" },
    { key: "conventionnel", icon: "fa-solid fa-ship", color: "from-orange to-yellow" },
];