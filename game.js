// Store the player
var player;

// Store the enemies
var enemies;

// Create a variable to hold all rendering shapes
var shapes;

// Create arrays to hold bullets
var playerBullets;
var enemyBullets;

// Variable to hold background colour
var bgColour;

// Space bar
var SPACE_BAR = 32;
var W = 87;
var A = 65;
var S = 83;
var D = 68;

// Player physics
var pSpeed = 10;
var rSpeed = 5;
var pBRadius;

// Store the number of enemies killed (score)
var score;

// Last score
var lastScore = 0;

// High score
var highScore = 0;

// Store the number of enemies remaining
var enemiesRemaining;

// Variable to score current time
var cTime;

// Background image
var iImage;

// Size variables
var playerWidth;
var playerHeight;
var eRadius;

// Create a list of levels
var levels = ["basic", "small", "quick", "homing"];

// Store the current level
var level;

// Store the level number
var levelNo;

// Set the number of enemies needed to kill
var noEnemies;

// Store the current number of enemies
var totEnemies;

// Store whether the user is currently shooting
var shooting;

// Store when the player last shot
var lastShot;

// Store whether the user is currently firing
var firing;

// Store when the user last teleported
var lastTele;

// Store the teleport frequency
var teleFreq = 10000;

// Create an indicator to show whether teleport is available
var teleIndicator;

// Store the theme
var theme;

// Store whether this is the first setup
var firstSetup = true;

// Store whether music is playing
var musicPlaying;

// Store whether the current level is a boss or not
var boss;

// Pre load
function preload() {
    
    // Get theme music
    theme = loadSound("theme.mp3");
    theme.setVolume(0.05);
    
}

// Function to mute music
function mute() {
    
    // Check whether music is playing
    if (musicPlaying) {
        theme.stop();
        musicPlaying = false;
    }
    else {
        theme.loop();
        musicPlaying = true;
    }
    
}

// Function ran at the start of the game
function setup() {
    
    // Set timeout on the menu window
    setTimeout(hideMenu, 10000);
	
    // Create a canvas
    createCanvas(windowWidth, windowHeight);
    
    // Set the level
    levelNo = 1;
    level = levels[levelNo];
    
    // Set boss to false
    boss = false;
    
    //If this is the first load
    if (firstSetup) {
        theme.loop();
        firstSetup = false;
        musicPlaying = true;
    }  
    
    // Initialize arrays
    enemies = [];
    shapes = [];
    playerBullets = [];
    enemyBullets = [];
    score = 0;
    
    // Set up the sizes of entities
    playerWidth = width / 40;
    playerHeight = width / 24;
    eRadius = width / 56;
    pBRadius = playerWidth / 12;
    
    // Create the player
    player = Player(Rectangle(0, 0, playerWidth, playerHeight, 0, color(0,204,204)), 10, pBRadius);
    
    // Store the shapes that are for rendering
    addShape(player.shape);
    
    // Get the current time
    cTime = new Date().getTime();
    
    // Set the time the player last shot
    lastShot = cTime;
    
    // Set the total enemies
    totEnemies = 1;
    
    // Add an enemy
    spawnEnemies(totEnemies);
    
    // Set the background colour
    bgColour = color(255, 255, 255);
    
    // Set text size
    textSize(32);
    
    // Set the initial number of enemies needed to kill
    noEnemies = 50;
    
    // Set the number of enemies remaining
    enemiesRemaining = noEnemies;
    
    // Set shooting to false
    shooting = false;
    
    // Set last teleport time
    lastTele = cTime;
    
    // Create the teleport indicator
    teleIndicator = Rectangle(0, height / 2 - 50, playerHeight, playerWidth, 0, color(0,204,107));
    
    // Add the teleport indicator
    addShape(teleIndicator);
    
}

