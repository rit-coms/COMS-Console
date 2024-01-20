import game
import os

games = {}
games_directory = ""; # TODO need this
file_list = os.listdir(games_directory) # create a list of each file (name) in the directory

for file in file_list:
    file_path = os.path.join(games_directory, file)
    game_inst = game.Game("", file_path, "")
    games[file] = game_inst