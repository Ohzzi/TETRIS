class Board {
    grid
    piece
    ghost

    reset() {
        this.grid = this.getEmptyBoard()
    }
    
    getEmptyBoard() {
        return Array.from(
            { length: ROWS }, () => Array(COLS).fill(0)
        )
    }
    /* Return new Array by shallow copy. Set ROWS as the length property
    * Construct a COLS-sized Array object and fill it with 0  */

    generatePiece() {
        currentShape = nextShape
        currentRotation = 0
        this.piece = new Piece(ctx, 4)
        this.piece.draw(currentShape)
        this.setNext()
        this.makeGhost()
    }
    /* Generate new piece and ghost */

    checkGameOver() {
        for (let x = 4; x < 8; x++) {
            if (this.grid[1][x] !== 0) {
                return true
            }
        }
        return false
    }
    /* The new piece will be generated at the first column
    * So if this.grid[1][4] ~ this.grid[1][7] have value, the game will be over */

    setNext() {
        nextShape = Math.floor(Math.random() * colorList.length)
        let nextPiece = new Piece(nctx, 0)
        const { width, height } = nctx.canvas
        nctx.clearRect(0, 0, width, height)
        nextPiece.draw(nextShape)
    }
    /* Make a piece which will be next */

    removePiece() {
        this.piece.remove()
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (shapes[currentShape][currentRotation] & (0x8000 >> (y * 4 + x))) {
                    this.grid[this.piece.y + y][this.piece.x + x] = 0
                }
            }
        }
    }

    freezePiece(p) {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (shapes[currentShape][currentRotation] & (0x8000 >> (y * 4 + x))) {
                    this.grid[p.y + y][p.x + x] = currentShape + 1
                }
            }
        }
    }
    /* Make the piece immobile */

    valid(p) {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (shapes[currentShape][currentRotation] & (0x8000 >> (y * 4 + x))) {
                    if (p.x + x > 11 || p.x + x < 0) return false
                    /* When the block goes over the side lines */
                    if (p.y + y > 19) {
                        return false
                    } /* When the block goes over the bottom line */
                    if (this.grid[p.y + y][p.x + x]) {
                        return false
                    } /* When the block hits another block already stacked */
                }
            }
        }
        return true
    }

    clearLines() {
        let lines = 0
        this.grid.forEach((row, y) => {
            if (row.every(value => value > 0)) {
                lines++
                this.grid.splice(y, 1)
                this.grid.unshift(Array(COLS).fill(0))
                this.fillBoard()
            }
        })
        /* Compares whether all values ​​of each row in the grid are greater than 0,
        * deletes the row if it is greater than 0,
        * and adds a row filled with zeros at the top */
        if (lines > 0) {
            account.score += this.getLineClearPoints(lines)
        }
        account.level = this.setLevel(account.score)
    }

    getLineClearPoints(lines) {
        account.lines += lines
        return lines === 1 ? POINTS.SINGLE : lines === 2 ? POINTS.DOUBLE : lines === 3 ? POINTS.TRIPLE : lines === 4 ? POINTS.TETRIS : 0
    }

    fillBoard() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.piece.ctx.fillStyle = colorList[value - 1]
                    this.piece.ctx.fillRect(x, y, 1, 1)
                }
                else {
                    this.piece.ctx.clearRect(x, y, 1, 1)
                }
            })
        })
    }
    /* If there is data while traversing all the cells,
    * paint it with the appropriate color. */

    makeGhost() {
        this.ghost = new Piece(ctx, 4)
        this.ghost.setPosition(this.piece)
        let p = { ...this.ghost }
        while (this.valid(p)) {
            this.ghost.setPosition(p)
            p.y++
        }
        this.ghost.ctx.fillStyle = '#E2E2E2'
        this.ghost.fillBlock(currentShape)
    }
    /* Draw a gray block on the floor
    * It is called 'ghost' */

    removeGhost() {
        this.ghost.remove()
    }

    changeShape() {
        this.removePiece()
        this.piece.rotateBlock()
        if (!this.valid(this.piece)) {
            this.piece.restoreBlock()
        }
            this.makeGhost()
            this.piece.draw(currentShape)
    }
    /* Rotate the piece clockwise
    * If it is not valid, it returns to the original state */

    movePiece(p) {
        if (this.valid(p)) {
            this.removePiece()
            this.piece.setPosition(p)
            this.makeGhost()
            this.piece.draw(currentShape)
        }
    }
    /* Make this.piece at the position of parameter p
    * Then draw a new ghost */

    removePiece() {
        this.piece.remove()
        this.ghost.remove()
    }

    setLevel(score) {
        let level = parseInt(score / 2000) + 1
        if (level > 10) return 10
        else return level
    }
}