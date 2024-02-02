import React, { useState, useEffect } from "react";
import BandeauReferent from "../../components/referent/bandeauReferent";
import Boite from "../../components/general/boite";
import Champ from "../../components/general/champ";

function PageAccueil() {
    const [userData, setUserData] = useState("");
    const [standInfo, setStandInfo] = useState([{}]);
    const [referentPseudo, setReferentPseudo] = useState({});
    const [selectedHoraireIndex, setSelectedHoraireIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [benevolePseudo, setBenevolePseudo] = useState({});


    useEffect(() => {
        const pseudo = localStorage.getItem("pseudo");
        if (!pseudo) return;

        const fetchUserDataAndStandInfo = async () => {
            setIsLoading(true); // Commencer le chargement
            try {
                const responseBenevole = await fetch(`http://localhost:3500/benevole/pseudo/${pseudo}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (responseBenevole.ok) {
                    const { benevole } = await responseBenevole.json();
                    setUserData(benevole);

                    const responseStand = await fetch(`http://localhost:3500/stands/referent/${benevole._id}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });

                    if (responseStand.ok) {
                        const standData = await responseStand.json();
                        setStandInfo(standData);
                        setIsLoading(false); // Fin du chargement
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
                setIsLoading(false); // Fin du chargement même en cas d'erreur
            }
        };

        fetchUserDataAndStandInfo();
    }, []);

    function formatDate(date) {
        if (!date) return "";
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }
    const currentStand = standInfo ? standInfo[0] : null;

    if (isLoading || !standInfo) {
        return <div>Chargement des données...</div>;
    }

    const renderGeneralStandContent = () => {
        return (
            <div>
                <Champ label="Nom du stand">
                <input
                    type="text"
                    className="input"
                    value={currentStand.nom_stand ||'Chargement...'} 
                    readOnly/>
                 </Champ>
                <Champ label="description">
                <input
                    type="text"
                    className="input"
                    value={ currentStand.description || 'Chargement...'} 
                    readOnly/>
                </Champ>
                <Champ label="Date">
                <input
                    type="text"
                    className="input"
                    value={ formatDate(currentStand.date) || 'Chargement...'} 
                    readOnly/>
                </Champ>
                <Champ label="Référents">
                    {currentStand.referents && currentStand.referents.length > 0 ? (
                        currentStand.referents.map((referent) => (
                            <div key={referent._id} className="referent-input">
                                <input
                                    type="text"
                                    className="input"
                                    value={referent.pseudo || 'Chargement...'}
                                    readOnly
                                />
                            </div>
                        ))
                    ) : (
                        <input
                            type="text"
                            className="input"
                            value="Aucun référent"
                            readOnly
                        />
                    )}
                </Champ>
                <div className="horaire-container">
                    <Champ label="Horaire :">
                    <select
                      className="input"
                      value={selectedHoraireIndex}
                      onChange={(e) => setSelectedHoraireIndex(e.target.value)}
                    >
                      {currentStand?.horaireCota &&
                      currentStand.horaireCota.length > 0 ? (
                        currentStand.horaireCota.map((horaire, index) => (
                          <option key={index} value={index}>
                            {horaire.heure}
                          </option>
                        ))
                      ) : (
                        <option>Aucun horaire disponible</option> // Cette option s'affiche s'il n'y a pas d'horaires
                      )}
                    </select>
                    </Champ>
                    <Champ label="Capacité :">
                    <input
                      type="number"
                      min="1"
                      value={
                        currentStand &&
                        currentStand.horaireCota &&
                        currentStand.horaireCota[selectedHoraireIndex]
                          ? currentStand.horaireCota[selectedHoraireIndex]
                              .nb_benevole || ""
                          : ""
                      }
                      className="input"
                      readOnly
                    />
                  </Champ>
                  <Champ label="Liste de bénévoles :">
                    {/* Utilisez ?. pour accéder en toute sécurité à liste_benevole */}
                    {currentStand?.horaireCota[selectedHoraireIndex]
                      ?.liste_benevole.length === 0 ? (
                      <input
                        type="text"
                        className="input"
                        value="0 bénévole inscrits"
                        readOnly
                      />
                    ) : (
                        currentStand?.horaireCota[
                        selectedHoraireIndex
                      ]?.liste_benevole.map((benevole, index) => (
                        <input
                          key={`${selectedHoraireIndex}-${benevole._id}-${index}`}
                          type="text"
                          className="input"
                          value={benevole.pseudo || ""}
                          readOnly
                        />
                      ))
                    )}
                  </Champ>
                  </div>
            </div>
        );
    };
    const renderAnimationJeuContent = () => {
        return (
            <div>
                <p>Contenu spécifique pour le stand d'animation de jeux.</p>
            </div>
        );
    };

    return (
        <div>
            <BandeauReferent />
            <Boite>
                <h2>Bonjour {userData.pseudo || 'Chargement...'}, vous êtes référent du stand {standInfo[0].nom_stand || 'Chargement...'} </h2>
                {currentStand.nom_stand === "Animation jeu" ? renderAnimationJeuContent() : renderGeneralStandContent()}
                
                
            </Boite>
        </div>
    );
}

export default PageAccueil;
