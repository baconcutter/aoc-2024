const fs = require('fs');
const {log} = require('console');

const bytes = fs.readFileSync('input.txt', 'utf-8').split('\n').map(line => line.split(',').map(x => parseInt(x)));

const cols = 70;
const rows = 70;
let walls = bytes.slice(0, 1024);
const start = {
    row: 0,
    col: 0,
    g: 0,
    h: 140,
    f: 0
};
const end = {
    row: 70,
    col: 70,
    g: 0,
    h: 0,
    f: 0
};

// A* pathfinding algorithm
function astar(start, end) {
    const openSet = [];
    const closedSet = [];
    openSet.push(start);

    while (openSet.length > 0) {
        // Find the node with the lowest total cost in the open set
        let currentNode = openSet[0];
        for (let i = 1; i < openSet.length; i++) {
            if (openSet[i].f < currentNode.f || (openSet[i].f === currentNode.f && openSet[i].h < currentNode.h)) {
                currentNode = openSet[i];
            }
        }

        // Remove the current node from the open set
        openSet.splice(openSet.indexOf(currentNode), 1);
        closedSet.push(currentNode);

        // If the current node is the goal, reconstruct the path
        if (currentNode.row === end.row && currentNode.col === end.col) {
            let path = [];
            let temp = currentNode;
            while (temp) {
                path.push(temp);
                temp = temp.parent;
            }
            return path.reverse();
        }

        // Generate neighbors of the current node
        const neighbors = [];
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // Right, Down, Left, Up

        for (let dir of directions) {
            const neighborRow = currentNode.row + dir[0];
            const neighborCol = currentNode.col + dir[1];

            if (isValidCell(neighborRow, neighborCol)) {
                const neighbor = {
                    row: neighborRow,
                    col: neighborCol,
                    g: currentNode.g + 1, // Cost to move to a neighboring cell is 1
                    h: heuristic({row: neighborRow, col: neighborCol}, end),
                    f: 0,
                    parent: currentNode,
                };

                neighbor.f = neighbor.g + neighbor.h;

                // Check if the neighbor is already in the closed set
                if (closedSet.some((node) => node.row === neighbor.row && node.col === neighbor.col)) {
                    continue;
                }

                // Check if the neighbor is already in the open set
                const openSetNode = openSet.find((node) => node.row === neighbor.row && node.col === neighbor.col);
                if (!openSetNode || neighbor.g < openSetNode.g) {
                    openSet.push(neighbor);
                }
            }
        }
    }
}

// Helper function to calculate the heuristic (Manhattan distance)
function heuristic(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// Helper function to check if a cell is valid and not an obstacle
function isValidCell(row, col) {
    if (row < 0 || row > rows || col < 0 || col > cols) {
        return false;
    }
    return !walls.some(([r, c]) => r === row && c === col);
}


// console.log(bytes);
// console.log(walls);
let path = astar(start, end);
console.log('part 1', path.length - 1);
// for (let p of path) {
//     console.log(p.row,p.col)
// }

let wallsEnd = 1025;
while (true) {
    console.log(wallsEnd);
    walls = bytes.slice(0, wallsEnd);
    if (!astar(start, end)) {
        break;
    }
    wallsEnd++;
}

console.log('part 2', bytes[wallsEnd - 1]);
