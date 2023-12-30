import PageLogin from "./pages/login&register/PageLogin";
import PageAccueil from "./pages/benevole/PageAccueil";
import PageRegister from "./pages/login&register/PageRegister";
import PageProfil from "./pages/benevole/PageProfil";
import AdminAccueil from "./pages/admin/AdminAccueil";


// isMenu : true si on peut voir la page dans le menu sans être connecté
// isPrivate : true si on doit être connecté pour voir la page => doit avoir AuthWrapper.js sur sa page
export const nav = [
    { path : "/", name : "PageLogin", element: <PageLogin />, isMenu: false, isPrivate: false},
    { path : "/accueil", name : "PageAccueil", element: <PageAccueil />, isMenu: true, isPrivate: false},
    { path : "/register", name : "PageRegister", element: <PageRegister />, isMenu: true, isPrivate: false},
    { path : "/profil", name : "PageProfil", element: <PageProfil />, isMenu: true, isPrivate: false},
    { path : "/admin", name : "AdminAccueil", element: <AdminAccueil />, isMenu: true, isPrivate: false},

]

