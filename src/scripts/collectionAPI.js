const API_URL = "http://localhost:3000";
import * as API from "./PokemonTCG.js";

export async function getAllFavorites(){

    try {
        
        const response = await fetch(`${API_URL}/favorites`);

        // parse the json response
        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function postCardToFavorites(card) {
    try {
        const response = await fetch(`${API_URL}/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(card)
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const newCard = await response.json();
        return newCard;

    } catch (error) {
        console.error('Post Data Error:', error);
        throw error;
    }
}

export async function deleteCardFromFavorites(idCard) {
    try {
        const response = await fetch(`${API_URL}/favorites/${idCard}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const newCard = await response.json();
        return newCard;

    } catch (error) {
        console.error('Post Data Error:', error);
        throw error;
    }
}


// COLLECTIONS
export async function getCollections(){
    try {
        const response = await fetch(`${API_URL}/other_collections`);

        let data = await response.json();

        let collectionNames = new Set();

        data.forEach(collection => {
            collectionNames.add(collection.name)
        });

        return collectionNames;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getCollectionByName(name){
    try {
        const response = await fetch(`${API_URL}/other_collections?name=${name}`);

        let data = await response.json();

        return data[0];

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function postNewCollection(nameCollection) {
    const newCollection = {
        "name": nameCollection,
        "cards": []
    }

    try {
        const response = await fetch(`${API_URL}/other_collections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCollection)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const newCard = await response.json();
        return newCard;

    } catch (error) {
        console.error('Post Data Error:', error);
        throw error;
    }
}

export async function addCardToCollection(nameCollection,card) {
    let collection = await getCollectionByName(nameCollection);
    let collectionId = collection.id;

    collection.cards.push(card);

    try {
        const response = await fetch(`${API_URL}/other_collections/${collectionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(collection)
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const newCard = await response.json();
        return newCard;

    } catch (error) {
        console.error('Post Data Error:', error);
        throw error;
    }
}

export async function deleteCardFromCollection(nameCollection,card) {
    let collection = await getCollectionByName(nameCollection);
    let collectionId = collection.id;
    let cardId = card.id;
    collection.cards = collection.cards.filter(currentCard => {
        console.log(currentCard.id + " " + cardId);
        
        return currentCard.id != cardId}
    );

    try {
        const response = await fetch(`${API_URL}/other_collections/${collectionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(collection)
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const newCard = await response.json();
        return newCard;

    } catch (error) {
        console.error('Post Data Error:', error);
        throw error;
    }
}

// API.getPokemonCardsById("base1-1").then(card =>{
//     console.log(card);
    
//     deleteCardFromCollection("DELPHIN", card);
// });

getCollections().then(names =>{
    console.log(names);
    
})