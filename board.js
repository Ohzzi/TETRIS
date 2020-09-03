class Board {
    grid
    piece

    reset() {
        this.grid = this.getEmptyBoard()
    }

    getEmptyBoard() {
        return Array.from(
            { length: ROWS }, () => Array(COLS).fill(0)
            // 새로운 배열 얕은 복사로 return
            // length 속성을 ROWS로 설정
            // Array(COLS)로 COLS 크기의 Array 객체를 생성하고 0으로 fill
        )
    }

    generateBlock() {
        currentShape = nextShape
        currentRotation = 3
        let piece = new Piece(ctx, 4)
        this.piece = piece
        if (this.valid(this.piece)) {
            piece.draw(currentShape)
            this.setData(piece)
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
        this.piece.move(p)
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
        } // 블럭이 차 있는 칸에 데이터를 입력
    }

    clearData(p) {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (shapes[currentShape][currentRotation] & (0x8000 >> (y * 4 + x))) {
                    this.grid[p.y + y][p.x + x] = 0
                }
            }
        } // 블럭이 차 있는 칸에 데이터 삭제
    }

    valid(p) {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (shapes[currentShape][currentRotation] & (0x8000 >> (y * 4 + x))) {
                    if (p.x + x > 11 || p.x + x < 0) return false // 블럭이 좌우 아래쪽을 넘어갔을 때
                    if (p.y + y > 19) {
                        return false
                    } // 블럭이 아래쪽을 넘어갔을 때
                    if (this.grid[p.y + y][p.x + x]) {
                        return false
                    } // 블럭이 이미 쌓여 있는 다른 블럭과 부딪혔을 때
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
    }

    clearLines() {
        let lines = 0
        this.grid.forEach((row, y) => {
            // 모든 값이 0보다 큰지 비교한다.
            if (row.every(value => value > 0)) {
                // 행을 삭제한다.
                lines++
                this.grid.splice(y, 1)
                // 맨 위에 0으로 채워진 행을 추가한다.
                this.grid.unshift(Array(COLS).fill(0))
                this.fillBoard()
            }
        })
        if (lines > 0) {
            account.score += this.getLineClearPoints(lines)
        }
        account.level = this.setLevel(account.score)
    }

    getLineClearPoints(lines) {
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
        this.clearData(this.piece)
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
            this.piece.move(p)
            this.piece.draw(currentShape)
        }
        else {
            this.setData(originalPiece)
        }
    }

    setLevel(score) {
        let level = parseInt(score / 2000) + 1
        if(level > 10) return 10
        else return level
    }
}