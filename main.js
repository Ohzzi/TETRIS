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

let dt = 0, step = 0.4, now = timestamp(), last = timestamp()

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
        const p = moves[KEYS.DOWN](board.piece)
        if (!board.isBottom(p)) {
            board.clearData(board.piece)
            board.piece.remove()
            board.piece.y++
            board.piece.draw(currentShape)
            board.setData(board.piece)
        } else {
            board.removeLine()
            generateBlock()
            animate()
        }
    }
}

function play() {
    if (!isPlay) {
        isPlay = true
        board.reset()
        board.getEmptyBoard()
        generateBlock()
        animate()
    }
}

function generateBlock() {
    currentShape = nextShape
    currentRotation = 3
    nextShape = Math.floor(Math.random() * colorList.length)
    let nextPiece = new Piece(nctx, nextShape, 0)
    const { width, height } = nctx.canvas;
    nctx.clearRect(0, 0, width, height)
    nextPiece.draw(nextShape)
    let piece = new Piece(ctx, currentShape, 4)
    board.piece = piece
    piece.draw(currentShape)
    board.setData(piece)
    /*nctx.fillStyle = colorList[nextShape]
        for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (shapes[nextShape][3] & (0x8000 >> (y * 4 + x))) {
                nctx.fillRect(x, y, 1, 1)
            }
        }
    }*/
}

moves = {
    [KEYS.LEFT]: (p) => ({ ...p, x: p.x - 1 }), // ...p (펼침 연산자) p를 얕은 복사
    [KEYS.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
    [KEYS.DOWN]: (p) => ({ ...p, y: p.y + 1 })
}

function keyUp() {
    let p = board.piece
    board.piece.remove()
    board.clearData(p)
    p.rotateBlock()
    if (!board.valid(p)) {
        p.restoreBlock()
        board.piece.draw(currentShape)
    }
    else {
        board.piece.draw(currentShape)
    }
    board.setData(p)
}

function moveBlock(p) {
    const originalPiece = ({ ...board.piece })
    board.clearData(board.piece)
    if (board.valid(p)) {
        board.piece.remove()
        board.piece.move(p)
        board.piece.draw(currentShape)
        board.setData(p) // board의 grid에 현재 블록이 들어있는 칸을 표시
    }
    else {
        board.setData(originalPiece)
    }
}

document.addEventListener('keydown', event => {
    if (event.keyCode == KEYS.UP) {
        keyUp()
    }
    else if (moves[event.keyCode]) {
        event.preventDefault()
        let p = moves[event.keyCode](board.piece)
        moveBlock(p)
    }
})