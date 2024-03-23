# To Run The Backend Server
First, install fastapi and uvicorn:
pip install fastapi
pip install uvicorn

uvicorn game_endpoints:app --reload

# To Access the Endpoints
(GET) 127.0.0.1:8000/games - this runs a scan of the directory and returns a list of each Game on the system
(GET) 127.0.0.1:8000/launch?id=[the_game's_id] - this launches the game specified by the game id


# To Add Cover Images to Your Game
(Must be a .jpg file) Add the image to the directory COMS-Console/data/cover_images with the naming convention (title).jpg