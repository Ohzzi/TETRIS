class Piece {
    x
    y
    ctx

    constructor(ctx, pos) {
        this.ctx = ctx
        this.x = pos
        this.y = 0
    }

    draw(shape) {
        this.ctx.fillStyle = colorList[shape]
        this.fillBlock(shape)
    }

    fillBlock(shape) {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (shapes[shape][currentRotation] & (0x8000 >> (y * 4 + x))) {
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1)
                }
                /* For Example, shapes[0][0] = 0x4640 can be represented as 0100 0110 0100 0000
                /* And 0x8000 is 1000 0000 0000 0000
                /* So & operation gives 0000 0000 0000 0000
                /* Then we paint nothing
                /* If you do the >> operation in the next for, then we get 0100 0000 0000 0000
                /* So 0100 0000 0000 0000 is returned by & operation
                /* Then fillRect is called
                /* If you go through all the loops, the cells containing data will be painted for 16 cells. */
            }
        }
    }

    remove() {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (shapes[currentShape][currentRotation] & (0x8000 >> (y * 4 + x))) {
                    this.ctx.clearRect(this.x + x, this.y + y, 1, 1)
                }
            }
        }
    }

    setPosition(p) {
        this.x = p.x
        this.y = p.y
    }

    rotateBlock() {
        currentRotation++
        if (currentRotation === 4) currentRotation = 0
    }

    restoreBlock() {
        currentRotation--
        if (currentRotation === -1) currentRotation = 3
    }
}