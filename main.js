const canvas = document.getElementById('board')
const ctx = canvas.getContext('2d')
/* A canvas which draws a Tetris board */

const next = document.getElementById('next')
const nctx = next.getContext('2d')
/* A canvas which draws a next block */

const TITLE = document.getElementById('title')
const LEVEL = document.getElementById('level')

nctx.canvas.width = 4 * BLOCK_SIZE
nctx.canvas.height = 4 * BLOCK_SIZE
nctx.scale(BLOCK_SIZE, BLOCK_SIZE)

ctx.canvas.width = COLS * BLOCK_SIZE
ctx.canvas.height = ROWS * BLOCK_SIZE
ctx.scale(BLOCK_SIZE, BLOCK_SIZE)
/* Resize ctx so that BLOCK_SIZE * BLOCK_SIZE becomes 1 
* Then when we call fillRect in pieces.js, 
* even if (1, 1) are given as size factors, the corresponding area is painted. */

let board = new Board()

let dt = 0, step = 0, now = timestamp(), last = timestamp()
let accountValues = {
    score: 0,
    level: 1,
    lines: 0
}

function animate() {
    now = timestamp()
    if(!isPaused) {
        update(Math.min(1, (now - last) / 400.0))
        last = now
        requestId = window.requestAnimationFrame(animate)
    }
}
/* If the game is paused, do not animate the game */

function timestamp() {
    return new Date().getTime()
}

function update(idt) {
    if (level <= 5) step = 1.0 - 0.05 * account.level
    else step = 0.75 - 0.1 * (account.level - 5)
    dt = dt + idt
    if (dt > step) {
        document.addEventListener('keydown', handleKeyPress)
        dt = dt - step
        let p = moves[KEYS.DOWN](board.piece)
        if (board.valid(p)) {
            board.movePiece(p)
        } else {
            board.setData(board.piece)
            board.clearLines()
            isGameOver = board.checkGameOver()
            if (!isGameOver) {
                if (!isDropped) account.score += POINTS.SOFT_DROP
                else isDropped = false
                board.generatePiece()
            }
            else {
                window.cancelAnimationFrame(requestId)
                TITLE.textContent = 'Game Over'
                document.removeEventListener('keydown', handleKeyPress)
            }
        }
    }
}

function play() {
    if (!isPlay) {
        document.addEventListener('keydown', pause)
        isPlay = true
        LEVEL.textContent = account.level
        board.reset()
        //board.getEmptyBoard()
        board.generatePiece()
        animate()
    }
}

function pause(event) {
    if (event.keyCode === KEYS.ESC) {
        if (!isPaused) {
            document.removeEventListener('keydown', handleKeyPress)
            isPaused = true
            TITLE.textContent = 'Paused'
        }
        else {
            document.addEventListener('keydown', handleKeyPress)
            isPaused = false
            TITLE.textContent = 'TETRIS'
            animate()
        }
    }
}

function handleKeyPress(event) {
    let p = moves[event.keyCode](board.piece)
    if (event.keyCode === KEYS.UP) {
        board.changeShape()
    }
    /* If KEY.UP is pressed, change the shape of piece */
    else if (event.keyCode === KEYS.SPACE) {
        isDropped = true
        board.removePiece()
        while (board.valid(p)) {
            board.piece.setPosition(p)
            p = moves[KEYS.DOWN](board.piece)
        }
        p = moves[KEYS.UP](board.piece)
        board.movePiece(p)
        account.score += POINTS.HARD_DROP
        document.removeEventListener('keydown', handleKeyPress)
    }
    /* If Space bar is pressed, do hard drop */
    else if (moves[event.keyCode]) {
        event.preventDefault()
        board.movePiece(p)
    }
    /* Else move a piece */
}

function updateAccount(key, value) {
    let element = document.getElementById(key)
    if (element) {
        element.textContent = value
    }
}
/* If accountValues are updated, the values in the web page will be changed */

let account = new Proxy(accountValues, {
    set: (target, key, value) => {
        target[key] = value
        updateAccount(key, value)
        return true
    }
})

moves = {
    [KEYS.UP]: (p) => ({ ...p }),
    [KEYS.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
    [KEYS.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
    [KEYS.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
    [KEYS.SPACE]: (p) => ({ ...p, y: p.y + 1 })
}
/* Shallow coppy */