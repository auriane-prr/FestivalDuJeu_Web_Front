import React, { createContext, useContext, useState } from "react";
import { RenderMenu, RenderRoutes } from "./renderNavigation";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState({ name: "",admin:"", referent:"", nom:"", prenom:"", password:"", taille_tshirt:"", vegetarien:"", mail:"", hebergement:"",   isAuthenticated: false });

  const login = async (pseudo, password) => {
    try {
      const response = await fetch('http://localhost:3500/benevole/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pseudo,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUser({ ...user,isAuthenticated: true, userInfo: data.userInfo });
        return "success";
      
      } else {
        throw new Error(data.message || "Erreur lors de l'authentification");
      }
    } catch (error) {
      throw new Error("Erreur lors de l'authentification");
    }
  };
  

  const logout = () => {
    setUser({ ...user, isAuthenticated: false });
  };

  const register = async (formData) => {
    const { mail, password, pseudo, nom, prenom, association, taille_tshirt, vegetarien, hebergement, num_telephone, admin, referent} = formData;

    try {
      const response = await fetch('http://localhost:3500/benevole/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail,
          password,
          pseudo,
          nom,
          prenom,
          association,
          taille_tshirt,
          vegetarien,
          hebergement,
          num_telephone,
          admin,
          referent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ name: data.pseudo, isAuthenticated: true });
        return "success";
      } else {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      throw new Error("Erreur lors de l'inscription");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      <>
        <RenderMenu />
        <RenderRoutes />
        {children}
      </>
    </AuthContext.Provider>
  );
};

export default AuthWrapper;
