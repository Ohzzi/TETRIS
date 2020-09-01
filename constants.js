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

const colorList = ['#dc143c', '#ff8c00', '#00ffff', '#7fff00', '#ffd700', '#ff69b4', '#000080']

let currentShape = 0,
    nextShape = Math.floor(Math.random() * colorList.length),
    currentRotation = 3,
    isPlay = false


/*const shapes = [
    [0x4640, 0x0E40, 0x4C40, 0x4E00], // 'T' 
    [0x8C40, 0x6C00, 0x8C40, 0x6C00], // 'S' 
    [0x4C80, 0xC600, 0x4C80, 0xC600], // 'Z' 
    [0x4444, 0xF000, 0x4444, 0xF000], // 'I'
    [0xC880, 0xE200, 0x44C0, 0x8E00], // 'J' 
    [0x88C0, 0xE800, 0xC440, 0x2E00], // 'L' 
    [0xCC00, 0xCC00, 0xCC00, 0xCC00] // 'O'
]*/

const shapes = [
    [0x2320, 0x0720, 0x2620, 0x2700], // 'T' 
    [0x4620, 0x3600, 0x4620, 0x3600], // 'S' 
    [0x2640, 0x6300, 0x2640, 0x6300], // 'Z' 
    [0x4444, 0xF000, 0x4444, 0xF000], // 'I'
    [0x6440, 0x7100, 0x2260, 0x4700], // 'J' 
    [0x4460, 0x7400, 0x6220, 0x1700], // 'L' 
    [0x6600, 0x6600, 0x6600, 0x6600] // 'O'
] // 위치 수정