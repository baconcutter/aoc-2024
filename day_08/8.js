const fs = require('fs');
const {log} = require('console');

const lines = fs.readFileSync('input.txt', 'utf-8').split('\n');
const [rMax, cMax] = [lines.length - 1, lines[0].length - 1];

const frequencies = {};

for (let r = 0; r < lines.length; r++) {
    for (let c = 0; c < lines[r].length; c++) {
        let char = lines[r][c];
        if (char !== '.' && char !== '#') {
            if (!frequencies[char]) {
                frequencies[char] = [[c, r]];
            } else {
                frequencies[char].push([c, r]);
            }
        }
    }
}

let part1 = [];
Object.keys(frequencies).forEach(key => {
    for (let i = 0; i < frequencies[key].length; i++) {
        for (let j = i + 1; j < frequencies[key].length; j++) {
            const [c1, r1] = frequencies[key][i];
            const [c2, r2] = frequencies[key][j];
            const [diffC, diffR] = [Math.abs(c1 - c2), Math.abs(r1 - r2)];
            let possibilities = []

            if (c2 < c1) {
                possibilities = [
                    [c1 + diffC, r1 - diffR],
                    [c2 - diffC, r2 + diffR],
                ];
            } else {
                possibilities = [
                    [c1 - diffC, r1 - diffR],
                    [c2 + diffC, r2 + diffR],
                ];
            }

            possibilities.forEach(([posC, posR]) => {
                if (posC >= 0 && posC <= cMax && posR >= 0 && posR <= rMax) {
                    log('add', key, [posC, posR]);
                    part1.push(`${posC}-${posR}`);
                }
            });
        }
    }
});
console.log(new Set(part1).size);

const kie = (c, r) => `${c},${r}`;
const inbounds = (c, r) => c >= 0 && c <= cMax && r >= 0 && r <= rMax;

let part2 = [];
Object.keys(frequencies).forEach(key => {
    for (let i = 0; i < frequencies[key].length; i++) {
        for (let j = i + 1; j < frequencies[key].length; j++) {
            const [c1, r1] = frequencies[key][i];
            const [c2, r2] = frequencies[key][j];
            const [diffC, diffR] = [Math.abs(c1 - c2), Math.abs(r1 - r2)];

            part2.push(`${c1}-${r1}`);
            part2.push(`${c2}-${r2}`);

            if (c2 < c1) {
                let [prevC, prevR] = [c1 + diffC, r1 - diffR];
                while (true) {
                    if (inbounds(prevC, prevR)) {
                        // log('add', key, [posC, posR]);
                        part2.push(`${prevC}-${prevR}`);
                        [prevC, prevR] = [prevC + diffC, prevR - diffR];
                    } else {
                        break;
                    }
                }

                [nextC, nextR] = [c2 - diffC, r2 + diffR];

                while (true) {
                    if (inbounds(nextC, nextR)) {
                        // log('add', key, [posC, posR]);
                        part2.push(`${nextC}-${nextR}`);
                        [nextC, nextR] = [nextC - diffC, nextR + diffR];
                    } else {
                        break;
                    }
                }
            } else {
                let [prevC, prevR] = [c1 - diffC, r1 - diffR];
                while (true) {
                    if (inbounds(prevC, prevR)) {
                        // log('add', key, [posC, posR]);
                        part2.push(`${prevC}-${prevR}`);
                        [prevC, prevR] = [prevC - diffC, prevR - diffR];
                    } else {
                        break;
                    }
                }

                [nextC, nextR] = [c2 + diffC, r2 + diffR];
                while (true) {
                    if (inbounds(nextC, nextR)) {
                        // log('add', key, [posC, posR]);
                        part2.push(`${nextC}-${nextR}`);
                        [nextC, nextR] = [nextC + diffC, nextR + diffR];
                    } else {
                        break;
                    }
                }
            }
        }
    }
});
console.log(new Set(part2).size);

