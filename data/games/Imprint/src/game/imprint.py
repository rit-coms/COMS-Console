import pygame
import sys
from pygame.math import Vector2
import random
import json


class DUCK:
    def __init__(self, paused):
        self.body = [Vector2(5,10), Vector2(4,10), Vector2(3,10)]
        self.direction = Vector2(0, 0)
        self.new_duck = False
        self.paused = paused

    """Draws the duck trail, starts with the mom duck then draws the babies"""
    def draw_duck(self):
        for index, block in enumerate(self.body):  # Use enumerate to get both index and block
            duck_rect = pygame.Rect(int(block.x * cell_size), int(block.y * cell_size), cell_size, cell_size)
            if index == 0:  
                screen.blit(mom_duck, duck_rect)  
            else:
                screen.blit(baby_duck, duck_rect) 

    """Makes a copy of the duck body and adds a block if there was a collision, otherwise moves head but removes tail"""
    def move_duck(self):
        if self.new_duck == True:
            body_copy = self.body[:]
            body_copy.insert(0, body_copy[0] + self.direction)
            self.body = body_copy[:]
            self.new_duck = False
        else:
            body_copy = self.body[:-1]
            body_copy.insert(0, body_copy[0] + self.direction)
            self.body = body_copy[:]

    """Allows the duck body to have more ducks added to it"""
    def add_duck(self):
        self.new_duck = True

    def reset(self):
        self.body = [Vector2(5,10), Vector2(4,10), Vector2(3,10)]
        self.direction = Vector2(0, 0)
        global score_value 
        update_high_score(score_value)
        score_value = 0

    """Returns the status for pausing the duck"""
    def pause(self):
        self.paused = not self.paused
        return self.paused
        
class BREAD:
    def __init__(self, duck_body):
        self.randomize(duck_body)

    """Creates the bread  and draws it onto the screen"""
    def draw_bread(self):
        bread_rect = pygame.Rect(int(self.pos.x * cell_size), int(self.pos.y * cell_size), cell_size, cell_size)
        screen.blit(bread, bread_rect)


    """Randomizes the position of the bread"""
    def randomize(self, duck_body):
        while True:
            self.x = random.randint(2, cell_number - 1)
            self.y = random.randint(2, cell_number - 1)
            self.pos = Vector2(self.x, self.y)
            if self.pos not in duck_body:
                break

class MAIN:
    def __init__(self):
        self.paused = True
        self.duck = DUCK(self.paused)
        self.bread = BREAD(self.duck.body)
        
    """Updates the game, checks for methods that alter the display"""
    def update(self):
        if not self.paused:
            self.duck.move_duck()
            self.check_collision()
            self.check_fail()
        self.display_score()

    """Draws the two elements necessary for the game"""
    def draw_elements(self):
        self.bread.draw_bread()
        self.duck.draw_duck()

    """Checks if the duck has consumed bread"""
    def check_collision(self):
        global score_value
        if self.bread.pos == self.duck.body[0]:
            self.bread.randomize(self.duck.body)
            self.duck.add_duck() 
            score_value += 1     

    """Checks if the duck trail hit itslef or hit the boarder
    ends the game if either of the conditions are true"""
    def check_fail(self):
        if not 2 <= self.duck.body[0].x < cell_number or not 2 <= self.duck.body[0].y < cell_number:
            self.game_over()

        for block in self.duck.body[1:]:
            if block == self.duck.body[0]:
                self.game_over()

    """Resets the game when it's over"""
    def game_over(self):
        self.pause_game()
        self.duck.reset()

    """Draws the score onto the screen"""
    def display_score(self):
        score = font.render("Score : " + str(score_value), True, (255, 255, 255))
        screen.blit(score, (2, 2))

    """Displays a grass pattern 
    Changes color of the "grass" depending on if the column is even or odd"""
    def grass_pattern(self):
        grass_color = (160, 220, 80)
        for row in range(2, cell_number):
            if row % 2 == 0:
                for col in range(2, cell_number):
                    if col % 2 == 0:
                        grass_rect = pygame.Rect(col * cell_size, row * cell_size, cell_size, cell_size)
                        pygame.draw.rect(screen, grass_color, grass_rect)
            else:
                for col in range(2, cell_number):
                    if col % 2 != 0:
                        grass_rect = pygame.Rect(col * cell_size, row * cell_size, cell_size, cell_size)
                        pygame.draw.rect(screen, grass_color, grass_rect)

    """Pauses the game by pausing the duck"""
    def pause_game(self):
        self.paused = not self.paused
        self.duck.pause()

    """Draws the game paused screen"""
    def game_paused_display(self):
        game_paused = font.render("Game Paused" , True, 'white')
        move_text = font.render("Move to Continue", True, 'white')
        screen.blit(game_paused, (275, 310))
        screen.blit(move_text, (245, 360))

    """Draws the high score"""
    def high_score_display(self):
        high_score_value = get_high_score()
        high_score = font.render("High Score: " + str(high_score_value), True, 'white')
        screen.blit(high_score, (520, 2))


