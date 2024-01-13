import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {
      name: "",
      admin: "",
      referent: "",
      nom: "",
      prenom: "",
      password: "",
      taille_tshirt: "",
      vegetarien: "",
      mail: "",
      hebergement: "",
      isAuthenticated: false,
    }
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (pseudo, password) => {
    try {
      const response = await fetch("http://localhost:3500/benevole/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pseudo, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de l'authentification"
        );
      }

      const data = await response.json();
      const updatedUser = {
        ...data.userInfo,
        isAuthenticated: true,
        admin: data.admin,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("user", user);
      return { token: data.token, admin: data.admin };
    } catch (error) {
      console.error("Erreur lors de l'authentification: ", error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser({
      name: "",
      admin: "",
      referent: "",
      nom: "",
      prenom: "",
      password: "",
      taille_tshirt: "",
      vegetarien: "",
      mail: "",
      hebergement: "",
      isAuthenticated: false,
    });
    localStorage.removeItem("user");
  };

  const register = async (formData) => {
    const {
      mail,
      password,
      pseudo,
      nom,
      prenom,
      association,
      taille_tshirt,
      vegetarien,
      hebergement,
      adresse,
      num_telephone,
      admin,
      referent,
    } = formData;

    try {
      const response = await fetch("http://localhost:3500/benevole/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail,
          password,
          pseudo,
          nom,
          prenom,
          adresse,
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
      {children}
    </AuthContext.Provider>
  );
};

export default AuthWrapper;
