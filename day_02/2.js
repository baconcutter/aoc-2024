const { log } = require('console');
const fs = require('fs');

const allFileContents = fs.readFileSync('input.txt', 'utf-8');
const reports = allFileContents
    .split(/\r?\n/)
    .map(r => r
        .split(' ')
        .map(x => parseInt(x))
    );


function isSafe(r) {
    let increasing = r[1] >= r[0];

    for (let x = 1; x < r.length; x++) {
        const prefV = r[x - 1];
        const v = r[x];
        const diff = increasing ? v - prefV : prefV - v;
        if (diff < 1 || diff > 3) {
            return false;
        }
    }
    return true;
}

// part 1

let part1 = 0;
for (let i = 0; i < reports.length; i++) {
    if (isSafe(reports[i])) {
        part1++;
    }
}
log(part1);

// part 2
let part2 = 0;
reportLoop: for (let i = 0; i < reports.length; i++) {
    const r = reports[i];

    for (let x = 0; x < r.length; x++) {
        const copy = r.toSpliced(x, 1);
        if (isSafe(r) || isSafe(copy)) {
            part2++;
            continue reportLoop;
        }
    }
}
log(part2);

