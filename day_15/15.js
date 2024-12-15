const fs = require('fs');
const {log} = require('console');

const [rawmap, rawinstructions] = fs.readFileSync('input.txt', 'utf-8')
    .split('\n\n')
const instructions = rawinstructions.split('\n').flat().join().split('');

function part1(){

    const maplines = rawmap.split('\n');
    const rows = maplines.length
    const cols = maplines[0].length;

    const isWall = (r, c) => maplines[r][c] === '#';
    const isRobot = (r, c) => maplines[r][c] === '@';
    const isBox = (r, c) => maplines[r][c] === 'O';
    const isOpen = (r, c) => maplines[r][c] === '.';
    const replaceAt = (r, c, x) => {
        maplines[r] = maplines[r].substring(0, c) + x + maplines[r].substring(c + 1);
    }

    let robot;
    for (let r = 0; r < maplines.length; r++) {
        for (let c = 0; c < maplines[r].length; c++) {
            if (isRobot(r, c)) {
                robot = [r, c];
                break;
            }
        }
    }
    console.log(maplines, robot);

    for (let instruction of instructions) {
        let cr = robot[0];
        let cc = robot[1];
        let boxesToMove = 0;
        if (instruction === '^') {
            for (let r = robot[0] - 1; r >= 0; r--) {
                if (isWall(r, cc)) {
                    break;
                } else if (isBox(r, cc)) {
                    boxesToMove++;
                } else if (isOpen(r, cc)) {
                    if (boxesToMove > 0) {
                        replaceAt(r, cc, 'O');
                    }
                    replaceAt(cr, cc, '.');
                    replaceAt(cr - 1, cc, '@');
                    robot = [cr - 1, cc];
                    break;
                }
            }
        } else if (instruction === 'v') {
            for (let r = robot[0] + 1; r <= rows; r++) {
                if (isWall(r, cc)) {
                    break;
                } else if (isBox(r, cc)) {
                    boxesToMove++;
                } else if (isOpen(r, cc)) {
                    if (boxesToMove > 0) {
                        replaceAt(r, cc, 'O');
                    }
                    replaceAt(cr, cc, '.');
                    replaceAt(cr + 1, cc, '@');
                    robot = [cr + 1, cc];
                    break;
                }
            }
        } else if (instruction === '<') {
            for (let c = robot[1] - 1; c >= 0; c--) {
                if (isWall(cr, c)) {
                    break;
                } else if (isBox(cr, c)) {
                    boxesToMove++;
                } else if (isOpen(cr, c)) {
                    if (boxesToMove > 0) {
                        replaceAt(cr, c, 'O');
                    }
                    replaceAt(cr, cc, '.');
                    replaceAt(cr, cc - 1, '@');
                    robot = [cr, cc - 1];
                    break;
                }
            }
        } else if (instruction === '>') {
            for (let c = robot[1] + 1; c <= cols; c++) {
                if (isWall(cr, c)) {
                    break;
                } else if (isBox(cr, c)) {
                    boxesToMove++;
                } else if (isOpen(cr, c)) {
                    if (boxesToMove > 0) {
                        replaceAt(cr, c, 'O');
                    }
                    replaceAt(cr, cc, '.');
                    replaceAt(cr, cc + 1, '@');
                    robot = [cr, cc + 1];
                    break;
                }
            }
        }
    }

    let sum = 0;
    for (let r = 0; r < maplines.length; r++) {
        for (let c = 0; c < maplines[r].length; c++) {
            if (isBox(r, c)) {
                sum+= 100 * r + c;
            }
        }
    }
    console.log(sum);
}