// Render function
function draw() {
    
    // Get the current time
    cTime = new Date().getTime();
    
    // Clear the canvas
    background(bgColour);
    
    // Render all the shapes
    renderShapes();
    
    // Show the score
    fill(0);
    text("Level: " + (levelNo+1).toString(), 20, 50);
    text("Score: " + score.toString(), 20, 100);
    text("Last score: " + lastScore.toString(), 20, 150);
    text("High score: " + highScore.toString(), 20, 200);
    text("Enemies remaining: " + enemiesRemaining.toString(), 20, 250);
    
    // Check for key presses
    if (keyIsDown(W)) {
        // Move up
        player.shape.y += pSpeed;
    }
    if (keyIsDown(S)) {
        //Move down
        player.shape.y -= pSpeed;
    }
    if (keyIsDown(A)) {
        // Move up
        player.shape.x -= pSpeed;
    }
    if (keyIsDown(D)) {
        //Move down
        player.shape.x += pSpeed;
    }
    if (keyIsDown(SPACE_BAR)) {
        // Teleport
        if (cTime - lastTele > teleFreq) {
            player.shape.x = mouseX - width / 2;
            player.shape.y = height / 2 - mouseY;
            lastTele = cTime;
        }
    }
    
    // Set the teleporter time
    if (level == "small") {
        teleFreq = 4000;
    }
    else {
        teleFreq = 10000;
    }
    
    // Check if teleporter is available
    // Teleport
    if (cTime - lastTele > teleFreq) {
        teleIndicator.colour = color(0,204,107);
    }
    else {
        teleIndicator.colour = color(255,200,200);
    }
    
    // Check the player is on screen
    returnToScreenRect(player.shape, width, height);
    
    // Aim at the mouse
    atMouse();
    
    // If the user is shooting but we aren't currently firing a shot
    if (shooting && !firing) {
        
        // If the difference between the last shot and the current time is greater than 500ms
        if (cTime - lastShot > 500) {
            lastShot = cTime;
            shoot(player, false);
        }
        
    }
    
    // Update the bullets
    updatePlayerBullets();
    
    // Update enemies
    updateEnemies();
    
}

// Function to level up
function levelUp() {
    
    // Check whether we are currently in a boss battle
    if (!boss) {
    
        // Go up a level
        levelNo++;

        // Reset total enemies
        totEnemies++;

        // If user has finished all levels, ramp difficulty
        if (levelNo == levels.length) {
            levelNo = 0;
            noEnemies += 10;
        }

        // Go up a level
        enemiesRemaining = noEnemies;
        level = levels[levelNo];
        
        // Disable boss
        boss = false;
    }
    else {
        // Set the next level as a boss fight
        boss = true;
        enemiesRemaining = 1;
    }

    // Delete current enemies
    for (var i = enemies.length - 1; i >= 0; i--) {
        // Remove the shape and enemy
        removeShape(enemies[i].shape);
        removeEnemy(enemies[i]);
    }
    // Delete current bullets
    for (var i = enemyBullets.length - 1; i >= 0; i--) {
        removeShape(enemyBullets[i].shape);
        removeBullet(enemyBullets[i], enemyBullets);
    }
    
}

// Function to add a shape
function addShape(s) {
    shapes.push(s);
}

// Function to add a shape at start of the list (drawn below all other shapes)
function addShapeStart(s) {
    shapes.unshift(s);
}

// Function to remove a shape
function removeShape(s) {
    var i = shapes.indexOf(s);
    shapes.splice(i, 1);
}

// Function to add a bullet
function addBullet(b, bl) {
    bl.push(b);
}

// Function to remove a bullet
function removeBullet(b, bl) {
    var i = bl.indexOf(b);
    bl.splice(i, 1);
}

// Function to add an enemy
function addEnemy(e) {
    enemies.push(e);
}

// Function to remove an enemy
function removeEnemy(e) {
    var i = enemies.indexOf(e);
    enemies.splice(i, 1);
}

