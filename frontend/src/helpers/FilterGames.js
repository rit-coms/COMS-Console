
export const filterByGenre = (games, type) => {

    type = type.toLowerCase()
    return (games.filter((game) => game['genre'].includes(type)))

}

export const filterByPlayers = (games, type) => {

    type = type.toLowerCase()

    switch (type) {
        case 'single player':
            return (games.filter((game) => game['is_multiplayer'] == false))
        case 'multiplayer':
            return (games.filter((game) => game['is_multiplayer'] == true))
    }

}

export const filterByYear = (games, year) => {

    return games.filter((game) => (game['release_date'].split("/")[2] == year))

}