const fs = require('fs');
const {log} = require('console');

const input = fs.readFileSync('input.txt', 'utf-8').split(' ');

let cache = {};
function countStones(stone, remainingSteps) {
    let cacheKey = `${stone}-${remainingSteps}`;
    if (cache[cacheKey] !== undefined) {
        return cache[cacheKey];
    }

    if (remainingSteps === 0) {
        return 1;
    }

    if (stone === '0') {
        cache[cacheKey] = countStones('1', remainingSteps - 1);
    } else if (stone.length % 2 === 0) {
        cache[cacheKey] = countStones(parseInt(stone.substring(0, (stone.length / 2))) + '', remainingSteps - 1) +
            countStones(parseInt(stone.substring(stone.length / 2)) + '', remainingSteps - 1)
    } else {
        cache[cacheKey] = countStones(stone * 2024 + '', remainingSteps - 1);
    }
    return cache[cacheKey];
}

// part 1
let part1 = 0;
for (let i = 0; i < input.length; i++) {
    part1 += countStones(input[i], 25);
}
log(part1);

// part 2
let part2 = 0;
for (let i = 0; i < input.length; i++) {
    part2 += countStones(input[i], 75);
}
log(part2);