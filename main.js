const canvas = document.getElementById('board')
const ctx = canvas.getContext('2d')
const next = document.getElementById('next')
const nctx = next.getContext('2d')

const TITLE = document.getElementById('title')
const LEVEL = document.getElementById('level')

nctx.canvas.width = 4 * BLOCK_SIZE
nctx.canvas.height = 4 * BLOCK_SIZE
nctx.scale(BLOCK_SIZE, BLOCK_SIZE)

ctx.canvas.width = COLS * BLOCK_SIZE
ctx.canvas.height = ROWS * BLOCK_SIZE
ctx.scale(BLOCK_SIZE, BLOCK_SIZE) // ctx의 크기를 조정. BLOCK_SIZE * BLOCK_SIZE를 1로
// 이렇게 설정해주면 picesc.js 에서 fillRect를 호출할때 크기 인자로 1, 1을 주어도 해당 영역이 칠해짐

let board = new Board()

let dt = 0, step = 0.8, now = timestamp(), last = timestamp()
let accountValues = {
    score: 0,
    level: 1,
    lines: 0
}

function animate() {
    now = timestamp()
    update(Math.min(1, (now - last) / 1000.0))
    last = now
    requestId = window.requestAnimationFrame(animate)
}

function timestamp() {
    return new Date().getTime()
}

function update(idt) {
    step = 1 - 0.05 * account.level
    dt = dt + idt
    if (dt > step) {
        dt = dt - step
        let p = moves[KEYS.DOWN](board.piece)
        if (!board.isBottom(p)) {
            board.moveBlock(p)
        } else {
            board.setData(board.piece)
            board.clearLines()
            isGameOver = board.checkGameOver()
            if (!isGameOver) {
                if(!isDropped) account.score += POINTS.SOFT_DROP
                else isDropped = false
                board.generateBlock()
                animate()
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
        isPlay = true
        LEVEL.textContent = account.level
        document.addEventListener('keydown', handleKeyPress)
        board.reset()
        board.getEmptyBoard()
        board.generateBlock()
        animate()
    }
}

moves = {
    [KEYS.UP]: (p) => ({ ...p }),
    [KEYS.LEFT]: (p) => ({ ...p, x: p.x - 1 }), // ...p (펼침 연산자) p를 얕은 복사
    [KEYS.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
    [KEYS.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
    [KEYS.SPACE]: (p) => ({ ...p, y: p.y + 1 })
}

function handleKeyPress(event) {
    let p = moves[event.keyCode](board.piece)
    if (event.keyCode === KEYS.UP) {
        board.changeShape()
    }
    else if (event.keyCode === KEYS.SPACE) {
        isDropped = true
        board.piece.remove()
        board.clearData(board.piece)
        while (board.valid(p)) {
            board.piece.move(p)
            p = moves[KEYS.DOWN](board.piece)
        }
        p = moves[KEYS.UP](board.piece)
        board.piece.move(p)
        board.setData(board.piece)
        board.piece.draw(currentShape)
        account.score += POINTS.HARD_DROP
    }
    else if (moves[event.keyCode]) {
        event.preventDefault()
        board.moveBlock(p)
        /*if(event.keyCode == KEYS.DOWN) {
            account.score += POINTS.SOFT_DROP
        }*/
    }
}

/*function addEventListener() {
    document.addEventListener('keydown', handleKeyPress)
}*/

function updateAccount(key, value) {
    let element = document.getElementById(key)
    if (element) {
        element.textContent = value
    }
}

let account = new Proxy(accountValues, {
    set: (target, key, value) => {
        target[key] = value
        updateAccount(key, value)
        return true
    }
})