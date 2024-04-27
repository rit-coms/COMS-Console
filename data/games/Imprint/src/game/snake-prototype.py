import pygame
import random
import math

# Initializes the pygame
pygame.init()

# creates the screen
screen = pygame.display.set_mode((700, 700))

# Title and Icon
pygame.display.set_caption("Imprint")
icon = pygame.image.load("./game/assets/duck_icon.png")
pygame.display.set_icon(icon)

# Player 
playerImg = pygame.image.load("./game/assets/duck_player.png")
playerX = 370
playerY = 275
playerX_change = 0
playerY_change = 0

# Score
score_value = 0
font = pygame.font.Font('freesansbold.ttf', 32)
textX = 10
textY = 10

# Food
foodImg = pygame.image.load("./game/assets/bread.png")
foodX = 200
foodY = 150

def displayScore(x:int, y:int):
    score = font.render("Score : " + str(score_value), True, (255, 255, 255))
    screen.blit(score, (x, y))

# Draws the player at the specific coordiante
def player(x:int , y:int):
    screen.blit(playerImg, (x, y))

# Draws the baby duck at the specific coordinate
def babyDuck(x, y):
    screen.blit(babyDuckImg, (x, y))
# Draws the food item at the specific coordinate
def food(x:int, y:int):
    screen.blit(foodImg, (x, y))

# Detects collision between duck and food
def isCollision(playerX, playerY, foodX, foodY):
    distance = math.sqrt(math.pow(playerX-foodX, 2) + math.pow(playerY-foodY, 2))
    #print(distance)
    if distance < 40:
        return True
    else:
        return False

"""
Game Loop
If the game is closed the loop ends
"""
running = True
while running:

    # updates screen background to green using RGB
    screen.fill((41, 180, 32))

    for event in pygame.event.get():
        # Allows the game to be closed
        if event.type == pygame.QUIT:
            running = False
    
        # Checks for keystroke 
        if event.type == pygame.KEYDOWN:

            # ESC to quit game
            if event.key == pygame.K_ESCAPE:
                running = False

            # Note: Y postion or X position is set to 0 to zero inorder to restrict diagnol movement
            # Move left
            if event.key == pygame.K_a or event.key == pygame.K_LEFT:
                playerX_change = -0.05
                playerY_change = 0

            # Move right
            if event.key == pygame.K_d or event.key == pygame.K_RIGHT:
                playerX_change = 0.05
                playerY_change = 0

            # Move up
            if event.key == pygame.K_w or event.key == pygame.K_UP:
                playerY_change = -0.05
                playerX_change = 0

            # Move down
            if event.key == pygame.K_s or event.key == pygame.K_DOWN:
                playerY_change = 0.05
                playerX_change = 0

    # Changes the player's position
    playerX += playerX_change
    playerY += playerY_change

    # Sets the boder for the game, depends on player size (64px)
    # If player hits the boarder the game quits 
    if playerX <= 0:
        playerX = 0
    elif playerX >= 636:
        playerX = 636
    if playerY <= 0:
        playerY = 0
    elif playerY >= 636:
        playerY = 636

    # Collision
    collision = isCollision(playerX, playerY, foodX, foodY)
    if collision:
        foodX = random.randint(11, 668)
        foodY = random.randint(11, 668)
        score_value += 1
        
    player(playerX, playerY)
    food(foodX, foodY)
    displayScore(textX, textY)
    # needed for continous updates to the game display
    pygame.display.update()