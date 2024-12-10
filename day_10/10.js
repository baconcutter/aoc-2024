const fs = require('fs');
const {log} = require('console');

const lines = fs.readFileSync('input.txt', 'utf-8').split('\n');

const trailheads = [];

for (let r = 0; r < lines.length; r++) {
    for (let c = 0; c < lines[r].length; c++) {
        if (lines[r][c] === '0') {
            trailheads.push([c, r]);
        }
    }
}

const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

function isInBounds(nextC, nextR) {
    return nextC >= 0 && nextR >= 0 && nextC < lines[0].length && nextR < lines.length;
}

function getScore(trailhead, distinct) {
    let score = [];
    let queue = directions.map(d => [...trailhead, trailhead[0] + d[0], trailhead[1] + d[1]]);
    while (queue.length > 0) {
        let [c, r, nextC, nextR] = queue.shift();
        if (isInBounds(nextC, nextR) && parseInt(lines[nextR][nextC]) - parseInt(lines[r][c]) === 1) {
            if (lines[nextR][nextC] === '9') {
                score.push(`${nextC}-${nextR}`);
            } else {
                directions.forEach(d => queue.push([nextC, nextR, nextC + d[0], nextR + d[1]]))
            }
        }
    }
    if (distinct) {
        return score.length;
    } else {
        return new Set(score).size;
    }
}

let part1 = 0;
for (let trailhead of trailheads) {
    part1 += getScore(trailhead, false);
}
log(part1);

let part2 = 0;
for (let trailhead of trailheads) {
    part2 += getScore(trailhead, true);
}
log(part2);