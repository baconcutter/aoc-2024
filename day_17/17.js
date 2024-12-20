const fs = require('fs');
const {log} = require('console');

const [rawRegisters, rawProgram] = fs.readFileSync('input.txt', 'utf-8').split('\n\n');
const [a, b, c] = [...rawRegisters.matchAll(/\d+/g).map(x => parseInt(x[0]))]
const program = rawProgram.split(': ')[1].split(',').map(x => parseInt(x));

// JS fix for negative modoulos
function mod(n, m) {
    return ((n % m) + m) % m;
}

function part1(a, b, c, program) {
    // console.log(a, b, c, program);
    let output = [];
    let operations = [];

    const instructions = [
        //adv opcode 0
        (op) => {
            operations.push(`adv: a = a >> op() = ${a >> op()}`);
            a = a >> op()
        },
        //bxl 1
        (op) => {
            operations.push(`bxl: b = ${b} ^ ${op(true)} = ${b ^ op(true)}`);
            b = b ^ op(true)
        },
        //bst 2
        (op) => {
            operations.push(`bst: b = mod(${op()}, 8) = ${mod(op(), 8)}`);
            b = mod(op(), 8)
        },
        //jnz 3
        (op) => {
            operations.push(`jnz: a ? ${op()} : undefined => ${a !== 0 ? op(true) : undefined}`);
            return a !== 0 ? op(true) : undefined
        },
        //bxc 4
        (op) => {
            operations.push(`bxc: b = ${b} ^ ${c} = ${b ^ c}`);
            b = b ^ c
        },
        //out 5
        (op) => {
            operations.push(`out: output.push(mod(${op()}, 8)) = ${mod(op(), 8)}`);
            output.push(mod(op(), 8))
        },
        //bdv 6
        (op) => {
            operations.push(`bdv: b = a >> op() = ${a >> op()}`);
            b = a >> op()
        },
        //cdv 7
        (op) => {
            operations.push(`cdv: c = a >> op() = ${a >> op()}`);
            c = a >> op()
        }
    ]

    let pointer = 0;
    while (pointer < program.length) {
        const opCode = program[pointer + 1];
        const operand = (literal = false) => {
            if (literal) {
                return opCode;
            }
            if (opCode === 4) {
                return a;
            } else if (opCode === 5) {
                return b;
            } else if (opCode === 6) {
                return c;
            }
            return opCode;
        }

        const newPointer = instructions[program[pointer]](operand);
        if (program[pointer] === 3 && newPointer !== undefined) {
            pointer = newPointer;
        } else {
            pointer += 2;
        }
    }
    // log(a,b,c);
    return output.join(',');
}

// testcases
// log(part1(0, 0, 9, [2, 6])); // b === 1
// log(part1(10, 0, 0, [5, 0, 5, 1, 5, 4])); // 0,1,2
// log(part1(2024, 0, 0, [0, 1, 5, 4, 3, 0])); //4,2,5,6,7,7,7,7,3,1,0 && A = 0
// log(part1(0, 29, 0, [1, 7])); // B = 26
// log(part1(0, 2024, 43690, [4, 0])); //B === 44354
// for real
console.log('hallo');
log(part1(1457428070, b, c, program));
// log(part1(117440, b, c, program));

// let [a1, b1, c1] = [3, 0, 0];
// let output = [];
//
// while (a1) {
//     b1 = mod(a1, 8);
//     b1 = b1 ^ 5;
//     c1 = a1 >> b1;
//     b1 = b1 ^ 6;
//     a1 = a1 >> 3;
//     b1 = b1 ^ c1;
//     output.push(mod(b1, 8))
// }
// console.log(output);


function find(input, answer) {
    console.log('find', input, answer);
    if (input.length === 0) {
        return answer;
    }

    for (let i = 0; i < 8; i++) {
        let a = i === 0 ? Math.trunc(answer * 8) : Math.trunc((answer * 8) + i);
        if (a < 0) {
            console.log(`(${answer} << 3) | ${i}; => ${answer << 3} => ${(answer << 3) | i}`);
            // console.log(`Math.trunc(${answer} * 8) | ${i} => ${answer * 8} => ${Math.trunc(answer * 8)} => ${Math.trunc(answer * 8) + i}`);
        }
        let b = 0;
        let c = 0;
        let output = undefined;
        for (let pointer = 0; pointer < program.length - 2; pointer += 2) {
            let instruction = program[pointer];
            let operand = program[pointer + 1];

            if (instruction === 0) {
                console.assert(operand === 3);
            } else if (instruction === 1) {
                // log(`bxl: b = b(${b}) ^ operand => ${b ^ operand}`);
                b = b ^ operand
            } else if (instruction === 2) {
                // log(`bst: b = a(${a}) % 8 => ${a % 8}`);
                b = a % 8;
            } else if (instruction === 4) {
                // log(`bxc: b = b(${b}) ^ c(${c}) => ${b ^ c}`);
                b = b ^ c;
            } else if (instruction === 5) {
                // log(`output: b(${b}) % 8 => ${b % 8}`);
                output = b % 8;
                // if (output < 0) {
                //     console.log('wut')
                //     console.log(a, b, c, output, input, answer, i);
                // }
            } else if (instruction === 7) {
                // log(`cdv: a(${a}) >> b(${b}) => ${a >> b}`);
                c = a >> b;
            } else {
                // console.log(input, answer, instruction, operand)
                throw 'unrecognized ' + instruction + ' ' + operand
            }
            if (output === input.at(-1)) {
                let sub = find(input.slice(0, input.length - 1), a);
                if (sub === undefined) {
                    continue;
                }
                return sub;
            }
        }
    }
}

console.log('part 2', find(program, 0));
// TODO fix