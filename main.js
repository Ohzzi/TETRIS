
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

if(!isMobile) saveHighScore()
deviceCheck()

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
            board.freezePiece(board.piece)
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
                saveHighScore()
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

function setCookie(name, value, day) {
    let date = new Date()
    date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000)
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/'
}

function getCookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
    return value? value[2] : null
}

function deleteCookie(name) {
    let date = new Date()
    document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/"
}

function saveHighScore() {
    if(isMobile) return
    const highScore = getCookie('score')
    const currentScore = accountValues.score
    if(highScore === null || highScore < currentScore) {
        deleteCookie('score')
        setCookie('score', currentScore, 10)
        HIGHSCORE.textContent = currentScore
    }
    else {
        HIGHSCORE.textContent = highScore
    }
}

function deviceCheck() {
    let pcDevice = "win16|win32|win64|mac|macintel"

    if (navigator.platform) {
        if (pcDevice.indexOf(navigator.platform.toLowerCase()) < 0) {
            //isMobile = true
            //window.location.replace("./mobile.html")
        }
        else {

        }
    }
}