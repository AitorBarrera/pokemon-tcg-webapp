# Pokemon TCG Explorer <img src="src/img/logo.png" alt="logo" style="width:80px;"></img>

### Authors: Aitor and Hugo

## Overview.

The main purpose of the app is to:

- Show Pokémon cards from the TCG card game.
- Filter cards by series and sets.
- Add your favorite cards to a private **Favorites** list via a custom API.

We use a JSON server to save the favorites data in the `db.json` file.

### Live Demo

You can view the live version of the project here: [Pokemon TCG Explorer](https://aitorbarrera.github.io/pokemon-tcg-webapp/)

## API Integration

API Name: TCG dex.

Link: [API Url](https://tcgdex.dev/)

Access: We acces to the API through the PokemonTCG.js file, where we find the different methods to obtain the information.

```javascript
const API_URL = "https://api.tcgdex.net/v2/en";

export async function getAllPokemonCardsBySet(set) {
  try {
    const response = await fetch(`${API_URL}/sets/${set}`);

    // parse the json response
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
```
