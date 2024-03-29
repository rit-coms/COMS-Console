# class to store each game's info
import subprocess

class Game:
    def __init__(self, id, title, file_path, author, summary, release_date, is_multiplayer, genres, cover_image, times_played, last_played):
        self.id = id
        self.title = title
        self.file_path = file_path
        self.author = author
        self.summary = summary
        self.release_date = release_date
        self.is_multiplayer = is_multiplayer
        self.genres = genres
        self.cover_image = cover_image
        self.times_played = times_played
        self.last_played = last_played
    
    # launch the game
    def launch(self):
        subprocess.Popen(self.file_path)