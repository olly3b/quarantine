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
    
    var mainViewport = new Viewport(5, 5, 640, 480);
    var playerViewPortOne = new Viewport (650, 5, 200, 200);
    var playerViewPortTwo = new Viewport (650, 245, 200, 200);

    var players = new Array();
    var monsters = new Array();
    var bullets = new Array();
    var spawners = new Array();  

    Game.buttons = new Array();
    Game.buttons.push(new Button(652, 210, 95, 20, 'img/follow.png')); // Follow 1
    Game.buttons.push(new Button(652, 450, 95, 20, 'img/follow.png')); // Follow 2
    Game.buttons.push(new Button(752, 210, 95, 20, 'img/ai.png')); // AI 1
    Game.buttons.push(new Button(752, 450, 95, 20, 'img/ai.png')); // AI 2

    var invX = new Array();
    var invY = new Array();
    invX.push(79);
    invY.push(490);

    invX.push(111);
    invY.push(490);

    invX.push(142);
    invY.push(490);

    invX.push(79);
    invY.push(522);

    invX.push(111);
    invY.push(522);

    invX.push(142);
    invY.push(522);

    var cursorItem = null;

    var pathFinder = new PathFinder(map.dynamicMap);;
    
    var spriteSheet = new Image();
    spriteSheet.src = 'img/spritesheet.png';
    var animations = new Array();
    animations.push(new Animation(true)); // Player standing // 0
    animations[animations.length - 1].addFrame(0, 0, 32, 32, 1);
    animations.push(new Animation(true)); // Player walking // 1
    animations[animations.length - 1].addFrame(32, 0, 32, 32, 7);
    animations[animations.length - 1].addFrame(64, 0, 32, 32, 7);
    animations.push(new Animation(true)); // Player aiming // 2
    animations[animations.length - 1].addFrame(96, 0, 32, 32, 1);
    animations.push(new Animation(false)); // Player shooting // 3
    animations[animations.length - 1].addFrame(128, 0, 32, 32, 20);    
    animations[animations.length - 1].addFrame(96, 0, 32, 32, 30);
    animations.push(new Animation(true)); // Monster standing // 4
    animations[animations.length - 1].addFrame(0, 96, 32, 32, 1);
    animations.push(new Animation(true)); // Monster walking  // 5
    animations[animations.length - 1].addFrame(32, 96, 32, 32, 7);
    animations[animations.length - 1].addFrame(64, 96, 32, 32, 7);

    var gunSound = new Array();
    gunSound.push(new Audio('sound/pistol.mp3'));
    gunSound.push(new Audio('sound/pistol.mp3'));
    gunSound.push(new Audio('sound/pistol.mp3'));

    var zombieSounds = new Array();
    zombieSounds.push(new Audio('sound/zombie1.mp3'));
    zombieSounds.push(new Audio('sound/zombie2.mp3'));
    zombieSounds.push(new Audio('sound/zombie3.mp3'));
    zombieSounds.push(new Audio('sound/zombie4.mp3'));
    zombieSounds.push(new Audio('sound/zombie5.mp3'));

	spawners.push(new Spawner(1, 1));
	spawners.push(new Spawner(1, 2));
	spawners.push(new Spawner(1, 27));
	spawners.push(new Spawner(1, 28));

    var debugOn = false;

    // Game update function
    var update = function(){
    	updateViewPorts();
        updateControlledPlayer();
        updateAIPlayers();    	
        updateMonsters();    	
    	updateBullets();
    	updateSpawners();	
        updateButtons();
    }

    Game.initialiseGame = function() {
        players.push(new Player ('Zara', 416, 616, 0));
        players.push(new Player ('Lila', 416, 584, 1));
        players.push(new Player ('Nico', 416, 552, 2));

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
            gunSound[0].play();
        }
    }
        
    var updateAIPlayers = function() {
        for (var p = 0; p < players.length; p++) {
            if (players[p].update(STEP, mainViewport, pathFinder, monsters, p, animations, map)) {
                bullets[bullets.length] = new Bullet(players[p], Math.cos(players[p].angle + 1.57079633), Math.sin(players[p].angle + 1.57079633));
                gunSound[p].play();
            }
        }
    }

    var updateMonsters = function() {
        if (monsters.length != 0) {
            for (var m = 0; m < monsters.length; m++) {
                monsters[m].update(STEP, players, pathFinder, animations, zombieSounds);
                if (monsters[m].alive == false) {
                    monsters.splice(m, 1);
                }
            }
        }
    }

    var updateBullets = function() {
        if (bullets.length != 0) {
            for (var i = 0; i < bullets.length; i++) {
                if (bullets[i].update(monsters, STEP, map)) {
                    buttons.splice(i, 1);
                }
            }
        }
    }

    var updateSpawners = function() {
        for (var s = 0; s < spawners.length; s++) {
            if (spawners[s].update()) {
                monsters.push(new Monster(spawners[s].x * 32, spawners[s].y * 32, 'img/monster.png'))
            }
        }       
    }

    var updateButtons = function() {
        for (var b = 0; b < Game.buttons.length; b++) {
            Game.buttons[b].update(controls.mouseX, controls.mouseY);
        }
    }

    // Game draw function
    var draw = function() {
        clearCanvas();        
      	map.draw(context);
        drawPlayers();
        drawMonsters();
        drawBullets();
        drawInterface();
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
            players[p].draw(context, spriteSheet, animations);
        }     
    }

    var drawMonsters = function() {
        for (var i = 0; i < monsters.length; i++) {
            monsters[i].draw(context, spriteSheet, animations);
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
        for (var b = 0; b < Game.buttons.length; b++) {
            Game.buttons[b].draw(drawContext);
            drawContext.font = '18px Verdana';
            drawContext.fillStyle = '#FFFFFF'
            if (b == 0) {
                drawContext.fillText('Follow', 674, 227);
            }
            if (b == 1) {
                drawContext.fillText('Follow', 674, 467);
            }
            if (b == 2) {
                drawContext.fillText('AI', 785, 227);
            }
            if (b == 3) {
                drawContext.fillText('AI', 785, 467);
            }
        }
        drawContext.font = '12px Verdana';
    }

    var drawCursor = function() {
        if (cursorItem != null) {
            drawContext.fillStyle = '#000000';
            drawContext.drawImage(spriteSheet, cursorItem.imageX, cursorItem.imageY, 32, 32, controls.mouseX - 16, controls.mouseY - 16, 32, 32);                    
            drawContext.fillText(cursorItem.ammo, controls.mouseX - 1, controls.mouseY + 14);
        } else {
            drawContext.strokeStyle = '#FF0000';
            drawContext.beginPath();
            drawContext.arc(controls.mouseX + 6, controls.mouseY + 6, 16, 0, Math.PI * 2, false);
            drawContext.closePath();
            drawContext.stroke();
        }
    }

    var drawInterface = function() {
        // Background
        drawContext.fillStyle = '#BBBBBB';
        drawContext.fillRect(0, 0, 1280, 600);

        drawContext.strokeStyle = '#000000';
        // Main focus equipped
        drawContext.strokeRect(10, 490, 64, 64);

        // Main focus invenory
        drawContext.strokeRect(79, 490, 32, 32);
        drawContext.strokeRect(79, 522, 32, 32);
        drawContext.strokeRect(111, 490, 32, 32);
        drawContext.strokeRect(111, 522, 32, 32);
        drawContext.strokeRect(143, 490, 32, 32);
        drawContext.strokeRect(143, 522, 32, 32);

        // Player one viewport equipped
        drawContext.strokeRect(855, 141, 64, 64);

        // Player two viewport equipped
        drawContext.strokeRect(855, 379, 64, 64);

        drawContext.fillStyle = '#000000';
        // Main viewport equipped item
        if (mainViewport.focus.equipped != null) {
            if (mainViewport.focus.equipped.itemType = 'weapon') {
                if (mainViewport.focus.equipped.itemName == 'pistol') {
                    drawContext.drawImage(spriteSheet, 0, 128, 32, 32, 10, 491, 64, 64);
                }
                drawContext.fillText(mainViewport.focus.equipped.ammo, 55, 550);
            }
        }

        // Main viewport inventory
        for (var i = 0; i < 3; i++) {
            if (mainViewport.focus.inventory[i] != null) {
                if (mainViewport.focus.inventory[i].itemType = 'ammo') {
                    if (mainViewport.focus.inventory[i].itemName == 'pistol') {
                        drawContext.drawImage(spriteSheet, 32, 128, 32, 32, 79 + (i * 32), 490, 32, 32);
                    }
                    drawContext.fillText(mainViewport.focus.inventory[i].ammo, 94 + (i * 32), 520);
                }
            }
        }
        for (var i = 3; i < 6; i++) {
            if (mainViewport.focus.inventory[i] != null) {
                if (mainViewport.focus.inventory[i].itemType = 'ammo') {
                    if (mainViewport.focus.inventory[i].itemName == 'pistol') {
                        drawContext.drawImage(spriteSheet, 32, 128, 32, 32, 79 + ((i - 3) * 32), 522, 32, 32);
                    }
                     drawContext.fillText(mainViewport.focus.inventory[i].ammo, 94 + ((i - 3) * 32), 552);
                }
            }
        }

          // Player one viewport equipped item
        if (playerViewPortOne.focus.equipped != null) {
            if (playerViewPortOne.focus.equipped.itemType = 'weapon') {
                if (playerViewPortOne.focus.equipped.itemName == 'pistol') {
                    drawContext.drawImage(spriteSheet, 0, 128, 32, 32, 855, 141, 64, 64);                    
                }
                drawContext.fillText(playerViewPortOne.focus.equipped.ammo, 900, 201);
            }
        }

          // player two viewport equipped item
        if (playerViewPortTwo.focus.equipped != null) {
            if (playerViewPortTwo.focus.equipped.itemType = 'weapon') {
                if (playerViewPortTwo.focus.equipped.itemName == 'pistol') {
                    drawContext.drawImage(spriteSheet, 0, 128, 32, 32, 855, 379, 64, 64);
                }
                drawContext.fillText(playerViewPortTwo.focus.equipped.ammo, 900, 439);
            }
        }
    }

    var drawDebug = function() {
        drawContext.fillStyle = '#000000';
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
        drawContext.fillStyle = '#00FF00';
	  	for (var m = 0; m < monsters.length; m++) {
	  		if (monsters[m].path != null) {
	  			for (var i = 0; i < monsters[m].path.length; i++) {      			
	  				drawContext.fillText(monsters[m].path[i].f, ((monsters[m].path[i].x * 32) - mainViewport.x) + 16, ((monsters[m].path[i].y * 32) - mainViewport.y) + 16);
	  			}
	  		}	
	    }

        drawContext.fillStyle = '#0000FF';
        for (var p = 0; p < players.length; p++) {
            if (players[p].path != null) {
                for (var i = 0; i < players[p].path.length; i++) {                 
                    drawContext.fillText(players[p].path[i].f, ((players[p].path[i].x * 32) - mainViewport.x) + 16, ((players[p].path[i].y * 32) - mainViewport.y) + 16);
                }
            }   
        }

        for(var y = 0; y < map.dynamicMap.length ; y++) {
            for(var x = 0; x < map.dynamicMap[y].length; x++) {
            
                var tile = map.dynamicMap[y][x];
                switch (tile) {
                    case 2:
                        drawContext.strokeStyle = '#00FF00';
                        drawContext.strokeRect((x * 32) - mainViewport.x + mainViewport.posX, (y * 32) - mainViewport.y + mainViewport.posY, 32, 32);
                    break;
                    case 3:
                        drawContext.strokeStyle = '#FF0000';
                        drawContext.strokeRect((x * 32) - mainViewport.x + mainViewport.posX, (y * 32) - mainViewport.y + mainViewport.posY, 32, 32);
                    break;
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
    	if (controls.mouseX > playerViewPortOne.posX && controls.mouseY > playerViewPortOne.posY && controls.mouseX < playerViewPortOne.posX + playerViewPortOne.width && controls.mouseY < playerViewPortOne.posY + playerViewPortOne.height) {
    		mainViewport.focus.currentViewPort = 1;
            playerViewPortOne.focus.currentViewPort = 0;
            var temp = mainViewport.focus;
    		mainViewport.focus.focus = false;
    		mainViewport.focus = playerViewPortOne.focus;
    		playerViewPortOne.focus.focus = true;
    		playerViewPortOne.focus = temp;
    		playerViewPortOne.focus.follow = false;
    		playerViewPortTwo.focus.follow = false;
            Game.buttons[0].on = playerViewPortOne.focus.follow;
            Game.buttons[2].on = playerViewPortOne.focus.ai;
    	}

    	if (controls.mouseX > playerViewPortTwo.posX && controls.mouseY > playerViewPortTwo.posY && controls.mouseX < playerViewPortTwo.posX + playerViewPortTwo.width && controls.mouseY < playerViewPortTwo.posY + playerViewPortTwo.height) {
            mainViewport.focus.currentViewPort = 2;
            playerViewPortTwo.focus.currentViewPort = 0;
    		var temp = mainViewport.focus;
    		mainViewport.focus.focus = false;
    		mainViewport.focus = playerViewPortTwo.focus;
    		playerViewPortTwo.focus.focus = true;
    		playerViewPortTwo.focus = temp;
    		playerViewPortOne.focus.follow = false;
    		playerViewPortTwo.focus.follow = false;
            Game.buttons[1].on = playerViewPortTwo.focus.follow;
            Game.buttons[3].on = playerViewPortTwo.focus.ai;
    	}    	
    }

    Game.checkButtonClick = function() {
        for (var b = 0; b < Game.buttons.length; b++) {
            if (controls.mouseX > Game.buttons[b].x && controls.mouseX < Game.buttons[b].x + Game.buttons[b].width) {
                if (controls.mouseY > Game.buttons[b].y && controls.mouseY < Game.buttons[b].y + Game.buttons[b].height) {
                    Game.buttons[b].clicked();

                    switch (b) {
                        case 0:
                            playerViewPortOne.focus.follow = !playerViewPortOne.focus.follow;
                        break;
                        case 1:
                            playerViewPortTwo.focus.follow = !playerViewPortTwo.focus.follow;
                        break;
                        case 2:
                            playerViewPortOne.focus.ai = !playerViewPortOne.focus.ai;
                        break;
                        case 3:
                            playerViewPortTwo.focus.ai = !playerViewPortTwo.focus.ai;
                        break;
                    }
                }
            }
        }
        
        for (var i = 0; i < 6; i++) {
            if (controls.mouseX > invX[i] && controls.mouseX < invX[i] + 32 && controls.mouseY > invY[i] && controls.mouseY < invY[i] + 32) {
                if (cursorItem != null) {
                    if (mainViewport.focus.inventory[i] == null) {
                        mainViewport.focus.inventory[i] = cursorItem;
                        cursorItem = null;
                    } else {
                        if (cursorItem.itemType == 'ammo' && mainViewport.focus.inventory[i].itemType == 'ammo') {
                            if (cursorItem.itemName == 'pistol' && mainViewport.focus.inventory[i].itemName == 'pistol') {
                                if (mainViewport.focus.inventory[i].ammo > mainViewport.focus.inventory[i].clipSize) {
                                    cursorItem.ammo += mainViewport.focus.inventory[i].clipSize;
                                    mainViewport.focus.inventory[i].ammo -= mainViewport.focus.inventory[i].clipSize;
                                } else {
                                    cursorItem.ammo += mainViewport.focus.inventory[i].ammo;
                                    mainViewport.focus.inventory[i] = null;
                                }
                            }
                        }
                    }
                } else {
                    if (mainViewport.focus.inventory[i] != null) {
                        if (mainViewport.focus.inventory[i].itemType == 'ammo') {
                            if (mainViewport.focus.inventory[i].ammo > mainViewport.focus.inventory[i].clipSize) {
                                mainViewport.focus.inventory[i].ammo -= mainViewport.focus.inventory[i].clipSize;
                                cursorItem = new Item('ammo', mainViewport.focus.inventory[i].itemName);
                            } else {
                                cursorItem = mainViewport.focus.inventory[i];
                                mainViewport.focus.inventory[i] = null;
                            }
                        } else {
                            cursorItem = mainViewport.focus.inventory[i];
                            mainViewport.focus.inventory[i] = null;
                        }
                    }
                }
            }      
        }

        if (controls.mouseX > 10 && controls.mouseX < 74 && controls.mouseY > 491 && controls.mouseY < 555) {
            if (cursorItem.itemType == 'ammo' && mainViewport.focus.equipped.itemType == 'weapon') {
                if (cursorItem.itemName == 'pistol' && mainViewport.focus.equipped.itemName == 'pistol') {
                    var t = mainViewport.focus.equipped.clipSize - mainViewport.focus.equipped.ammo;
                    if (cursorItem.ammo > t) {
                        cursorItem.ammo -= t;
                        mainViewport.focus.equipped.ammo += t;
                    } else {
                        mainViewport.focus.equipped.ammo += cursorItem.ammo;
                        cursorItem = null;
                    }                
                }

            }
        }
    }
})();


// start the game when page is loaded
window.onload = function(){    
    Game.initialiseGame();
	Game.play();
}

