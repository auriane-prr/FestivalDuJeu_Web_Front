import React, { useState, useEffect } from "react";
import BandeauReferent from "../../components/referent/bandeauReferent";
import Boite from "../../components/general/boite";

function PageAccueil() {
    const [userData, setUserData] = useState('');
    const [standInfo, setStandInfo] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const pseudo = localStorage.getItem("pseudo");
            console.log("pseudo", pseudo);
            if (!pseudo) return;

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
                console.log("userData", userData.pseudo);

                if (userData.pseudo) {
                    const responseStand = await fetch(`http://localhost:3500/stands/referent/${userData._id}`,{
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (!responseStand.ok) throw new Error("Impossible de récupérer les informations du stand");

                    const standInfo = await responseStand.json();
                    setStandInfo(standInfo);
                    console.log("standInfo", standInfo);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <BandeauReferent />
            <Boite>
                <h2>Page d'accueil</h2>
                <div>Informations utilisateur: {userData ? userData.pseudo : 'Chargement...'}</div>
                <div>Informations du stand: {standInfo ? standInfo[0].nom_stand : 'Chargement...'}</div>
            </Boite>
        </div>
    );
}

export default PageAccueil;
