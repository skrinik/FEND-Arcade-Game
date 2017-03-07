/*
* Initialize variables to help with movements:
* rowHeight and colWidth give me the step lengths to be centered
  in the next block (row or column)
* rowZero and colZero help me identify where the first row (from the top)
  and the first column begin so I have a sense of my origin, adjusted for
  character/sprite height and width.
*/
var rowHeight = 83; //height of rows
var colWidth = 101; //width of columns
var yOffsetForChar = -23; // Used to center the player/enemies in their row
var enemyRows = [
    // Array to store the rows for enemies to follow using the set rowHeight and
    // offset to help center the enemies in the rows
    yOffsetForChar + rowHeight,
    yOffsetForChar + rowHeight * 2,
    yOffsetForChar + rowHeight * 3
];
var enemySpeeds = [
    // Array to store the three speed levels for enemies, underlying function
    // getRandomInt uses Math.random for assured randomness
    getRandomInt(getRandomInt(1, 3), getRandomInt(4, 6)),
    getRandomInt(getRandomInt(4, 6), getRandomInt(8, 10)),
    getRandomInt(getRandomInt(8, 10), getRandomInt(15, 20))
];


// Thanks to MDN documentation for getRandomInt(),
// returns a random integer between min & max,
// inclusive/non-inclusive respectively.
function getRandomInt(min, max) {
    /* Thanks to MDN documentation for getRandomInt(),
    returns a random integer between min & max,
    inclusive/non-inclusive respectively. */
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/****************/
/* ENEMY CLASS */
/**************/
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Enemies are placed randomly in a row (x) in order to space them out
    this.x = getRandomInt(-101, 505);
    // Enemies are randomly assigned a row (y)
    this.y = enemyRows[getRandomInt(0, 3)];
};

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x >= -colWidth && this.x < ctx.canvas.width + colWidth) {
        // Uses the speed function to determine enemy speed based off of the current
        // player level, higher the level, the faster the enemies go
        this.x += this.speed(player.level) * (dt * 100 - 1);
    } else {
        // resets position of enemy to -colWidth so the enemy restarts from the left
        this.x = -colWidth;
        this.y = enemyRows[getRandomInt(0, 3)];
    }
};

Enemy.prototype.render = function() {
    // Draw the enemy on the screen, required method for game
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.speed = function(playerLvl) {
    // Function used to assign a speed to the enemies based on the player's level.
    if (playerLvl < 5) {
        // base speed until level 4
        return enemySpeeds[0];
    } else if (playerLvl < 9) {
        // enemies speed up once you reach level 8, moderate speed.
        return enemySpeeds[1];
    } else {
        // for levels above 8, fastest speed is default
        return enemySpeeds[2];
    }
};

/****************/
/* PLAYER CLASS */
/****************/
var Player = function() {
    // Initialize player variables:
    this.sprite = 'images/char-boy.png';
    this.resetHome(); // sets the player at the 'home' positon for initialization
    this.level = 1; // sets the player's level to 1 upon initialization
    this.lives = 10; // player gets 10 lives upon initialization, trust me it gets hard
};

Player.prototype.render = function() {
    // render function proivded, renders the player when called.
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.update = function() {
    // No update function needed at this time, all movements handled in
    // handleInput function.
};

Player.prototype.updateLives = function() {
    // Function to update lives, called in checkCollisions
    this.lives -= 1;
};

Player.prototype.levelUp = function() {
    // Every even level you reach, a new enemy is added, increments player's level
    // as you win a round
    this.level++;
    if (this.level % 2 === 0) {
        allEnemies.push(new Enemy()); // pushes new enemy into allEnemies array
    }
    this.resetHome(); // resets player position to home after you win a round
};

Player.prototype.resetHome = function() {
    // Used to set player to home position, called in various functions
    this.x = colWidth * 2;
    this.y = yOffsetForChar + rowHeight * 5;
};

Player.prototype.handleInput = function(key) {
    // Function recieves key inputs from below, and processes the inputs accordingly
    if (key === 'up') {
        if (this.y === yOffsetForChar + rowHeight) {
            // checks for a win and resets player if won
            this.levelUp();
        } else {
            //checks if the players next move up is out of bounds
            this.y -= rowHeight;
        }
    } else if (key === 'down') {
        if ((this.y + rowHeight) <= (yOffsetForChar + rowHeight * 5)) {
            //checks if the next move down is out of bounds
            this.y += rowHeight;
        }
    } else if (key === 'left') {
        if (this.x - colWidth >= 0) {
            //checks if the next move down is out of bounds
            this.x -= colWidth;
        }
    } else if (key === 'right') {
        if ((this.x + colWidth) <= (colWidth * 4)) {
            //checks if the next move down is out of bounds
            this.x += colWidth;
        }
    } else {
        // blank just to cover any unwanted implications
        // i.e. if other keys are pressed
    }
};

/* Check Collisions Function */
function checkCollisions() {
    allEnemies.forEach(function(enemy) {
        // Checks positions of each enemy on the board,
        // numbers were chosen as an appropriate buffer for the player,
        // if the enemies penetrate the buffer, a collision is recorded
        if (enemy.y >= player.y - 50 &&
            enemy.y <= player.y + 50 &&
            enemy.x >= player.x - 65 &&
            enemy.x <= player.x + 65) {
            // decrement player's lives, return player home upon collision
            player.updateLives();
            player.resetHome();
        }
    });
}

/* Initialize Objects */
var allEnemies = [
    // base case has two enemies
    new Enemy(),
    new Enemy()
];
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
