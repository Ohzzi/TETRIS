const canvas = document.getElementById('board')
const ctx = canvas.getContext('2d')
const next = document.getElementById('next')
const nctx = next.getContext('2d')

nctx.canvas.width = 4 * BLOCK_SIZE
nctx.canvas.height = 4 * BLOCK_SIZE
nctx.scale(BLOCK_SIZE, BLOCK_SIZE)

ctx.canvas.width = COLS * BLOCK_SIZE
ctx.canvas.height = ROWS * BLOCK_SIZE
ctx.scale(BLOCK_SIZE, BLOCK_SIZE) // ctx의 크기를 조정. BLOCK_SIZE * BLOCK_SIZE를 1로
// 이렇게 설정해주면 picesc.js 에서 fillRect를 호출할때 크기 인자로 1, 1을 주어도 해당 영역이 칠해짐

let board = new Board()

let dt = 0, step = 0.8, now = timestamp(), last = timestamp()

function animate() {
    now = timestamp()
    update(Math.min(1, (now - last) / 1000.0))
    last = now
    window.requestAnimationFrame(animate)
}

function timestamp() {
    return new Date().getTime()
}

function update(idt) {
    dt = dt + idt
    if (dt > step) {
        dt = dt - step
        let p = moves[KEYS.DOWN](board.piece)
        if (!board.isBottom(p)) {
            board.moveBlock(p)
        } else {
            board.setData(board.piece)
            board.removeLine()
            board.generateBlock()
            animate()
        }
    }
}

function play() {
    if (!isPlay) {
        isPlay = true
        board.reset()
        board.getEmptyBoard()
        board.generateBlock()
        animate()
    }
}

moves = {
    [KEYS.UP]: (p) => ({ ...p}),
    [KEYS.LEFT]: (p) => ({ ...p, x: p.x - 1 }), // ...p (펼침 연산자) p를 얕은 복사
    [KEYS.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
    [KEYS.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
    [KEYS.SPACE]: (p) => ({ ...p, y: p.y + 1})
}

document.addEventListener('keydown', event => {
    let p = moves[event.keyCode](board.piece)
    if (event.keyCode === KEYS.UP) {
        board.changeShape()
    }
    else if (event.keyCode === KEYS.SPACE) {
        board.piece.remove()
        board.clearData(board.piece)
        while(board.valid(p)) {
            board.piece.move(p)
            p = moves[KEYS.DOWN](board.piece)
        }
        p = moves[KEYS.UP](board.piece)
        board.piece.move(p)
        board.setData(board.piece)
        board.piece.draw(currentShape)
    }
    if (moves[event.keyCode]) {
        event.preventDefault()
        board.moveBlock(p)
    }
})