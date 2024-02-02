import React, { useState, useEffect } from "react";
import BandeauReferent from "../../components/referent/bandeauReferent";
import Boite from "../../components/general/boite";
import Champ from "../../components/general/champ";

function PageAccueil() {
    const [userData, setUserData] = useState("");
    const [standInfo, setStandInfo] = useState([{}]);

    useEffect(() => {
        const pseudo = localStorage.getItem("pseudo");
        if (!pseudo) return;

        const fetchUserData = async () => {
            try {
                const responseBenevole = await fetch(`http://localhost:3500/benevole/pseudo/${pseudo}`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!responseBenevole.ok){
                    throw new Error("Impossible de récupérer les informations de l'utilisateur");
                }
                const {benevole} = await responseBenevole.json();
                setUserData(benevole);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchUserData();
    }, []); // Supprimer userData des dépendances pour éviter la boucle infinie

    useEffect(() => {
        if (!userData) return;

        const fetchStandInfo = async () => {
            try {
                const responseStand = await fetch(`http://localhost:3500/stands/referent/${userData._id}`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!responseStand.ok) throw new Error("Impossible de récupérer les informations du stand");

                const standInfo = await responseStand.json();
                setStandInfo(standInfo);
                console.log(standInfo);
            } catch (error) {
                console.error("Erreur lors de la récupération des informations du stand :", error);
            }
        };

        fetchStandInfo();
    }, [userData]);

    return (
        <div>
            <BandeauReferent />
            <Boite>
                <h2>Bonjour {userData.pseudo || 'Chargement...'}, vous êtes référent du stand {standInfo[0].nom_stand || 'Chargement...'} </h2>
                <Champ label="Nom du stand">
                <input
                    type="text"
                    className="input"
                    value={standInfo[0].nom_stand ||'Chargement...'} 
                    readOnly/>
                 </Champ>
                <Champ label="description">
                <input
                    type="text"
                    className="input"
                    value={ standInfo[0].description || 'Chargement...'} 
                    readOnly/>
                </Champ>
                <Champ label="Référent">
                <input
                    type="text"
                    className="input"
                    value={standInfo[0].referents[0] || 'Chargement...'} 
                    readOnly/>
                </Champ>
            
            </Boite>
        </div>
    );
}

export default PageAccueil;
