/* GOALS   */
/* Support Every Command
8XY6
8XYE
BNNN
CXNN
EX9E
EXA1
FX07
FX15
FX18
FX13
FX0A
FX29
FX33
FX55
FX65
*/
function toggles(){
	toggleShiftEmu = true // Only true for OG Chip-8 Programs (Not Chip-48 or Super Chip)
}
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
  ON_COLOR =  "Black Concrete"
  OFF_COLOR = "White Concrete"
  ram = []
  for(let i = 0; i < 4096; i++){
    ram.push(0x0000)
  }
}

function swc0(args){
  switch(args[3]){
    case 0:
      api.log(`Display Reset`)
      resetDisplay()
      break
		case 14:
			X = stack.pop()
			api.log(`Returning from subroutine ${PC} into ${X}`)
	 		PC = X
  }
}
function scw8(X,Y,N){
	switch(N){
		case 0:
			api.log(`Set register ${X} (${regs[X]}) to register ${Y} (${regs[Y]})`)
			regs[X] = regs[Y]
			break
		case 1:
			api.log(`Set register ${X} (${regs[X]}) to register ${Y} (${regs[Y]}) Binary OR`)
			regs[X] = regs[Y] || regs[X]
			break
		case 2:
			api.log(`Set register ${X} (${regs[X]}) to register ${Y} (${regs[Y]}) Binary AND`)
			regs[X] = regs[Y] && regs[X]
			break
		case 3:
			api.log(`Set register ${X} (${regs[X]}) to register ${Y} (${regs[Y]}) Logical XOR`)
			regs[X] = regs[X] ^ regs[Y]
			break
		case 4:
			api.log(`Set register ${X} (${regs[X]}) to register ${Y} (${regs[Y]}) ADD`)
			regs[X] = regs[Y] + regs[X]
			regs[15] = 0 
			if(regs[X] > 255){
				regs[X] = regs[X] % 255
				regs[15] = 1
			}
			break
		case 5:
			api.log(`Set register ${X} (${regs[X]}) to register ${Y} (${regs[Y]}) SubtractXY`)
			regs[X] = regs[X] - regs[Y]
			regs[15] = 0
			if(regs[X] < 0){
				regs[X] = regs[X] + 255
				regs[15] = 1
			}
			break
		case 7:
			api.log(`Set register ${X} (${regs[X]}) to register ${Y} (${regs[Y]}) SubtractYX`)
			regs[X] = regs[Y] - regs[X]
			regs[15] = 0
			if(regs[X] < 0){
				regs[X] = regs[X] + 255
				regs[15] = 1
			}
			break
		
	}
}

function init2(){
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
function init3(){
	toggles()
	for(let i = -4; i < 4; i++){
		api.setBlockRect([i*8,32,0],[i*8+8,0,0],"White Concrete")
	}
}

function interpret(line){
  api.log(`${line.toString(16)} at ${curr_tick}`)
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
      api.log(`Jump to: ${NNN}`)
      PC = NNN - 1
      break
    case 2:
			api.log(`Entering Routine ${NNN} from ${PC}`)
			stack.push(PC)
			PC = NNN
      break
    case 3:
		  if(regs[X] == NN){
				PC += 2
			}
      break
    case 4:
			if(regs[X] != NN){
				PC += 2
			}
      break
    case 5:
			if(regs[X] == regs[Y] & N == 0){
				PC += 2
			}
      break
    case 6:
      api.log(`Register ${X} set to ${NN}`)
      regs[X] = NN
      break
    case 7:
      api.log(`Add ${NN} to Register ${X} (Currently ${regs[X]})`)
      regs[X] += NN
      break
    case 8:
			scw8(X,Y,N)
      break
    case 9:
			if(regs[X] != regs[Y] & N == 0){
				PC += 2
			}
      break
    case 0xA:
      I = NNN
      api.log(`Index set to ${NNN.toString(16)} (${ram[NNN].toString(16)})`)
      break
    case 0xB:
      break
    case 0xC:
      break
    case 0xD:
      /* AHHHH DXYN IS HARD */
      api.log(`X ${regs[X] & 63}, Y ${regs[Y] & 31}, Height ${N}`)
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
			api.setBlock([-32 + x, 32 - y, 0], display[x][y])
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
  for(let i = 0; i < display[0].length; i++){
    coord[0] = -32
    for(let k = 0; k < display.length; k++){
      if(display[k][i] == ON_COLOR){
        api.setBlock(coord, ON_COLOR)
      } else {
        api.setBlock(coord, OFF_COLOR)
      }
      coord[0]++
    }
    coord[1]--
  }
  
}

const rom = [
	// Offset 0x00000000 to 0x00000083
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




function tick(){
	
	try{flag} catch {
		console.log("fenl_'s Bloxd Chip-8 emulator")
		flag = "INIT"
    curr_tick = 0
    comm = 1
		comms = 0
    init()
	}
	switch (flag) {
		case "RUNNING":
			comm = ram[PC]
    	PC++
    	comm = 256 * comm + ram[PC]
    	PC++
			console.log(comm)
    	interpret(comm)
    	curr_tick++
    	if(comm == 0){
				comms ++
				if(comms > 30){
     	 		flag = "OFF"
				}
    	} else {
				comms = 0
			}
			break
		case "INIT3":
			init3()
			flag = "RUNNING"
			break
		case "INIT2":
			init2()
			flag = "INIT3"
			break
		case "INIT":
			flag = "INIT2"
			break
	}
	
}
