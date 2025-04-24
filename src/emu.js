/* GOALS */
/* Write IBM Logo
00E0
1NNN
6XNN
7XNN
ANNN
DXYN
*/

function resetDisplay(){
  let tmp = []
  for(let i = 0; i < 32; i++){
    tmp.push(OFF_COLOR)
  }
  display = []
  for(let i = 0; i < 64; i++){
    display.push(tmp)
  }
}


function init(){
  ON_COLOR = 1
  OFF_COLOR = 0
  ram = []
  for(let i = 0; i < 4096; i++){
    ram.push(0x0000)
  }
  regs = []
  for(let i = 0; i < 16; i++){
    regs.push(0)
  }
  stack = []
  DT = 0
  ST = 0
  IDX = 0
  VF = 0
  PC = 0x200
  SP = stack[stack.length - 1]
  resetDisplay()
}

function swc0(args){
  switch(args[3]){
    case 0xE:
      resetDisplay()
      break
  }
}

function interpret(line){
  args = []
  for(let i = 0; i < 4; i++){
    args.push(line % 16)
    line >> 4
  }
  args.reverse()

  switch (args[0]){
    case 0:
      scw0(args)
      break
    case 1:
      PC = (256 * args[1] + 16 * args[2] + args[3])
      break
    case 2:
      break
    case 3:
      break
    case 4:
      break
    case 5:
      break
    case 6:
      regs[args[1]] = (16 * args[2] + args[3])
      break
    case 7:
      regs[args[1]] += (16 * args[2] + args[3])
      break
    case 8:
      break
    case 9:
      break
    case 0xA:
      IDX = (256 * args[1] + 16 * args[2] + args[3])
      break
    case 0xB:
      break
    case 0xC:
      break
    case 0xD:
      /* AHHHH DXYN IS HARD */
      y = regs[args[1] & 31]
      VF = 0
      for(let i = 0; i < args[2]; i++){
        if(y > 31){
          break
        }
        x = regs[args[1] & 63]
        N = ram[I]
        I++
        N = N.toString(2)
        for(let k = 0; k < N; k++){
          if(N[k] == 1){
            if(display[x][y] == ON_COLOR){
              display[x][y] = OFF_COLOR
              VF = 1
            } else {
              display[x][y] = ON_COLOR
            }
          }
          if(x < 63){
            x++
          }
        }
        y++
      }
      break
    case 0xE:
      break
    case 0xF:
      break
    
    }
}

function displ(){
  coord = [-32,32,0]
  for(let i = 0; i < display.length; i++){
    coord[1] = 32
    j = ""
    for(let k = 0; k < display[0].length; k++){
      if(display[i][k] == OFF_COLOR){
        j += "*"
      } else {
        j += " "
      }
      coord[1]--
    }
    console.log(j)
    coord[0] ++
  }
}

const rom = [
	0x00E0, 0xA22A, 0x600C, 0x6108, 0xD01F, 0x7009,
	0xA239, 0xD01F, 0xA248, 0x7008, 0xD01F, 0x7004,
	0xA257, 0xD01F, 0x7008, 0xA266, 0xD01F, 0x7008,
	0xA275, 0xD01F, 0x1228, 0xFF00, 0xFF00, 0x3C00,
	0x3C00, 0x3C00, 0x3C00, 0xFF00, 0xFFFF, 0x00FF,
	0x0038, 0x003F, 0x003F, 0x0038, 0x00FF, 0x00FF,
	0x8000, 0xE000, 0xE000, 0x8000, 0x8000, 0xE000,
	0xE000, 0x80F8, 0x00FC, 0x003E, 0x003F, 0x003B,
	0x0039, 0x00F8, 0x00F8, 0x0300, 0x0700, 0x0F00,
	0xBF00, 0xFB00, 0xF300, 0xE300, 0x43E0, 0x00E0,
	0x0080, 0x0080, 0x0080, 0x0080, 0x00E0, 0x00E0
]

init()
displ()
while(PC < data.length + 0x200){
  interpret(rom[PC] - 0x200)
  PC++
  if(PC % 10 == 0){
    displ()
  }
}
