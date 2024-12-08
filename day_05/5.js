const fs = require('fs');
const {log} = require('console');

const [rawOrderingRules, rawUpdates] = fs.readFileSync('input.txt', 'utf-8').split('\n\n');
const updates = rawUpdates.split('\n').map(line => line.split(',').map(x => parseInt(x)));

let incorrectUpdates = [];

let part1 = 0;
updateLoop: for (const update of updates) {
    for (let i = 0; i < update.length - 1; i++) {
        for (let j = i + 1; j < update.length; j++) {
            let ruleIndex = rawOrderingRules.indexOf(`${update[i]}|${update[j]}`);
            if (ruleIndex === -1) {
                let reverseRuleIndex = rawOrderingRules.indexOf(`${update[j]}|${update[i]}`);
                if (reverseRuleIndex > -1) {
                    incorrectUpdates.push(update);
                    continue updateLoop;
                }
            }
        }
    }
    part1 += update[Math.floor(update.length / 2)];
}
console.log(part1);

// part 2
let part2 = 0;
for (const incorrectUpdate of incorrectUpdates) {

    const sorted = incorrectUpdate.toSorted((a, b) => {
        if (rawOrderingRules.indexOf(`${a}|${b}`) > -1) {
            return -1;
        } else if(rawOrderingRules.indexOf(`${b}|${a}`) > -1) {
            return 1;
        }
        return 0;
    });
    part2 += sorted[Math.floor(sorted.length / 2)];
}
console.log(part2);