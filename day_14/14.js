const fs = require('fs');
const {log} = require('console');

const robots = fs.readFileSync('input.txt', 'utf-8')
    .split('\n')
    .map(robot => robot
        .split(' ')
        .map(x => x
            .substring(2)
            .split(',')
            .map(p => parseInt(p))
        ));

// 101 tiles wide and 103 tiles tall (when viewed from above).
// 11 tiles wide and 7 tiles tall.

const cols = 101;
const rows = 103;

function print(positions) {
    for (let r = 0; r < rows; r++) {
        let str = '';
        for (let c = 0; c < cols; c++) {
            const robots = positions.filter(po => po[0] === c && po[1] === r).length;
            str += robots ? robots : '.';
        }
        log(str);
    }
}

// JS fix for negative modoulos
function mod(n, m) {
    return ((n % m) + m) % m;
}

function calcQuadrants(positions) {
    return [
        calcQuadrant(positions, 0, Math.floor(cols / 2) - 1, 0, Math.floor(rows / 2) - 1),
        calcQuadrant(positions, Math.ceil(cols / 2), cols, 0, Math.floor(rows / 2) - 1),
        calcQuadrant(positions, 0, Math.floor(cols / 2) - 1, Math.ceil(rows / 2), rows),
        calcQuadrant(positions, Math.ceil(cols / 2), cols, Math.ceil(rows / 2), rows),
    ];
}


let positions = [];
for (let [p, v] of robots) {
    positions.push([mod(p[0] + v[0] * 100, cols), mod(p[1] + v[1] * 100, rows)]);
}

function calcQuadrant(positions, xmin, xmax, ymin, ymax) {
    return positions
        .filter(
            ([x, y]) => x >= xmin && x <= xmax && y >= ymin && y <= ymax
        )
        .length
}

const part1 = calcQuadrants(positions).reduce((a, b) => a * b);

log(part1);

// every robot is on the same position again after rows * cols turns
let number = rows * cols;
for (let i = 0; i < number; i++) {
    let positions = [];
    for (let [p,v ] of robots) {
        positions.push([mod(p[0] + v[0] * i, cols), mod(p[1] + v[1] * i, rows)]);
    }

    const qs = calcQuadrants(positions);

    // first try was assuming that the tree would cover the whole grid, so symmetrical quadrants. that is not the case, so
    // assuming that the tree is in one quadrant.
    if(qs[0] > qs[1] + qs[2] + qs[3] ||
        qs[1] > qs[0] + qs[2] + qs[3] ||
        qs[2] > qs[1] + qs[0] + qs[3] ||
        qs[3] > qs[1] + qs[2] + qs[0]){
        console.log(`=== ${i} ===`);
        print(positions);
    }
}