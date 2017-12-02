// Create a rvariable to hold some shapes
var r;
var c;

// Function ran at the start of the game
function setup() {
	
	// Create a canvas
	createCanvas(windowWidth, windowHeight);
    
    // Create some shapes
    r = Rectangle(0, 0, 100, 100, 0, color(255,0,0));
    c = Circle(100, 100, 50, 0, color(0,150,150));
    
}

// Render function
function draw() {
    
    //Draw the shapes
    drawRect(r);
    drawCircle(c);
    
}