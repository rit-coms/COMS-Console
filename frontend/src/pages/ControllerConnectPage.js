
import { useContext, useEffect, useState } from 'react'
import '../styles/ControllerConnect.css'
import { ControllerContext } from '../context/ControllerContext'

export default function ControllerConnectPage() {

    const {
        currentButton, currentPlayer, players,
        allControllersConnected,

    } = useContext(ControllerContext)

    const _players = Object.values(players['current']).slice(2, 4)

    const [pageIndex, setPageIndex] = useState(
        { hierarchyIndex: 0, elementIndex: 0 }
    )

    // focusable elements on the page
    const pageHierarchy = {
        0: document.querySelectorAll('button.player-description'),
        1: document.querySelectorAll('button.controller-submit')
    }

    // helper mod function
    const mod = (n, m) => {
        return ((n % m) + m) % m
    }

    // reset element index when hierarchy is changed
    const resetElementIndex = (from, to) => {
        setPageIndex(pageIndex => (
            {
                ...pageIndex,
                ['elementIndex']: mod(
                    Object.values(pageHierarchy)[from].length,
                    Object.values(pageHierarchy)[to].length
                )
            }
        ))
    }

    // iterate up/down through elements on different hierarchy
    const modifyHierarchyIndex = (type) => {

        let currentHierarchy = pageIndex.hierarchyIndex
        let newHierarchy = -1
        const keyLength = Object.keys(pageHierarchy).length

        switch (type) {
            case "increase":
                if (currentHierarchy + 1 >= keyLength)
                    return
                newHierarchy = currentHierarchy + 1
                break

            case "decrease":
                if (currentHierarchy - 1 < 0)
                    return
                newHierarchy = currentHierarchy - 1
                break
        }

        const value = mod((newHierarchy), keyLength)
        setPageIndex(pageIndex => ({ ...pageIndex, ['hierarchyIndex']: value }))
        resetElementIndex(currentHierarchy, newHierarchy)
    }

    // iterate right/left through elements on same hierarchy
    const modifyElementIndex = (type) => {
        let currentHierarchy = pageIndex.elementIndex
        let newHierarchy = -1
        const valueLength = Object.values(pageHierarchy[pageIndex.hierarchyIndex]).length

        switch (type) {
            case "increase":
                if (currentHierarchy + 1 >= valueLength)
                    return
                newHierarchy = currentHierarchy + 1
                break

            case "decrease":
                if (currentHierarchy - 1 < 0)
                    return
                newHierarchy = currentHierarchy - 1
                break
        }

        const value = mod((newHierarchy), valueLength)
        setPageIndex(pageIndex => ({ ...pageIndex, ['elementIndex']: value }))
    }

    // re-render everytime currentButton changes
    useEffect(() => {

        // if at least 1 player connected
        if (_players.filter((player) => player != null).length > 0) {
            pageHierarchy[pageIndex.hierarchyIndex][pageIndex.elementIndex].focus()

            switch (currentButton) {
                case "DOWN":
                    modifyHierarchyIndex('increase')
                    break
                case "UP":
                    modifyHierarchyIndex('decrease')
                    break
                case "RIGHT":
                    modifyElementIndex('increase')
                    break
                case "LEFT":
                    modifyElementIndex('decrease')
                    break
                case "A":
                    pageHierarchy[pageIndex.hierarchyIndex][pageIndex.elementIndex].click()
                    break
            }

        }

    }, [currentButton])


    return (
        <div className="controller-connect-container">

            <div className="controller-connect-header">
                <span>Waiting for controller connection...</span>
            </div>

            <div className="controller-connect-players-container">

                {
                    _players.map((player, index) => {
                        return (
                            <div key={index} className={player ? 'player connected' : 'player'}>
                                <div className={player ? 'player-card connected' : 'player-card'}>
                                    {
                                        player ?
                                            <div className="mascot"></div>
                                            : null
                                    }
                                </div>
                                <button className={player ? 'player-description connected' : 'player-description'}>
                                    Player {index + 1}
                                </button>
                            </div>
                        )
                    })
                }

            </div>

            <div className="controller-connect-footer">
                <button className='controller-submit' onClick={allControllersConnected}>Done</button>
            </div>

        </div>
    )
}