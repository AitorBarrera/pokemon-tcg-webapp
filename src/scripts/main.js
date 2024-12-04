import "../style/main.scss";
import * as buttonUp from "./buttonUp.js";
import * as collectionAPI from "./collectionAPI.js";

buttonUp.setupButtonClick();

import * as API from "./PokemonTCG.js";

let currentListCards;
let currentSeriesSelected = "base";

document.addEventListener("DOMContentLoaded", event =>{
    changeHTML("sectionCards")
    // API.getAllPokemonCardsBySet("A1").then((pokemonCard) => {
    //     // console.log(pokemonCard.cards);
    //     renderPokemonCard(pokemonCard.cards);

    // }).catch(error => console.log("Error: " + error))
    
    // API.getPokemonCardsByName("like:cubone").then((pokemonCards) => {
    //     // console.log(pokemonCard);
    //     currentListCards = pokemonCards;
    //     renderPokemonCard(pokemonCards);

    // }).catch(error => console.log("Error: " + error))

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

    const buttonSearchByName = document.querySelector(".buttonSearchByName");

    buttonSearchByName.addEventListener("click", e =>{
        e.preventDefault();
        e.stopPropagation();

        const inputSearchByName = document.querySelector(".inputSearchByName");

        filterByName(inputSearchByName.value);
    })
});

function renderPokemonCard(pokemonCards){
    // console.log(pokemonCards);

    const cardContainer = document.querySelector(".cardContainer .row");

    if (!pokemonCards.length > 0){
        cardContainer.innerHTML = "<h2 class='errorFilters'>There are not cards that fit the filters</h2>";
    } else {
        cardContainer.innerHTML = "";
    }

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
        cardImg.alt = pokemonCard.id

        const starFavoriteButton = card.querySelector(".starFavoriteButton");
        starFavoriteButton.setAttribute("data-id", pokemonCard.id);
        
        cardContainer.append(card);
    });

    const starFavoriteButtons = document.querySelectorAll(".starFavoriteButton");
    
    starFavoriteButtons.forEach(button => {
        button.addEventListener("click", e =>{
            const idCard = button.getAttribute("data-id");

            API.getPokemonCardsById(idCard).then((card) => {
                // console.log(series);
                let selectedCard = card;
                collectionAPI.postCardToFavorites(selectedCard);
        
            }).catch(error => console.log("Error: " + error));
            
        })
    })
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
        

        // change current series selected logo
        const logoCurrentSeries = document.querySelector(".dropdownSeriesContainer .currentSeries");
        const linkItem = dropdownItem.querySelector("a");

        linkItem.setAttribute("data-id", serie.id);
        linkItem.addEventListener("click", e =>{
            currentSeriesSelected = serie.id;

            API.getSeriesById(currentSeriesSelected).then((serie) => {
                logoCurrentSeries.src = serie.logo + ".webp";
                logoCurrentSeries.alt = `${serie.name}`
                
                renderSets(currentSeriesSelected);
        
            }).catch(error => console.log("Error: " + error))
        })

        dropdown.append(dropdownItem);
    });
}

function renderSets(seriesId){
    const dropdown = document.querySelector(".dropdownSets");
    dropdown.innerHTML = ""

    const dropdownItemTemplate = document.querySelector("#dropdownItemTemplate");

    API.getSeriesById(seriesId).then((serie) => {
        const sets = serie.sets;

        sets.forEach( set =>{
            const dropdownItem = dropdownItemTemplate.cloneNode(true).content;
            const logoItem = dropdownItem.querySelector("img");
            
            logoItem.src = `${set.logo}.webp`;
            logoItem.alt = `${set.name}`
            
            const linkItem = dropdownItem.querySelector("a");
            linkItem.setAttribute("data-id", serie.id);

            const logoCurrent = document.querySelector(".dropdownSetsContainer .currentSet");

            linkItem.addEventListener("click", e =>{
                let currentSetSelectedId = set.id;
                logoCurrent.src = set.logo + ".webp";
                logoCurrent.alt = `${set.name}`
                

                // API.getSeriesById(currentSeriesSelectedId).then((serie) => {
                //     logoCurrent.src = serie.logo + ".webp";
            
                // }).catch(error => console.log("Error: " + error));

                API.getAllPokemonCardsBySet(currentSetSelectedId).then((pokemonCards) => {
                    renderPokemonCard(pokemonCards.cards);
                    currentListCards = pokemonCards.cards;
            
                }).catch(error => console.log("Error: " + error));
            })

            dropdown.append(dropdownItem);
        })

    }).catch(error => console.log("Error: " + error))
}

function filterByName(name) {
    const filterCards = currentListCards.filter(card =>{
        return card.name.toLowerCase().indexOf(name.toLowerCase()) != -1;
    })

    renderPokemonCard(filterCards);
}

// funcion auxiliar que cambia la pagina que se quiere mostrar
function changeHTML(id) { 
    const header = document.querySelector("header");
    if (id == "sectionHero"){
        header.classList.remove("d-none")
        header.classList.add("d-none")
    }else{
        header.classList.add("d-block")
        header.classList.remove("d-none")
    }

    const paginas = document.querySelectorAll(".pagina");

    paginas.forEach(pagina => {
        if (pagina.classList.contains("d-block"))
            pagina.classList.remove("d-block")
        pagina.classList.add("d-none")
    }
    );

    const paginaAMostrar = document.querySelector(`#${id}`);
    
    if (paginaAMostrar.classList.contains("d-none"))
        paginaAMostrar.classList.remove("d-none");
    paginaAMostrar.classList.add("d-block");
}

const buttonsChangeToSectionHero = document.querySelectorAll(".changeToSectionHero");
buttonsChangeToSectionHero.forEach(button => button.addEventListener("click", e => changeHTML("sectionHero")));

const buttonsChangeToSectionCards = document.querySelectorAll(".changeToSectionCards");
buttonsChangeToSectionCards.forEach(button => button.addEventListener("click", e => changeHTML("sectionCards")));

const buttonschangeToFavorites = document.querySelectorAll(".changeToFavorites");
console.log(buttonschangeToFavorites);

buttonschangeToFavorites.forEach(button => button.addEventListener("click", e => {
    renderFavorites();
}));


collectionAPI.getAllFavorites().then(cards =>{
    console.log(cards);
    
}).catch(error => console.log("Error: " + error));


function renderFavorites() {
    collectionAPI.getAllFavorites().then(cards => {
        renderPokemonCard(cards);
        changeHTML("sectionCards");
        changeFavoriteButtonToDelete()
    }).catch(error => console.log("Error: " + error));
}

// function to change the favorite button to delete button
function changeFavoriteButtonToDelete() {

    const starFavoriteButtonContainers = document.querySelectorAll(".starFavoriteButtonContainer");
    starFavoriteButtonContainers.forEach(container =>{
        const idCard = container.querySelector(".starFavoriteButton").getAttribute("data-id");
        
        container.innerHTML = `<a class="deleteFavoriteButton" data-id=${idCard}>
                                <i class="fa-solid fa-trash deleteFavorite"></i>
                            </a>`;
    })

    const buttons = document.querySelectorAll(".deleteFavoriteButton");
        buttons.forEach(button => button.addEventListener("click", e =>{
            const idCard = button.getAttribute("data-id");
            collectionAPI.deleteCardFromFavorites(idCard).then(response =>{
                console.log(`Card with id ${idCard} has benn deleted from favorites.`);
    
                renderFavorites();
            }).catch(error => console.log("Error: " + error));
        }))
}