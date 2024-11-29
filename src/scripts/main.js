import "../style/main.scss";

import * as API from "./PokemonTCG.js";

document.addEventListener("DOMContentLoaded", event =>{
    // API.getAllPokemonCardsBySet("A1").then((pokemonCard) => {
    //     // console.log(pokemonCard.cards);
    //     renderPokemonCard(pokemonCard.cards);

    // }).catch(error => console.log("Error: " + error))
    
    API.getPokemonCardsByName("like:cubone").then((pokemonCard) => {
        // console.log(pokemonCard);
        renderPokemonCard(pokemonCard);

    }).catch(error => console.log("Error: " + error))

    // API.getPokemonCardsBySuffix("ex").then((pokemonCard) => {
    //     // console.log(pokemonCard);
    //     renderPokemonCard(pokemonCard);

    // }).catch(error => console.log("Error: " + error))

    API.getSeries().then((series) => {
        // console.log(series);
       renderSeries(series);

    }).catch(error => console.log("Error: " + error))

    // API.getSets().then((sets) => {
    //     // console.log(sets);
    //     renderSets(sets);

    // }).catch(error => console.log("Error: " + error))
});

function renderPokemonCard(pokemonCards){
    // console.log(pokemonCards);

    const cardContainer = document.querySelector(".cardContainer .row");
    const cardTemplate = document.querySelector("#pokemonCardTemplate");

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


function renderSeries(seriesList){

    const dropdown = document.querySelector(".dropdownSeries");
    const dropdownItemTemplate = dropdown.querySelector("#dropdownItemTemplate");

    seriesList.forEach(serie => {
        // console.log(series);

        const dropdownItem = dropdownItemTemplate.cloneNode(true).content;
        const logoItem = dropdownItem.querySelector("img");
        
        logoItem.src = `${serie.logo}.webp`;
        logoItem.alt = `${serie.name}`

        dropdown.append(dropdownItem);
    });
}


// function renderSets(setsList){
//     const dropdown = document.querySelector(".dropdownSets .dropdown-menu");
//     const dropdownItemTemplate = dropdown.querySelector("#dropdownItemTemplate");

//     setsList.forEach(set => {

//         const dropdownItem = dropdownItemTemplate.cloneNode(true).content;
//         const logoItem = dropdownItem.querySelector("img");
        
//         logoItem.src = `${set.logo}.webp`;
//         logoItem.alt = `${set.name}`

//         dropdown.append(dropdownItem);
//     });
// }