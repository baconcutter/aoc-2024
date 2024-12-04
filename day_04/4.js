const { log } = require('console');
const fs = require('fs');

const allFileContents = fs.readFileSync('input.txt', 'utf-8')
const lines = allFileContents
    .split(/\r?\n/)
    .map(l => l.split(''));

let part1 = [
    ...allFileContents.matchAll(/XMAS/gm),
    ...allFileContents.matchAll(/SAMX/gm)].length;
for (let l = 0; l < lines.length; l++) {
    const line = lines[l];
    for (let x = 0; x < line.length; x++) {
        const c = line[x];
        if (c == 'X') {
            // above
            const above = [
                (lines[l - 1] || [])[x] ?? '',
                (lines[l - 2] || [])[x] ?? '',
                (lines[l - 3] || [])[x] ?? '',
            ].join('');
            const leftAbove = [
                (lines[l - 1] || [])[x - 1] ?? '',
                (lines[l - 2] || [])[x - 2] ?? '',
                (lines[l - 3] || [])[x - 3] ?? '',
            ].join('');
            const rightAbove = [
                (lines[l - 1] || [])[x + 1] ?? '',
                (lines[l - 2] || [])[x + 2] ?? '',
                (lines[l - 3] || [])[x + 3] ?? '',
            ].join('');

            const below = [
                (lines[l + 1] || [])[x] ?? '',
                (lines[l + 2] || [])[x] ?? '',
                (lines[l + 3] || [])[x] ?? '',
            ].join('');
            const leftBelow = [
                (lines[l + 1] || [])[x - 1] ?? '',
                (lines[l + 2] || [])[x - 2] ?? '',
                (lines[l + 3] || [])[x - 3] ?? '',
            ].join('');
            const rightBelow = [
                (lines[l + 1] || [])[x + 1] ?? '',
                (lines[l + 2] || [])[x + 2] ?? '',
                (lines[l + 3] || [])[x + 3] ?? '',
            ].join('');

            const matches = [above, leftAbove, rightAbove, below, leftBelow, rightBelow];

            part1 += matches.filter(m => m === 'MAS').length
        }
    }
}
log(part1);

let part2 = 0;
for (let l = 0; l < lines.length; l++) {
    const line = lines[l];
    for (let x = 0; x < line.length; x++) {
        const c = line[x];
        if (c == 'A') {
            const la = (lines[l - 1] || [])[x - 1] ?? '';
            const ra = (lines[l - 1] || [])[x + 1] ?? '';
            const lb = (lines[l + 1] || [])[x - 1] ?? '';
            const rb = (lines[l + 1] || [])[x + 1] ?? '';
            const joined = [la,ra,rb,lb].join('');
            if(joined === 'SSMM' || joined === 'MSSM' || joined === 'SMMS' || joined === 'MMSS'){
                part2++;
            }
        }
    }
}
log(part2);