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
    if (keyIsDown(LEFT_ARROW)) {
        // Rotate left
        player.shape.rotation--;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        // Rotate right
        player.shape.rotation++;
    }
    if (keyIsDown(UP_ARROW)) {
        // Move forward
        move(player.shape, 10);
    }
    if (keyIsDown(DOWN_ARROW)) {
        //Move backwards
        move(player.shape, -5);
    }
    
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
        addShape(bShape);
        
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