const fs = require('fs');
const {log} = require('console');

const line = fs.readFileSync('input.txt', 'utf-8');
const _space = '.';

function getCheckSum(disk) {
    let checksum = 0;
    for (let i = 0; i < disk.length; i++) {
        if (disk[i] !== _space) {
            checksum += i * disk[i];
        }
    }
    return checksum;
}

function part1() {
    let index = 0;
    let disk = [];

    for (let i = 0; i < line.length; i += 2) {
        disk.push(...new Array(parseInt(line[i])).fill(index));
        if (line[i + 1]) {
            disk.push(...new Array(parseInt(line[i + 1])).fill(_space));
        }
        index++;
    }

    while (true) {
        let index = disk.findIndex(i => i === _space);
        let lastFileBlock = disk.findLastIndex(i => i !== _space);
        if (index > -1 && index < lastFileBlock) {
            disk[index] = disk[lastFileBlock];
            disk.splice(lastFileBlock, 1);
        } else {
            break;
        }
    }
    log(getCheckSum(disk));
}

part1();

function part2() {
    let index = 0;
    let disk = [];
    for (let i = 0; i < line.length; i += 2) {
        disk.push(new Array(parseInt(line[i])).fill(index));
        if (line[i + 1]) {
            disk.push(new Array(parseInt(line[i + 1])).fill(_space));
        }
        index++;
    }

    const lastFile = disk[disk.findLastIndex(i => i && i[0] !== _space)][0];
    for (let i = lastFile; i >= 0; i--) {
        const fileIndex = disk.findIndex(x => x.length && x[0] === i);
        for (let j = 0; j < fileIndex; j++) {
            let length = disk[fileIndex].length;
            if (disk[j].length >= length && disk[j][0] === _space) {
                disk[j].splice(0, length);
                disk.splice(j, 0, disk[fileIndex]);
                disk[fileIndex+1] = disk[fileIndex + 1].map(_ => _space);
                break;
            }
        }
    }

    console.log(getCheckSum(disk.flat()));
}

part2();
