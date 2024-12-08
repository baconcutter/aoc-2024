const fs = require('fs');
const {log} = require('console');

let lines = fs.readFileSync('input.txt', 'utf-8').split('\n');

function findPosition() {
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[0].length; j++) {
            if (lines[i][j] === '^') {
                return [j, i];
            }
        }
    }
}

let [columnStart, rowStart] = findPosition();
let [columnCurrent, rowCurrent] = [columnStart, rowStart];
let [columnDirection, rowDirection] = [0, -1];

let visited = new Set();

const key = (c, r) => `${c},${r}`;
visited.add(key(columnStart, rowStart));
while (true) {
    let [columnNext, rowNext] = [columnCurrent + columnDirection, rowCurrent + rowDirection];

    if (columnNext < 0 || rowNext < 0 || columnNext >= lines[0].length || rowNext >= lines.length) {
        break;
    }
    if (lines[rowNext][columnNext] === '#') {
        // turn right
        [columnDirection, rowDirection] = [-rowDirection, columnDirection];
    } else {
        visited.add(key(columnNext, rowNext));
        [columnCurrent, rowCurrent] = [columnNext, rowNext];
    }
}
log(visited.size);

function isEndless(columnStart, rowStart, columnDirection, rowDirection, grid) {
    let [columnCurrent, rowCurrent] = [columnStart, rowStart];
    let visited = {};
    visited[key(columnStart, rowStart)] = [[columnDirection, rowDirection]];

    while (true) {
        let [columnNext, rowNext] = [columnCurrent + columnDirection, rowCurrent + rowDirection];

        if (columnNext < 0 || rowNext < 0 || columnNext >= lines[0].length || rowNext >= lines.length) {
            return false;
        }
        if (grid[rowNext][columnNext] === '#') {
            // turn right
            [columnDirection, rowDirection] = [-rowDirection, columnDirection];
        } else {
            let k = key(columnNext, rowNext);
            let dk = key(columnDirection, rowDirection);
            if (visited[k]) {
                if (visited[k].includes(dk)) {
                    // loop confirmed
                    return true;
                }
                visited[k].push(dk);
            } else {
                visited[k] = [dk];
            }
            [columnCurrent, rowCurrent] = [columnNext, rowNext];
        }
    }
}

// part 2
let blocks = new Set();
// change every visited coordinate (except start) to # and check if it results in a loop.
for (let k of visited) {
    const [c, r] = k.split(',').map(x => parseInt(x))

    if (!(c === columnStart && r === rowStart)) {
        // clone grid with added # on next direction and check isEndless
        const copy = JSON.parse(JSON.stringify(lines));
        copy[r] = copy[r].slice(0, c) + '#' + copy[r].slice(c + 1);

        if (isEndless(columnStart, rowStart, -1, 0, copy)) {
            blocks.add(key(c, r));
        }
    }
}
console.log(blocks.size);
