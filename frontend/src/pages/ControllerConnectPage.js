
import { useContext, useEffect, useState } from 'react'
import '../styles/ControllerConnect.css'
import { ControllerContext } from '../context/ControllerContext'
import { PageContext } from '../context/PageContext'

export default function ControllerConnectPage() {

    const {
        currentButton, players, allControllersConnected,
    } = useContext(ControllerContext)

    const _players = Object.values(players['current']).slice(2, 4)

    const {
        changePage, modifyHierarchyIndex, modifyElementIndex,
        pageIndex, focusElement, clickElement, clearClasslist, resetPageIndex
    } = useContext(PageContext)

    // onload, change page
    useEffect(() => {
        changePage('controller connect')
    }, [])

    useEffect(() => {

        if (_players.filter((player) => player != null).length > 0) {

            clearClasslist()
            focusElement()

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
                    clickElement()
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
                <span onClick={resetPageIndex}>
                    <button className='controller-submit' onClick={allControllersConnected}>
                        Done
                    </button>
                </span>
            </div>

        </div>
    )
}