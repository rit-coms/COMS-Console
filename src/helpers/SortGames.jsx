
export const sortAlphabetical = (games) => { 
    return games.sort((a, b) =>
        (a['title'].toUpperCase() < b['title'].toUpperCase())
            ? -1 : 1
    )
}

export const sortReverseAlphabetical = (games) => {
    return games.sort((a, b) =>
        (a['title'].toUpperCase() > b['title'].toUpperCase())
            ? -1 : 1
    )
}

export const sortLatestReleaseDate = (games) => {
    return games.sort((a, b) => 
        (getDate(a) > getDate(b))
            ? -1 : 1
    )
}

export const sortOldestReleaseDate = (games) => {
    return games.sort((a, b) =>
        (getDate(a) < getDate(b))
            ? -1 : 1
    )
}

export const sortMostPlayed = (games) => {
    return games.sort((a, b) =>
        (a['times_played'] > b['times_played'])
            ? -1 : 1
    )
}

export const sortLeastPlayed = (games) => {
    return games.sort((a, b) =>
        (a['times_played'] < b['times_played'])
            ? -1 : 1
    )
}

export const sortLastPlayed = (games) => {
    return games.sort((a, b) => {
        (a['last_played'] < b['last_played'])
            ? -1 : 1
    })
}

// const getDate = (object, field='release_date') => {
//     // date convention: mm/dd/yyyy
//     const date = object[field].split('/')
//     return new Date(date[2], date[0], date[1])
// }
