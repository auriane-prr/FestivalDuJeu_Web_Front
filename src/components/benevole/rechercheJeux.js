import React, { useState } from "react";
import Champ from "../general/champ";

const RechercheJeux = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [searchResult, setSearchResult] = useState("");
    const [selectedGame, setSelectedGame] = useState("");
const handleSearchSubmit = async (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page

    try {
        const response = await fetch(`http://localhost:3500/jeux/nom/${searchTerm}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            const data = await response.json();
            setSearchResult(`Le jeu ${searchTerm} est situé dans la zone : ${data.nom_zone}`);
        } else {
            setSearchResult(`Aucun jeu trouvé pour le terme de recherche "${searchTerm}"`);
        }
    } catch (error) {
        console.error("Erreur de connexion au serveur", error);
        setSearchResult("Erreur lors de la recherche du jeu");
    }
    setSuggestions([]);
    setSearchTerm('');
};
const fetchGameSuggestions = async (searchTerm) => {
    try {
        const response = await fetch(`http://localhost:3500/jeux/search?search=${searchTerm}`);
        const gameNames = await response.json();
        setSuggestions(gameNames);
    } catch (error) {
        console.error("Erreur lors de la récupération des suggestions de jeux", error);
    }
};


const fetchSuggestions = async (text) => {
    try {
        const response = await fetch(`http://localhost:3500/jeux/search?search=${text}`);
        if (response.ok) {
            const data = await response.json();
            setSuggestions(data);
        } else {
            console.error("Erreur lors de la récupération des suggestions");
            setSuggestions([]);
        }
    } catch (error) {
        console.error("Erreur de connexion au serveur", error);
        setSuggestions([]);
    }
};

const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value); // Mettez à jour l'état searchTerm avec la valeur actuelle de l'input
    if (value.length > 1) { // Déclencher la recherche seulement si au moins 2 caractères sont saisis
        fetchGameSuggestions(value);
    } else {
        setSuggestions([]); // Efface les suggestions si la saisie est trop courte
    }
};
    

const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 1) { // Déclencher la recherche seulement si au moins 2 caractères sont saisis
        fetchSuggestions(value);
    } else {
        setSuggestions([]);
    }
};

const handleSuggestionClick = async (gameName) => {
    setSearchTerm(gameName); // Mettre à jour le terme de recherche avec le jeu sélectionné
    setSuggestions([]); // Effacer les suggestions

    try {
        const response = await fetch(`http://localhost:3500/jeux/nom/${gameName}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            const data = await response.json();
            setSearchResult(`Le jeu ${gameName} est situé dans la zone : ${data.nom_zone}`);
        } else {
            setSearchResult(`Aucun jeu trouvé pour le terme de recherche "${gameName}"`);
        }
    } catch (error) {
        console.error("Erreur de connexion au serveur", error);
        setSearchResult("Erreur lors de la recherche du jeu");
    }
};

return (
    <div>
        <form onSubmit={handleSearchSubmit}>
                        <Champ label="Rechercher un jeu :">
                            <input
                            className="input"
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            placeholder="Rechercher un jeu"
                            />
                        </Champ>
                        <ul>
                            {suggestions.map((gameName, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(gameName)}
                                >
                                    {gameName}
                                </li>
                            ))}
                        </ul>
                    </form>
                {searchResult && <p>{searchResult}
                </p>}
    </div>
);

}
export default RechercheJeux;