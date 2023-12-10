import PageLogin from "./pages/PageLogin";
import PageAccueil from "./pages/PageAccueil";
import PageRegister from "./pages/PageRegister";
import PageProfil from "./pages/PageProfil";
import AdminAccueil from "./pages/admin/AdminAccueil";


// isMenu : true si on peut voir la page dans le menu sans être connecté
// isPrivate : true si on doit être connecté pour voir la page => doit avoir AuthWrapper.js sur sa page
export const nav = [
    { path : "/", name : "PageLogin", element: <PageLogin />, isMenu: false, isPrivate: false},
    { path : "/accueil", name : "PageAccueil", element: <PageAccueil />, isMenu: true, isPrivate: false},
    { path : "/register", name : "PageRegister", element: <PageRegister />, isMenu: true, isPrivate: false},
<<<<<<< HEAD
    { path : "/profil", name : "PageProfil", element: <PageProfil />, isMenu: true, isPrivate: false},
=======
    { path : "/profil", name : "PageProfil", element: <PageProfil />, isMenu: true, isPrivate: true},
    { path : "/admin", name : "AdminAccueil", element: <AdminAccueil />, isMenu: true, isPrivate: false}

>>>>>>> cb4b14ef51267ec9e6db0d06cad91b72580d5cc3

]

