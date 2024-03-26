
import { useContext } from 'react'
import '../styles/SearchModal.css'
import { SearchContext } from '../context/SearchContext'

function GameSearch() {
    
    let { keyboardClick } = useContext(SearchContext)

    const keyboard = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'del'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
        ['space']
    ]

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