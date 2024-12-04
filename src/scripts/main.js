import "../style/main.scss";

import * as API from "./PokemonTCG.js";

document.addEventListener("DOMContentLoaded", event =>{
    // API.getAllPokemonCardsBySet("A1").then((pokemonCard) => {
    //     // console.log(pokemonCard.cards);
    //     renderPokemonCard(pokemonCard.cards);

    // }).catch(error => console.log("Error: " + error))
    
    API.getPokemonCardsByName("like:cubone").then((pokemonCard) => {
        console.log(pokemonCard);
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

    API.getSets().then((sets) => {
        // console.log(sets);
        renderSets(sets);

    }).catch(error => console.log("Error: " + error))

    const heroSection = document.querySelector('.hero');
    const favButton = document.querySelector('.favourite-button');
    const collectionButton = document.querySelector('.collections-button');
    const seriesButton = document.querySelector('.series-button');
    
    favButton.addEventListener('click', function() {
        const favSection = document.querySelector('.favourite');
        favSection.classList.remove("d-none");
        heroSection.classList.add("d-none");
    });
    
    collectionButton.addEventListener('click', function() {
        const collectionsSection = document.querySelector('.collections');
        collectionsSection.classList.remove("d-none");
        heroSection.classList.add("d-none");
    });
    
    seriesButton.addEventListener('click', function() {
        const seriesSection = document.querySelector('.series');
        seriesSection.classList.remove("d-none");
        heroSection.classList.add("d-none");
      API.getSeries().then((series) => {
            renderSeriesRow(series);
        }).catch(error => console.log("Error: " + error));
    }); 
    seriesButton.addEventListener('click', function() {
        const seriesSection = document.querySelector('.series');
        seriesSection.classList.remove("d-none");
        heroSection.classList.add("d-none");
      API.getSeries().then((series) => {
            renderSeriesRow(series);
        }).catch(error => console.log("Error: " + error));
    }); 
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
//Show the series in the main page:
function renderSeriesRow(seriesList) {
    const seriesRow = document.querySelector(".series-row");
    seriesRow.innerHTML = ""; 

    seriesList.forEach(serie => {
        const div = document.createElement("div");
        div.className = "col-xl-3 col-md-4 col-sm-6 my-4";
        div.innerHTML = `
            <a href="#" class="card h-100" data-id="${serie.name}">
                <img class="card-img-top" style="height: 12rem;" src="${serie.logo}.webp" alt="${serie.name}" />
                <div class="card-body">
                    <h4 class="card-title text-center">${serie.name}</h4>
                </div>
            </a>`;

        const seriesLink = div.querySelector("a");
        seriesLink.addEventListener('click', function(event) {
            event.preventDefault();
            displaySetsBySeries(serie.name); 
        });

        seriesRow.appendChild(div); 
    }); 
}
// Show the sets of a specific series
function displaySetsBySeries(name) {
    const setsSection = document.querySelector('.sets');  
    setsSection.classList.remove("d-none");

    const seriesSection = document.querySelector('.series');
    seriesSection.classList.add("d-none");


    API.getSetsBySeries(name).then((sets) => {
        renderSetsRow(sets);
    }).catch(error => console.log("Error: " + error));
}

// Render sets for the selected series
function renderSetsRow(setsList) {
    const setsRow = document.querySelector(".sets-row");
    setsRow.innerHTML = "";

    setsList.forEach(set => {
        const div = document.createElement("div");
        div.className = "col-xl-3 col-md-4 col-sm-6 mt-4";
        div.innerHTML = `
            <div class="card h-100">
                <img class="card-img-top" style="height: 12rem;" src="${set.logo}.webp" alt="${set.name}" />
                <div class="card-body">
                    <h4 class="card-title text-center">${set.name}</h4>
                </div>
            </div>`;

        setsRow.appendChild(div); 
    });
}



function renderSeries(seriesList){

    const dropdown = document.querySelector(".dropdownSeries .dropdown-menu");
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


function renderSets(setsList){
    const dropdown = document.querySelector(".dropdownSets .dropdown-menu");
    const dropdownItemTemplate = dropdown.querySelector("#dropdownItemTemplate");

    setsList.forEach(set => {

        const dropdownItem = dropdownItemTemplate.cloneNode(true).content;
        const logoItem = dropdownItem.querySelector("img");
        
        logoItem.src = `${set.logo}.webp`;
        logoItem.alt = `${set.name}`

        dropdown.append(dropdownItem);
    });
}