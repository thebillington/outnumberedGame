// Function to return a bullet
function Bullet(s, sp, h) {
    
    // Return a bullet object
    return {shape: s, speed: sp, homing: h}
    
}

// Function to return an enemy
function Enemy(s, bs, br, crt, pr, h) {
    
    // Return the enemy object
    return {shape: s, bSpeed: bs, bRadius: br, created: crt, lastShot: crt, period: pr, active: false}
    
}

// Function to return a player
function Player(s, bs, br) {
    
    
    // Return the player object
    return {shape: s, bSpeed: bs, bRadius: br}
    
}

// Function to return a boss
function Boss(s, e, d) {
    
    // Return the boss object
    return {shape: s, enemies: s, direction: d}
    
}

// Function to generate turrets for a boss
function genTurrets(boss, no) {
    
    // Create an empty list to hold the turrets
    var turrets = [];
    
    // 
    
}