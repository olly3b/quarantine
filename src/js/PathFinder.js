function PathFinder(map) {
    this.map = map;
}

PathFinder.prototype.findPath = function(object, target) {
    // Initialise pathfinder

    startVectorX = Math.floor((object.x + 1) / 32);
    startVectorY = Math.floor((object.y + 1) / 32);

    destVectorX = Math.floor((target.x + 1) / 32);
    destVectorY = Math.floor((target.y + 1) / 32);

    //destVectorX = Math.floor(target.x / 32);
    //destVectorY = Math.floor(target.y / 32);


    var closedList = new Array();
    var openList = new Array();

    closedList.push(new Node(startVectorX, startVectorY, 0, null, destVectorX, destVectorY)); // Add the start node to the closed list

    // Find path

    for (var attempts = 0; attempts < 500000; attempts++) {

        var currentNode = closedList[closedList.length - 1]; // Make the currentNode the last one added to the closed list
        var adjacentNodes = this.findAdjacentNodes(currentNode, destVectorX, destVectorY); // Final adjacent nodes

        // Validate new nodes for openlist
        for (var a = 0; a < adjacentNodes.length; a++) {
            var flag = false;

            for (var c = 0; c < closedList.length; c++) { // Check node not in closed list
                if (adjacentNodes[a].x == closedList[c].x && adjacentNodes[a].y == closedList[c].y) {
                    flag = true;
                }
            }

            if (openList.length > 0) { // Skip this if open list is empty
                for (var o = 0; o < openList.length; o++) { // Check node not in open list
                    if (adjacentNodes[a].x == openList[o].x && adjacentNodes[a].y == openList[o].y) {  
                        flag = true;

                         // If node is in open list then recalculate G and F
                        if (adjacentNodes[a].f < openList[o].f) {
                            openList[o] = adjacentNodes[a];
                        }
                    } 
                }
            }

            // Check map tile is valid for travel
            if (this.map[adjacentNodes[a].y][adjacentNodes[a].x] == 3) {
                flag = true;
            }

            // If all checks passed then add the node to the open list
            if (!flag) {
                openList.push(adjacentNodes[a]);
            }
        }

        // Find lowest F score
        currentNode = openList[0];
        var currentIndex = 0;
        for (var o = 1; o < openList.length; o++) {
            if (openList[o].f < currentNode.f) {
                currentNode = openList[o];
                currentIndex = o;
            }
        }

        // Add to closed list
        closedList.push(currentNode);

        // Remove from open list
        openList.splice(currentIndex, 1);

        // I can't remember what this is but its probably important
        if (currentNode == null) {
            return new Array();
        }

        // When the destination is reached calculate the path        
        if (currentNode.x == destVectorX && currentNode.y == destVectorY) {
            var path = new Array();

            path.push(closedList[closedList.length - 1]);

            while(path[path.length -1].parent.x != startVectorX || path[path.length - 1].parent.y != startVectorY) {
                path.push(path[path.length - 1].parent);
            }

            return path.reverse(); // Doesn't include starting node
        }
        
    }
}

PathFinder.prototype.findAdjacentNodes = function(currentNode, destVectorX, destVectorY) {
    var adjacentNodes = new Array();

    adjacentNodes.push(new Node(currentNode.x + 1, currentNode.y, 10, currentNode, destVectorX, destVectorY));
    adjacentNodes.push(new Node(currentNode.x - 1, currentNode.y, 10, currentNode, destVectorX, destVectorY));
    adjacentNodes.push(new Node(currentNode.x, currentNode.y + 1, 10, currentNode, destVectorX, destVectorY));
    adjacentNodes.push(new Node(currentNode.x, currentNode.y - 1, 10, currentNode, destVectorX, destVectorY));

    // if (this.map[currentNode.y][currentNode.x - 1] != 3 && this.map[currentNode.y][currentNode.x + 1] != 3 && this.map[currentNode.y + 1][currentNode.x] != 3 && this.map[currentNode.y - 1][currentNode.x] != 3) {
    //     adjacentNodes.push(new Node(currentNode.x - 1, currentNode.y + 1, 14, currentNode, destVectorX, destVectorY));
    //     adjacentNodes.push(new Node(currentNode.x + 1, currentNode.y + 1, 14, currentNode, destVectorX, destVectorY));
    //     adjacentNodes.push(new Node(currentNode.x - 1, currentNode.y - 1, 14, currentNode, destVectorX, destVectorY));
    //     adjacentNodes.push(new Node(currentNode.x - 1, currentNode.y - 1, 14, currentNode, destVectorX, destVectorY));
    // }

    // if (this.map[currentNode.y][currentNode.x - 1] != 3 && this.map[currentNode.y + 1][currentNode.x] != 3) {
    //     adjacentNodes.push(new Node(currentNode.x - 1, currentNode.y + 1, 14, currentNode, destVectorX, destVectorY));
    // }
    // if (this.map[currentNode.y][currentNode.x + 1] != 3 && this.map[currentNode.y - 1][currentNode.x] != 3) {
    //     adjacentNodes.push(new Node(currentNode.x + 1, currentNode.y - 1, 14, currentNode, destVectorX, destVectorY));
    // }


    //  if (this.map[currentNode.y][currentNode.x - 1] != 3 && this.map[currentNode.y - 1][currentNode.x] != 3) {
    //     adjacentNodes.push(new Node(currentNode.x - 1, currentNode.y - 1, 14, currentNode, destVectorX, destVectorY));
    // }

    //  if (this.map[currentNode.y][currentNode.x + 1] != 3 && this.map[currentNode.y + 1][currentNode.x] != 3) {
    //     adjacentNodes.push(new Node(currentNode.x + 1, currentNode.y + 1, 14, currentNode, destVectorX, destVectorY));
    // }   


    if (this.map[currentNode.y][currentNode.x + 1] != 3 && this.map[currentNode.y + 1][currentNode.x] != 3) {
        adjacentNodes.push(new Node(currentNode.x + 1, currentNode.y + 1, 14, currentNode, destVectorX, destVectorY));
    }
    if (this.map[currentNode.y][currentNode.x - 1] != 3 && this.map[currentNode.y - 1][currentNode.x] != 3) {
        adjacentNodes.push(new Node(currentNode.x - 1, currentNode.y - 1, 14, currentNode, destVectorX, destVectorY));
    }
    if (this.map[currentNode.y][currentNode.x - 1] != 3 && this.map[currentNode.y + 1][currentNode.x] != 3) {
        adjacentNodes.push(new Node(currentNode.x - 1, currentNode.y + 1, 14, currentNode, destVectorX, destVectorY));
    }
    if (this.map[currentNode.y][currentNode.x + 1] != 3 && this.map[currentNode.y - 1][currentNode.x] != 3) {
        adjacentNodes.push(new Node(currentNode.x + 1, currentNode.y - 1, 14, currentNode, destVectorX, destVectorY));
    }

    return adjacentNodes;
};

function Node(x, y, g, parent, dX, dY) {
    this.x = x;
    this.y = y;

    this.parent = parent;

    this.g = this.calculateG(g);
    this.h = this.calculateH(dX, dY);
    this.f = this.calculateF();  
}

Node.prototype.calculateG = function(g) {
    if (this.parent != null) {
        return g + this.parent.g;
    } else {
        return g;
    }
}

Node.prototype.calculateH = function(dX, dY) {
    var hX = (this.x - dX) * 10;
    if (hX < 0) { hX = -hX; }

    var hY = (this.y - dY) * 10;
    if (hY < 0) { hY = -hY; }

    return hX + hY;;
}

Node.prototype.calculateF = function() {
    return this.g + this.h;
}
