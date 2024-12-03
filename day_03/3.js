const { log } = require('console');
const fs = require('fs');

const line = fs.readFileSync('input.txt', 'utf-8');
const regex = new RegExp(/mul\(\d+,\d+\)/g);

const muls = [...line.matchAll(regex)];
let part1 = 0;
for (const mul of muls) {
    const [x, y] = mul[0].split('(')[1].split(',').map(x => parseInt(x));
    part1 += x * y;
}

log(part1);

const matches = [...line.matchAll(/mul\(\d+,\d+\)|do\(\)|don\'t\(\)/g)];
let enabled = true;
let part2 = 0;
for (const m of matches) {
    if(m[0] === 'do()'){
        enabled = true;
    } else if (m[0] === 'don\'t()') {
        enabled = false;
    } else {
        if(enabled){
            const [x, y] = m[0].split('(')[1].split(',').map(x => parseInt(x));
            part2 += x * y;
        }
    }
}
log(part2);