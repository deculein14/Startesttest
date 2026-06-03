const grid = document.getElementById('grid');

const toolButtons =
document.querySelectorAll('.tool-btn');

const saveBtn =
document.getElementById('save-btn');

const loadBtn =
document.getElementById('load-btn');

const clearBtn =
document.getElementById('clear-btn');

const toggleRangeBtn =
document.getElementById('toggle-range-btn');

let currentTool = 'scarecrow';
let rangesVisible = true;

const GRID_WIDTH = 40;
const GRID_HEIGHT = 30;

const allTools = [
    'scarecrow',
    'sprinkler',
    'quality-sprinkler',
    'iridium-sprinkler'
];

/* UNDO/REDO HISTORY */

let history = [];
let historyIndex = -1;

function saveHistory() {

    const cells =
    document.querySelectorAll('.cell');

    const snapshot = [];

    cells.forEach(cell => {

        let type = null;

        allTools.forEach(tool => {

            if (cell.classList.contains(tool)) {
                type = tool;
            }

        });

        snapshot.push(type);

    });

    /* REMOVE ANY REDO STATES */

    history = history.slice(0, historyIndex + 1);

    history.push(snapshot);

    historyIndex++;

}

function restoreHistory(snapshot) {

    const cells =
    document.querySelectorAll('.cell');

    cells.forEach((cell, i) => {

        clearCell(cell);

        if (snapshot[i]) {
            cell.classList.add(snapshot[i]);
        }

    });

    updateRanges();

}

function undo() {

    if (historyIndex <= 0) return;

    historyIndex--;

    restoreHistory(history[historyIndex]);

}

function redo() {

    if (historyIndex >= history.length - 1) return;

    historyIndex++;

    restoreHistory(history[historyIndex]);

}

/* KEYBOARD SHORTCUTS */

document.addEventListener('keydown', (e) => {

    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
    }

    if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
    }

});

/* CREATE GRID */

for (
    let i = 0;
    i < GRID_WIDTH * GRID_HEIGHT;
    i++
) {

    const cell =
    document.createElement('div');

    cell.classList.add('cell');

    cell.dataset.index = i;

    /* PLACE */

    cell.addEventListener('click', () => {

        saveHistory();

        clearCell(cell);

        cell.classList.add(currentTool);

        updateRanges();

    });

    /* REMOVE */

    cell.addEventListener('dblclick', () => {

        saveHistory();

        clearCell(cell);

        updateRanges();

    });

    grid.appendChild(cell);

}

/* SAVE INITIAL EMPTY STATE */

saveHistory();

/* TOOL SWITCH */

toolButtons.forEach(button => {

    button.addEventListener('click', () => {

        toolButtons.forEach(btn => {

            btn.classList.remove('active');

        });

        button.classList.add('active');

        currentTool =
        button.dataset.tool;

    });

});

/* TOGGLE RANGE */

toggleRangeBtn.addEventListener('click', () => {

    rangesVisible = !rangesVisible;

    toggleRangeBtn.textContent =
    rangesVisible ? 'Hide Range' : 'Show Range';

    toggleRangeBtn.classList.toggle(
    'ranges-hidden',
    !rangesVisible
    );

    if (rangesVisible) {
        updateRanges();
    } else {
        clearRanges();
    }

});

/* CLEAR CELL */

function clearCell(cell) {

    allTools.forEach(tool => {

        cell.classList.remove(tool);

    });

}

/* GET CELL */

function getCell(x, y) {

    if (
        x < 0 ||
        y < 0 ||
        x >= GRID_WIDTH ||
        y >= GRID_HEIGHT
    ) {
        return null;
    }

    const index =
    y * GRID_WIDTH + x;

    return document.querySelector(
    `.cell[data-index="${index}"]`
    );

}

/* CLEAR RANGES */

function clearRanges() {

    document
    .querySelectorAll('.cell')
    .forEach(cell => {

        cell.style.backgroundColor = '';

    });

}

/* UPDATE RANGES */
/* scarecrow first, sprinklers last so they show on top */

function updateRanges() {

    if (!rangesVisible) return;

    clearRanges();

    const cells =
    document.querySelectorAll('.cell');

    /* PASS 1: SCARECROW */

    cells.forEach(cell => {

        const index =
        Number(cell.dataset.index);

        const x =
        index % GRID_WIDTH;

        const y =
        Math.floor(index / GRID_WIDTH);

        if (
        cell.classList.contains(
        'scarecrow'
        )) {

            highlightScarecrow(
            x,
            y,
            '#FFD54F'
            );

        }

    });

    /* PASS 2: SPRINKLERS */

    cells.forEach(cell => {

        const index =
        Number(cell.dataset.index);

        const x =
        index % GRID_WIDTH;

        const y =
        Math.floor(index / GRID_WIDTH);

        if (
        cell.classList.contains(
        'sprinkler'
        )) {

            highlightPlus(
            x,
            y,
            '#4FC3F7'
            );

        }

        if (
        cell.classList.contains(
        'quality-sprinkler'
        )) {

            highlightQuality(
            x,
            y,
            '#81C784'
            );

        }

        if (
        cell.classList.contains(
        'iridium-sprinkler'
        )) {

            highlightIridium(
            x,
            y,
            '#BA68C8'
            );

        }

    });

}

