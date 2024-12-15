const fs = require('fs');
const {log} = require('console');

const machines = fs.readFileSync('input.txt', 'utf-8')
    .split('\n\n')
    .map(machine => machine
        .split('\n')
        .map(line => line
            .split(': ')
            .slice(1)
            .map(p => p.split(', '))
        ));

function bruteForce(ax, ay, bx, by, pricex, pricey) {
    let minCosts = Infinity;
    for (let i = 0; i <= 100; i++) {
        for (let j = 0; j <= 100; j++) {
            if (ax * i + bx * j === pricex && ay * i + by * j === pricey) {
                const costs = i * 3 + j;
                minCosts = Math.min(minCosts, costs);
            }
        }
    }
    return minCosts;
}


let part1 = 0;
machines.forEach(machine => {
    const [aRaw, bRaw, prizeRaw] = machine.flat();
    const ax = parseInt(aRaw[0].split('+')[1]);
    const ay = parseInt(aRaw[1].split('+')[1]);
    const bx = parseInt(bRaw[0].split('+')[1]);
    const by = parseInt(bRaw[1].split('+')[1]);
    const prizex = parseInt(prizeRaw[0].split('=')[1]);
    const prizey = parseInt(prizeRaw[1].split('=')[1]);

    let sum = bruteForce(ax, ay, bx, by, prizex, prizey);
    if (sum !== Infinity) {
        part1 += sum;
    }
})
console.log(part1);


let part2 = 0;
machines.forEach(machine => {
    const [aRaw, bRaw, prizeRaw] = machine.flat();
    const ax = parseInt(aRaw[0].split('+')[1]);
    const ay = parseInt(aRaw[1].split('+')[1]);
    const bx = parseInt(bRaw[0].split('+')[1]);
    const by = parseInt(bRaw[1].split('+')[1]);
    const prizex = parseInt(prizeRaw[0].split('=')[1]) + 10000000000000;
    const prizey = parseInt(prizeRaw[1].split('=')[1]) + 10000000000000;

    // solution is not mine, but from hyperneutrino youtube channel.
    const ca = (prizex * by - prizey * bx) / (ax * by - ay * bx);
    const cb = (prizex - ax * ca) / bx;
    if (ca % 1 === 0 && cb % 1 === 0) {
        part2 += ca * 3 + cb;
    }

})
console.log(part2);