// Function to draw the bullets
function updatePlayerBullets() {
    
    // Move each bullet
    for (var i = playerBullets.length - 1; i > -1; i--) {
        
        // Move the bullet
        move(playerBullets[i].shape, playerBullets[i].speed);
        
        // Check whether the bullet needs deleting
        if ((playerBullets[i].shape.x < -width / 2 || playerBullets[i].shape.x > width / 2) || (playerBullets[i].shape.y < -height / 2 || playerBullets[i].shape.y > height / 2)) {
            removeShape(playerBullets[i].shape);
            removeBullet(playerBullets[i], playerBullets);
        }
        else {
        
            // Check whether the bullet has collided with an enemy
            for (var j = enemies.length - 1; j > -1; j--) {
                
                // Check there is a bullet
                if(playerBullets[i] !== undefined && enemies[j] !== undefined) {
                    
                    // Check for the collision
                    if (collision(playerBullets[i].shape, enemies[j].shape)) {
                        
                        // Add one to score
                        score++;
                        
                        // Remove one from enemies remaining
                        enemiesRemaining--;
                        
                        // If there are no enemies remaining
                        if (enemiesRemaining == 0) {
                            
                            // Go up a level
                            levelUp();
                            
                            // Spawn some enemies
                            if (!boss) {
                                spawnEnemies(totEnemies);
                            }
                            
                            // Otherwise spawn a boss
                            else {
                                spawnBoss();
                            }
                            
                        }
                        else {
    
                            // Check for high score
                            if (score > highScore) {
                                highScore = score;
                            }


                            // Delete them both
                            removeShape(playerBullets[i].shape);
                            removeBullet(playerBullets[i], playerBullets);
                            removeShape(enemies[j].shape);
                            removeEnemy(enemies[j]);

                            // Check number of enemies to spawn
                            var eNo = 1;
                            if (score % 5 == 0) {
                                eNo ++;
                            }
                            spawnEnemies(eNo);
                        }
                    }
                }
            }
        }
    }
    
}

// Function to update the enemies
function updateEnemies() {
    
    // If we aren't in a boss fight
    if (!boss) {
    
        // Look at each enemy
        for (var i = 0; i < enemies.length; i++) {

            // Check if the turret should become active
            if (!enemies[i].active) {

                // If not full size, grow
                if (enemies[i].shape.radius < eRadius) {
                    enemies[i].shape.radius += 1;
                }

                // Check the time difference
                if (cTime - enemies[i].created > 1000) {

                    // Remove the existing shape
                    enemies[i].active = true;
                    enemies[i].shape.colour = color(255, 102, 102);
                    enemies[i].shape.radius = eRadius;
        
                    // If this is a homing enemy, fire
                    if (level == "homing") {
                        
                        // Face at the player
                        atPlayer(enemies[i]);

                        // Shoot
                        shoot(enemies[i], true);

                    }
                }

            }
            else {

                // If the enemy has collided with the player, kill
                if (collision(enemies[i].shape, player.shape)) {

                    // DIE
                    lastScore = score;
                    setup();

                }

                // Check if we need to shoot
                else if(cTime - enemies[i].lastShot > enemies[i].period) {

                    // Face at the player
                    atPlayer(enemies[i]);

                    // Shoot
                    shoot(enemies[i], true);

                    // Set the last shot time
                    enemies[i].lastShot = cTime;

                }
            }

        }
    }
    // Boss
    else {
        
        
        
    }
    
    // Look at each enemy bullet
    for (var i = enemyBullets.length - 1; i >= 0; i--) {
        
        // Check the bullet exists
        if (enemyBullets[i] !== undefined) {
        
            // Check whether the bullet needs deleting
            if ((enemyBullets[i].shape.x < -width / 2 || enemyBullets[i].shape.x > width / 2) || (enemyBullets[i].shape.y < -height / 2 || enemyBullets[i].shape.y > height / 2)) {
                removeShape(enemyBullets[i].shape);
                removeBullet(enemyBullets[i], enemyBullets);
            }
            else {

                // If the game mode is homing
                if (level == "homing") {

                    // Point the enemy bullet at the player
                    atPlayer(enemyBullets[i]);
                    
                    // Check if this bullet has collided with an enemy bullet
                    for (var j = 0; j < playerBullets.length; j++) {
                        if (collision(enemyBullets[i].shape, playerBullets[j].shape)) {
                            // Delete the enemy bullet and break loop
                            removeShape(enemyBullets[i].shape);
                            removeBullet(enemyBullets[i], enemyBullets);
                            break;
                        }
                    }

                }
                
                // Check the bullet hasn't been deleted
                if (enemyBullets[i] !== undefined) {

                    // Update the bullet position
                    move(enemyBullets[i].shape, enemyBullets[i].speed);

                    // If the bullet has collided with the player, kill them
                    if (collision(enemyBullets[i].shape, player.shape)) {

                        // DIE
                        lastScore = score;
                        setup();

                    }
                }

            }
        }
        
    }
    
}

