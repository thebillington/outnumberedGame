// Store the player
var player;

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
    
    // Store the shapes that are for rendering
    shapes.push(player);
    shapes.push(Circle(100, 100, 50, 0, color(0,150,150)));
    shapes.push(Circle(-120, 120, 50, 0, color(100,0,255)));
    
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
    
    // Move the second circle
    shapes[2].x += 1;
    
    // Check for collision of circles
    console.log(collision(shapes[1], shapes[2]));
    
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