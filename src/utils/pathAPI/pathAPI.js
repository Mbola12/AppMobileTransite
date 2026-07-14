const pathAPI = {
    navire: {
        fetchALL: 'navire/fetchall'
    },
    login: {
        seconnect: 'users/loginclient',
        logout: 'users/logout'
    },
    dossier: {
        fetchAll: 'dossier/fetchall',
        get: 'dossier/get',
        getparbl: 'dossier/getparbl',
        fetchYear: 'dossier/fetchyear',
        dashboardsuiviebl: 'dossier/dashboardsuiviebl',
    },
    bl: {
        fetchByClientID: 'dossier/fetchbyclientid',
        fetchdeclaration : 'dossier/fetchdeclarationbyclientid'
    },
    navirebl: {
        fetchAll: 'navirebl/fetchall'
    },
    dossier_detail: {
        confirm_receipt: 'suivieenlevementdetail/confirmreceiptmsg'
    },
    suivieenlevement: {
        fetchAll: 'suivieenlevement/fetchall',
        detail: 'suivieenlevementdetail/getbysuivieenlevement',
        onUnloaded: 'suivieenlevementdetail/dechargement'
    },
    subclient: {
        fetchAll: 'subclient/fetchall',
        save: 'subclient/addaction',
        edit: 'subclient/editaction',
        get: 'subclient/get',
        delete: 'subclient/delete'
    },
    tableaubord: {
        fetchAll: '/suivieenlevementdetail/tableaubord',
        entrepot: '/suivieenlevementdetail/fetchdistinctentrepot',
        navire: '/suivieenlevementdetail/fetchnavire'
    }
}

export default pathAPI;