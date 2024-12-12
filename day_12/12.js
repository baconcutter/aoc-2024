const fs = require('fs');
const {log} = require('console');

const input = fs.readFileSync('input.txt', 'utf-8').split('\n');

const k = ([r, c]) => `${r}-${c}`;
const rows = input.length;
const cols = input[0].length

let regions = [];
let seen = [];
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const rc = k([r, c]);
        if (seen.includes(rc)) continue;

        seen.push(rc);
        let region = new Set();
        region.add(rc);

        let queue = [[r, c]];
        const plant = input[r][c];
        while (queue.length) {
            const [qr, qc] = queue.shift();
            let adjacentFields = [[qr + 1, qc], [qr - 1, qc], [qr, qc + 1], [qr, qc - 1]];

            for (const [adr, adc] of adjacentFields) {
                if (adr < 0 || adc < 0 || adr >= rows || adc >= cols) continue;
                if (input[adr][adc] !== plant) continue;

                const adrc = k([adr, adc]);
                if (region.has(adrc)) continue;
                region.add(adrc);
                queue.push([adr, adc]);
                seen.push(adrc);
            }
        }
        regions.push(region);
    }
}

let part1 = 0;
for (let region of regions) {
    const area = region.size;
    let perimeter = area * 4;
    region.forEach(coord => {
        let [r, c] = coord.split('-').map(x => parseInt(x));
        [k([r + 1, c]), k([r - 1, c]), k([r, c + 1]), k([r, c - 1])].forEach(adjacentField => {
            if (region.has(adjacentField))
                perimeter--;
        });
    });
    part1 += area * perimeter;
}
console.log(part1);

let part2 = 0;

function getDistinctFences(list, adjacentFieldsCb) {
    let fenceGroups = [];
    let seen = [];

    for (let i = 0; i < list.length; i++) {
        const rc = list[i];
        if (seen.includes(rc)) continue;

        seen.push(rc);
        let region = new Set();
        region.add(rc);

        let queue = [rc.split('-').map(x => parseInt(x))];
        while (queue.length) {
            const [qr, qc] = queue.shift();
            let adjacentFields = adjacentFieldsCb(qr,qc);

            for (const [adr, adc] of adjacentFields) {
                const adrc = k([adr, adc]);
                if (!list.includes(adrc)) continue;
                if (region.has(adrc)) continue;
                region.add(adrc);
                queue.push([adr, adc]);
                seen.push(adrc);
            }
        }
        fenceGroups.push(region);
    }
    return fenceGroups.length;
}

function getDistinctFencesOnRow(list) {
    return getDistinctFences(list, (r,c) => [[r, c + 1], [r, c - 1]]);
}

function getDistinctFencesOnColumn(list) {
    return getDistinctFences(list, (r,c) => [[r -1, c], [r + 1, c]])
}

for (let region of regions) {
    let topFences = [];
    let downFences = [];
    let leftFences = [];
    let rightFences = [];

    region.forEach(coord => {
        let [r, c] = coord.split('-').map(x => parseInt(x));

        if (!region.has(k([r - 1, c]))) {
            topFences.push(coord);
        }

        if (!region.has(k([r + 1, c]))) {
            downFences.push(coord);
        }

        if (!region.has(k([r, c - 1]))) {
            leftFences.push(coord);
        }

        if (!region.has(k([r, c + 1]))) {
            rightFences.push(coord);
        }
    });

    part2 += region.size * (
        getDistinctFencesOnRow(topFences) +
        getDistinctFencesOnRow(downFences) +
        getDistinctFencesOnColumn(leftFences) +
        getDistinctFencesOnColumn(rightFences));
}

console.log(part2);

