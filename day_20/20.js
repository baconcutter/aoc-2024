const fs = require('fs');

const lines = fs.readFileSync('input.txt', 'utf-8').split('\n');

// track
// [
//      [r,c,hacks:[[r,c]]],
// ]
let start, end;
let path = []

// add start and end
for (let r = 0; r < lines.length; r++) {
    for (let c = 0; c < lines[r].length; c++) {
        if (lines[r][c] === 'S') {
            start = [r, c];
        } else if (lines[r][c] === 'E') {
            end = [r, c];
        } else if (lines[r][c] === '.') {
            path.push([r, c]);
        }
    }
}

let current = start;
let track = []

console.log(start, end);

while (!(current[0] === end[0] && current[1] === end[1])) {
    let adjacent = [
        [[current[0], current[1] + 1], [current[0], current[1] + 2]],
        [[current[0], current[1] - 1], [current[0], current[1] - 2]],
        [[current[0] - 1, current[1]], [current[0] - 2, current[1]]],
        [[current[0] + 1, current[1]], [current[0] + 2, current[1]]],
    ];
    let next;
    let hacks = [];
    for (let [[afr, afc], [nfr, nfc]] of adjacent) {
        if (lines[afr][afc] === '.' || lines[afr][afc] === 'E') {
            let seen = track.some(i => i[0] === afr && i[1] === afc);
            if (!seen) {
                next = [afr, afc];
            }
        } else if (lines[afr][afc] === '#') {
            if (nfr > 0 && nfr < lines.length && nfc > 0 && nfc < lines[0].length) {
                if (lines[nfr][nfc] === '.' || lines[nfr][nfc] === 'E') {
                    let seen = track.some(i => i[0] === nfr && i[1] === nfc);
                    if (!seen) {
                        hacks.push([nfr, nfc]);
                    }
                }
            }
        }
    }
    track.push([current[0], current[1], hacks]);
    if (!next) {
        throw 'weird';
    }
    current = next;
}
track.push([...end, []]);

let pico = [];

for (let i = 0; i < track.length; i++) {
    const hacks = track[i][2];
    for (let hack of hacks) {
        let index = track.findIndex(t => t[0] === hack[0] && t[1] === hack[1]);
        pico.push(index - i - 2);
    }
}
console.log('part 1', pico.filter(p => p >= 100).length);

const distance = (r, c, dr, dc) => {
    return Math.abs(r - dr) + Math.abs(c - dc);
}

let part2 = [];
for (let i = 0; i < track.length - 2; i++) {
    for (let j = i + 2; j < track.length; j++) {
        const [r, c, {}] = track[i];
        const [dr, dc, {}] = track[j];

        const d = distance(r, c, dr, dc);
        const cutoff = j - i - d;
        if (d <= 20 && cutoff >= 100) {
            part2.push(cutoff);
        }
    }
}
console.log(part2.length);
