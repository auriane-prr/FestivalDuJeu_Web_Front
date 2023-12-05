import { Link, Route, Routes } from "react-router-dom";
import "./styles/renderNavigation.css";
import { useAuth } from "./AuthWrapper";
import { nav } from "./navigation";


export const RenderRoutes = () => {

    const { user } = useAuth();
    return (
        <Routes>
            { nav.map((r, i) => {
                  
                if (r.isPrivate && user.isAuthenticated) {
                    return <Route key={i} path={r.path} element={r.element}/>
                } else if (!r.isPrivate) {
                    return <Route key={i} path={r.path} element={r.element}/>
                } else return false
            })}
             
        </Routes>
    )
}
   
export const RenderMenu = () => {
    const { user, logout } = useAuth();
    const MenuItem = ({r}) => {
        return (
            <div className="menuItem"><Link to={r.path}>{r.name}</Link></div>
        )
    }
    return (
        <div className="menu">
            { nav.map((r, i) => {
   
                if (!r.isPrivate && r.isMenu) {
                    return (
                        <MenuItem key={i} r={r}/>
                    )
                } else if (user.isAuthenticated && r.isMenu) {
                    return (
                        <MenuItem key={i} r={r}/>
                    )
                } else return false
            })};
            
        </div>
    )
}