// Function to draw a quad
function drawRect(r) {
	
	// Get the coordinates
	cOne = rotatePoint(r.x - r.width / 2 + width / 2, height / 2 - (r.y + r.height / 2), r.x + width / 2, r.y + height / 2, r.rotation);
	cTwo = rotatePoint(r.x - r.width / 2 + width / 2, height / 2 - (r.y - r.height / 2), r.x + width / 2, r.y + height / 2, r.rotation);
	cThree = rotatePoint(r.x + r.width / 2 + width / 2, height / 2 - (r.y - r.height / 2), r.x + width / 2, r.y + height / 2, r.rotation);
	cFour = rotatePoint(r.x + r.width / 2 + width / 2, height / 2 - (r.y + r.height / 2), r.x + width / 2, r.y + height / 2, r.rotation);
	
	// Set fill colour
	fill(r.colour);
	
	// Draw the quad
	quad(cOne.x, cOne.y, cTwo.x, cTwo.y, cThree.x, cThree.y, cFour.x, cFour.y);

}

// Function to draw an ellipse
function drawCircle(c) {
	
	// Set fill colour
	fill(c.colour);
	
	// Draw the ellipse
	ellipse(c.x + width / 2, height / 2 - c.y, c.radius * 2, c.radius * 2);
	
}

// Function to get a point rotated around an origin
function rotatePoint(pointX, pointY, originX, originY, angle) {
	
	// Convert the angle to radians
	angle = angle * Math.PI / 180.0;
	
	// Get the sin and cos of the angle
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	
	// Return the rotated point
	return {
		x: c * (pointX - originX) - s * (pointY - originY) + originX,
		y: s * (pointX - originX) + c * (pointY - originY) + originY
	};
}

// Check for collision
function collision(shapeOne, shapeTwo) {
	
	// Rect on rect
	if (shapeOne.type == "rect" && shapeTwo.type == "rect") {
        
        // Return no collision
		return false;
	}
	
	// Circle on circle
	else if(shapeOne.type == "circle" && shapeTwo.type == "circle") {
		
		// Check whether the distance between the shapes is less than sum of radii
		if(pointPythagoras({x: shapeOne.x, y: shapeOne.y}, {x: shapeTwo.x, y: shapeTwo.y}) < shapeOne.radius + shapeTwo.radius) {
			return true;
		}
        
        // Return no collision
		return false;
	}
	
	// Circle on rect
	else if(shapeOne.type == "circle" && shapeTwo.type == "rect") {
        
        // Return no collision
		return false;
	}
	
	// Return the reversed collision
	else {
		return checkCollision(shapeTwo, shapeOne);
	}
	
}

// Function to get all the points of a rect
function getRectPoints(rect) {
	
	// Get the coordinates
	pOne = {x: rect.x - rect.width / 2, y: rect.y + rect.height / 2};
	pTwo = {x: rect.x - rect.width / 2, y: rect.y - rect.height / 2};
	pThree = {x: rect.x + rect.width / 2, y: rect.y + rect.height / 2};
	pFour = {x: rect.x + rect.width / 2, y: rect.y - rect.height / 2};
    
    // Return the points
    return [pOne, pTwo, pThree, pFour];
}

// Pythagoras of two points
function pointPythagoras(pointOne, pointTwo) {
	
	// Get the difference in x and difference in y and return total distance
	var xDiff = Math.abs(pointOne.x - pointTwo.x);
	var yDiff = Math.abs(pointOne.y - pointTwo.y);
	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
	
}