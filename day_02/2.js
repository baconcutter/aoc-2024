const { log } = require('console');
const fs = require('fs');

const allFileContents = fs.readFileSync('input.txt', 'utf-8');
const reports = allFileContents
    .split(/\r?\n/)
    .map(r => r
        .split(' ')
        .map(x => parseInt(x))
    );

let part1 = 0;

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
    log('safe', r);
    return true;
}

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
    if (isSafe(r)) {
        log('safe 1', i, r);
        part2++;
    } else {
        let increasing = r[1] >= r[0];
        for (let x = 1; x < r.length; x++) {
            const prefV = r[x - 1];
            const v = r[x];
            const diff = increasing ? v - prefV : prefV - v;
            if (diff < 1 || diff > 3) {
                if(!isSafe(r.toSpliced(x-1, 1)) && isSafe(r.toSpliced(x, 1))){
                    continue reportLoop;
                }
            }
        }
        log('safe 2 ', i);
        part2++;  
    }

    
}
log(part2);

