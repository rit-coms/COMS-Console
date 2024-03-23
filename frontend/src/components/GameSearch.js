
import '../styles/SearchModal.css'

function GameSearch({keyboardClick}) {
    
    const keyboard = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'del'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
        ['space']
    ]

    // const searchGame = (searchTerm) => {
    //     let searchResults = []
    //     games.forEach(game => {
    //         // Add the game to an array of search results if the search term is included in the name or author
    //         if (game.name.toLowerCase().includes(searchTerm) || game.author.toLowerCase().includes(searchTerm)) {
    //             searchResults.push(game);
    //         }
    //     });

    //     console.log(searchResults);
    //     setSearchResults(searchResults);

    //     return searchResults;
    // }

    // {
    //     searchResults.map((game, index) => (
    //         <div key={index} style={{ textAlign: 'center', margin: 'auto', width: '50%' }}
    //         >
    //             <img height="120px" width="120px"
    //                 style={{ display: 'block', margin: 'auto' }}
    //                 src='https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F7%2F74%2FWhite_domesticated_duck%2C_stretching.jpg&f=1&nofb=1&ipt=fe16a3ffa3dbfffac1161692adff97ed1ec76957bdad784cfdb37813d1a8a561&ipo=images'></img>
    //             <h3 style={{ textAlign: 'center', margin: 'auto', width: '50%' }}
    //                 onClick={() => openModal(game)}>{game.name}</h3>
    //             <p style={{ textAlign: 'center', margin: 'auto', width: '50%' }}>{game.author}</p>
    //         </div>
    //     ))
    // }

    return (
        <div className='keyboard-container'>
            {
                keyboard.map((row) => {
                    return (
                        <div key={row} className='keyboard-row'>
                            {
                                row.map((key) => {
                                    return (
                                        <div key={key} className='keyboard-key'
                                            onClick={() => keyboardClick(key)}
                                        >
                                            {key}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default GameSearch