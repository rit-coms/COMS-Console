# class to store each game's info
import subprocess

class Game:
    def __init__(self, title, file_path, author, summary, release_date, is_multiplayer, genres):
        self.title = title
        self.file_path = file_path
        self.author = author
        self.summary = summary
        self.release_date = release_date
        self.is_multiplayer = is_multiplayer
        self.genres = genres
    
    # launch the game
    def launch(self):
        subprocess.Popen(self.file_path)