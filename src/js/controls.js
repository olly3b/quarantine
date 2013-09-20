 // <-- configure Game controls:

    controls = {
        left: false,
        up: false,
        right: false,
        down: false,
        space: false,
        mouseX: 0,
        mouseY: 0
    };

    window.addEventListener("keydown", function(e){
        switch(e.keyCode)
        {
            case 32:
                controls.space = true;
            break;
            case 37: // left arrow
            case 65:
                controls.left = true;
                break;
            case 38: // up arrow
            case 87:
                controls.up = true;
                break;
            case 39: // right arrow
            case 68:
                controls.right = true;
                break;
            case 40: // down arrow
            case 83:
                controls.down = true;
                break;
        }
    }, false);

    window.addEventListener("keyup", function(e){
        switch(e.keyCode)
        {
            case 32:
                controls.space = false;
            break;
            case 37: // left arrow
            case 65:
                controls.left = false;
                break;
            case 38: // up arrow
            case 87:
                controls.up = false;
                break;
            case 39: // right arrow
            case 68:
                controls.right = false;
                break;
            case 40: // down arrow
            case 83:
                controls.down = false;
                break;            
            case 80: // key P pauses the game
                togglePause();
                break;        
        }
    }, false);

    window.addEventListener("mousemove", function(e){
        controls.mouseX = e.clientX;
        controls.mouseY = e.clientY;
    }, false);

    window.addEventListener("mousedown", function(e) {
        Game.toggleFocus();
        Game.clickFollow();
    }, false);