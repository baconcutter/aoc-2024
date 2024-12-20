const fs = require('fs');

const [rawTowelPatterns, rawDesigns] = fs.readFileSync('input.txt', 'utf-8').split('\n\n');
const towelPatterns = rawTowelPatterns.split(', ');
const designs = rawDesigns.split('\n');

const cache = {
    '': 1
}
function solve(input) {
    if (cache[input]) {
        return cache[input];
    }

    let nextPatternOptions = towelPatterns
        .filter(tp => tp.length <= input.length && input.substring(0, tp.length) === tp);

    let result = 0;
    for (const nextPatternOption of nextPatternOptions) {
        result += solve(input.substring(nextPatternOption.length));
    }
    cache[input] = result;

    return result;
}

let part1 = 0;
let part2 = 0;
for (let design of designs) {
    let solutions = solve(design);
    if (solutions > 0) {
        part1++;
    }
    part2+= solutions;
}
console.log(part1);
console.log(part2);