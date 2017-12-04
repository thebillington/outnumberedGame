# Outnumbered

[Play the game](http://outnumberedgame.co.uk/)

## Ludum Dare 40

Outnumbered was built in 48 hours for the Ludum Dare game jam, submitted into the compo category. Unfortunately on the second day of the competition I was ill, and thus unable to spend as much time polishing the game as I would have liked. I spent around 10 hours total on the game on the first day of the jam.

## Technology

### Graphics

The game was built using a lightweight Javascript graphics library called p5.js. It is very powerful and fairly robust considering the tiny file size of the library.

[p5.js](https://p5js.org/)

### Physics

Physics were built myself from scratch. My initial aim for the weekend was to implement the Separating-Axis-Theorem, however due to time constraints on the second day I was unable to do so - I will have to save this for a future jam.

The physics time step is linked directly to the renderer and therefore physics is completely hardware dependent. Again, due to time cnstraints on the second day I was unable to add real time-stepped physics to the simulation.
