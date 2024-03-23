# class to store each game's info
import subprocess

class Game:
    def __init__(self, id, title, file_path, author, summary, release_date, is_multiplayer, genres, cover_image):
        self.id = id
        self.title = title
        self.file_path = file_path
        self.author = author
        self.summary = summary
        self.release_date = release_date
        self.is_multiplayer = is_multiplayer
        self.genres = genres
        self.cover_image = cover_image
    
    # launch the game
    def launch(self):
        subprocess.Popen(self.file_path)