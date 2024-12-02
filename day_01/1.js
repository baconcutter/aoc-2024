const { log } = require('console');
const fs = require('fs');

const allFileContents = fs.readFileSync('1.txt', 'utf-8');
const lines = allFileContents.split(/\r?\n/);

// part 1
const left = [];
const right = [];

lines.forEach(l => {
    const n = l
        .split('   ')
        .map(v => parseInt(v));

    left.push(n[0]);
    right.push(n[1]);
});

left.sort();
right.sort();

let sum = 0;
for (i = 0; i < left.length; i++) {
    sum += Math.abs(right[i] - left[i]);
}

console.log(sum);

// part 2
const rightMap = new Map();

for (i = 0; i < right.length; i++) {
    const x = rightMap.get(right[i]) ?? 0;
    rightMap.set(right[i], x + 1);
}
let sum2 = 0;
for (i = 0; i < left.length; i++) {
    sum2 += left[i] * (rightMap.get(left[i]) ?? 0);
}
log(sum2);