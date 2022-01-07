//canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;

//keys
var keys = [];

//player
var playerX = 0;
var playerY = 0;
var oldPlayerX = 0;
var oldPlayerY = 0;
var playerJump = 0;
var playerPlatformWidth;
var playerStartingX;
var playerStartingY;
var playerIsInAir = false;
var playerAnimationFrame = 0;
var frame = 0;
var playerDirection = 'none';

//particles
var particles = [];

//images
var tiles = new Image();
tiles.src = 'assets/graphics/tilesheet.png';
var charector = new Image();
charector.src = 'assets/graphics/characters.png';

//2d primitives:
//Set fill color of the shapes
function fill(r, g, b, a) {
    if (g === undefined) {
        g = r;
        b = r;
    }
    if (a === undefined) {
        a = 255;
    }
    ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ", " + a + ")";
}
//Set stroke color of the shapes
function stroke(r, g, b) {
    if (g === undefined) {
        g = r;
        b = r;
    }
    ctx.strokeStyle = "rgb(" + r + ", " + g + ", " + b + ")";
}
//Make's there be no stroke
function noStroke() {
    ctx.strokeStyle = "rgb(0, 0, 0, 0)";
}
//Set's the sizeo of the text
function textSize(size) {
    ctx.font = size + 'px American Typewriter';
}
//Sets the width of the stroke
function strokeWidth(num) {
    ctx.lineWidth = num;
}
//Makes a rectangle
function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}
//Makes text
function text(text, x, y) {
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
    ctx.strokeText(text, x, y);
}

Array.prototype.removeAt = function (iIndex) {
    var vItem = this[iIndex];
    if (vItem) {
        this.splice(iIndex, 1);
    }
    return vItem;
};

//levels
var level = 0;
var levels = [
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
        [2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        []
    ]
];
var levelPos = [
    [5, 8]
];

//handles changing levels
function changeLevel(levelToChangeTo) {
    if (levelToChangeTo === level) {
        level = levelToChangeTo;
    }

    //change player attributes
    playerX = levelPos[level][0] * 20 - 10;
    playerY = levelPos[level][1] * 20 - 10;
    playerJump = 0;
    playerIsInAir = true;
}

changeLevel(level);

