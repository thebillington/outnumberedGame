// Store the player
var player;
var enemy;

// Create a variable to hold some shapes
var shapes = [];

// Create an array to hold player bullets
var playerBullets = [];

// Variable to hold background colour
var bgColour;

// Space bar
var SPACE_BAR = 32;
var W = 87;
var A = 65;
var S = 83;
var D = 68;

// Player physics
pSpeed = 10;
rSpeed = 5;

// Function ran at the start of the game
function setup() {
	
	// Create a canvas
	createCanvas(windowWidth, windowHeight);
    
    // Create the player
    player = Player(Rectangle(-100, 100, 60, 100, 0, color(255,0,0)), 10, 20);
    
    // Create the enemy
    enemy = Enemy(Circle(80, 80, 50, 0, color(0, 150, 150)), 5, 10);
    
    // Store the shapes that are for rendering
    addShape(player.shape);
    addShape(enemy.shape);
    
    // Set the background colour
    bgColour = color(255, 255, 255);
    
}

// Render function
function draw() {
    
    // Clear the canvas
    background(bgColour);
    
    // Render all the shapes
    renderShapes();
    
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
    
    // Aim at the mouse
    atMouse();
    
    // Check for collision between player and enemy
    if (collision(player.shape, enemy.shape)) {
        // Kill the player
        player.x = -100;
        player.y = -100;
    }
    
    // Update the bullets
    updateBullets();
    
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

// Function to add a shape
function addBullet(b, bl) {
    bl.push(b);
}

// Function to remove a shape
function removeBullet(b, bl) {
    var i = bl.indexOf(b);
    bl.splice(i, 1);
}

// Function to draw the bullets
function updateBullets() {
    
    // Move each bullet
    for (var i =0; i < playerBullets.length; i++) {
        
        // Move the bullet
        move(playerBullets[i].shape, playerBullets[i].speed);
        
        // Check whether the bullet needs deleting
        if ((playerBullets[i].shape.x < -width / 2 || playerBullets[i].shape.x > width / 2) || (playerBullets[i].shape.y < -height / 2 || playerBullets[i].shape.y > height / 2)) {
            removeShape(playerBullets[i].shape);
            removeBullet(playerBullets[i], playerBullets);
        }
    }
    
}

// Key press function
function keyPressed() {
    
    // If it is the space bar
    if(keyCode == SPACE_BAR) {
        
        // Shoot
        shoot(player, false);
        
    }
    
}

// Function to shoot
function shoot(ent, enemy) {
    
    // If it was the player who shot
    if (!enemy) {
        
        // Create the bullet shape
        bShape = Circle(ent.shape.x, ent.shape.y, ent.bRadius, ent.shape.rotation, ent.shape.colour);
        
        // Add the shape to list of shapes
        addShapeStart(bShape);
        
        // Create a new bullet with the specified speed and direction
        addBullet(Bullet(bShape, ent.bSpeed), playerBullets);
        
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

// Create a function to spawn some enemies
function spawnEnemies(no) {
    
    // Spawn some enemies at a random position (and ensure they are a safe distance from the player)
    
}

// Function to generate a random coordinate
function getRandCoord() {
    
    // Return a random coordinate in the grid
    
    
}