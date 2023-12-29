import React, { useReducer, useState, useEffect, useRef } from "react";
import Champ from "../general/champ";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthWrapper";
import "../../styles/login&register/register.css";
import FenetrePopup from "../general/fenetre_popup";
import Aide from "./aide";

const FormInscription = () => {
  const formReducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_FIELD":
        return { ...state, [action.field]: action.value };
      default:
        return state;
    }
  };

  const [formData, dispatchFormData] = useReducer(formReducer, {
    nom: "",
    prenom: "",
    pseudo: "",
    password: "",
    association: "",
    taille_tshirt: "",
    vegetarien: "",
    hebergement: "",
    adresse: "",
    num_telephone: "",
    mail: "",
    admin: false,
    referent: false,
  });

  const [pseudo, setPseudo] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false); // Afficher la fenêtre contextuelle
  const isPropositionSelected = useRef(false); // Afficher le champ adresse

  const { register } = useAuth();
  const navigate = useNavigate();

  const hidePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    // Cette fonction sera appelée après que le composant ait été rendu
    // et que setPseudo ait mis à jour l'état
    dispatchFormData({ type: "UPDATE_FIELD", field: "pseudo", value: pseudo });
  }, [pseudo]); // Assurez-vous d'ajouter pseudo comme dépendance ici

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatchFormData({ type: "UPDATE_FIELD", field: name, value });

    // Si le champ végétarien est sélectionné, convertir la valeur en booléen
    if (name === "vegetarien") {
      const vegetarienValue = name === "vegetarien" ? value === "oui" : value;
      dispatchFormData({
        type: "UPDATE_FIELD",
        field: name,
        value: vegetarienValue,
      });
    }

    // Si "proposition" est sélectionné, afficher le champ d'adresse
    if (name === "hebergement" && value !== "proposition") {
      isPropositionSelected.current = false;
    } else if (name === "hebergement" && value === "proposition") {
      isPropositionSelected.current = true;
    }

    // Update pseudo when changing in the name or surname fields
    if (name === "prenom" || name === "nom") {
      generatePseudo(e);
    }
  };

  const generatePseudo = (e) => {
    const prenom = e.target.value;
    const { nom } = formData;
    if (nom && prenom) {
      const newPseudo = `${prenom}${nom.charAt(0)}`;
      setPseudo(newPseudo);
      dispatchFormData({
        type: "UPDATE_FIELD",
        field: "pseudo",
        value: newPseudo,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { num_telephone } = formData;

    // Vérification pour le numéro de téléphone s'il est renseigné
    if (
      num_telephone &&
      (num_telephone.length !== 10 || isNaN(num_telephone))
    ) {
      setErrorMessage(
        "Le numéro de téléphone doit contenir exactement 10 chiffres."
      );
      setSuccessMessage(null);
      setPopupVisible(true);
      return;
    }

    if (isPropositionSelected.current && formData.adresse.trim() === "") {
      setErrorMessage(
        "L'adresse est obligatoire si vous sélectionnez \"proposition\" pour l'hébergement."
      );
      setSuccessMessage(null);
      setPopupVisible(true);
      return;
    }

    try {
      const response = await register(formData);

      if (response === "success") {
        setSuccessMessage("Inscription réussie");
        setErrorMessage(null);
        setPopupVisible(true);
        // La redirection sera effectuée après que l'utilisateur a vu la fenêtre contextuelle
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setErrorMessage("L'inscription a échoué");
        setSuccessMessage(null);
        setPopupVisible(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setErrorMessage(null);
      setPopupVisible(true);
    }
  };

  return (
    <div className="Form-register">
      <form onSubmit={handleSubmit}>

      <div className="field-with-aide">
        <Champ label="Nom :">
          <input
            className="input"
            type="text"
            name="nom"
            id="nom"
            value={formData.nom}
            onChange={handleInputChange}
            required
          />
        </Champ>
        <Aide />
        </div>

      <div className="field-with-aide">
        <Champ label="Prénom :">
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleInputChange}
            className="input"
            required
          />
        </Champ>
        <Aide />
        </div>

        <Champ label="Pseudo :">
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            value={pseudo}
            onChange={handleInputChange}
            readOnly
            required
            className="input"
          />
        </Champ>

        <div className="field-with-aide">
        <Champ label="Mot de passe :">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="input"
            required
          />
        </Champ>
        <Aide />
        </div>

        <Champ label="Email :">
          <input
            type="text"
            name="mail"
            id="mail"
            value={formData.mail}
            onChange={handleInputChange}
            className="input"
            required
          />
        </Champ>

        <Champ label="Téléphone :">
          <input
            type="tel"
            name="num_telephone"
            id="num_telephone"
            value={formData.num_telephone}
            onChange={handleInputChange}
            className="input"
          />
        </Champ>

        <Champ label="Taille de Tee-shirt :">
          <select
            type="text"
            name="taille_tshirt"
            id="taille_tshirt"
            value={formData.taille_tshirt}
            onChange={handleInputChange}
            required
            className="input"
          >
            <option value="">Sélectionnez une option</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </Champ>

        <Champ label="Association :">
          <select
            name="association"
            id="association"
            value={formData.association}
            onChange={handleInputChange}
            className="input"
            required
          >
            <option value="">Sélectionnez une option</option>
            <option value="APCU">APCU</option>
            <option value="MEN">MEN</option>
            <option value="SMI">SMI</option>
          </select>
        </Champ>

        <Champ label="Végétarien ? :">
          <select
            name="vegetarien"
            id="vegetarien"
            value={formData.vegetarien}
            onChange={handleInputChange}
            className="input"
            required
          >
            <option value="">Sélectionnez une option</option>
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </Champ>

        <Champ label="Hébergement :">
          <select
            name="hebergement"
            id="hebergement"
            value={formData.hebergement}
            onChange={handleInputChange}
            className="input"
            required
          >
            <option value="">Sélectionnez une option</option>
            <option value="Recherche">Recherche</option>
            <option value="Proposition">Proposition</option>
            <option value="Rien">Rien</option>
          </select>
        </Champ>

        {isPropositionSelected.current && (
          <Champ label="Adresse :">
            <input
              type="text"
              name="adresse"
              id="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              className="input"
            />
          </Champ>
        )}

        <div className="button_container">
          <button type="submit">
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front text"> Je m'inscris </span>
          </button>
        </div>
      </form>

      {errorMessage && isPopupVisible && (
        <FenetrePopup message={errorMessage} type="error" onClose={hidePopup} />
      )}

      {successMessage && isPopupVisible && (
        <FenetrePopup
          message={successMessage}
          type="success"
          onClose={hidePopup}
        />
      )}
    </div>
  );
};

export default FormInscription;
