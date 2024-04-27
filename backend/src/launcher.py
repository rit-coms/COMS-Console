import json
import game
import os
import uuid

database_directory = r"/Users/zoebingham/School/Spring-2024/COMS/COMS-Console/data/games.json" #"../data/games.json"
# database_directory = r"C:\Users\awbus\OneDrive\Desktop\games.json" #WINDOWS
games_directory = r"/Users/zoebingham/School/Spring-2024/COMS/COMS-Console/data/games" #"/home/pi/ConsoleGames"
# games_directory = r"C:\Users\awbus\OneDrive\Desktop\test" #WINDOWS
cover_image_directory = r"/Users/zoebingham/School/Spring-2024/COMS/COMS-Console/data/cover_images" # "../data/cover_images"
# cover_image_directory = r"C:\Users\awbus\OneDrive\Desktop\cover_images" #WINDOWS

# adds new games in the games directory to the game_data json file
def scan():
    old_data = {}

    with open(database_directory, "r") as current:
        try:
            old_data = json.load(current)
        except json.decoder.JSONDecodeError:
            pass
    
    # convert the old_data array into a dictionary - file_path : Game
    old_data_dict = {}
    for old_game in old_data:
        old_game_inst = game.Game(**old_game)
        old_data_dict[str(old_game_inst.file_path)] = old_game_inst
    
    # look in the directory for games currently stored; create Game instances for each
    games = {}
    file_list = os.listdir(games_directory) # create a list of each file (name) in the directory
    for file in file_list:
        file_path = os.path.join(games_directory, file)
        if file_path not in old_data_dict:
            game_inst = game.Game(str(uuid.uuid4()), file, file_path, '', '', 0, False, [], '', 0, '')  # create an instance of a Game object
            games[str(game_inst.file_path)] = game_inst
    
    # pick out the new games / take out the ones that already exist
    games_new = {}
    games_old = {}
    for g_id, g in games.items():
        if g_id not in old_data_dict:
            # check for cover image
            image_path = cover_image_directory + '/' + g.title + '.jpg'
            if os.path.exists(image_path):
                g.cover_image = image_path
            gameDict = {"title": g.title,'id': g.id, 'file_path': g.file_path, 'author': g.author, 'summary': g.summary, 'release_date': g.release_date, 'is_multiplayer': g.is_multiplayer, 'genres': g.genres, 'cover_image': g.cover_image, 'times_played': g.times_played, 'last_played': g.last_played}
            games_new[str(g.id)] = gameDict
    for g_id, g in old_data_dict.items():
        # check for cover image
        image_path = cover_image_directory + '/' + g.title + '.jpg'
        if os.path.exists(image_path):
            g.cover_image = image_path
        gameDict = {"title": g.title,'id': g.id, 'file_path': g.file_path, 'author': g.author, 'summary': g.summary, 'release_date': g.release_date, 'is_multiplayer': g.is_multiplayer, 'genres': g.genres, 'cover_image': g.cover_image, 'times_played': g.times_played, 'last_played': g.last_played}
        games_old[str(g.id)] = gameDict
   
    # update the json file    
    all_games = []
    for g_id, g in games_old.items():
        all_games.append(g)
    for g_id, g in games_new.items():
        all_games.append(g)
    
    with open(database_directory, "w") as p:
        json.dump(all_games, p, indent=4)
