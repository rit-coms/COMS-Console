import React, { useState, useEffect } from "react";
import {
  Link,
  Modal,
  Pill,
  Tab,
  Table,
  TableData,
  TableRow,
  Tabs,
  Text,
  Checkbox,
} from "quackbox-design-system";
import "../styles/GameInfoModal.css";
import { invoke } from "@tauri-apps/api/tauri";
import { usePageContext } from "../context/contexts";

import placeholder from "../assets/placeholder.png";

export default function GameInfoModal({ showModal, closeModal, game }) {
  if (!showModal) return null;

  const { updatePage } = usePageContext();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isAscending, setIsAscending] = useState(false);
  const isPlaceholder = game.title.toLowerCase().includes("coming soon");
  const hasCoverImage = !game.coverImage?.includes("null");

  const formatDate = (dateString) => {
    // yyyy-mm-dd date format
    const dateParts = dateString.split("-");
    const formattedDateString = `${dateParts[0]}-${String(
      dateParts[1]
    ).padStart(2, "0")}-${String(dateParts[2]).padStart(2, "0")}`;

    const date = new Date(formattedDateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    invoke("get_leaderboard_data", { gameTitle: game.title }).then(
      (leaderboard) => {
        console.log(leaderboard);
        // leaderboard = leaderboard.map(async gameInfo => {
        // 	console.log(gameInfo);
        //     return leaderboard;
        // });
        // Promise.all(leaderboard).then(leaderboard => setLeaderboard(leaderboard));
        setLeaderboard(leaderboard);
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);

  const getTopFiveLeaderboardEntries = (entries) => {
    return [...entries]
      .sort((a, b) =>
        isAscending ? a.value_num - b.value_num : b.value_num - a.value_num
      )
      .slice(0, 5);
  };

  const startGame = async (gameId) => {
    try {
      await invoke("play_game", { id: gameId });
      console.log(`Started Game ${game.title}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlayGame = () => {
    if (!isPlaceholder) startGame(game.id);

    closeModal();
    setTimeout(() => {
      updatePage("home page");
    }, 0);
  };

  const handleAscendingChange = () => {
    setIsAscending(!isAscending);
  };

  let leaderboardData;

  return (
    <Modal
      isOpen={showModal}
      onClose={closeModal}
      variant={"gameInfo"}
      overlay
      confirmLabel={!isPlaceholder ? "Play" : "Close"}
      confirmLabelColorPrimary
      title={game.title}
      gameImageSrc={hasCoverImage ? game.coverImage : placeholder}
      onConfirmation={handlePlayGame}
      dataId="game-info"
    >
      <div className="game-info">
        <div className="game-author">
          <Text fontSize={"medium"}>
            {!isPlaceholder ? `Created by ${game.author}` : game.author}
          </Text>
          {game.release_date && (
            <Text fontSize="small">{formatDate(game.release_date)}</Text>
          )}
        </div>

        <Tabs dataId="game-tabs">
          <Tab label={!isPlaceholder ? "Game Details" : "Details"}>
            <div className="game-details">
              <div className="game-description">
                <Text fontSize="small">Description</Text>
                <Text>
                  {game.summary.length > 250
                    ? game.summary.slice(0, 250) + "..."
                    : game.summary}
                </Text>
              </div>
              <div className="game-genres">
                {game.genres && (
                  <>
                    <Text fontSize="small">Tags</Text>
                    <div className="game-tags">
                      {game.multiplayer !== null &&
                        ((game.multiplayer === "Multiplayer" && (
                          <Pill>Multiplayer</Pill>
                        )) || <Pill>Single Player</Pill>)}

                      {game.genres.map((genre, index) => {
                        return (
                          <Pill key={index} variant="secondary">
                            {genre}
                          </Pill>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Tab>
          {!isPlaceholder && (
            <Tab label="Leaderboard">
              {(leaderboardData = Object.keys(leaderboard?.data ?? {}))
                .length != 0 ? (
                <div className="leaderboard-flex-parent">
                  <div className="leaderboard-flex-checkbox">
                    <Checkbox
                      dataId="leaderboard-toggle-ascending"
                      checked={isAscending}
                      onChange={handleAscendingChange}
                    ></Checkbox>
                    <div style={{ textAlign: "center" }}>
                      <Text fontSize="small">{isAscending ? "v" : "^"}</Text>
                    </div>
                  </div>
                  <Tabs dataId="leaderboard-tabs">
                    {leaderboardData.map((value_name) => {
                      const leaderboardTitle = value_name
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ");
                      return (
                        <Tab label={leaderboardTitle}>
                          <div className="leaderboard-flex-table">
                            <Table
                              headers={["Username", leaderboardTitle, "Date"]}
                            >
                              {getTopFiveLeaderboardEntries(
                                leaderboard.data[value_name]
                              ).map(
                                (
                                  { username, value_num, time_stamp },
                                  index
                                ) => {
                                  return (
                                    <TableRow key={index}>
                                      <TableData>{username}</TableData>
                                      <TableData>{value_num}</TableData>
                                      <TableData>{time_stamp}</TableData>
                                    </TableRow>
                                  );
                                }
                              )}
                            </Table>
                          </div>
                        </Tab>
                      );
                    })}
                  </Tabs>
                </div>
              ) : (
                <div className="game-leaderboard">
                  No leaderboard data to show
                </div>
              )}
            </Tab>
          )}
        </Tabs>
      </div>
    </Modal>
  );
}
