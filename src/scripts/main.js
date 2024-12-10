import "../style/main.scss";
import * as buttonUp from "./buttonUp.js";
import * as collectionAPI from "./collectionAPI.js";
import * as toastWindow from "./toastWindow.js";
import * as API from "./PokemonTCG.js";

buttonUp.setupButtonClick();

let currentListCards;
let currentSeriesSelected = "base";
document.addEventListener("DOMContentLoaded", event =>{

    //-----------------------------INDEX PAGE------------------------------------
    changeHTML("sectionHero")

    //-----------------------------NAVIGATION BUTTONS------------------------------------
    const buttonsChangeToSectionHero = document.querySelectorAll(".changeToSectionHero");
    buttonsChangeToSectionHero.forEach(button => button.addEventListener("click", e => changeHTML("sectionHero")));

    const buttonsChangeToSectionCards = document.querySelectorAll(".changeToSectionCards");
    buttonsChangeToSectionCards.forEach(button => button.addEventListener("click", e => {
        filterCards();
        changeHTML("sectionCards")
    }));

    const buttonschangeToFavorites = document.querySelectorAll(".changeToFavorites");
    buttonschangeToFavorites.forEach(button => button.addEventListener("click", e => {
        renderFavorites();
    }));

    const buttonsChangeToSectionSeries = document.querySelectorAll(".changeToSectionSeries");
    buttonsChangeToSectionSeries.forEach(button => button.addEventListener("click", e => {
        changeHTML("sectionSeriesRow")
    }));

    const buttonsChangeToSectionSets = document.querySelectorAll(".changeToSectionSets");
    buttonsChangeToSectionSets.forEach(button => button.addEventListener("click", e => changeHTML("sectionSets")));

    const buttonsSortCards = document.querySelectorAll(".dropdownSort .sortName");
    buttonsSortCards.forEach(button => {
        button.addEventListener("click", e => {
            document.querySelector(".currentSortName").textContent = button.textContent;
            document.querySelector(".currentSortName").setAttribute("data-id", button.getAttribute("data-id"));

            filterCards();
            })
        }
    );

    //-----------------------------REQUEST TO GET THE SERIES AND SETS FROM THE API------------------------------------
    API.getSeries().then((series) => {
        // console.log(series);
       renderSeries(series);
       renderSeriesRow(series);

    }).catch(error => console.log("Error: " + error))

    API.getSets().then((sets) => {
        // console.log(series);
       renderSetsRow(sets);
    }).catch(error => console.log("Error: " + error))

    //-----------------------------FILTERS BY THE NAME WRITTEN IN THE INPUT------------------------------------
    const buttonSearchByName = document.querySelector(".buttonSearchByName");

    buttonSearchByName.addEventListener("click", e =>{
        e.preventDefault();
        e.stopPropagation();
        
        filterCards();
    })
});

//-----------------------------RENDER PAGES------------------------------------
function renderSeriesRow(seriesList) {
    const seriesRow = document.querySelector(".series-row");
    seriesRow.innerHTML = ""; 

    seriesList.forEach(serie => {
        const div = document.createElement("div");
        div.className = "col-xl-3 col-md-4 col-sm-6 my-4";
        div.innerHTML = `
            <a href="#sectionSeriesRow" class="card seriesCard h-100" data-id="${serie.id}">
                    <div class="card-img-top">
                        <img class="img-fluid" src="${serie.logo}.webp" alt="${serie.name}" onerror="this.src='img/no-logo.png';"/>
                    </div>
                    <div class="card-body">
                    <h4 class="card-title text-center">${serie.name}</h4>
                </div>
            </a>`;

        const seriesLink = div.querySelector("a");
        
        seriesLink.addEventListener("click", e =>{
            currentSeriesSelected = serie.id;

            API.getSeriesById(currentSeriesSelected).then((serie) => {
                
                renderSetsRowById(currentSeriesSelected);
                document.querySelector(".selectedSerie").textContent = serie.name;
                document.querySelector(".currentSeries").src = serie.logo + ".webp"
                changeHTML("sectionSetIdRow");
                renderSets(serie.id);
                fixLogos()
            }).catch(error => console.log("Error: " + error))
        })

        seriesRow.appendChild(div); 
    }); 
    fixLogos();
}