function part2() {
    const maplines = rawmap.split('\n');
    let m = [];

    for (let r = 0; r < maplines.length; r++) {
        let ml = '';
        for (let c = 0; c < maplines[r].length; c++) {
            if (maplines[r][c] === 'O') {
                ml += '[]'
            } else if (maplines[r][c] === '.') {
                ml += '..'
            } else if (maplines[r][c] === '#') {
                ml += '##'
            } else if (maplines[r][c] === '@') {
                ml += '@.'
            }
        }
        m.push(ml);
    }

    const rows = m.length
    const cols = m[0].length;

    const isWall = (r, c) => m[r][c] === '#';
    const isRobot = (r, c) => m[r][c] === '@';
    const isBox = (r, c) => isLBox(r, c) || isRBox(r, c);
    const isLBox = (r, c) => m[r][c] === '[';
    const isRBox = (r, c) => m[r][c] === ']';
    const isOpen = (r, c) => m[r][c] === '.';
    const replaceAt = (r, c, x) => {
        m[r] = m[r].substring(0, c) + x + m[r].substring(c + 1);
    }

    const canBoxMoveUp = (r, c) => {
        if (m[r - 1][c] === '#' || m[r - 1][c + 1] === '#') {
            return false;
        }
        if (m[r - 1][c] === '.' && m[r - 1][c + 1] === '.') {
            return true;
        }
        if (m[r - 1][c] === '[') {
            // box right above
            return canBoxMoveUp(r - 1, c);
        }
        if (m[r - 1][c] === ']' && m[r - 1][c + 1] === '[') {
            // 2 boxes
            return canBoxMoveUp(r - 1, c - 1) && canBoxMoveUp(r - 1, c + 1);
        }
        if (m[r - 1][c] === ']') {
            return canBoxMoveUp(r - 1, c - 1);
        }

        if (m[r - 1][c + 1] === '[') {
            return canBoxMoveUp(r - 1, c + 1);
        }
    }

    const moveBoxUp = (r, c) => {
        function move() {
            replaceAt(r - 1, c, '[');
            replaceAt(r - 1, c + 1, ']');
            replaceAt(r, c, '.');
            replaceAt(r, c + 1, '.');
        }

        if (!isBox(r - 1, c) && !isBox(r - 1, c + 1)) {
            move();
        } else {
            if (isLBox(r - 1, c)) {
                moveBoxUp(r - 1, c);
                move();
            } else if (isRBox(r - 1, c) && isLBox(r - 1, c + 1)) {
                moveBoxUp(r - 1, c - 1);
                moveBoxUp(r - 1, c + 1);
                move();
            } else if (isRBox(r - 1, c)) {
                moveBoxUp(r - 1, c - 1);
                move();
            } else if (isLBox(r - 1, c + 1)) {
                moveBoxUp(r - 1, c + 1);
                move();
            }
        }
    }

    const moveBoxDown = (r, c) => {
        function move() {
            replaceAt(r + 1, c, '[');
            replaceAt(r + 1, c + 1, ']');
            replaceAt(r, c, '.');
            replaceAt(r, c + 1, '.');
        }

        if (!isBox(r + 1, c) && !isBox(r + 1, c + 1)) {
            move();
        } else {
            if (isLBox(r + 1, c)) {
                moveBoxDown(r + 1, c);
                move();
            } else if (isRBox(r + 1, c) && isLBox(r + 1, c + 1)) {
                moveBoxDown(r + 1, c - 1);
                moveBoxDown(r + 1, c + 1);
                move();
            } else if (isRBox(r + 1, c)) {
                moveBoxDown(r + 1, c - 1);
                move();
            } else if (isLBox(r + 1, c + 1)) {
                moveBoxDown(r + 1, c + 1);
                move();
            }
        }
    }

    const canBoxMoveDown = (r, c) => {
        if (m[r + 1][c] === '#' || m[r + 1][c + 1] === '#') {
            return false;
        }
        if (m[r + 1][c] === '.' && m[r + 1][c + 1] === '.') {
            return true;
        }
        if (m[r + 1][c] === '[') {
            // box right above
            return canBoxMoveDown(r + 1, c);
        }
        if (m[r + 1][c] === ']' && m[r + 1][c + 1] === '[') {
            // 2 boxes
            return canBoxMoveDown(r + 1, c - 1) && canBoxMoveDown(r + 1, c + 1);
        }
        if (m[r + 1][c] === ']') {
            return canBoxMoveDown(r + 1, c - 1);
        }

        if (m[r + 1][c + 1] === '[') {
            return canBoxMoveDown(r + 1, c + 1);
        }
    }

    let robot;
    for (let r = 0; r < m.length; r++) {
        for (let c = 0; c < m[r].length; c++) {
            if (isRobot(r, c)) {
                robot = [r, c];
                break;
            }
        }
    }

    let index = 0;
    for (let instruction of instructions) {
        // console.log(m);
        // console.log('====', index, '====', instruction);
        index++;
        let cr = robot[0];
        let cc = robot[1];
        let boxesToMove = [];
        if (instruction === '^') {
            const nextR = cr - 1;
            if (isWall(nextR, cc)) continue;
            if (isBox(nextR, cc)) {
                if (isLBox(nextR, cc)) {
                    if (canBoxMoveUp(nextR, cc)) {
                        moveBoxUp(nextR, cc);
                    } else {
                        continue;
                    }
                } else {
                    if (canBoxMoveUp(nextR, cc - 1)) {
                        moveBoxUp(nextR, cc - 1);
                    } else {
                        continue;
                    }
                }
            }
            if (isOpen(nextR, cc) || isBox(nextR, cc)) {
                replaceAt(cr, cc, '.');
                replaceAt(nextR, cc, '@');
                robot = [nextR, cc];
            }
        } else if (instruction === 'v') {
            const nextR = cr + 1;
            if (isWall(nextR, cc)) continue;
            if (isBox(nextR, cc)) {
                if (isLBox(nextR, cc)) {
                    if (canBoxMoveDown(nextR, cc)) {
                        moveBoxDown(nextR, cc);
                    } else {
                        continue;
                    }
                } else {
                    if (canBoxMoveDown(nextR, cc - 1)) {
                        moveBoxDown(nextR, cc - 1);
                    } else {
                        continue;
                    }
                }
            }
            if (isOpen(nextR, cc) || isBox(nextR, cc)) {
                replaceAt(cr, cc, '.');
                replaceAt(nextR, cc, '@');
                robot = [nextR, cc];
            }
        } else if (instruction === '<') {
            for (let c = robot[1] - 1; c >= 0; c--) {
                if (isWall(cr, c)) {
                    break;
                } else if (isLBox(cr, c)) {
                    boxesToMove.push([cr, c]);
                } else if (isOpen(cr, c)) {
                    for (let b of boxesToMove) {
                        replaceAt(b[0], b[1] - 1, '[');
                        replaceAt(b[0], b[1], ']');
                    }
                    replaceAt(cr, cc, '.');
                    replaceAt(cr, cc - 1, '@');
                    robot = [cr, cc - 1];
                    break;
                }
            }
        } else if (instruction === '>') {
            for (let c = robot[1] + 1; c <= cols; c++) {
                if (isWall(cr, c)) {
                    break;
                } else if (isLBox(cr, c)) {
                    boxesToMove.push([cr, c]);
                } else if (isOpen(cr, c)) {
                    for (let b of boxesToMove) {
                        replaceAt(b[0], b[1] + 1, '[');
                        replaceAt(b[0], b[1] + 2, ']');
                    }
                    replaceAt(cr, cc, '.');
                    replaceAt(cr, cc + 1, '@');
                    robot = [cr, cc + 1];
                    break;
                }
            }
        }
    }

    console.log(m);

    let sum = 0;
    for (let r = 0; r < m.length; r++) {
        for (let c = 0; c < m[r].length; c++) {
            if (isLBox(r, c)) {
                sum += 100 * r + c;
            }
        }
    }
    console.log(sum);
}

part2();