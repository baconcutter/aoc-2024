const fs = require('fs');
const {log} = require('console');

const lines = fs.readFileSync('input.txt', 'utf-8').split('\n');

let start, end;
for (let r = 0; r < lines.length; r++) {
    for (let c = 0; c < lines[r].length; c++) {
        if (lines[r][c] === 'E') {
            end = [r, c];
        }
        if (lines[r][c] === 'S') {
            start = [r, c];
        }
    }
}

const getAdjacentFields = (r, c) => {
    return [
        [r - 1, c, 'NORTH'],
        [r + 1, c, 'SOUTH'],
        [r, c - 1, 'WEST'],
        [r, c + 1, 'EAST']
    ];
}
const isAccessible = (r, c) => lines[r][c] !== '#'

const calcCosts = (d, cd) => {
    if (d === cd) {
        return 1;
    } else {
        if (cd === 'NORTH' || cd === 'SOUTH') {
            if (d === 'WEST' || d === 'EAST') {
                return 1001;
            }
            return 2002;
        } else if (cd === 'WEST' || cd === 'EAST') {
            if (d === 'NORTH' || d === 'SOUTH') {
                return 1001;
            }
            return 2002;
        }
    }
    throw 'raar';
}
const k = (r, c) => `${r}-${c}`;
const kd = (r, c, d) => `${r}-${c}-${d}`;

//map coord: mincosts
let seen = {};
seen[kd(start[0], start[1], 'EAST')] = 0;

let queue = [];

getAdjacentFields(start[0], start[1])
    .forEach(([r, c, d]) => {
        if (isAccessible(r, c)) {
            queue.push([r, c, d, calcCosts(d, 'EAST'), [k(start[0], start[1])]]);
        }
    });
queue.sort((a, b) => a[3] - b[3]);

let minCosts = Infinity;
let costs = [];
while (queue.length) {
    const [r, c, d, cost, path] = queue.shift();
    if (cost > seen[k(r, c, d)] ?? Infinity) continue;
    seen[kd(r, c, d)] = cost;

    if (r === end[0] && c === end[1]) {
        if (cost > minCosts) {
            break;
        }
        minCosts = cost;
        costs.push([cost, path]);
        continue;
    }
    getAdjacentFields(r, c)
        .forEach(([afr, afc, afd]) => {
            let afdDCost = calcCosts(afd, d);

            if (isAccessible(afr, afc) && afdDCost < 2000) {
                const costToAf = cost + afdDCost;
                let minCostsToAf = seen[k(afr, afc, afd)] ?? Infinity;

                if (costToAf <= minCostsToAf) {
                    queue.push([
                        afr,
                        afc,
                        afd,
                        costToAf,
                        [...path, k(afr, afc)]
                    ]);
                }
            }
        });
    queue.sort((a, b) => a[3] - b[3]);
}

console.log('part1', minCosts);

// console.log(costs);

let paths = new Set();
costs.forEach(c => {
    c[1].forEach(coord => {
        paths.add(coord)
    });
})
console.log('part2', paths.size + 1);
// TODO complete part 2