/* BASIC SPRINKLER */
/* 4 tiles */

function highlightPlus(
centerX,
centerY,
color
) {

    const positions = [

        [0,-1],
        [0,1],
        [-1,0],
        [1,0]

    ];

    positions.forEach(pos => {

        const target =
        getCell(
        centerX + pos[0],
        centerY + pos[1]
        );

        if (target) {

            target.style
            .backgroundColor =
            color + '88';

        }

    });

}

/* QUALITY SPRINKLER */
/* 8 surrounding tiles */

function highlightQuality(
centerX,
centerY,
color
) {

    for (
    let y = -1;
    y <= 1;
    y++
    ) {

        for (
        let x = -1;
        x <= 1;
        x++
        ) {

            if (
            x === 0 &&
            y === 0
            ) continue;

            const target =
            getCell(
            centerX + x,
            centerY + y
            );

            if (target) {

                target.style
                .backgroundColor =
                color + '88';

            }

        }

    }

}

/* IRIDIUM SPRINKLER */
/* 5x5 */

function highlightIridium(
centerX,
centerY,
color
) {

    for (
    let y = -2;
    y <= 2;
    y++
    ) {

        for (
        let x = -2;
        x <= 2;
        x++
        ) {

            if (
            x === 0 &&
            y === 0
            ) continue;

            const target =
            getCell(
            centerX + x,
            centerY + y
            );

            if (target) {

                target.style
                .backgroundColor =
                color + '66';

            }

        }

    }

}

/* SCARECROW RANGE */
/* matches exact in-game 17x17 shape */
/* corners cut: 4 at row ±8, 3 at ±7, 2 at ±6, 1 at ±5 */

const SCARECROW_CORNER_CUT = {
    8: 4,
    7: 3,
    6: 2,
    5: 1
};

function highlightScarecrow(
centerX,
centerY,
color
) {

    for (
    let dy = -8;
    dy <= 8;
    dy++
    ) {

        const cut =
        SCARECROW_CORNER_CUT[
            Math.abs(dy)
        ] || 0;

        for (
        let dx = -8;
        dx <= 8;
        dx++
        ) {

            if (dx === 0 && dy === 0) continue;

            if (Math.abs(dx) > 8 - cut) continue;

            const target =
            getCell(
            centerX + dx,
            centerY + dy
            );

            if (target) {

                target.style
                .backgroundColor =
                color + '33';

            }

        }

    }

}

/* SAVE */

saveBtn.addEventListener('click', () => {

    const layout = [];

    document
    .querySelectorAll('.cell')
    .forEach(cell => {

        let type = null;

        allTools.forEach(tool => {

            if (
            cell.classList.contains(tool)
            ) {

                type = tool;

            }

        });

        layout.push({

            index:
            cell.dataset.index,

            type:
            type

        });

    });

    const blob =
    new Blob(

        [
            JSON.stringify(
            layout,
            null,
            2
            )
        ],

        {
            type:
            'application/json'
        }

    );

    const a =
    document.createElement('a');

    a.href =
    URL.createObjectURL(blob);

    a.download =
    'farm-layout.json';

    a.click();

});

/* LOAD */

loadBtn.addEventListener('click', () => {

    const input =
    document.createElement('input');

    input.type = 'file';

    input.accept = '.json';

    input.addEventListener(
    'change',
    (e) => {

        const file =
        e.target.files[0];

        if (!file) return;

        const reader =
        new FileReader();

        reader.onload =
        (event) => {

            const layout =
            JSON.parse(
            event.target.result
            );

            const cells =
            document
            .querySelectorAll('.cell');

            cells.forEach(cell => {

                clearCell(cell);

            });

            layout.forEach(item => {

                const cell =
                cells[item.index];

                if (
                cell &&
                item.type
                ) {

                    cell.classList
                    .add(item.type);

                }

            });

            saveHistory();

            updateRanges();

        };

        reader.readAsText(file);

    });

    input.click();

});

/* CLEAR */

clearBtn.addEventListener(
'click',
() => {

    const confirmClear =
    confirm(
    'Clear the entire farm?'
    );

    if (!confirmClear) return;

    saveHistory();

    document
    .querySelectorAll('.cell')
    .forEach(cell => {

        clearCell(cell);

    });

    updateRanges();

});

updateRanges();