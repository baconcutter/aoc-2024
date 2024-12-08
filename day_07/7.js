const fs = require('fs');
const {log} = require('console');

const lines = fs.readFileSync('input.txt', 'utf-8').split('\n');
let part1 = 0;
for (let line of lines) {
    const [rawResult, rawParts] = line.split(': ');
    const result = parseInt(rawResult);
    const parts = rawParts.split(' ').map(p => parseInt(p));
    let eq = [parts[0]];

    for (let i = 1; i < parts.length; i++) {
        const newEq = [];
        for (let eqElement of eq) {
            newEq.push(`(${eqElement} + ${parts[i]})`);
            newEq.push(`(${eqElement} * ${parts[i]})`);
            newEq.push(`${eval(eqElement)}${parts[i]}`);
        }
        eq = newEq;
    }

    for (let e of eq) {
        if (eval(e) === result) {
            part1 += result;
            break;
        }
    }
}
log(part1);