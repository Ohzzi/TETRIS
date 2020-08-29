class Board {
    grid

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
                    this.grid[p.y + y][p.x + x] = 1
                }
            }
        }
    }
    
    clearData(p) {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (shapes[currentShape][currentRotation] & (0x8000 >> (y * 4 + x))) {
                    this.grid[p.y + y][p.x + x] = 0
                }
            }
        }
    }

    valid(p) {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (shapes[currentShape][currentRotation] & (0x8000 >> (y * 4 + x))) {
                    if(p.x + x > 11 || p.x + x < 0 || p.y+y > 19) return false // 블럭이 좌우 또는 아래쪽을 넘어갔을 때
                    //if(p.y + y > 19) result = false // 블럭이 아래쪽을 넘어갔을 때
                    if(this.grid[p.y + y][p.x + x]) return false // 블럭이 이미 쌓여 있는 다른 블럭과 부딪혔을 때
                }
            }
        }
        return true
    }
}