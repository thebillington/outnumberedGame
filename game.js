// Store the player
var player;
var enemy;

// Create a variable to hold some shapes
var shapes = [];

// Variable to hold background colour
var bgColour;

// Function ran at the start of the game
function setup() {
	
	// Create a canvas
	createCanvas(windowWidth, windowHeight);
    
    // Create the player
    player = Rectangle(0, 0, 100, 100, 0, color(255,0,0));
    
    // Create the enemy
    enemy = Circle(80, 80, 50, 0, color(0, 150, 150));
    
    // Store the shapes that are for rendering
    shapes.push(player);
    shapes.push(enemy);
    
    // Set the background colour
    bgColour = color(255, 255, 255);
    
}

// Render function
function draw() {
    
    // Clear the canvas
    background(bgColour);
    
    // Render all the shapes
    renderShapes();
    
    // Rotate the player
    player.rotation += 1;
    
    // Check for collision between player and enemy
    console.log(collision(player, enemy));
    
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