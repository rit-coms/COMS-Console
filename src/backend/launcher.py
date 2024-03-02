import json
import game
import os
import uuid

# games_directory = "/home/pi/ConsoleGames"
games_directory = r"C:\Users\BurgosAd1\Desktop\Test"

# adds new games in the games directory to the game_data json file
def scan():
    games = {}
    file_list = os.listdir(games_directory) # create a list of each file (name) in the directory
    for file in file_list:
        file_path = os.path.join(games_directory, file)
        game_inst = game.Game(str(uuid.uuid4()), file, file_path, '', '', 0, False, [])  # create an instance of a Game object
        games[str(game_inst.id)] = game_inst

    old_data = {}

    with open(r"C:\Users\BurgosAd1\Desktop\games.json", "r") as current:
        try:
            old_data = json.load(current)
        except json.decoder.JSONDecodeError:
            pass
    
    # pick out the new games
    for g_id, g in games.items():
        if g_id in old_data:
            games.pop(g_id)

    # update the json file
    for g_id, g in games.items():
        if g_id not in old_data:
            old_data[g_id] = g.__dict__
    
    with open(r"C:\Users\BurgosAd1\Desktop\games.json", "w") as p:
        json.dump(old_data, p, indent=4)


scan()