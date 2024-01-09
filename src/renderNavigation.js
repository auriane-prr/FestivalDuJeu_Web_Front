import { Link, Route, Routes, Navigate } from "react-router-dom";
import "./styles/renderNavigation.css";
import { useAuth } from "./AuthWrapper";
import { nav } from "./navigation";

export const RenderRoutes = () => {
  const { user } = useAuth();

  const getRouteElement = (route) => {
    // Destructure pour faciliter l'accès aux propriétés de route
    const { path, element, isPrivate, adminOnly } = route;

    // Si l'utilisateur n'est pas authentifié et que la route est privée, rediriger vers la page de connexion
    if (isPrivate && !user.isAuthenticated) {
      return <Navigate replace to="/" />;
    }

    // Si la route est réservée aux admins et que l'utilisateur n'est pas admin, rediriger
    if (adminOnly && !user.admin) {
      return <Navigate replace to="/accueil" />;
    }

    // Si l'utilisateur a le droit d'accéder à la route, retournez l'élément de la route
    return element;
  };

  return (
    <Routes>
      {nav.map((route, index) => (
        <Route key={index} path={route.path} element={getRouteElement(route)} />
      ))}
    </Routes>
  );
};




export const RenderMenu = () => {
  const { user } = useAuth();

  return (
    <div className="menu">
      {nav.map((route, index) => {
        // Condition pour déterminer si le lien de menu doit être affiché
        const showPublicLink = !route.isPrivate && route.isMenu;
        const showPrivateLink = user.isAuthenticated && route.isMenu;
        const isNotAdminRouteOrUserIsAdmin = !route.adminOnly || user.admin;

        // Si la route est publique ou si l'utilisateur est authentifié et autorisé à voir le lien
        if ((showPublicLink || showPrivateLink) && isNotAdminRouteOrUserIsAdmin) {
          return (
            <div className="menuItem" key={index}>
              <Link to={route.path}>{route.name}</Link>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};