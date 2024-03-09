from fastapi import FastAPI
import game
import launcher
import json

app = FastAPI()
file_path = r"C:\Users\awbus\OneDrive\Desktop\games.json"

# get all of the games stored on the system
@app.get("/games")
def get_games():
    launcher.scan()
    with open(file_path, "r") as file:
        games_data = json.load(file)
    return games_data

# launch a specified game
@app.get("/launch")
def launch(id: str):
    with open(file_path, "r") as file:
        games_data = json.load(file)
    for g in games_data:
        if g['id'] == id:
            game_inst = game.Game(g['id'], g['title'], g['file_path'], g['summary'], g['release_date'], g['is_multiplayer'])
            game_inst.launch()