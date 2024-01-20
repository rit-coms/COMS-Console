# class to store each game's info
import subprocess

class Game:
    def __init__(self, name, file_path, summary):
        self.name = name
        self.file_path = file_path,
        self.summary = summary
    
    def launch(self):
        subprocess.Popen(self.file_path)