import { useContext, useState } from "react";
import { createContext } from "react";
import { ControllerContext } from "./ControllerContext";

export const PageContext = createContext("")

// helper mod function
const mod = (n, m) => {
    return ((n % m) + m) % m
}

const getPageHierarchy = (page) => {
    
    // returns the hierarchy of focusable elements on the page
    switch (page) {
        case "controller connect":
            return {
                0: document.querySelectorAll('button.player-description'),
                1: document.querySelectorAll('button.controller-submit')
            }

        case "home":
            return {
                0: document.querySelectorAll('button.search-bar, .search-button'),
                1: document.querySelectorAll('.game-gallery-card')
            }

        case "full game gallery":
            break

        case "search modal":
            return {
                0: document.querySelectorAll('.search-modal-close'),
                1: document.querySelectorAll('div.search-bar'),
                2: document.querySelectorAll('.row-0'),
                3: document.querySelectorAll('.row-1'),
                4: document.querySelectorAll('.row-2'),
                5: document.querySelectorAll('.row-3'),
                6: document.querySelectorAll('.search-modal-button')
            }
            
        case "filter modal":
            return {
                0: document.querySelectorAll('.filter-modal-back'),
                1: document.querySelectorAll('.filter-option-single-player'),
                2: document.querySelectorAll('.filter-option-multiplayer'),
                3: document.querySelectorAll('.filter-option-platformer'),
                4: document.querySelectorAll('.filter-option-strategy'),
                5: document.querySelectorAll('.filter-option-first-person-shooter'),
                6: document.querySelectorAll('.filter-option-survival'),
                7: document.querySelectorAll('.filter-option-2024'),
                8: document.querySelectorAll('.filter-modal-button')
            }

        case "game info modal":
            return {
                0: document.querySelectorAll('.game-info-modal-close.true'),
                1: document.querySelectorAll('.game-info-modal-play-button.true')
            }

        default:
            return

    }

}

export const PageProvider = ({ children }) => {

    const {currentPlayer} = useContext(ControllerContext)

    const [page, setPage] = useState("")
    const [pageHierarchy, setPageHierarchy] = useState({})
    const [pageIndex, setPageIndex] = useState(
        {
            1: {
                hierarchyIndex: 0,
                elementIndex: 0
            },
            2: {
                hierarchyIndex: 0,
                elementIndex: 1
            }
        }
    )


    // PAGE/SET PAGE FUNCTIONS
    const changePage = (page) => {
        setTimeout(() => {
            setPage(page)
            resetPageIndex()
            setPageHierarchy(getPageHierarchy(page))
        }, 500)
    }

    // PAGE INDEX/SET PAGE INDEX FUNCTIONS
    const modifyHierarchyIndex = (type) => {

        let currentHierarchy = pageIndex[currentPlayer].hierarchyIndex
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
        setPageIndex(pageIndex => (
            {
                ...pageIndex,
                [currentPlayer]: {
                    ...pageIndex[currentPlayer],
                    ['hierarchyIndex']: value
                }
            }
        ))

        resetElementIndex(currentHierarchy, newHierarchy)
    }

    const modifyElementIndex = (type) => {
        let currentHierarchy = pageIndex[currentPlayer].elementIndex
        let newHierarchy = -1
        const valueLength = Object.values(pageHierarchy[pageIndex[currentPlayer].hierarchyIndex]).length

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
        setPageIndex(pageIndex => (
            {
                ...pageIndex,
                [currentPlayer]: {
                    ...pageIndex[currentPlayer],
                    ['elementIndex']: value
                }
            }
        ))
    }

    const resetElementIndex = (from, to) => {
        setPageIndex(pageIndex => (
            {
                ...pageIndex,
                [currentPlayer]: {
                    ...pageIndex[currentPlayer],
                    ['elementIndex']: mod(
                        Object.values(pageHierarchy)[from].length,
                        Object.values(pageHierarchy)[to].length
                    )
                }
            }
        ))
    }

    const resetPageIndex = () => {
        setPageIndex({
            1: {
                hierarchyIndex: 0,
                elementIndex: 0
            },
            2: {
                hierarchyIndex: 0,
                elementIndex: 0
            }
        })

    }

    const focusElement = () => {
        if (pageHierarchy[pageIndex[currentPlayer].hierarchyIndex][pageIndex[currentPlayer].elementIndex]) {
            (pageHierarchy[pageIndex[currentPlayer].hierarchyIndex][pageIndex[currentPlayer].elementIndex].classList.add('player'+currentPlayer))
        }
    }

    const clickElement = () => {
        pageHierarchy[pageIndex[currentPlayer].hierarchyIndex][pageIndex[currentPlayer].elementIndex].click()
    }

    const clearClasslist = () => {
        Object.values(pageHierarchy).forEach((nodeLists) => {
            nodeLists.forEach((element) => {
                element.classList.remove('player'+currentPlayer)
            })
        })
    }

    const values = {
        changePage, pageHierarchy, modifyHierarchyIndex, modifyElementIndex,
        pageIndex, focusElement, clickElement, clearClasslist, resetPageIndex
    }

    return (
        <PageContext.Provider value={values}>
            {children}
        </PageContext.Provider>
    )

}
