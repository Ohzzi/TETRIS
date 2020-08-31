const canvas = document.getElementById('board')
const ctx = canvas.getContext('2d')

ctx.canvas.width = COLS * BLOCK_SIZE
ctx.canvas.height = ROWS * BLOCK_SIZE

let board = new Board()

let dt = 0, step = 0.4, now = timestamp(), last = timestamp()

function animate() {
    now = timestamp()
    update(Math.min(1, (now - last) / 2000.0))
    last = now
    window.requestAnimationFrame(animate)
}

function timestamp() {
    return new Date().getTime()
}

function update(idt) {
    dt = dt + idt
    if(dt > step) {
        dt = dt - step
        const p = moves[KEYS.DOWN](board.piece)
        console.log(board.isBottom(p))
        if(!board.isBottom(p)){
            board.clearData(board.piece)
            board.piece.remove()
            board.piece.y++
            board.piece.draw()
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
    let piece = new Piece(ctx)
    board.piece = piece
    piece.draw()
    board.setData(piece)
}

ctx.scale(BLOCK_SIZE, BLOCK_SIZE) // ctx의 크기를 조정. BLOCK_SIZE * BLOCK_SIZE를 1로
// 이렇게 설정해주면 picesc.js 에서 fillRect를 호출할때 크기 인자로 1, 1을 주어도 해당 영역이 칠해짐

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
        board.piece.draw()
    }
    else {
        board.piece.draw()
    }
    board.setData(p)
}

function moveBlock(p) {
    const originalPiece = ({ ...board.piece })
    board.clearData(board.piece)
    if (board.valid(p)) {
        board.piece.remove()
        board.piece.move(p)
        board.piece.draw()
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