const leftBtn = document.getElementById('left')
const rightBtn = document.getElementById('right')
const downBtn = document.getElementById('down')
const dropBtn = document.getElementById('space')
const changeBtn = document.getElementById('change')
const pauseBtn = document.getElementById('pause')

leftBtn.addEventListener('click', () => {
    handleButtonPress(KEYS.LEFT)
})
rightBtn.addEventListener('click', () => {
    handleButtonPress(KEYS.RIGHT)
})
downBtn.addEventListener('click', () => {
    handleButtonPress(KEYS.DOWN)
})
dropBtn.addEventListener('click', () => {
    handleButtonPress(KEYS.SPACE)
})
changeBtn.addEventListener('click', () => {
    handleButtonPress(KEYS.UP)
})
pauseBtn.addEventListener('click', () => {
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
})

function handleButtonPress(code) {
    let p = moves[code](board.piece)
    if (code === KEYS.UP) {
        board.changeShape()
    }
    /* If KEY.UP is pressed, change the shape of piece */
    else if (code === KEYS.SPACE) {
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
    else if (moves[code]) {
        event.preventDefault()
        board.movePiece(p)
    }
    /* Else move a piece */
}
