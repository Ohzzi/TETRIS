class Piece {
    x
    y
    color
    shape
    ctx

    constructor(ctx) {
        this.ctx = ctx
        this.spawn()
    }

    spawn() {
        this.color = colorList[0]
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
}

let currentShape = 0, currentRotation = 3

const colorList = ['#dc143c', '#ff8c00', '#00ffff', '#7fff00', '#ffd700', '#ff69b4', '#000080']

const shapes = [
    [0x4640, 0x0E40, 0x4C40, 0x4E00], // 'T' 
    [0x8C40, 0x6C00, 0x8C40, 0x6C00], // 'S' 
    [0x4C80, 0xC600, 0x4C80, 0xC600], // 'Z' 
    [0x4444, 0x0F00, 0x4444, 0x0F00], // 'I'
    [0x44C0, 0x8E00, 0xC880, 0xE200], // 'J' 
    [0x88C0, 0xE800, 0xC440, 0x2E00], // 'L' 
    [0xCC00, 0xCC00, 0xCC00, 0xCC00] // 'O'
]