import React, { createContext, useEffect, useState } from "react";
import { useGamepadContext } from "./contexts";

const getPageHierarchy = (page) => {
    switch (page) {
        case "controller connect": 
            const playerTiles = document.body.querySelectorAll("button[data-id='player-tile-label']");
            
            if (playerTiles.length > 4) {
                return {
                    0: Array.from(playerTiles).slice(0, 4),
                    1: Array.from(playerTiles).slice(4),
                    2: document.body.querySelectorAll("button[data-id='controller-connect-modal-confirm-button']")
                };
            }
            return {
                0: playerTiles,
                1: document.body.querySelectorAll("button[data-id='controller-connect-modal-confirm-button']")
            };

        case "home page": return {
            0: document.body.querySelectorAll("[data-id^='navigation']"),
            1: document.body.querySelectorAll("[data-id='game-container'] > [data-id^='game']"),
        };

        case "search modal": return {
            0: document.body.querySelectorAll("[data-id='search-modal-close-button']"),
            1: document.body.querySelectorAll("[data-id='keyboard-search-bar']"),
            2: document.body.querySelectorAll("[data-id='keyboard-row-0'] > [data-id^='keyboard-key']"),
            3: document.body.querySelectorAll("[data-id='keyboard-row-1'] > [data-id^='keyboard-key']"),
            4: document.body.querySelectorAll("[data-id='keyboard-row-2'] > [data-id^='keyboard-key']"),
            5: document.body.querySelectorAll("[data-id='keyboard-row-3'] > [data-id^='keyboard-key']"),
            6: document.body.querySelectorAll("[data-id='keyboard-row-4'] > [data-id^='keyboard-key']"),
            7: document.body.querySelectorAll("[data-id='search-modal-confirm-button']")
        };

        case "game info modal": return {
            0: document.body.querySelectorAll("[data-id='game-info-close-button']"),
            1: document.body.querySelectorAll("[data-id^='tab']"),
            2: document.body.querySelectorAll("[data-id='game-info-confirm-button']")
        };

    }
};

const getPlayerColor = (index) => {
    const playerNumber = index + 1;

    switch (playerNumber) {
        case 1: return "#3498DB";
        case 2: return "#FF5733";
        case 3: return "#2ECC71";
        case 4: return "#F1C40F";
        case 5: return "#E67E22";
        case 6: return "#1E9496";
        case 7: return "#B83B58";
        case 9: return "#9B59B6";
    }
};

export const PageContext = createContext();

