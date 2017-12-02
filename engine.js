// Function to draw a quad
function drawRect(r) {
	
	// Get the coordinates
	cOne = rotatePoint(r.x - r.width / 2 + width / 2, height / 2 - (r.y + r.height / 2), width / 2 + r.x, height / 2 - r.y, r.rotation);
	cTwo = rotatePoint(r.x - r.width / 2 + width / 2, height / 2 - (r.y - r.height / 2), width / 2 + r.x, height / 2 - r.y, r.rotation);
	cThree = rotatePoint(r.x + r.width / 2 + width / 2, height / 2 - (r.y - r.height / 2), width / 2 + r.x, height / 2 - r.y, r.rotation);
	cFour = rotatePoint(r.x + r.width / 2 + width / 2, height / 2 - (r.y + r.height / 2), width / 2 + r.x, height / 2 - r.y, r.rotation);
	
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
		
		// Unrotate the circle
		var circleLocation = rotatePoint(shapeOne.x, shapeOne.y, shapeTwo.x, shapeTwo.y, -shapeTwo.rotation);
		
		// Check wether the centre of the circle is inside the rect
		xColl = circleLocation.x > shapeTwo.x - shapeTwo.width / 2 && circleLocation.x < shapeTwo.x + shapeTwo.width / 2;
		yColl = circleLocation.y > shapeTwo.y - shapeTwo.height / 2 && circleLocation.y < shapeTwo.y + shapeTwo.height / 2;
		
		// If xColl and yColl
		if (xColl && yColl) {
			return true;
		}
		// If there is just a collision on the x, check the y distance
		if (xColl) {
			if (Math.abs(circleLocation.y - shapeTwo.y) < shapeOne.radius + shapeTwo.height / 2) {
				return true;
			}
		}
		// If there is just a collision on the y, check the x distance
		if (yColl) {
			if (Math.abs(circleLocation.x - shapeTwo.x) < shapeOne.radius + shapeTwo.width / 2) {
				return true;
			}
		}
		// Otherwise check the corners
		var points = getRectPoints(shapeTwo);
        for(var i = 0; i < points.length; i++) {
            // Check whether the distance between the point and the circle is less than the radius
            if (pointPythagoras(points[i], circleLocation) < shapeOne.radius) {
                return true;
            }
        }
        
        // Return no collision
		return false;
	}
	
	// Return the reversed collision
	else {
		return collision(shapeTwo, shapeOne);
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

// Function to get the points of the rectangle rotated
function getRectPointsRotated(r) {
	
	// Get the coordinates
	pOne = rotatePoint(r.x - r.width / 2 + width / 2, height / 2 - (r.y + r.height / 2), width / 2 + r.x, height / 2 - r.y, r.rotation);
	pTwo = rotatePoint(r.x - r.width / 2 + width / 2, height / 2 - (r.y - r.height / 2), width / 2 + r.x, height / 2 - r.y, r.rotation);
	pThree = rotatePoint(r.x + r.width / 2 + width / 2, height / 2 - (r.y - r.height / 2), width / 2 + r.x, height / 2 - r.y, r.rotation);
	pFour = rotatePoint(r.x + r.width / 2 + width / 2, height / 2 - (r.y + r.height / 2), width / 2 + r.x, height / 2 - r.y, r.rotation);
    
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

// Function to generate a random coordinate
function getRandCoord() {
    
    // Return a random coordinate in the grid
    return {x: Math.floor(Math.random() * (width) + 1 - width / 2), y: Math.floor(Math.random() * (height) + 1 - height / 2)}
    
}

// Function to check that a cicle is on screen
function onScreenCircle(x, y, r) {
    
    // Check each bound
    if (x - r < -width / 2 || x + r > width / 2) {
        return false;
    }
    if (y - r < -height / 2 || y + r > height / 2) {
        return false;
    }
    return true;
    
}

// Function to check that the player is on screen
function returnToScreenRect(rect, width, height) {
    
    // Get the points of the rectangle rotated
    var points = getRectPointsRotated(rect);
    
    // Check each point is on screen
    for (var i = 0; i < points.length; i++) {
        
        // If the point is off screen
        while (points[i].x <= 0) {
            // Move the rectangle
            rect.x += 1;
            points = getRectPointsRotated(rect);
        }
        while (points[i].x >= width) {
            // Move the rectangle
            rect.x -= 1;
            points = getRectPointsRotated(rect);
        }
        while (points[i].y <= 0) {
            // Move the rectangle
            rect.y -= 1;
            points = getRectPointsRotated(rect);
        }
        while (points[i].y >= height) {
            // Move the rectangle
            rect.y += 1;
            points = getRectPointsRotated(rect);
        }
        
    }
}