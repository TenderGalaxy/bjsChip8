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
  display = []
  for(let i = 0; i < 64; i++){
    display[i]  = []
    for(let k = 0; k < 32; k++){
        display[i].push(OFF_COLOR)
    }
  }
}


function init(){
  ON_COLOR =  "@"
  OFF_COLOR = " "
  ram = []
  for(let i = 0; i < 4096; i++){
    ram.push(0x0000)
  }
  for(let i = 0; i < rom.length; i++){
    ram[0x200 + i] = rom[i]
  }
  regs = []
  for(let i = 0; i < 16; i++){
    regs.push(0)
  }
  stack = []
  DT = 0
  ST = 0
  VF = 0
  PC = 0x200
  SP = stack[stack.length - 1]
  I = 0x200
  resetDisplay()
}

function swc0(args){
  switch(args[2]){
    case 14:
      console.log(`Display Reset`)
      resetDisplay()
      break
    default:
      break
  }
}

function interpret(line){
  console.log(`${line.toString(16)} at ${curr_tick}`)
  args = []
  for(let i = 0; i < 4; i++){
    args.push(line % 16)
    line = Math.floor(line/16)
  }
  args.reverse()
  N = args[3]
  NN = 16 * args[2] + args[3]
  NNN = 256 * args[1] + 16 * args[2] + args[3]
  X = args[1]
  Y = args[2]

  switch (args[0]){
    case 0:
      swc0(args)
      break
    case 1:
      console.log(`JUMP TO: ${NNN}`)
      PC = NNN - 1
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
      console.log(`Register ${X} set to ${NN}`)
      regs[X] = NN
      break
    case 7:
      console.log(`Add ${NN} to Register ${X} (Currently ${regs[X]})`)
      regs[X] += NN
      break
    case 8:
      break
    case 9:
      break
    case 0xA:
      I = NNN
      console.log(`Index set to ${NNN.toString(16)} (${ram[NNN].toString(16)})`)
      break
    case 0xB:
      break
    case 0xC:
      break
    case 0xD:
      /* AHHHH DXYN IS HARD */
      console.log(`X ${regs[X] & 63}, Y ${regs[Y] & 31}, Height ${N}`)
      y = regs[Y] & 31
      regs[0xF]  = 0
      idx = I
      for(let i = 0; i < N; i++){
        if(y > 31){
          break
        }
        x = regs[X] & 63
        draw = ram[idx].toString(2)
        while(draw.length < 8){
          draw = "0" + draw
        }
        idx++
        console.log(draw)
        
        for(let k = 0; k < draw.length; k++){
          x++
          if(x > 63){
            break
          }
          if(draw[k] == 1){
            if(display[x][y] == ON_COLOR){
              display[x][y] = OFF_COLOR
              regs[0xF] = 1
            } else {
              display[x][y] = ON_COLOR
            }
          }
        }
        y++
        
      }
      displ()
      break
    case 0xE:
      break
    case 0xF:
      break
    
    }
}

function displ(){
    
  coord = [-32,32,0]
  for(let i = 0; i < display[0].length; i++){
    coord[1] = 32
    j = ""
    for(let k = 0; k < display.length; k++){
      j += display[k][i]
      coord[1]--
    }
    console.log(j)
    coord[0] ++
  }
  
}

const rom = [
	0x00, 0xE0, 0xA2, 0x2A, 0x60, 0x0C, 0x61, 0x08, 0xD0, 0x1F, 0x70, 0x09,
	0xA2, 0x39, 0xD0, 0x1F, 0xA2, 0x48, 0x70, 0x08, 0xD0, 0x1F, 0x70, 0x04,
	0xA2, 0x57, 0xD0, 0x1F, 0x70, 0x08, 0xA2, 0x66, 0xD0, 0x1F, 0x70, 0x08,
	0xA2, 0x75, 0xD0, 0x1F, 0x12, 0x28, 0xFF, 0x00, 0xFF, 0x00, 0x3C, 0x00,
	0x3C, 0x00, 0x3C, 0x00, 0x3C, 0x00, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0xFF,
	0x00, 0x38, 0x00, 0x3F, 0x00, 0x3F, 0x00, 0x38, 0x00, 0xFF, 0x00, 0xFF,
	0x80, 0x00, 0xE0, 0x00, 0xE0, 0x00, 0x80, 0x00, 0x80, 0x00, 0xE0, 0x00,
	0xE0, 0x00, 0x80, 0xF8, 0x00, 0xFC, 0x00, 0x3E, 0x00, 0x3F, 0x00, 0x3B,
	0x00, 0x39, 0x00, 0xF8, 0x00, 0xF8, 0x03, 0x00, 0x07, 0x00, 0x0F, 0x00,
	0xBF, 0x00, 0xFB, 0x00, 0xF3, 0x00, 0xE3, 0x00, 0x43, 0xE0, 0x00, 0xE0,
	0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0xE0, 0x00, 0xE0
];

curr_tick = 0
comm = 1
init()
while(comm != 0){
  comm = ram[PC]
  PC++
  comm = 256 * comm + ram[PC]
  PC++
  interpret(comm)
  curr_tick++
}
