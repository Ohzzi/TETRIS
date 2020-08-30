class Piece {
    x
    y
    color
    ctx

    constructor(ctx) {
        this.ctx = ctx
        this.spawn(Math.floor(Math.random() * colorList.length))
    }

    spawn(rand) {
        currentShape = rand
        this.color = colorList[rand]
        this.x = 4
        this.y = 0
    }

    draw() {
        this.ctx.fillStyle = this.color
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (shapes[currentShape][currentRotation] & (0x8000 >> (y * 4 + x))) {
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1)
                }
                /*
                예를 들어 shapes[0][0] = 0x4640의 
                0x8000 = 1000 0000 0000 0000
                0x4640 = 0100 0110 0100 0000 이므로 & 연산 하면 0000 0000 0000 0000이 나와서 아무것도 칠하지 않음
                다음 for에서 >> 연산 한번 해주면 0x8000 >> = 0100 0000 0000 0000 이므로 & 연산하면 0100 0000 0000 0000이 나와서 fillRect 호출
                모든 for을 돌면 총 16칸에 대해서 데이터가 들어있는 칸을 칠해줌
                */
            }
        }
    }

    move(p) {
        this.x = p.x
        this.y = p.y
    }

    rotateBlock() {
        currentRotation++
        if(currentRotation === 4) currentRotation = 0
    }

    restoreBlock() {
        currentRotation--
        if(currentRotation === -1) currentRotation = 3
    }
}