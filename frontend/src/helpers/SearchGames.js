
export const searchBy = (games, search) => {

    search = search.toLowerCase()
    return (games.filter((game) => game['title'].toLowerCase().indexOf(search) >= 0 || game['author'].toLowerCase().indexOf(search) >= 0))

}