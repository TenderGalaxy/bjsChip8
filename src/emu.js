function resetDisplay(){
  let tmp = []
  for(let i = 0; i < 32; i++){
    tmp.push(0)
  }
  display = []
  for(let i = 0; i < 64; i++){
    display.push(tmp)
  }
}


function init(){
  ram = []
  for(let i = 0; i < 4096; i++){
    ram.push(0x0000)
  }
  stack = []
  DT = 0
  ST = 0
  I = 0
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
    
}
