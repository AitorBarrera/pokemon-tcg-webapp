const API_URL = "http://localhost:3000";

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

// export async function postNewCollection(nameCollection) {
//     const newCollection = {
//         "name": nameCollection,
//         "cards": [

//         ]
//     }

//     try {
//         const response = await fetch(`${API_URL}/other_collections`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(newCollection)
//         });

//         if (!response.ok) {
//             throw new Error(`Error: ${response.statusText}`);
//         }
//         const newCard = await response.json();
//         return newCard;

//     } catch (error) {
//         console.error('Post Data Error:', error);
//         throw error;
//     }
// }

// export async function postCardToCollection(nameCollection,card) {
//     try {
//         const response = await fetch(`${API_URL}/ot`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(card)
//         });
//         if (!response.ok) {
//             throw new Error(`Error: ${response.statusText}`);
//         }
//         const newCard = await response.json();
//         return newCard;

//     } catch (error) {
//         console.error('Post Data Error:', error);
//         throw error;
//     }
// }