function update() {
    //change canvas size
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    requestAnimationFrame(update);

    //background
    fill(105, 150, 140);
    noStroke();
    rect(0, 0, WIDTH, HEIGHT);

    //platforms
    fill(0);
    for (var y = 0; y < levels[level].length - 1; y++) {
        for (var x = 0; x < levels[level][y].length; x++) {
            if ((levels[level][y][x] === 1 || levels[level][y][x] === 2) && x * 20 - playerX + WIDTH / 2 > -20 && x * 20 - playerX + WIDTH / 2 < WIDTH && y * 20 - Math.round(playerY) + HEIGHT / 2 > -20 && y * 20 - Math.round(playerY) + HEIGHT / 2 < HEIGHT) {
                if (levels[level][y - 1][x] !== 2 && levels[level][y][x] === 2) {
                    ctx.drawImage(tiles, 0, 0, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 20);
                }
                else if (levels[level][y][x] === 2) {
                    ctx.drawImage(tiles, 0, 20, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 20);
                }
                else if (levels[level][y][x] === 1 && (levels[level][y][x - 1] === 2 || levels[level][y][x + 1] === 2) && (levels[level][y - 1][x - 1] !== 2 && levels[level][y - 1][x + 1] !== 2)) {
                    ctx.drawImage(tiles, 0, 0, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 20);
                }
                else if (levels[level][y][x] === 1 && (levels[level][y][x - 1] === 2 || levels[level][y][x + 1] === 2) && (levels[level][y - 1][x - 1] === 2 || levels[level][y - 1][x + 1] === 2)) {
                    ctx.drawImage(tiles, 0, 20, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 20);
                }
            }
            if (levels[level][y][x] === 1 && x * 20 - playerX + WIDTH / 2 > -20 && x * 20 - playerX + WIDTH / 2 < WIDTH && y * 20 - Math.round(playerY) + HEIGHT / 2 > -20 && y * 20 - Math.round(playerY) + HEIGHT / 2 < HEIGHT) {
                if (levels[level][y][x + 1] === 1 && levels[level][y + 1][x] !== 1 && levels[level][y][x - 1] !== 1 && levels[level][y - 1][x] === 1) {
                    ctx.drawImage(tiles, 20, 40, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 21);
                }
                else if (levels[level][y][x + 1] !== 1 && levels[level][y + 1][x] !== 1 && levels[level][y][x - 1] === 1 && levels[level][y - 1][x] === 1) {
                    ctx.drawImage(tiles, 60, 40, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 21);
                }
                else if (levels[level][y][x - 1] === 1 && levels[level][y][x + 1] === 1 && levels[level][y + 1][x] === 1 && levels[level][y - 1][x] !== 1) {
                    ctx.drawImage(tiles, 40, 0, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 21);
                }
                else if (levels[level][y][x - 1] === 1 && levels[level][y][x + 1] === 1 && levels[level][y + 1][x] !== 1 && levels[level][y - 1][x] === 1) {
                    ctx.drawImage(tiles, 40, 40, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 21);
                }
                else if (levels[level][y][x - 1] === 1 && levels[level][y - 1][x] === 1 && levels[level][y][x + 1] !== 1) {
                    ctx.drawImage(tiles, 60, 20, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 21);
                }
                else if (levels[level][y][x + 1] === 1 && levels[level][y - 1][x] === 1 && levels[level][y][x - 1] !== 1) {
                    ctx.drawImage(tiles, 20, 20, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 21);
                }
                else if (levels[level][y][x + 1] === 1 && levels[level][y + 1][x] === 1 && levels[level][y][x - 1] !== 1 && levels[level][y - 1][x] !== 1) {
                    ctx.drawImage(tiles, 20, 0, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 21);
                }
                else if (levels[level][y][x - 1] === 1 && levels[level][y + 1][x] === 1 && levels[level][y][x + 1] !== 1 && levels[level][y - 1][x] !== 1) {
                    ctx.drawImage(tiles, 60, 0, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 21);
                }
                else if (levels[level][y][x - 1] === 1 && levels[level][y + 1][x] === 1 && levels[level][y][x + 1] === 1 && levels[level][y - 1][x] === 1 && levels[level][y - 1][x + 1] !== 1) {
                    ctx.drawImage(tiles, 100, 0, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 21);
                }
                else if (levels[level][y][x - 1] === 1 && levels[level][y + 1][x] === 1 && levels[level][y][x + 1] === 1 && levels[level][y - 1][x] === 1 && levels[level][y - 1][x - 1] !== 1) {
                    ctx.drawImage(tiles, 80, 0, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 21);
                }
                else {
                    ctx.drawImage(tiles, 40, 20, 20, 20, x * 20 - playerX + WIDTH / 2, y * 20 - Math.round(playerY) + HEIGHT / 2, 20, 21);
                }
            }
        }
    }

    //particles
    noStroke();
    for (var i = 0; i < particles.length; i++) {
        fill(particles[i][6], particles[i][7], particles[i][8]);
        rect(particles[i][0] - playerX + WIDTH / 2, particles[i][1] - playerY + HEIGHT / 2, particles[i][4], particles[i][4]);
        particles[i][5]--;
        if (Math.round(particles[i][5]) === 0) {
            particles.removeAt(i);
        }
        particles[i][3] += 0.5;
        particles[i][0] += particles[i][2];
        particles[i][1] += particles[i][3];
    }

    //player
    //draw
    if (playerDirection === 'none') {
        ctx.drawImage(charector, playerAnimationFrame * 32 + 164, -1, 23, 24, WIDTH / 2 - 10, HEIGHT / 2 - 10, 20, 20);
    }
    else if (playerDirection === 'right' || playerDirection === 'left') {
        ctx.drawImage(charector, playerAnimationFrame * 32 + 4, -1, 23, 24, WIDTH / 2 - 10, HEIGHT / 2 - 10, 20, 20);
    }

    frame++;

    if (frame === 10) {
        playerAnimationFrame++;
        frame = 0;
    }

    if (playerAnimationFrame === 5) {
        playerAnimationFrame = 0;
    }

    //move
    if (keys.includes('a')) {
        if (levels[level][Math.floor((playerY + 10) / 20)][Math.floor((playerX - 14) / 20)] === 2 && levels[level][Math.ceil((playerY + 10) / 20)][Math.floor((playerX - 14) / 20)] === 2) {
            playerX -= 1;
        }
        else if (levels[level][Math.floor((playerY - 10) / 20)][Math.floor((playerX - 14) / 20)] === 0 && levels[level][Math.ceil((playerY - 10) / 20)][Math.floor((playerX - 14) / 20)] === 0) {
            playerX -= 3;
        }
        else if (levels[level][Math.floor((playerY - 10) / 20)][Math.floor((playerX - 10) / 20)] === 0 && levels[level][Math.ceil((playerY - 10) / 20)][Math.floor((playerX - 10) / 20)] === 0) {
            playerX = Math.floor(playerX / 20) * 20 + 10;
        }
        playerDirection = 'left';
    }
    else if (keys.includes('d')) {
        if (levels[level][Math.floor((playerY + 10) / 20)][Math.ceil((playerX - 6) / 20)] === 2 && levels[level][Math.ceil((playerY + 10) / 20)][Math.ceil((playerX - 6) / 20)] === 2) {
            playerX += 1;
        }
        else if (levels[level][Math.floor((playerY - 10) / 20)][Math.ceil((playerX - 6) / 20)] === 0 && levels[level][Math.ceil((playerY - 10) / 20)][Math.ceil((playerX - 6) / 20)] === 0) {
            playerX += 3;
        }
        else if (levels[level][Math.floor((playerY - 10) / 20)][Math.ceil((playerX - 10) / 20)] === 0 && levels[level][Math.ceil((playerY - 10) / 20)][Math.ceil((playerX - 10) / 20)] === 0) {
            playerX = Math.ceil(playerX / 20) * 20 - 10;
        }
        playerDirection = 'right';
    }
    else {
        playerDirection = 'none';
    }

    oldPlayerX = playerX;

    //die
    if (playerY >= (levels[level].length) * 20) {
        changeLevel(level);
    }

    //jump
    if (keys.includes('w') && playerIsInAir === false) {
        playerJump = 10;
    }
    if (keys.includes('w') && playerIsInAir === 'water') {
        playerY -= 2.5;
        if (levels[level][Math.floor((playerY + 10) / 20)][Math.floor((playerX - 10) / 20)] !== 2) {
            playerY = Math.ceil((playerY) / 20) * 20 - 11;
        }
    }
    if (keys.includes('s') && playerIsInAir === 'water') {
        playerY += 2;
    }

    playerY -= playerJump;

    if (levels[level][Math.ceil((playerY - 2) / 20)][Math.floor((playerX - 10) / 20)] === 2 && levels[level][Math.ceil((playerY - 2) / 20)][Math.ceil((playerX - 10) / 20)] === 2) {
        if (playerIsInAir === true) {
            for (var i = 0; i <= Math.abs(playerJump); i++) {
                particles.push([playerX, playerY, Math.random() * 8 - 4, Math.random() * -5, Math.random() * 5 + 2, Math.random() * 100, 50, 50, Math.random() * 155 + 100]);
            }

            playerY = Math.ceil(playerY / 20) * 20 - 10;
        }

        if (playerJump < 0) {
            playerJump += 0.8;

            if (playerJump > 0) {
                playerJump = 0;
            }
        }
        else {
            playerY += 1;
        }

        playerIsInAir = 'water';
    }
    else if (levels[level][Math.ceil(playerY / 20)][Math.floor((playerX - 10) / 20)] !== 1 && levels[level][Math.ceil(playerY / 20)][Math.ceil((playerX - 10) / 20)] !== 1) {
        playerIsInAir = true;
        playerJump -= 0.5;
    }
    else {
        if (playerIsInAir === true) {
            for (var i = 0; i <= Math.abs(playerJump); i++) {
                particles.push([playerX, playerY, Math.random() * 8 - 4, Math.random() * -5, Math.random() * 5 + 2, Math.random() * 100, Math.random() * 100, Math.random() * 255, Math.random() * 25]);
            }

            playerY = Math.ceil(playerY / 20) * 20 - 10;
            playerJump = 0;
        }

        playerIsInAir = false;
    }

    if (playerIsInAir === true && (levels[level][Math.floor((playerY - 10) / 20)][Math.floor((playerX - 10) / 20)] === 1 || levels[level][Math.floor((playerY - 10) / 20)][Math.ceil((playerX - 10) / 20)] === 1)) {
        playerY = Math.floor((playerY) / 20) * 20 + 10;
        playerJump = 0;
    }

    oldPlayerY = playerY;
}

update();

document.addEventListener('keydown', function (e) {
    keys.push(e.key);
});

document.addEventListener('keyup', function (e) {
    var newArr = [];
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] != e.key) {
            newArr.push(keys[i]);
        }
    }
    keys = newArr;
});