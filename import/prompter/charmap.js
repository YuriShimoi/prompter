// [top, right, bottom, left]
//  x  [single, double, bold]
const DIRECTIONAL_CHAR_MAP = {
  ' ': [0,0,0,0, 0],

  '┘': [1,0,0,1, 0],
  '┐': [0,0,1,1, 0],
  '┌': [0,1,1,0, 0],
  '└': [1,1,0,0, 0],
  '┤': [1,0,1,1, 0],
  '┴': [1,1,0,1, 0],
  '┬': [0,1,1,1, 0],
  '├': [1,1,1,0, 0],
  '─': [0,1,0,1, 0],
  '│': [1,0,1,0, 0],
  '┼': [1,1,1,1, 0],

  '╝': [1,0,0,1, 1],
  '╗': [0,0,1,1, 1],
  '╔': [0,1,1,0, 1],
  '╚': [1,1,0,0, 1],
  '╣': [1,0,1,1, 1],
  '╩': [1,1,0,1, 1],
  '╦': [0,1,1,1, 1],
  '╠': [1,1,1,0, 1],
  '═': [0,1,0,1, 1],
  '║': [1,0,1,0, 1],
  '╬': [1,1,1,1, 1],

  '┛': [1,0,0,1, 2],
  '┓': [0,0,1,1, 2],
  '┏': [0,1,1,0, 2],
  '┗': [1,1,0,0, 2],
  '┫': [1,0,1,1, 2],
  '┻': [1,1,0,1, 2],
  '┳': [0,1,1,1, 2],
  '┣': [1,1,1,0, 2],
  '━': [0,1,0,1, 2],
  '┃': [1,0,1,0, 2],
  '╋': [1,1,1,1, 2],
}


function charMap(side, type='single', pre=' '){
  // REFERENCE: https://en.wikipedia.org/wiki/Box_Drawing_(Unicode_block)
  let ch = {
    'none': [
      ' ',' ',' ',
      ' ',' ',' ',
      ' ',' ',' '
    ],
    'single': [
      '┌','─','┐',
      '│',' ','│',
      '└','─','┘'
    ],
    'double': [
      '╔','═','╗',
      '║',' ','║',
      '╚','═','╝'
    ],
    'bold': [
      '┏','━','┓',
      '┃',' ','┃',
      '┗','━','┛'
    ],
    'chess': [
      '┌','┬','┐',
      '├','┼','┤',
      '└','┴','┘'
    ],
    'double-chess': [
      '╔','╦','╗',
      '╠','╬','╣',
      '╚','╩','╝'
    ],
    'bold-chess': [
      '┏','┳','┓',
      '┣','╋','┫',
      '┗','┻','┛'
    ]
  }

  let square_map = {
    'top-left'    : 0,
    'top'         : 1,
    'top-right'   : 2,
    'left'        : 3,
    'middle'      : 4,
    'right'       : 5,
    'bottom-left' : 6,
    'bottom'      : 7,
    'bottom-right': 8
  }

  // [top, right, bottom, left]
  let miss_value = {
    'top-left'    : [0,1,1,0],
    'top'         : [0,1,1,1],
    'top-right'   : [0,0,1,1],
    'left'        : [1,1,1,0],
    'middle'      : [1,1,1,1],
    'right'       : [1,0,1,1],
    'bottom-left' : [1,1,0,0],
    'bottom'      : [1,1,0,1],
    'bottom-right': [1,0,0,1]
  }
  
  return mergeChar(ch[type][square_map[side]], pre, miss_value[side]);
}

function mergeChar(ch1, ch2, miss=[0,0,0,0]){
  if(!(ch1 in DIRECTIONAL_CHAR_MAP) || !(ch2 in DIRECTIONAL_CHAR_MAP)) return ch1;
  let cformat1 = DIRECTIONAL_CHAR_MAP[ch1];
  let cformat2 = DIRECTIONAL_CHAR_MAP[ch2];

  let cformat3 = [
    cformat1[0]? 1: cformat2[0]? cformat2[0] - miss[0]: 0,
    cformat1[1]? 1: cformat2[1]? cformat2[1] - miss[1]: 0,
    cformat1[2]? 1: cformat2[2]? cformat2[2] - miss[2]: 0,
    cformat1[3]? 1: cformat2[3]? cformat2[3] - miss[3]: 0,
    cformat1[4]
  ];

  for(let f in DIRECTIONAL_CHAR_MAP){
    if(DIRECTIONAL_CHAR_MAP[f].join('') == cformat3.join('')){
      return f;
    }
  }

  return ch1;
}