export const PageProvider = ({ children }) => {

    const { gamepads, players, pressedButton } = useGamepadContext();
    const [playerFocus, setPlayerFocus] = useState({});
    const [page, setPage] = useState(undefined);

    const [pageElements, setPageElements] = useState({
        0: document.body.querySelectorAll("button[data-id='player-tile-label']"),
        1: document.body.querySelectorAll("button[data-id='controller-connect-modal-confirm-button']")
    });

    const updatePageElements = (page) => {
        setTimeout(() => {
            setPageElements(
                getPageHierarchy(page)
            );
        }, 0);
        
    };

    const resetPlayerFocus = () => {
        clearFocus();
        setPlayerFocus((prevFocus) => {
            const updatedFocus = { ...prevFocus };
            players.forEach((player) => {
                updatedFocus[player.playerIndex] = { x: 1, y: 0 };
            }); 
            return updatedFocus;
        });
    };

    const updatePage = (page) => {
        setPage(page);
        setPageElements(getPageHierarchy(page));
        resetPlayerFocus(); 
    };

    const clickCaret = (direction, playerIndex) => {
        const element = document.body.querySelector(`[data-id="carousel-${direction}-caret"]`);
        if (element.classList.value.includes("disabled"))
            return;
        element.click();

        updatePageElements("home page");
        
        const updatedFocus = { ...playerFocus[playerIndex] };
        direction === "right" ? updatedFocus.y -= 1: updatedFocus.y += 1;

        setTimeout(() => {
            setPlayerFocus((prevFocus) => ({
                ...prevFocus,
                [playerIndex]: updatedFocus
            }));
        }, 0);
        
    };

    const updateFocus = (playerIndex, direction) => {

        const currentFocus = playerFocus[playerIndex];
        const updatedFocus = { ...currentFocus };
        clearFocus();

        switch (direction) {
            case "DOWN":
                updatedFocus.x = Math.min(updatedFocus.x + 1, Object.keys(pageElements).length - 1);
                updatedFocus.y = Math.min(updatedFocus.y, pageElements[updatedFocus.x].length - 1);
                break;

            case "UP":
                updatedFocus.x = Math.max(updatedFocus.x - 1, 0);
                updatedFocus.y = Math.min(updatedFocus.y, pageElements[updatedFocus.x].length - 1);
                break;

            case "RIGHT":
                if (page === "home page" && updatedFocus.x === 1 && updatedFocus.y === pageElements[updatedFocus.x].length - 1) {
                    clickCaret("right", playerIndex);
                }
                updatedFocus.y = Math.min(updatedFocus.y + 1, pageElements[updatedFocus.x].length - 1);
                break;

            case "LEFT":
                if (page === "home page" && updatedFocus.x === 1 && updatedFocus.y === 0) {
                    clickCaret("left", playerIndex);
                }
                updatedFocus.y = Math.max(updatedFocus.y - 1, 0);
                break;
        }

        setPlayerFocus((prevFocus) => ({
            ...prevFocus,
            [playerIndex]: updatedFocus
        }));
    };

    const clickElement = (playerIndex) => {
        const element = (pageElements[playerFocus[playerIndex].x][playerFocus[playerIndex].y]);
        element.click();
    };

    const focusElement = (element, index) => {
        if (!element) return;
        element.style.outline = `2px solid ${getPlayerColor(index)}`;
        element.style.outlineOffset = "4px";
    };

    const clearFocus = () => {
        Object.values(pageElements).forEach((group) => {
            group.forEach((element) => {
                element.style.outline = "";
            });
        });
    };

    useEffect(() => {
        if (Object.keys(pressedButton).length > 0) {
            // Handle pressedButton inputs for each player
            Object.keys(pressedButton).forEach((playerIndex) => {

                if (!(players[playerIndex] && players[playerIndex].isConnected))
                    return;

                const pressed = pressedButton[playerIndex];
                switch (pressed) {
                    case "UP": updateFocus(playerIndex, "UP"); break;
                    case "DOWN": updateFocus(playerIndex, "DOWN"); break;
                    case "LEFT": updateFocus(playerIndex, "LEFT"); break;
                    case "RIGHT": updateFocus(playerIndex, "RIGHT"); break;
                    case "A": playerIndex == 0 && clickElement(playerIndex); break;
                };

            });
        }
    }, [pressedButton]); 

    useEffect(() => {
        
        setPlayerFocus((prevFocus) => {
            // set the initial player focus
            const updatedFocus = { ...prevFocus };
            players.forEach((player) => {
                
                if (!updatedFocus[player.playerIndex]) {
                    // Initial focus indexes only relevant to the Controller Connect Page
                    updatedFocus[player.playerIndex] = {x: 0, y: player.playerIndex};
                }
            });
            return updatedFocus;
        });

    }, [gamepads]);

    useEffect(() => {
        clearFocus();
    }, [players.length]);

    useEffect(() => {

        players.forEach((_, index) => {

            if (!players[index].isConnected || !playerFocus[index])
                return;

            const x = playerFocus[index].x;
            const y = playerFocus[index].y;
            if (pageElements) {
                const currentElement = pageElements[x][y];
                focusElement(currentElement, index);
            }
        });

    }, [playerFocus, pageElements]);
    
  return (
    <PageContext.Provider value={{ 
        playerFocus, setPlayerFocus, updateFocus,
        clickElement, updatePageElements,
        updatePage
    }}>
        {children}
    </PageContext.Provider>
  );

};
