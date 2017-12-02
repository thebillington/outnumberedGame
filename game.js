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
var pBRadius = 5;

// Enemy physics
var eRadius = 40;

// Store the number of enemies killed (score)
var score;

// Variable to score current time
var cTime;

// Background image
var iImage;

// Function ran at the start of the game
function setup() {
	
	// Create a canvas
	createCanvas(windowWidth, windowHeight);
    
    // Initialize arrays
    enemies = [];
    shapes = [];
    playerBullets = [];
    enemyBullets = [];
    score = 0;
    
    // Create the player
    player = Player(Rectangle(0, 0, 60, 100, 0, color(0,204,204)), 10, pBRadius);
    
    // Store the shapes that are for rendering
    addShape(player.shape);
    
    // Get the current time
    cTime = new Date().getTime();
    
    // Add an enemy
    spawnEnemies(1);
    
    // Set the background colour
    bgColour = color(255, 255, 255);
    
    // Set text size
    textSize(32);
    
    // Get the background image
    iImage = loadImage("instructions.png");
    
}

// Render function
function draw() {
    
    // Get the current time
    cTime = new Date().getTime();
    
    // Clear the canvas
    background(bgColour);
    
    // Draw the instructions
    image(iImage, 0, height - iImage.height);
    
    // Render all the shapes
    renderShapes();
    
    // Show the score
    fill(0);
    text("Score: " + score.toString(), 20, 50);
    
    // Check for key presses
    if (keyIsDown(A)) {
        // Rotate left
        player.shape.rotation -= rSpeed;
    }
    if (keyIsDown(D)) {
        // Rotate right
        player.shape.rotation += rSpeed;
    }
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
    
    // Check the player is on screen
    returnToScreenRect(player.shape, width, height);
    
    // Aim at the mouse
    atMouse();
    
    // Update the bullets
    updatePlayerBullets();
    
    // Update enemies
    updateEnemies();
    
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
                        
                        // Delete them both
                        removeShape(playerBullets[i].shape);
                        removeBullet(playerBullets[i], playerBullets);
                        removeShape(enemies[j].shape);
                        removeEnemy(enemies[j]);

                        // Check number of enemies to spawn
                        var eNo = 1;
                        if (score % 5 == 0) {
                            eNo += 1;
                        }
                        spawnEnemies(eNo);
                    }
                }
            }
        }
    }
    
}

// Function to update the enemies
function updateEnemies() {
    
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
            }
            
        }
        else {
        
            // If the enemy has collided with the player, kill
            if (collision(enemies[i].shape, player.shape)) {

                // DIE
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
    
    // Look at each enemy bullet
    for (var i = 0; i < enemyBullets.length; i++) {
        
        // Update the bullet position
        move(enemyBullets[i].shape, enemyBullets[i].speed);
        
        // If the bullet has collided with the player, kill them
        if (collision(enemyBullets[i].shape, player.shape)) {
            
            // DIE
            setup();
            
        }
        
    }
    
}

// Key press function
function mousePressed() {
        
    // Shoot
    shoot(player, false);
    
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
        
        // Add the new enemy
        var eShape = Circle(c.x, c.y, 1, 0, color(255, 255, 102));
        addShapeStart(eShape);
        addEnemy(Enemy(eShape, 5, 10, cTime, 2000));
        
    }
    
}