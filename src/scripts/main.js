import "../style/main.scss";
import * as buttonUp from "./buttonUp.js";
buttonUp.setupButtonClick();

import * as API from "./PokemonTCG.js";

let currentListCards;
let currentSeriesSelected = "base";

document.addEventListener("DOMContentLoaded", event =>{
    changeHTML("sectionHero")
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
       renderSeriesRow(series);
    }).catch(error => console.log("Error: " + error))

    API.getSets().then((sets) => {
        // console.log(series);
       renderSetsRow(sets);
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
        

        // change current series selected logo
        const logoCurrentSeries = document.querySelector(".dropdownSeriesContainer .currentSeries");
        const linkItem = dropdownItem.querySelector("a");

        linkItem.setAttribute("data-id", serie.id);
        linkItem.addEventListener("click", e =>{
            currentSeriesSelected = serie.id;

            API.getSeriesById(currentSeriesSelected).then((serie) => {
                logoCurrentSeries.src = serie.logo + ".webp";
                
                renderSets(currentSeriesSelected);
        
            }).catch(error => console.log("Error: " + error))
        })

        
        dropdown.append(dropdownItem);
    });
}

//Show series in row
function renderSeriesRow(seriesList) {
    const seriesRow = document.querySelector(".series-row");
    seriesRow.innerHTML = ""; 

    seriesList.forEach(serie => {
        const div = document.createElement("div");
        div.className = "col-xl-3 col-md-4 col-sm-6 my-4";
        div.innerHTML = `
            <a href="#sectionSeries" class="card h-100" data-id="${serie.id}">
                <img class="card-img-top" style="height: 12rem;" src="${serie.logo ? serie.logo + '.webp' : 'img/no-image.jpg'}" alt="${serie.name}" />
                <div class="card-body">
                    <h4 class="card-title text-center">${serie.name}</h4>
                </div>
            </a>`;

        const seriesLink = div.querySelector("a");
        seriesLink.addEventListener("click", e =>{
            currentSeriesSelected = serie.id;

            API.getSeriesById(currentSeriesSelected).then((serie) => {
                
                renderSetsRowById(currentSeriesSelected);
        
            }).catch(error => console.log("Error: " + error))
        })

        seriesRow.appendChild(div); 
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


//Show sets in row

function renderSetsRow(setList) {
    const setsRow = document.querySelector(".sets-row");
    setsRow.innerHTML = ""; 

    setList.forEach(set => {
        const div = document.createElement("div");
        div.className = "col-xl-3 col-md-4 col-sm-6 my-4";
        div.innerHTML = `
                <img class="card-img-top" style="height: 12rem;" src="${set.logo ? set.logo + '.webp' : 'img/no-image.jpg'}" alt="${set.name}" />
                <div class="card-body">
                    <h4 class="card-title text-center">${set.name}</h4>
                </div>`;

        setsRow.appendChild(div); 
    }); 
}


//Render all sets by ID 


function renderSetsRowById(seriesId) {
    const setsRow = document.querySelector(".setsId-row");
    
    setsRow.innerHTML = ""; 
    API.getSeriesById(seriesId).then((serie) => {
        const sets = serie.sets;
        
        sets.forEach( set =>{
        const div = document.createElement("div");

        div.className = "col-xl-3 col-md-4 col-sm-6 my-4";
        div.innerHTML = `
                <a href="#sectionCards" data-id="${set.id}">
                <img class="card-img-top" style="height: 12rem;" src="${set.logo ? set.logo + '.webp' : 'img/no-image.jpg'}" alt="${set.name}" />
                <div class="card-body">
                    <h4 class="card-title text-center">${set.name}</h4>
                </div>
                </a>`;
            
                const setsLink = div.querySelector("a");
                const selectedSetId = setsLink.getAttribute("data-id");
                setsLink.addEventListener("click", e =>{
                    changeHTML("sectionCards");
                    API.getAllPokemonCardsBySet(selectedSetId).then((pokemonCards) => {
                        renderPokemonCard(pokemonCards.cards);
                        currentListCards = pokemonCards.cards;                    
                    }).catch(error => console.log("Error: " + error))
                });
                
        setsRow.appendChild(div); 


    });

    const seriesRow = document.querySelector(".series-row");
    seriesRow.classList.toggle("d-none"); 

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

const buttonsChangeToSectionSeries = document.querySelectorAll(".changeToSectionSeries");
buttonsChangeToSectionSeries.forEach(button => button.addEventListener("click", e => {
    changeHTML("sectionSeries")
    
    const seriesRow = document.querySelector(".series-row");

    seriesRow.classList.remove("d-none");
    seriesRow.classList.add("d-flex");

}));

const buttonsChangeToSectionSets = document.querySelectorAll(".changeToSectionSets");
buttonsChangeToSectionSets.forEach(button => button.addEventListener("click", e => changeHTML("sectionSets")));

