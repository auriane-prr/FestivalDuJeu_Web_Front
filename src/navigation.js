import PageLogin from "./pages/login&register/PageLogin";
import PageAccueil from "./pages/benevole/PageAccueil";
import PageRegister from "./pages/login&register/PageRegister";
import PageProfil from "./pages/benevole/PageProfil";
import AdminAccueil from "./pages/admin/AdminAccueil";
import AdminPageFestival from "./pages/admin/pageFestival";
import AdminParametre from "./pages/admin/AdminParametre";
import AdminFlexible from "./pages/admin/AdminFlexible";
import PagePlanning from "./pages/benevole/PagePlanning";
import ReferentAccueil from "./pages/referent/ReferentAccueil";
import PosteReferentPlanning from "./pages/referent/PosteReferentPlanning";


// isMenu : true si on peut voir la page dans le menu sans être connecté
// isPrivate : true si on doit être connecté pour voir la page => doit avoir AuthWrapper.js sur sa page
export const nav = [
    { path : "/", name : "PageLogin", element: <PageLogin />, isMenu: false, isPrivate: false},
    { path : "/accueil", name : "PageAccueil", element: <PageAccueil />, isMenu: false, isPrivate: true},
    { path : "/register", name : "PageRegister", element: <PageRegister />, isMenu: false, isPrivate: false},
    { path : "/profil", name : "PageProfil", element: <PageProfil />, isMenu: false, isPrivate: true},
    { path : "/planning", name : "PagePlanning", element: <PagePlanning />, isMenu: false, isPrivate: true},
    { path : "/admin", name: "AdminAccueil", element: <AdminAccueil />, isMenu: false, isPrivate: true, adminOnly: true },
    { path : "/admin/festival", name: "AdminPageFestival", element: <AdminPageFestival />, isMenu: false, isPrivate: true, adminOnly: true },
    { path : "/admin/parametre", name: "AdminParametre", element: <AdminParametre />, isMenu: false, isPrivate: true, adminOnly: true },
    { path : "/admin/flexible", name: "AdminFlexible", element: <AdminFlexible />, isMenu: false, isPrivate: true, adminOnly: true },
    { path : "/referent", name : "ReferentAccueil", element: <ReferentAccueil />, isMenu: false, isPrivate: true},
    { path : "/referent/poste", name : "PosteReferentPlanning", element: <PosteReferentPlanning />, isMenu: false, isPrivate: true},
]

