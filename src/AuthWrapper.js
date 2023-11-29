import React, { createContext, useContext, useState } from "react";
import { RenderMenu, RenderRoutes } from "./renderNavigation";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState({ name: "",admin:"", referent:"", nom:"", prenom:"", password:"", taille_tshirt:"", vegetarien:"", mail:"", hebergement:"",   isAuthenticated: false });

  const login = async (pseudo, password) => {
    try {
      const response = await fetch('http://localhost:3500/benevole/');
      const data = await response.json();
      const founduser = data.find(
        (user) => user.pseudo === pseudo && user.password === password
      );
      console.log(founduser);

      if (founduser) {
        setUser({ isAuthenticated: true, userInfo: founduser });
        return "success";

      } else {
        const errorData = await data.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      throw new Error("Erreur lors de l'authentification");
    }
  };

  const logout = () => {
    setUser({ ...user, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <>
        <RenderMenu />
        <RenderRoutes />
        {children} 
      </>
    </AuthContext.Provider>
  );
};

export default AuthWrapper;
