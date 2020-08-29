const COLS = 12
const ROWS = 20
const BLOCK_SIZE = 30

const KEYS = {
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    P: 80,
    Q: 81
}
Object.freeze(KEYS) // KEYS 열거형을 불변하게 만듦

let currentShape = 0, currentRotation = 3, isPlay = false

const colorList = ['#dc143c', '#ff8c00', '#00ffff', '#7fff00', '#ffd700', '#ff69b4', '#000080']

const shapes = [
    [0x4640, 0x0E40, 0x4C40, 0x4E00], // 'T' 
    [0x8C40, 0x6C00, 0x8C40, 0x6C00], // 'S' 
    [0x4C80, 0xC600, 0x4C80, 0xC600], // 'Z' 
    [0x4444, 0x0F00, 0x4444, 0xF000], // 'I'
    [0x44C0, 0x8E00, 0xC880, 0xE200], // 'J' 
    [0x88C0, 0xE800, 0xC440, 0x2E00], // 'L' 
    [0xCC00, 0xCC00, 0xCC00, 0xCC00] // 'O'
]