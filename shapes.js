// Function to return a rect object
function Rectangle(_x, _y, w, h, rot, c) {
    
    // Return the object
    return {x: _x, y: _y, width: w, height: h, rotation: rot, colour: c, type: "rect"}
    
}

// Function to return a circle object
function Circle(_x, _y, r, rot, c) {
    
    // Return the object
    return {x: _x, y: _y, radius: r, rotation: r, colour: c, type: "circle"}
    
}