function renderSetsRow(setList) {
    const setsRow = document.querySelector(".sets-row");
    setsRow.innerHTML = ""; 

    setList.forEach(set => {
        const div = document.createElement("div");
        div.className = "col-xl-3 col-md-4 col-sm-6 my-4 setCard";
        div.innerHTML = `
                <a href="#sectionSets" class="card setsCard h-100" data-id="${set.id}">
                        <div class="card-img-top">
                            <img class="img-fluid" src="${set.logo}.webp" alt="${set.name}" onerror="this.src='img/no-logo.png';"/>
                        </div>
                        <div class="card-body">
                        <h4 class="card-title text-center">${set.name}</h4>
                    </div>
                </a>
            `;

            const setsLink = div.querySelector("a");
            const selectedSetId = setsLink.getAttribute("data-id");

            setsLink.addEventListener("click", e =>{
                changeHTML("sectionCards");                
                document.querySelector(".currentSeries").src = "";
                document.querySelector(".currentSet").src = set.logo + ".webp"
                document.querySelector(".currentSet").parentNode.setAttribute("data-id", set.id);

                API.getAllPokemonCardsBySet(selectedSetId).then((pokemonCards) => {
                    renderPokemonCard(pokemonCards.cards);
                    currentListCards = pokemonCards.cards;

                }).catch(error => console.log("Error: " + error))
                fixLogos()
            });

        setsRow.appendChild(div); 
    }); 
}

function renderSetsRowById(seriesId) {
    const setsRow = document.querySelector(".setsId-row");
    
    setsRow.innerHTML = "";

    API.getSeriesById(seriesId).then((serie) => {
        const sets = serie.sets;
        
        sets.forEach( set =>{
            const div = document.createElement("div");

            div.className = "col-xl-3 col-md-4 col-sm-6 my-4";
            div.innerHTML = `
                    <a href="#sectionSetIdRow" class="card setByIdCard h-100" data-id="${set.id}">
                            <div class="card-img-top">
                                <img class="img-fluid" src="${set.logo}.webp" alt="${set.name}" onerror="this.src='img/no-logo.png';"/>
                            </div>
                            <div class="card-body">
                            <h4 class="card-title text-center">${set.name}</h4>
                        </div>
                    </a>`;
                
                    const setsLink = div.querySelector("a");
                    const selectedSetId = setsLink.getAttribute("data-id");

                    setsLink.addEventListener("click", e =>{
                        changeHTML("sectionCards");
                        document.querySelector(".currentSet").src = set.logo + ".webp"
                        document.querySelector(".currentSet").parentNode.setAttribute("data-id", set.id);

                        API.getAllPokemonCardsBySet(selectedSetId).then((pokemonCards) => {
                            renderPokemonCard(pokemonCards.cards);
                            currentListCards = pokemonCards.cards;

                        }).catch(error => console.log("Error: " + error))
                    });
                    
            setsRow.appendChild(div); 
    });
    
    changeHTML("sectionSetIdRow");

}).catch(error => console.log("Error: " + error))
}

function renderFavorites() {
    collectionAPI.getAllFavorites().then(cards => {
        renderPokemonCard(cards, true);
        changeHTML("sectionCards");
        changeFavoriteButtonToDelete();
    }).catch(error => console.log("Error: " + error));    
}

function renderPokemonCard(pokemonCards, collections = false){

    const cardContainer = document.querySelector(".cardContainer .row");

    if (!pokemonCards.length > 0){
        cardContainer.innerHTML = "<h2 class='errorFilters text-center display-4'>There are not cards that fit the filters</h2>";
    } else {
        cardContainer.innerHTML = "";
    }

    const cardTemplate = document.querySelector("#pokemonCardTemplate");

    // Remove objects without images.
    pokemonCards = pokemonCards.filter(card =>{
        return card.image != null;
    })

    pokemonCards.forEach(pokemonCard => {

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
        const toastElement = document.getElementById('liveToastFav');
        const toast = new bootstrap.Toast(toastElement);

        button.addEventListener("click", e =>{

            const idCard = button.getAttribute("data-id");

            API.getPokemonCardsById(idCard).then((card) => {
                let selectedCard = card;
                // renderModalAddCollection(card);
                document.querySelector(".toastIcon").src = card.image + "/high.webp";
                document.querySelector(".toastCardName").textContent = card.name;
                collectionAPI.postCardToFavorites(selectedCard);
        
            }).catch(error => console.log("Error: " + error));
            
            toast.show();
        })
    })

    toggleFilter(collections)
}

