from fastapi import FastAPI
import game
import json

app = FastAPI()
file_path = r"C:\Users\BurgosAd1\Desktop\games.json"

# get all of the games stored on the system
@app.get("/games")
def get_games():
    with open(file_path, "r") as file:
        games_data = json.load(file)
    return games_data