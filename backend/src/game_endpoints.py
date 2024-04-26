from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import game
import launcher
import json

app = FastAPI()
file_path = r"..\data\games.json"
# file_path = r"C:\Users\awbus\OneDrive\Desktop\games.json"  #WINDOWS

origins = [
    "http://localhost:3",
    "http://localhost:1000",
    "http://localhost:3000",
    "http://127.0.0.1",
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# get an individual game by ID
@app.get("/game")
def get_game(id: str):
    launcher.scan()
    with open(file_path, "r") as file:
        games_data = json.load(file)
    for g in games_data:
        if g['id'] == id:
            return g

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
            game_inst = game.Game(g['id'], g['title'], g['file_path'], g['summary'], g['author'], g['release_date'], g['is_multiplayer'], g['genres'], g['cover_image'], g['times_played'], g['last_played'])
            game_inst.launch()