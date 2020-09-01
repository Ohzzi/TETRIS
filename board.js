class Board {
    grid
    piece
    /*ctx
    nctx

    constructor(ctx, nctx) {
        this.ctx = ctx
        this.nctx = nctx
    }*/

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

    removeLine() {
        this.grid.forEach((row, y) => {
            // 모든 값이 0보다 큰지 비교한다.
            if (row.every(value => value > 0)) {
                // 행을 삭제한다.
                this.grid.splice(y, 1)
                // 맨 위에 0으로 채워진 행을 추가한다.
                this.grid.unshift(Array(COLS).fill(0))
                this.fillBoard()
            }
        })
    }

    fillBoard() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.piece.ctx.fillStyle = colorList[value - 1]
                    this.piece.ctx.fillRect(x, y, 1, 1)
                }
                else {
                    this.piece.ctx.fillStyle = 'white'
                    this.piece.ctx.fillRect(x, y, 1, 1)
                }
            })
        })
    }
}