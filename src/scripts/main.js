import "../style/main.scss";

import { getAllPokemonCardsBySet, getPokemonCardsByName} from "./PokemonTCG.js";

document.addEventListener("DOMContentLoaded", event =>{
    // getAllPokemonCardsBySet("A1").then((pokemonCard) => {
    //     // console.log(pokemonCard.cards);
    //     renderPokemonCard(pokemonCard.cards);

    // }).catch(error => console.log("Error: " + error))
    
    getPokemonCardsByName("like:ex").then((pokemonCard) => {
        // console.log(pokemonCard.cards);
        renderPokemonCard(pokemonCard);

    }).catch(error => console.log("Error: " + error))
});

function renderPokemonCard(pokemonCards){
    // console.log(pokemonCards);

    const cardContainer = document.querySelector(".cardContainer .row");
    const cardTemplate = document.querySelector("template");

    // Remove objects without images.
    pokemonCards = pokemonCards.filter(card =>{
        return card.image != null;
    })

    pokemonCards.forEach(pokemonCard => {
        // console.log(pokemonCard);

        const card = cardTemplate.cloneNode(true).content;

        const cardImg = card.querySelector("img");

        cardImg.src = `${pokemonCard.image}/high.webp`

        cardContainer.append(card);
    });
}