//-----------------------------RENDER FILTERS------------------------------------
function renderSeries(seriesList){

    const dropdown = document.querySelector(".dropdownSeries");
    const dropdownItemTemplate = dropdown.querySelector("#dropdownItemTemplate");

    seriesList.forEach(serie => {

        const dropdownItem = dropdownItemTemplate.cloneNode(true).content;
        const logoItem = dropdownItem.querySelector("img");
        const nameItem = dropdownItem.querySelector(".nameItem");
        
        logoItem.src = `${serie.logo}.webp`;
        logoItem.alt = `${serie.name}`
        nameItem.textContent = `${serie.name}`
        

        // change current series selected logo
        const logoCurrentSeries = document.querySelector(".dropdownSeriesContainer .currentSeries");
        const nameCurrentSeries = document.querySelector(".dropdownSeriesContainer .currentSeriesName");
        const linkItem = dropdownItem.querySelector("a");

        linkItem.setAttribute("data-id", serie.id);
        linkItem.addEventListener("click", e =>{
            currentSeriesSelected = serie.id;

            API.getSeriesById(currentSeriesSelected).then((serie) => {
                logoCurrentSeries.src = serie.logo + ".webp";
                logoCurrentSeries.alt = `${serie.name}`
                // nameCurrentSeries.textContent = `${serie.name}`
                
                // reset current set
                document.querySelector(".currentSet").setAttribute("src","img/logo-placeholder.png");
                document.querySelector(".currentRarityName").innerHTML = '<img src="img/logo-placeholder.png" alt="" class="w-50">';
                
                renderSets(currentSeriesSelected);
                fixLogos();
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
            const nameItem = dropdownItem.querySelector(".nameItem");
            
            logoItem.src = `${set.logo}.webp`;
            logoItem.alt = `${set.name}`
            nameItem.textContent = `${set.name}`;
            
            const linkItem = dropdownItem.querySelector("a");
            linkItem.setAttribute("data-id", set.id);

            const logoCurrent = document.querySelector(".dropdownSetsContainer .currentSet");

            linkItem.addEventListener("click", e =>{
                
                logoCurrent.src = set.logo + ".webp";
                logoCurrent.alt = `${set.name}`
                logoCurrent.parentNode.setAttribute("data-id", set.id);

                document.querySelector(".currentRarityName").innerHTML = '<img src="img/logo-placeholder.png" alt="" class="w-50">';
                renderRarities(set.id);
                filterCards();
                fixLogos();
            })

            dropdown.append(dropdownItem);
        })

    }).catch(error => console.log("Error: " + error))
}


function renderRarities(setId){
    const dropdown = document.querySelector(".dropdownRarity");
    dropdown.innerHTML = ""

    const dropdownItemTemplate = document.querySelector("#dropdownItemRarityTemplate");

    API.getRarities(setId).then((rarities) => {

        rarities.forEach( rarity =>{
            const dropdownItem = dropdownItemTemplate.cloneNode(true).content;
            const rarityName = dropdownItem.querySelector(".rarityName");
            
            rarityName.textContent = rarity;
            
            const linkItem = dropdownItem.querySelector("a");

            const rarityCurrent = document.querySelector(".currentRarityName");

            linkItem.addEventListener("click", e =>{
                rarityCurrent.textContent = rarity;

                filterCards();
            })

            dropdown.append(dropdownItem);
        })

    }).catch(error => console.log("Error: " + error))
}


//-----------------------------FILTER OF CARDS BY THE SETUP PARAMETERS------------------------------------
function filterCards() {
    let currentSetId = document.querySelector(".currentSet").parentNode.getAttribute("data-id");
    let inputSearchByName = document.querySelector(".inputSearchByName");
    let currentRarityName = document.querySelector(".currentRarityName").textContent;
    let currentSortName = document.querySelector(".currentSortName").getAttribute("data-id");

    currentSetId = currentSetId==null? undefined :currentSetId;

    API.getFilteredCards(currentSetId, inputSearchByName.value, "", currentRarityName, currentSortName).then(cards => {
        renderPokemonCard(cards);
        
    }).catch(error => console.log("Error: " + error));
}


//-----------------------------SPA FUNCTION------------------------------------
function changeHTML(id) { 
    const header = document.querySelector("header");

    if (id == "sectionHero"){
        header.classList.remove("d-block")
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
    });

    const paginaAMostrar = document.querySelector(`#${id}`);
    
    if (paginaAMostrar.classList.contains("d-none"))
        paginaAMostrar.classList.remove("d-none");
    paginaAMostrar.classList.add("d-block");
}


//-----------------------------CHANGE THE BUTTON ON CARDS TO DELETE IN FAVORITE PAGE------------------------------------
function changeFavoriteButtonToDelete() {
    
    const starFavoriteButtonContainers = document.querySelectorAll(".starFavoriteButtonContainer");
    starFavoriteButtonContainers.forEach(container =>{
        const idCard = container.querySelector(".starFavoriteButton").getAttribute("data-id");
        
        container.innerHTML = `<a class="deleteFavoriteButton" data-id=${idCard}>
                                <i class="fa-solid fa-trash deleteFavorite"></i>
                            </a>`;
    })

    const buttons = document.querySelectorAll(".deleteFavoriteButton");
        buttons.forEach(button => {
            const toastElement = document.getElementById('liveToastFavDel');
            const toast = new bootstrap.Toast(toastElement);

            button.addEventListener("click", e =>{
                toast.show();

                const idCard = button.getAttribute("data-id");

                collectionAPI.deleteCardFromFavorites(idCard).then(card =>{
                    console.log(`Card with id ${idCard} has benn deleted from favorites.`);
        
                    document.querySelector(".toastIconDelete").src = card.image + "/high.webp";
                    document.querySelector(".toastCardNameDelete").textContent = card.name;
                    
                    renderFavorites();
                }).catch(error => console.log("Error: " + error));
            
            })
        })
}

//-----------------------------HIDE THE FILTER FOR FAOVRITES PAGE------------------------------------
function toggleFilter(favorite = false) {
    let filterNavbar = document.querySelector("#navbar");
    let favoritesTitle = document.querySelector(".favoritesTitle");
    

    if (favorite){
        filterNavbar.classList.remove("d-block")
        filterNavbar.classList.add("d-none")
        favoritesTitle.classList.remove("d-none")
        favoritesTitle.classList.add("d-block")
    } else {
        filterNavbar.classList.remove("d-none")
        filterNavbar.classList.add("d-block")
        favoritesTitle.classList.remove("d-block")
        favoritesTitle.classList.add("d-none")
    }

}

//-----------------------------FIX WRONG LOGOS------------------------------------
function fixLogos() {
    let allImgs= document.querySelectorAll("img");

    allImgs.forEach(img =>{
        let srcImg = img.src;
        
        if (srcImg.indexOf("/pop/np/logo.webp") != -1){
            img.src = `https://assets.tcgdex.net/en/pop/pop1/logo.webp`
        } else
        if (srcImg.indexOf("/dp/dpp/logo.webp") != -1){
            img.src = `https://assets.tcgdex.net/en/dp/dp1/logo.webp`
        } else
        if (srcImg.indexOf("/xy/xyp/logo.webp") != -1){
            img.src = `https://assets.tcgdex.net/en/xy/xy1/logo.webp`
        } else
        if (srcImg.indexOf("/sm/smp/logo.webp") != -1){
            img.src = `https://assets.tcgdex.net/en/sm/sm1/logo.webp`
        } else
        if (srcImg.indexOf("/swsh/swshp/logo.webp") != -1){
            img.src = `https://assets.tcgdex.net/en/swsh/swsh1/logo.webp`
        }
    })
}



// Form validation
(function () {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms).forEach(function (form) {
        const buttonForm = form.querySelector('.needs-validation button');
        
        buttonForm.addEventListener('click', function (event) {
            // HTML5 validation
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            //Petcode validation
            const inputSearchByName = document.querySelector('.inputSearchByName');
            console.log(inputSearchByName.value);
            
            let regEx = /^[a-zA-Z]*$/i;

            if (!regEx.test(inputSearchByName.value)) {
                console.log(true);
                inputSearchByName.setCustomValidity('Please insert only letters.');
                const validationMessage = document.querySelector('.inputSearchByName + div');
                console.log(validationMessage);
                
                validationMessage.textContent = "Please insert only letters.";

            } else {
                console.log(false);
                inputSearchByName.setCustomValidity('');
            }

            // Add Bootstrap validation classes
            form.classList.add('was-validated');
        }, false);
    });
})();