"""Updates the high score if the current score exceeds it"""
def update_high_score(score):
    high_score = get_high_score()
    if score > high_score:
        high_score_dict = {"high_score": score}
        json_object = json.dumps(high_score_dict, indent=4)
        with open("highscore.json", "w") as outfile:
            outfile.write(json_object)

"""Retrieves the current high score"""
def get_high_score():
    with open("highscore.json", "r") as openfile:
        json_object = json.load(openfile)
    return json_object["high_score"]

# Initializes pygame
pygame.init()

# Initalizes the joystick module
pygame.joystick.init()

# Sets up screen and clock
"""Created the screen_cell_number to have the score and high score displayed outside the playable area. 
    All gameplay elements are done within the playable are"""
screen_cell_number = 22
cell_size = 35
cell_number = 20
screen = pygame.display.set_mode((screen_cell_number * cell_size, screen_cell_number * cell_size))
clock = pygame.time.Clock()

# Assets
bread = pygame.image.load("./game/assets/bread.png")
mom_duck = pygame.image.load("./game/assets/duck_player.png")
baby_duck = pygame.image.load("./game/assets/rubber-duck.png") 

# Title and Icon
pygame.display.set_caption("Imprint")
icon = pygame.image.load("./game/assets/duck_icon.png")
pygame.display.set_icon(icon)

# Score
global score_value
score_value = 0
font = pygame.font.Font('freesansbold.ttf', 32)

main_game = MAIN()

SCREEN_UPDATE = pygame.USEREVENT
pygame.time.set_timer(SCREEN_UPDATE, 140)

running = True
# Gameloop
while running:
    screen.fill((126, 189, 64))
    main_game.grass_pattern()
    main_game.draw_elements()
    main_game.display_score()
    main_game.high_score_display()

    if main_game.paused:
        main_game.game_paused_display()

    for event in pygame.event.get():
        # exits the game
        if event.type == pygame.QUIT:
            running = False
            sys.exit()

        # detects if a controller is pluged in
        if event.type == pygame.JOYDEVICEADDED:
            print("Controller connected: " + str(event))
            joy = pygame.joystick.Joystick(event.device_index)
            print(str(joy.get_name()))
            
        # movement with controller buttons
        if event.type == pygame.JOYBUTTONDOWN:
            # X button
            if event.button == 0 and main_game.duck.direction.y != 1:
                if main_game.paused:
                    main_game.paused = False
                main_game.duck.direction = Vector2(0, -1)
            # A button
            if event.button == 1 and main_game.duck.direction.x != -1:
                if main_game.paused:
                    main_game.paused = False
                main_game.duck.direction = Vector2(1, 0)
            # B button
            if event.button == 2 and main_game.duck.direction.y != -1:
                if main_game.paused:
                    main_game.paused = False
                main_game.duck.direction = Vector2(0, 1)
            # Y button
            if event.button == 3 and main_game.duck.direction.x != 1:
                if main_game.paused:
                    main_game.paused = False
                main_game.duck.direction = Vector2(-1, 0)
            # start button
            if event.button == 9:
                main_game.pause_game()
            # select button
            if event.button == 8:
                running = False
    
        # For any event calls update
        if event.type == SCREEN_UPDATE:
            main_game.update()

        # keyboard controls
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP and main_game.duck.direction.y != 1:
                if main_game.paused:
                    main_game.paused = False
                main_game.duck.direction = Vector2(0, -1)
            if event.key == pygame.K_DOWN and main_game.duck.direction.y != -1:
                if main_game.paused:
                    main_game.paused = False
                main_game.duck.direction = Vector2(0, 1)
            if event.key == pygame.K_LEFT and main_game.duck.direction.x != 1:
                if main_game.paused:
                    main_game.paused = False
                main_game.duck.direction = Vector2(-1, 0)
            if event.key == pygame.K_RIGHT and main_game.duck.direction.x != -1:
                if main_game.paused:
                    main_game.paused = False
                main_game.duck.direction = Vector2(1, 0)
            if event.key == pygame.K_SPACE:
                main_game.pause_game()
            if event.key == pygame.K_ESCAPE:
                running = False
        

    pygame.display.update()
    # Framerate 60 fps
    clock.tick(60)