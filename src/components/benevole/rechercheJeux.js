import React, { useState, useEffect } from "react";
import Champ from "../general/champ";
import "../../styles/rechercheJeu.css"; // Importer votre fichier CSS pour les styles

const RechercheJeux = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Requête pour obtenir la liste des jeux correspondants au terme de recherche
    const fetchGameSuggestions = async () => {
      try {
        const response = await fetch(
          `https://festivaldujeuback.onrender.com/jeux/search?search=${searchTerm}`
        );
        if (response.ok) {
          const games = await response.json();

          // Récupérer les noms de zone pour chaque jeu
          const gameSuggestions = await Promise.all(
            games.map(async (game) => {
              const zoneResponse = await fetch(
                `https://festivaldujeuback.onrender.com/jeux/nom/${game}`,
                {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
                }
              );
              if (zoneResponse.ok) {
                const zoneData = await zoneResponse.json();
                return (
                  <li key={game} className="game-item">
                    <span className="game-name">{game}</span>
                    <span className="zone-name">
                      situé dans la zone : {zoneData.nom_zone}
                    </span>
                  </li>
                );
              }
              return (
                <li key={game} className="game-item">
                  {game}
                </li>
              );
            })
          );

          setSuggestions(gameSuggestions);
        } else {
          console.error("Erreur lors de la récupération des suggestions");
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Erreur de connexion au serveur", error);
        setSuggestions([]);
      }
    };

    if (searchTerm.length > 1) {
      // Déclencher la recherche seulement si au moins 2 caractères sont saisis
      fetchGameSuggestions();
    } else {
      setSuggestions([]); // Efface les suggestions si la saisie est trop courte
    }
  }, [searchTerm]);

  return (
    <div>
      <form>
        <Champ label="Rechercher un jeu :">
          <input
            className="input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un jeu"
          />
        </Champ>
        <ul className="game-list">{suggestions}</ul>
      </form>
    </div>
  );
};

export default RechercheJeux;
