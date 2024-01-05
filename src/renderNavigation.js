import { Link, Route, Routes, useNavigate, Navigate } from "react-router-dom";
import "./styles/renderNavigation.css";
import { useAuth } from "./AuthWrapper";
import { nav } from "./navigation";
import { useEffect } from "react";

export const RenderRoutes = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
  
    useEffect(() => {
      // Rediriger vers une page spécifique si l'utilisateur est un admin
      if (user.isAuthenticated && user.admin) {
        navigate('/admin');
      }
      // Vous pouvez également gérer ici la redirection pour les utilisateurs non-admin
    }, [user, navigate]);
  
    return (
      <Routes>
        {nav.map((r, i) => {
          if (r.isPrivate && !user.isAuthenticated) {
            // Si la route est privée et que l'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
            return <Route key={i} path="*" element={<Navigate replace to="/" />} />
          } else if (r.isPrivate && user.isAuthenticated) {
            // Si l'utilisateur est authentifié, affichez la route privée
            return <Route key={i} path={r.path} element={r.element}/>
          } else if (!r.isPrivate) {
            // Si la route n'est pas privée, affichez-la normalement
            return <Route key={i} path={r.path} element={r.element}/>
          } else {
            return null; // Ou rediriger vers une page d'erreur si vous préférez
          }
        })}
      </Routes>
    );
  }
  
  

export const RenderMenu = () => {
  const { user } = useAuth();
  const MenuItem = ({ r }) => {
    // Afficher un lien de menu différent si l'utilisateur est un admin
    if (user.admin && r.path === "/admin") {
      return (
        <div className="menuItem">
          <Link to="/admin">Admin</Link>
        </div>
      );
    }
    return (
      <div className="menuItem">
        <Link to={r.path}>{r.name}</Link>
      </div>
    );
  };

  return (
    <div className="menu">
      {nav.map((r, i) => {
        if (!r.isPrivate && r.isMenu) {
          // Afficher les liens de menu publics
          return <MenuItem key={i} r={r} />;
        } else if (
          user.isAuthenticated &&
          r.isMenu &&
          (!r.adminOnly || user.admin)
        ) {
          // Afficher les liens de menu privés si l'utilisateur est authentifié
          // et ne montrer que les liens adminOnly si l'utilisateur est admin
          return <MenuItem key={i} r={r} />;
        } else {
          return null; // Ou rien si l'élément de menu ne doit pas être affiché
        }
      })}
    </div>
  );
};
