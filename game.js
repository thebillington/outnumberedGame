// Create a variable to hold some shapes
var r;
var c;

// Variable to hold background colour
var bgColour;

// Function ran at the start of the game
function setup() {
	
	// Create a canvas
	createCanvas(windowWidth, windowHeight);
    
    // Create some shapes
    r = Rectangle(0, 0, 100, 100, 0, color(255,0,0));
    c = Circle(100, 100, 50, 0, color(0,150,150));
    
    // Set the background colour
    bgColour = color(255, 255, 255);
    
}

// Render function
function draw() {
    
    // Clear the canvas
    background(bgColour);
    
    //Draw the shapes
    drawRect(r);
    drawCircle(c);
    
    // Rotate the rectangle
    r.rotation++;
    
}