import json
import game
import os

# games_directory = "/home/pi/ConsoleGames"
games_directory = r"C:\Users\Adrian\Documents\Games"

# adds new games in the games directory to the game_data json file
def scan():
    games = {}
    file_list = os.listdir(games_directory) # create a list of each file (name) in the directory
    for file in file_list:
        file_path = os.path.join(games_directory, file)
        game_inst = game.Game(file, file_path, '', '', 0, False, [])  # create an instance of a Game object
        games[file] = game_inst
    with open(r"C:\Users\Adrian\Desktop", "r") as current:
        old_data = json.load(current)
    
    # pick out the new games
    for g in games:
        for old in old_data:
            if(g.file_path == old.file_path):
                games.popitem(g)

    # update the json file
    with open(r"C:\Users\Adrian\Desktop", "w") as p:
        json.dump(games, p)

