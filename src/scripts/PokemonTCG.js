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