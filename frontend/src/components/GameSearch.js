
import { useContext } from 'react'
import '../styles/SearchModal.css'
import { SearchContext } from '../context/SearchContext'

function GameSearch() {
    
    let { keyboardClick } = useContext(SearchContext)

    const keyboard = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['del', 'z', 'x', 'c', 'v', 'b', 'n', 'm'],
        ['space']
    ]

    return (
        <div className='keyboard-container'>
            {
                keyboard.map((row, index) => {
                    return (
                        <div key={row} className='keyboard-row'>
                            {
                                row.map((key) => {
                                    return (
                                        <button key={key} className={'keyboard-key row-' + index}
                                            onClick={() => keyboardClick(key)}
                                        >
                                            {key}
                                        </button>
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