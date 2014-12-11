function PathFinder(map) {
    this.map = map;
    this.density = 500;
    this.startX = 0;
    this.startY = 0;
    this.destX = 0;
    this.destY = 0;
    this.openList = new Array();
    this.closedList = new Array();
    this.adjacentNodes = new Array();
    this.currentNode = null;
    this.currentIndex = 0
}

PathFinder.prototype.findPath = function(object, target) {
    // Initialise pathfinder
    this.startX = Math.floor((object.x + 1) / 32);
    this.startY = Math.floor((object.y + 1) / 32);

    this.destX = Math.floor((target.x + 1) / 32);
    this.destY = Math.floor((target.y + 1) / 32);

    this.openList = [];
    this.closedList = [];
    this.currentNode = null;
    this.currentIndex = 0;
    this.adjacentNodes = [];

    this.addStartNode(this.startX, this.startY, this.destX, this.destY);

    for (var attempts = 0; attempts < this.density; attempts++) {

        this.currentNode = this.closedList[this.closedList.length - 1]; // Make the currentNode the last one added to the closed list
        this.adjacentNodes = this.findAdjacentNodes(this.currentNode, this.destX, this.destY); // Find adjacent nodes

        // Validate new nodes for openlist
        for (var a = 0; a < this.adjacentNodes.length; a++) {
            if (!this.isOpenListEmpty()) {
                if (!this.isNodeInClosedList(this.adjacentNodes[a])) {
                    if (!this.isNodeinOpenList(this.adjacentNodes[a])) {
                        if (this.isTileValid(this.adjacentNodes[a])) {
                            this.addToOpenList(this.adjacentNodes[a]);      
                        }
                    }                       
                }
            } else {
                if (this.isTileValid(this.adjacentNodes[a])) {
                    this.addToOpenList(this.adjacentNodes[a]);      
                }
            }

            this.currentNode = this.getLowestFNode();
            this.currentIndex = this.getLowestFIndex();
        }

        // Add to closed list
        this.closedList.push(this.currentNode);

        // Remove from open list
        this.openList.splice(this.currentIndex, 1);

        // I can't remember what this is but its probably important
        if (this.currentNode == null) {
            return null;
        }

        if (this.isDestinationReached()) {
            var path = this.generatePath();

            return path.reverse();
        }
    }
}

PathFinder.prototype.isOpenListEmpty = function() {
     if (this.openList.length == 0) {
        return true;
    } else {
        return false;
    }
}

PathFinder.prototype.isNodeinOpenList = function(node) {
    for (var o = 0; o < this.openList.length; o++) { // Check node not in open list
        if (node.x == this.openList[o].x && node.y == this.openList[o].y) {  

             // If node is in open list then recalculate G and F
            if (node.f < this.openList[o].f) {
                this.openList[o] = node;
            }

            return true;
        } 
    }

    return false;
}

PathFinder.prototype.isTileValid = function(node) {
    switch (this.map[node.y][node.x]) {
        case 2:
        case 3:
            return false;
        break;
    }

    return true;
}

PathFinder.prototype.addToOpenList = function(node) {
     this.openList.push(node);
}

PathFinder.prototype.isNodeInClosedList = function(node) {
   for (var c = 0; c < this.closedList.length; c++) { // Check node not in closed list
        if (node.x == this.closedList[c].x && node.y == this.closedList[c].y) {
            return true;
        }
    }

    return false;
}

PathFinder.prototype.getLowestFNode = function() {
    var node = this.openList[0];
    for (var o = 1; o < this.openList.length; o++) {
        if (this.openList[o].f < node.f) {
            node = this.openList[o];
        }
    }

    return node;
}

PathFinder.prototype.getLowestFIndex = function() {
    var node = this.openList[0];
    var index = 0;
    for (var o = 1; o < this.openList.length; o++) {
        if (this.openList[o].f < this.openList[index].f) {
            index = o;
        }
    }

    return index;
}

PathFinder.prototype.isDestinationReached = function() {
    if (this.currentNode.x == this.destX && this.currentNode.y == this.destY) {
        return true;
    }

    return false;
}

PathFinder.prototype.generatePath = function() {
    var path = new Array();

     path.push(this.closedList[this.closedList.length - 1]);

    while(path[path.length - 1].parent.x != this.startX || path[path.length - 1].parent.y != this.startY) {
        path.push(path[path.length - 1].parent);
    }

    return path;
}

PathFinder.prototype.findAdjacentNodes = function() {
    var temp = new Array();

    temp.push(new Node(this.currentNode.x + 1, this.currentNode.y, 10, this.currentNode, this.destX, this.destY));
    temp.push(new Node(this.currentNode.x - 1, this.currentNode.y, 10, this.currentNode, this.destX, this.destY));
    temp.push(new Node(this.currentNode.x, this.currentNode.y + 1, 10, this.currentNode, this.destX, this.destY));
    temp.push(new Node(this.currentNode.x, this.currentNode.y - 1, 10, this.currentNode, this.destX, this.destY));

    if ((this.map[this.currentNode.y][this.currentNode.x + 1] != 3 || this.map[this.currentNode.y][this.currentNode.x + 1] != 2) && (this.map[this.currentNode.y + 1][this.currentNode.x] != 3 || this.map[this.currentNode.y + 1][this.currentNode.x] != 2)) {
        temp.push(new Node(this.currentNode.x + 1, this.currentNode.y + 1, 14, this.currentNode, this.destX, this.destY));
    }
    if ((this.map[this.currentNode.y][this.currentNode.x - 1] != 3 || this.map[this.currentNode.y][this.currentNode.x - 1] != 2) && (this.map[this.currentNode.y - 1][this.currentNode.x] != 3 || this.map[this.currentNode.y - 1][this.currentNode.x] != 2)) {
        temp.push(new Node(this.currentNode.x - 1, this.currentNode.y - 1, 14, this.currentNode, this.destX, this.destY));
    }
    if ((this.map[this.currentNode.y][this.currentNode.x - 1] != 3 || this.map[this.currentNode.y][this.currentNode.x - 1] != 2) && (this.map[this.currentNode.y + 1][this.currentNode.x] != 3 || this.map[this.currentNode.y + 1][this.currentNode.x] != 2)) {
        temp.push(new Node(this.currentNode.x - 1, this.currentNode.y + 1, 14, this.currentNode, this.destX, this.destY));
    }
    if ((this.map[this.currentNode.y][this.currentNode.x + 1] != 3 || this.map[this.currentNode.y][this.currentNode.x + 1] != 2) && (this.map[this.currentNode.y - 1][this.currentNode.x] != 3 || this.map[this.currentNode.y - 1][this.currentNode.x] != 2)) {
        temp.push(new Node(this.currentNode.x + 1, this.currentNode.y - 1, 14, this.currentNode, this.destX, this.destY));
    }

    return temp;
}

PathFinder.prototype.addStartNode = function(startX, startY, destX, destY) {
    this.closedList.push(new Node(this.startX, this.startY, 0, null, this.destX, this.destY));
}

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