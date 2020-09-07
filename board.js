class Board {
    grid
    piece

    reset() {
        this.grid = this.getEmptyBoard()
    }

    getEmptyBoard() {
        return Array.from(
            { length: ROWS }, () => Array(COLS).fill(0)
        )
    }
    /* Return new Array by shallow copy. Set ROWS as the length property
    /* Construct a COLS-sized Array object and fill it with 0  */

    generateBlock() {
        currentShape = nextShape
        currentRotation = 3
        let piece = new Piece(ctx, 4)
        this.piece = piece
        if (this.valid(this.piece)) {
            piece.draw(currentShape)
            this.setNext()
        }
    }

    checkGameOver() {
        for (let x = 4; x < 8; x++) {
            if (this.grid[1][x] !== 0) {
                return true
            }
        }
        return false
    }

    setNext() {
        nextShape = Math.floor(Math.random() * colorList.length)
        let nextPiece = new Piece(nctx, 0)
        const { width, height } = nctx.canvas;
        nctx.clearRect(0, 0, width, height)
        nextPiece.draw(nextShape)
    }

    removePiece() {
        this.piece.remove()
        this.clearData(this.piece)
    }

    drawPiece(p, shape) {
        this.piece.setPosition(p)
        this.setData(this.piece)
        this.piece.draw(shape)
    }

    setData(p) {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (shapes[currentShape][currentRotation] & (0x8000 >> (y * 4 + x))) {
                    this.grid[p.y + y][p.x + x] = currentShape + 1
                }
            }
        } 
    }
    /* Set data in a block */

    clearData(p) {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (shapes[currentShape][currentRotation] & (0x8000 >> (y * 4 + x))) {
                    this.grid[p.y + y][p.x + x] = 0
                }
            }
        }
    }
    /* Clear data in a block */

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

    isBottom(p) {
        let max = [-1, -1, -1, -1]
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (shapes[currentShape][currentRotation] & (0x8000 >> (y * 4 + x))) {
                    if (max[x] < y) max[x] = y
                }
            }
        }
        for (let x = 0; x < 4; x++) {
            if (max[x] !== -1) {
                if (p.y + max[x] > 19 || this.grid[p.y + max[x]][p.x + x]) return true
            }
        }
        return false
    }
    /* Determines if the block is the bottom space that can no longer be moved */

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
        /* deletes the row if it is greater than 0,
        /* and adds a row filled with zeros at the top */
        if (lines > 0) {
            account.score += this.getLineClearPoints(lines)
        }
        account.level = this.setLevel(account.score)
    }

    getLineClearPoints(lines) {
        account.lines += lines
        return lines === 1 ? POINTS.SINGLE : lines === 2 ? POINTS.DOUBLE : lines === 3 ? POINTS.TRIPLE : lines === 4 ? POINTS.TETRIS : 0;
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

    changeShape() {
        this.piece.remove()
        this.piece.rotateBlock()
        if (!this.valid(this.piece)) {
            this.piece.restoreBlock()
            this.piece.draw(currentShape)
        }
        else {
            this.piece.draw(currentShape)
        }
    }

    moveBlock(p) {
        const originalPiece = ({ ...this.piece })
        this.clearData(this.piece)
        if (this.valid(p)) {
            this.piece.remove()
            this.piece.setPosition(p);
            this.piece.draw(currentShape)
        }
        else {
            this.setData(originalPiece)
        }
    }

    setLevel(score) {
        let level = parseInt(score / 2000) + 1
        if (level > 10) return 10
        else return level
    }
}