'use strict';

// wrapper for our game "classes", "methods" and "objects"
window.Game = {};

// Game Script
(function(){
    // prepaire our game canvas
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");

    var drawCanvas = document.getElementById("drawCanvas");
    var drawContext = drawCanvas.getContext("2d");

    // game settings:    
    var FPS = 30;
    var INTERVAL = 1000/FPS; // milliseconds
    var STEP = INTERVAL/1000 // seconds

    var map = new Map(1280, 960, 'img/map.png');
    
    var mainViewport = new Viewport(0, 0, 640, 480);
    var playerViewPortOne = new Viewport (645, 0, 200, 200);
    var playerViewPortTwo = new Viewport (645, 240, 200, 200);

    var players = new Array();
    var monsters = new Array();
    var bullets = new Array();
    var spawners = new Array();  

    var pathFinder = new PathFinder(map.dynamicMap);;

	spawners.push(new Spawner(1, 1));
	spawners.push(new Spawner(19, 14));
	spawners.push(new Spawner(19, 1));
	spawners.push(new Spawner(1, 14));

    var debugOn = false;

    // Game update function
    var update = function(){
    	updateViewPorts();
        updateControlledPlayer();
        updateAIPlayers();    	
        updateMonsters();    	
    	updateBullets();
    	updateSpawners();	
    }

    Game.initialiseGame = function() {
        players.push(new Player (160, 120, 'img/player.png'));
        players.push(new Player (480, 120, 'img/player.png'));
        players.push(new Player (480, 360, 'img/player.png'));

        mainViewport.focus = players[0];
        players[0].focus = true;
        playerViewPortOne.focus = players[1];
        playerViewPortTwo.focus = players[2];
    }

    var updateViewPorts = function() {
        mainViewport.update(map);       
        playerViewPortOne.update(map);
        playerViewPortTwo.update(map);      
    }

    var updateControlledPlayer = function() {
        if (mainViewport.focus.controlUpdate(STEP, mainViewport, map)) {
            bullets[bullets.length] = new Bullet(mainViewport.focus, Math.cos(mainViewport.focus.angle + 1.57079633), Math.sin(mainViewport.focus.angle + 1.57079633));
        }
    }
        
    var updateAIPlayers = function() {
        for (var p = 0; p < players.length; p++) {
            if (players[p].update(STEP, mainViewport, pathFinder, monsters)) {
                bullets[bullets.length] = new Bullet(players[p], Math.cos(players[p].angle + 1.57079633), Math.sin(players[p].angle + 1.57079633));
            }
        }
    }

    var updateMonsters = function() {
        if (monsters.length != 0) {
            for (var m = 0; m < monsters.length; m++) {
                monsters[m].update(STEP, players, pathFinder);
                if (monsters[m].alive == false) {
                    monsters.splice(m, 1);
                }
            }
        }
    }

    var updateBullets = function() {
        if (bullets.length != 0) {
            for (var i = 0; i < bullets.length; i++) {
                bullets[i].update(monsters, STEP, map);
                if (bullets[i].alive == false) {
                    bullets.splice(i, 1);
                }
            }
        }
    }

    var updateSpawners = function() {
        for (var s = 0; s < spawners.length; s++) {
            if (spawners[s].update()) {
                monsters.push(new Monster(spawners[s].x * 32 + 16, spawners[s].y * 32 + 16, 'img/monster.png'))
            }
        }       
    }

    // Game draw function
    var draw = function() {
        clearCanvas();        
      	map.draw(context);
        drawPlayers();
        drawMonsters();
        drawBullets();
        drawViewPorts();
        drawButtons();
        drawCursor();

      	if (debugOn) { drawDebug(); }
    }

    var clearCanvas = function() {
        drawContext.clearRect(0, 0, canvas.width, canvas.height);  
        context.clearRect(0, 0, canvas.width, canvas.height);  
    }

    var drawPlayers = function() {
        for (var p = 0; p < players.length; p++) {
            players[p].draw(context);
        }     
    }

    var drawMonsters = function() {
        for (var i = 0; i < monsters.length; i++) {
            monsters[i].draw(context);
        }
    }

    var drawBullets = function() {
        if (bullets != null) {
            for (var i = 0; i < bullets.length; i++) {
                bullets[i].draw(context, map);
            }
        }
    }

    var drawViewPorts = function() {
        drawContext.drawImage(gameCanvas, mainViewport.x, mainViewport.y, mainViewport.width, mainViewport.height, mainViewport.posX, mainViewport.posY, mainViewport.width, mainViewport.height);
        drawContext.drawImage(gameCanvas, playerViewPortOne.x, playerViewPortOne.y, playerViewPortOne.width, playerViewPortOne.height, playerViewPortOne.posX, playerViewPortOne.posY, playerViewPortOne.width, playerViewPortOne.height);
        drawContext.drawImage(gameCanvas, playerViewPortTwo.x, playerViewPortTwo.y, playerViewPortTwo.width, playerViewPortTwo.height, playerViewPortTwo.posX, playerViewPortTwo.posY, playerViewPortTwo.width, playerViewPortTwo.height);      
    }

    var drawButtons = function() {
        drawContext.fillStyle = '#0000FF';
        drawContext.fillRect(645, 205, 50, 20);
        drawContext.fillRect(645, 445, 50, 20);
    }

    var drawCursor = function() {
        drawContext.strokeStyle = '#FF0000';
        drawContext.beginPath();
        drawContext.arc(controls.mouseX, controls.mouseY, 5, 0, Math.PI * 2, false);
        drawContext.closePath();
        drawContext.stroke();
    }

    var drawDebug = function() {
	  	//drawContext.fillText('x: ' + Math.floor(mainViewport.x) + ' y: ' + Math.floor(mainViewport.y), 10, 10);
	   	//drawContext.fillText('x: ' + Math.floor(playerViewPortOne.x) + ' y: ' + Math.floor(playerViewPortOne.y), 645, 10);      	
	  	//drawContext.fillText('x: ' + Math.floor(playerViewPortTwo.x) + ' y: ' + Math.floor(playerViewPortTwo.y), 645, 175);
	  	//drawContext.fillText('x: ' + Math.floor(playerViewPortThree.x) + ' y: ' + Math.floor(playerViewPortThree.y), 645, 340);
	  	drawContext.fillText(controls.up, 30, 30);
	  	drawContext.fillText(controls.right, 45, 40);
	  	drawContext.fillText(controls.left, 15, 40);
	  	drawContext.fillText(controls.down, 30, 50);
	  	//drawContext.fillText('p1x: ' + Math.floor(playerOne.x) + ' p1y: ' + Math.floor(playerOne.y), 10, 70);
	  	drawContext.fillText('mx: ' + Math.floor(controls.mouseX) + ' my: ' + Math.floor(controls.mouseY), 10, 90);
	  	//drawContext.fillText('a: ' + -Math.floor(playerOne.angle * (180/Math.PI)), 10, 100);
	  	drawContext.fillText('tiles: ' + map.tilesX + ' x ' + map.tilesY, 10, 110)

	  	// Draw path
	  	for (var m = 0; m < monsters.length; m++) {
	  		if (monsters[m].path != null) {
	  			for (var i = 0; i < monsters[m].path.length; i++) {      			
	  				drawContext.fillText(monsters[m].path[i].f, ((monsters[m].path[i].x * 32) - mainViewport.x) + 16, ((monsters[m].path[i].y * 32) - mainViewport.y) + 16);
	  			}
	  		}	
	    }
    }

    // Game Loop
    var gameLoop = function(){                        
        update();
        draw();
    }    
    
    // <-- configure play/pause capabilities:
    
    // I'll use setInterval instead of requestAnimationFrame for compatibility reason,
    // but it's easy to change that.
    
    var runningId = -1;
    
    Game.play = function(){    
        if(runningId == -1){
            runningId = setInterval(function(){
                gameLoop();
            }, INTERVAL);
            console.log("play");
        }
    }
    
    Game.togglePause = function(){        
        if(runningId == -1){
            Game.play();
        }
        else
        {
            clearInterval(runningId);
            runningId = -1;
            console.log("paused");
        }
    }    

    Game.toggleFocus = function(){
    	if (controls.mouseX > playerViewPortOne.posX + 5 && controls.mouseY > playerViewPortOne.posY + 5 && controls.mouseX < playerViewPortOne.posX + 5 + playerViewPortOne.width && controls.mouseY < playerViewPortOne.posY + 5 + playerViewPortOne.height) {
    		var temp = mainViewport.focus;
    		mainViewport.focus.focus = false;
    		mainViewport.focus = playerViewPortOne.focus;
    		playerViewPortOne.focus.focus = true;
    		playerViewPortOne.focus = temp;
    		playerViewPortOne.focus.follow = false;
    		playerViewPortTwo.focus.follow = false;
    	}

    	if (controls.mouseX > playerViewPortTwo.posX + 5 && controls.mouseY > playerViewPortTwo.posY + 5 && controls.mouseX < playerViewPortTwo.posX + 5 + playerViewPortTwo.width && controls.mouseY < playerViewPortTwo.posY + 5 + playerViewPortTwo.height) {
    		var temp = mainViewport.focus;
    		mainViewport.focus.focus = false;
    		mainViewport.focus = playerViewPortTwo.focus;
    		playerViewPortTwo.focus.focus = true;
    		playerViewPortTwo.focus = temp;
    		playerViewPortOne.focus.follow = false;
    		playerViewPortTwo.focus.follow = false;
    	}    	
    }

    Game.clickFollow = function() {
    	if (controls.mouseX > 644 && controls.mouseX < 696 && controls.mouseY > 204 && controls.mouseY < 226) {
    		playerViewPortOne.focus.follow = !playerViewPortOne.focus.follow;
    	}
    	if (controls.mouseX > 644 && controls.mouseX < 696 && controls.mouseY > 444 && controls.mouseY < 466) {
    		playerViewPortTwo.focus.follow = !playerViewPortTwo.focus.follow;
    	}
    }

})();


// start the game when page is loaded
window.onload = function(){    
    Game.initialiseGame();
	Game.play();
}

