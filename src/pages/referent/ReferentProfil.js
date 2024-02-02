import "../../styles/Pages/pageProfil.css";
import React, { useState, useEffect } from "react";
import BandeauReferent from "../../components/referent/bandeauReferent";
import Boite from "../../components/general/boite";
import Champ from "../../components/general/champ";
import { useAuth } from "../../AuthWrapper";
import FenetrePopup from "../../components/general/fenetre_popup";
import Bouton from "../../components/general/bouton";

function ReferentProfil() {
  const { user } = useAuth();
  const { userInfo = {} } = user;

  const {
    nom = "",
    prenom = "",
    pseudo = "",
    association = "",
    taille_tshirt = "",
    password = "",
    mail = "",
    num_telephone = "",
    vegetarien = "",
    hebergement = "",
    adresse = "",
  } = userInfo;

  const [editMode, setEditMode] = useState(false);

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [nomValue, setNom] = useState(nom || "");
  const [prenomValue, setPrenom] = useState(prenom || "");
  const [pseudoValue, setPseudo] = useState(pseudo || "");
  const [associationValue, setAssociation] = useState(association || "");
  const [taille_tshirtValue, setTailleTshirt] = useState(taille_tshirt || "");
  const [mailValue, setMail] = useState(mail || "");
  const [telephoneValue, setTelephone] = useState(num_telephone || "");
  const [vegetarienValue, setVegetarien] = useState(vegetarien || "");
  const [hebergementValue, setHebergement] = useState(hebergement || "");
  const [adresseValue, setAdresse] = useState(adresse || "");
  const [passwordValue, setPassword] = useState(password || "");
  const [newPassword, setNewPassword] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [adresseVisible, setAdresseVisible] = useState(false);

  const telephoneVisible =
    (!telephoneValue && editMode === true) || // Situation 1
    (telephoneValue && editMode === true) || // Situation 2
    (telephoneValue && editMode === false); // Situation 3

  const showAdresse =
    (hebergementValue === "Proposition" && editMode === true) ||
    (hebergementValue === "Proposition" && editMode === false);

  const handleEditModeToggle = () => {
    setEditMode(!editMode);

    // S'assurer que la valeur du mot de passe n'est jamais undefined ou null
    if (!editMode) {
      setPassword("");
      setNewPassword("");
    }
  };

  const [isPopupVisible, setPopupVisible] = useState(false);
  const hidePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const token = localStorage.getItem("authToken");
        const pseudo = localStorage.getItem("pseudo");

        const response = await fetch(
          `http://localhost:3500/benevole/pseudo/${pseudo}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const { benevole } = await response.json();
          setPseudo(benevole.pseudo || "");
          setNom(benevole.nom || "");
          setPrenom(benevole.prenom || "");
          setAssociation(benevole.association || "");
          setTailleTshirt(benevole.taille_tshirt || "");
          setPassword(benevole.password || "");
          setMail(benevole.mail || "");
          setTelephone(benevole.num_telephone || "");
          setVegetarien(benevole.vegetarien || "");
          setHebergement(benevole.hebergement || "");
          setAdresse(benevole.adresse || "");

          // Mise à jour de la visibilité du champ 'Adresse' en fonction de 'hebergementValue'
          setAdresseVisible(
            benevole.hebergement === "Proposition" && !!benevole.adresse
          );
        } else {
          throw new Error(
            "Erreur lors de la récupération des informations utilisateur"
          );
        }
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la récupération des informations utilisateur",
          error
        );
        // Gérer l'erreur, par exemple afficher un message d'erreur à l'utilisateur
      }
    }
    fetchUserProfile();
  }, [userInfo.pseudo, editMode]);

  const generatePseudo = (nom, prenom) => {
    if (nom && prenom) {
      const newPseudo = `${prenom}${nom.charAt(0)}`;
      setPseudo(newPseudo.toLowerCase());
    }
  };

  useEffect(() => {
    if (editMode) {
      // Réinitialiser le mot de passe lorsqu'on entre en mode édition
      setPassword("");
    } else {
      // Réinitialiser le mot de passe à la valeur stockée pour l'utilisateur lorsqu'on quitte le mode édition
      setPassword(userInfo.password || "");
    }
  }, [editMode, userInfo.password]);

  const handleNomChange = (e) => {
    const newNom = e.target.value;
    setNom(newNom);
    generatePseudo(newNom, prenomValue); // Utilisez la valeur actuelle de prenomValue
  };

  const handlePrenomChange = (e) => {
    const newPrenom = e.target.value;
    setPrenom(newPrenom);
    generatePseudo(nomValue, newPrenom); // Utilisez la valeur actuelle de nomValue
  };

  const handleAssociationChange = (e) => {
    setAssociation(e.target.value);
  };

  const handleTailleTshirtChange = (e) => {
    setTailleTshirt(e.target.value);
  };

  const handleMailChange = (e) => {
    setMail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleTelephoneChange = (e) => {
    setTelephone(e.target.value);
  };

  const handleVegetarienChange = (e) => {
    const value = e.target.value;
    const vegetarienValue = value === "Oui";
    setVegetarien(vegetarienValue);
  };

  const handleHebergementChange = (e) => {
    setHebergement(e.target.value);
  };

  const handleAdresseChange = (e) => {
    setAdresse(e.target.value);
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const pseudo = localStorage.getItem("pseudo");

      // Ajoutez une condition pour vérifier si le champ adresse n'est pas vide
      if (hebergementValue === "Proposition" && adresseValue.trim() === "") {
        setErrorMessage("Veuillez saisir une adresse pour l'hébergement.");
        setSuccessMessage(null);
        setPopupVisible(true);
        return;
      }

      // Construisez l'objet avec les modifications à envoyer au serveur
      const modifiedData = {
        nom: nomValue,
        prenom: prenomValue,
        pseudo: pseudoValue,
        mail: mailValue,
        num_telephone: telephoneValue,
        association: associationValue,
        taille_tshirt: taille_tshirtValue,
        vegetarien: vegetarienValue,
        hebergement: hebergementValue,
        adresse: adresseValue,
      };

      if (newPassword) {
        modifiedData.password = newPassword;
        console.log("Mise à jour du mot de passe");
      }

      // Effectuez la requête PUT au serveur avec les données modifiées
      const response = await fetch(`http://localhost:3500/benevole/${pseudo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(modifiedData),
      });

      if (!token) {
        console.error("Token d'authentification non trouvé");
        return;
      }

      if (response.ok) {
        // Les modifications ont été enregistrées avec succès
        setNewPassword("");
        setSuccessMessage("Modifications enregistrées avec succès");
        setErrorMessage(null);
        setPopupVisible(true);

        // Actualisez l'état local avec les nouvelles données de la base de données
        const updatedResponse = await fetch(
          `http://localhost:3500/benevole/pseudo/${pseudo}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updatedResponse.ok) {
          // Mettez à jour directement tous les états avec les nouvelles valeurs
          setNom(nomValue);
          setPrenom(prenomValue);
          setMail(mailValue);
          setPassword(passwordValue);
          setTelephone(telephoneValue);
          setAssociation(associationValue);
          setTailleTshirt(taille_tshirtValue);
          setVegetarien(vegetarienValue);
          setHebergement(hebergementValue);
          setAdresse(adresseValue);

          // Désactivez le mode édition après avoir sauvegardé les modifications
          setEditMode(false);
        }
      } else {
        // Gérez les erreurs liées à la requête
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const responseData = isJson ? await response.json() : null;
        console.error(
          "Erreur lors de la sauvegarde des modifications",
          response.status,
          responseData
        );
        setErrorMessage(
          `Erreur lors de la sauvegarde: ${
            responseData ? responseData.message : response.statusText
          }`
        );
        setPopupVisible(true);
      }
    } catch (error) {
      // Gérez les erreurs liées à la requête
      console.error("Erreur lors de la sauvegarde des modifications", error);
      setErrorMessage(null);
      setPopupVisible(true);
    }
  };

  useEffect(() => {
    // Désactivez le mode d'édition après qu'un message de succès est défini
    if (successMessage) {
      setEditMode(false);
    }
  }, [successMessage]);

  return (
    <div>
      <BandeauReferent />
      <Boite valeurDuTitre={pseudoValue}>
        <div className="Container-profil-info">
          <div className="champ-container">
            <div className="row">
              <Champ label="Nom :">
                <input
                  className="input"
                  type="text"
                  name="nom"
                  value={nomValue}
                  onChange={handleNomChange}
                  readOnly={!editMode}
                  required
                />
              </Champ>

              <Champ label="Mot de passe :">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={editMode ? newPassword : passwordValue}
                  onChange={handlePasswordChange}
                  readOnly={!editMode}
                  placeholder={editMode ? "Nouveau mot de passe" : ""}
                  className="input"
                />
              </Champ>

              <Champ label="Végétarien ? :">
                {editMode ? (
                  <select
                    name="vegetarien"
                    id="vegetarien"
                    value={vegetarienValue ? "Oui" : "Non"}
                    onChange={handleVegetarienChange}
                    className="input"
                    style={{ height: "30px", width: "102%" }}
                  >
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </select>
                ) : (
                  <input
                    className="input"
                    type="text"
                    value={vegetarienValue ? "Oui" : "Non"}
                    readOnly={!editMode}
                  />
                )}
              </Champ>

              <Champ label="Hébergement :">
                {editMode ? (
                  <select
                    className="input"
                    value={hebergementValue}
                    onChange={handleHebergementChange}
                    style={{ height: "30px", width: "102%" }}
                  >
                    {/* Options du sélecteur, à remplir avec vos valeurs spécifiques */}
                    <option value="">Sélectionnez une option</option>
                    <option value="Recherche">Recherche</option>
                    <option value="Proposition">Proposition</option>
                    <option value="Rien">Rien</option>
                  </select>
                ) : (
                  <input
                    className="input"
                    type="text"
                    value={hebergementValue}
                    readOnly={!editMode}
                  />
                )}
              </Champ>

              {showAdresse ? (
                <Champ label="Adresse :">
                  <input
                    type="text"
                    name="adresse"
                    id="adresse"
                    value={adresseValue}
                    onChange={handleAdresseChange}
                    readOnly={!editMode}
                    className="input"
                  />
                </Champ>
              ) : telephoneVisible ? (
                <div className="invisible-field">
                  <Champ label="Invisible :">
                    <input type="text" className="input" />
                  </Champ>
                </div>
              ) : null}
            </div>
            <div className="row">
              <Champ label="Prénom :">
                <input
                  className="input"
                  type="text"
                  name="prenom"
                  value={prenomValue}
                  onChange={handlePrenomChange}
                  readOnly={!editMode}
                />
              </Champ>

              <Champ label="Email :">
                <input
                  type="text"
                  name="mail"
                  id="mail"
                  value={mailValue}
                  onChange={handleMailChange}
                  readOnly={!editMode}
                  className="input"
                  required
                />
              </Champ>

              <Champ label="Association :">
                {editMode ? (
                  <select
                    className="input"
                    value={associationValue}
                    onChange={handleAssociationChange}
                    style={{ height: "30px", width: "102%" }}
                  >
                    {/* Options du sélecteur, à remplir avec vos valeurs spécifiques */}
                    <option value="">Sélectionnez une option</option>
                    <option value="APCU">APCU</option>
                    <option value="MEN">MEN</option>
                    <option value="SMI">SMI</option>
                    {/* ... Ajoutez d'autres options au besoin */}
                  </select>
                ) : (
                  <input
                    className="input"
                    type="text"
                    value={associationValue}
                    readOnly={!editMode}
                  />
                )}
              </Champ>

              <Champ label="Taille de tee-shirt :">
                {editMode ? (
                  <select
                    className="input"
                    value={taille_tshirtValue}
                    onChange={handleTailleTshirtChange}
                    style={{ height: "30px", width: "102%" }}
                  >
                    <option value="">Sélectionnez une option</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                ) : (
                  <input
                    className="input"
                    type="text"
                    value={taille_tshirtValue}
                    readOnly={!editMode}
                  />
                )}
              </Champ>

              {telephoneVisible ? (
                <Champ label="Téléphone :">
                  <input
                    type="tel"
                    name="num_telephone"
                    id="num_telephone"
                    value={telephoneValue}
                    onChange={handleTelephoneChange}
                    className="input"
                    readOnly={!editMode}
                  />
                </Champ>
              ) : showAdresse ? (
                <div className="invisible-field">
                  <Champ label="Invisible :">
                    <input type="text" className="input" />
                  </Champ>
                </div>
              ) : null}
            </div>
          </div>
          {editMode ? (
            <Bouton onClick={handleSaveChanges} type="button">
              Enregistrer
            </Bouton>
          ) : (
            <Bouton onClick={handleEditModeToggle} type="button">
              Modifier
            </Bouton>
          )}
        </div>
      </Boite>

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
}

export default ReferentProfil;
