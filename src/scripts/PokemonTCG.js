const API_URL = "https://api.tcgdex.net/v2/en";

export async function getAllPokemonCardsBySet(set){

    try {
        const response = await fetch(`${API_URL}/sets/${set}`);

        // parse the json response
        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getPokemonCardsById(id){

    try {
        const response = await fetch(`${API_URL}/cards/${id}`);

        // parse the json response
        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}


export async function getPokemonCardsByName(name){

    try {
        const response = await fetch(`${API_URL}/cards?name=${name}`);

        // parse the json response
        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}


export async function getPokemonCardsBySuffix(suffix){

    try {
        const response = await fetch(`${API_URL}/cards?suffix=like:${suffix}`);

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}


export async function getSeries(){

    try {
        const response = await fetch(`${API_URL}/series`);

        // parse the json response
        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getSeriesById(id){

    try {
        const response = await fetch(`${API_URL}/series/${id}`);

        // parse the json response
        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getSets(){

    try {
        const response = await fetch(`${API_URL}/sets`);

        // parse the json response
        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getSetsBySeriesId(){

    try {
        const response = await fetch(`${API_URL}/series/${id}`);

        // parse the json response
        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getFilteredCards(set = "base1", name = "", category = "", rarity = "", sortedBy = ""){

    try {
        const endPoint =`${API_URL}/cards?id=like:${set}&name=like:${name}&category=like:${category}&rarity=like:${rarity}&sort:field=${sortedBy}&${sortedBy}=notnull:`
        console.log(endPoint);
        
        const response = await fetch(endPoint);

        // parse the json response
        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
  
export async function getCardCount(cardSet){

    try {
        const endPoint =`${API_URL}/sets/${cardSet}`

        const response = await fetch(endPoint);

        // parse the json response
        const data = await response.json();

        return data.cardCount.official;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getRarities(cardSet) {
    try {
      const count = await getCardCount(cardSet);
      console.log("Card Set:", cardSet);
      console.log("Count:", count);
  
      if (count > 200) return null;

      const rarities = new Set();
  
      const urls = [];
      for (let index = 1; index < count; index++) {
        let apiUrl = `https://api.tcgdex.net/v2/en/cards/${cardSet}-${index}`; 
        if(["a1","sv-01","sv-02","sv-03", "sv03.5"].indexOf(cardSet.toLowerCase()) != -1){
            apiUrl = `https://api.tcgdex.net/v2/en/cards/${cardSet}-${index.toString().padStart(3, "0")}`;
        } else if (["smp","bwp"].indexOf(cardSet.toLowerCase()) != -1){
            apiUrl = `https://api.tcgdex.net/v2/en/cards/${cardSet}-SM${index.toString().padStart(2, "0")}`;
        }

        urls.push(apiUrl);
      }

      const responses = await Promise.all(urls.map(url => fetch(url)));
  
      for (const response of responses) {
        if (!response.ok) {
          console.warn(`Error en la URL ${response.url}: ${response.statusText}`);
          continue;
        }
  
        const cardData = await response.json();
        if (cardData.rarity) {
          rarities.add(cardData.rarity);
        }
      }
  
      const raritiesArray = [...rarities];
      console.log("Rarities:", raritiesArray);
      return raritiesArray;
  
    } catch (error) {
      console.error("Error en getRarities:", error);

      return [];
    }
  }