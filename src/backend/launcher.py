import game
import os

games = {}  # the list of each Game - frontend devs use this to access all Game objects
# games_directory = "/home/pi/ConsoleGames"
games_directory = r"C:\Users\Adrian\Documents\Games"
file_list = os.listdir(games_directory) # create a list of each file (name) in the directory

for file in file_list:
    file_path = os.path.join(games_directory, file)
    game_inst = game.Game(file, file_path, '', '', 0, False, [])  # create an instance of a Game object
    games[file] = game_inst
