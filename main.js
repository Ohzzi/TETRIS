const canvas = document.getElementById('board')
const ctx = canvas.getContext('2d')

ctx.canvas.width = COLS * BLOCK_SIZE
ctx.canvas.height = ROWS * BLOCK_SIZE

let board = new Board()

function play() {
    if (!isPlay) {
        isPlay = true
        board.reset()
        board.getEmptyBoard()
        let piece = new Piece(ctx)
        piece.draw()
        board.piece = piece
        board.setData(piece) // board의 grid에 현재 블록이 들어있는 칸을 표시
    }
}

ctx.scale(BLOCK_SIZE, BLOCK_SIZE) // ctx의 크기를 조정. BLOCK_SIZE * BLOCK_SIZE를 1로
// 이렇게 설정해주면 picesc.js 에서 fillRect를 호출할때 크기 인자로 1, 1을 주어도 해당 영역이 칠해짐

moves = {
    [KEYS.LEFT]: (p) => ({ ...p, x: p.x - 1 }), // ...p (펼침 연산자) p를 얕은 복사
    [KEYS.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
    [KEYS.DOWN]: (p) => ({ ...p, y: p.y + 1 })
}


document.addEventListener('keydown', event => {
    const originalPiece = board.piece
    if(event.keyCode == KEYS.UP) {
        let p = board.piece
        board.clearData(p)
        p.rotate()
        if(!board.valid(p)) { // 블럭을 회전했을 때 유효하지 않으면
            p.restore()
        }
        else {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            board.piece.draw()
        }
        board.setData(p)
    }
    else if (moves[event.keyCode]) {
        event.preventDefault()
        board.clearData(board.piece) // 이동하기 전에 piece가 있었던 위치를 지워줌
        let p = moves[event.keyCode](board.piece)
        if (board.valid(p)) {
            board.piece.move(p)

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

            board.piece.draw()
            board.setData(p) // board의 grid에 현재 블록이 들어있는 칸을 표시
        }
        else {
            board.setData(originalPiece)
        }
    }
    // console.table(board.grid)
})