// On mouse press
function mousePressed() {
    
    // If left click
    if (mouseButton == LEFT) {
        
        // Shoot
        shoot(player, false);

        // Set last shot
        lastShot = cTime;

        // Set shooting to true
        shooting = true;
        
    }
    
}

// On mouse up
function mouseReleased() {
    
    // If it was left mouse button
    if (mouseButton = LEFT) {
    
        // Set shooting to false
        shooting = false;
        
    }
    
}

// Function to shoot
function shoot(ent, enemy) {
    
    // If it was the player who shot
    if (!enemy) {
        
        // Get the x and y position
        var c = rotatePoint(ent.shape.x, ent.shape.y + ent.shape.height / 2, ent.shape.x, ent.shape.y, -ent.shape.rotation);
        
        // Create the bullet shape
        bShape = Circle(c.x, c.y, ent.bRadius, ent.shape.rotation, ent.shape.colour);
        
        // Add the shape to list of shapes
        addShapeStart(bShape);
        
        // Create a new bullet with the specified speed and direction
        addBullet(Bullet(bShape, ent.bSpeed), playerBullets);
        
    }
    // Otherwise it was an enemy
    else {
        
        // Get the x and y position
        var c = rotatePoint(ent.shape.x, ent.shape.y + ent.shape.radius, ent.shape.x, ent.shape.y, -ent.shape.rotation);
        
        // Create the bullet shape
        bShape = Circle(c.x, c.y, ent.bRadius, ent.shape.rotation, ent.shape.colour);
        
        // Add the shape to list of shapes
        addShapeStart(bShape);
        
        // Create a new bullet with the specified speed and direction
        addBullet(Bullet(bShape, ent.bSpeed), enemyBullets);
        
        console.log(enemyBullets);
        
    }
    
}

// Add a function to move the player
function move(shape, speed) {
	
	// Convert the angle to radians
	angle = shape.rotation * Math.PI / 180.0;
    
    // Move the player by speed on each axis
    shape.x += Math.sin(angle) * speed;
    shape.y += Math.cos(angle) * speed;
    
}

// Function to render all the shapes
function renderShapes() {
    
    //Draw the shapes
    for (var i = 0; i < shapes.length; i++) {
		
		// Check the type of the shape
		if (shapes[i].type == "rect") {
		
			// Draw the shape
			drawRect(shapes[i]);
		
		}
		else if (shapes[i].type == "circle") {
			
			// Draw the shape
			drawCircle(shapes[i]);
			
		}
    }
    
}

// Function to aim the player at the mouse
function atMouse() {
    
    // Calculate the angle
    var angle = Math.atan2((height / 2 - player.shape.y - mouseY), (width / 2 + player.shape.x - mouseX));
    
    // Set the rotation of the player
    player.shape.rotation = angle / Math.PI * 180 + 270;
    
}

// Function to aim an enemy at the player
function atPlayer(enemy) {
    
    // Calculate the angle
    var angle = Math.atan2(enemy.shape.x - player.shape.x, enemy.shape.y - player.shape.y);
    
    // Set the rotation of the player
    enemy.shape.rotation = angle / Math.PI * 180 + 180;
    
}

// Create a function to spawn some enemies
function spawnEnemies(no) {
    
    // Spawn some enemies at a random position (and ensure they are a safe distance from the player)
    for (var i = 0; i < no; i++) {
        
        // Get a random coordinate
        var c = getRandCoord();
        
        // Check the distance
        while (pointPythagoras({x: player.shape.x, y: player.shape.y}, c) < 200 || !onScreenCircle(c.x, c.y, eRadius)) {
            c = getRandCoord();
        }
        
        // Depending on the game mode, set the physics
        var fireRate = 2000;
        var r = eRadius / 3;
        var bulletSpeed = height / 200;
        if (level == "homing") {
            fireRate = 6000;
        }
        if (level == "small") {
            fireRate = 1000;
            r = r / 2;
        }
        if (level == "quick") {
            bulletSpeed = bulletSpeed * 2;
        }
        
        // Add the new enemy
        var eShape = Circle(c.x, c.y, 1, 0, color(255, 255, 102));
        addShapeStart(eShape);
        addEnemy(Enemy(eShape, bulletSpeed, r, cTime + i * 200, fireRate));
        
    }
    
}

// Create a function to spawn a boss
function spawnBoss() {
    
    // Create the boss shape
    
    
}