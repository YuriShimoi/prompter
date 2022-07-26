class PrompterCharmap {
  static WHITESPACE = " ";
  // [top, right, bottom, left]
  //  x  [single, double, bold]
  static DIRECTIONAL_CHAR_MAP = {
    ' ': [[0,0,0,0, 0], [0,0,0,0, 0].join('')],
  
    '┘': [[1,0,0,1, 0], [1,0,0,1, 0].join('')],
    '┐': [[0,0,1,1, 0], [0,0,1,1, 0].join('')],
    '┌': [[0,1,1,0, 0], [0,1,1,0, 0].join('')],
    '└': [[1,1,0,0, 0], [1,1,0,0, 0].join('')],
    '┤': [[1,0,1,1, 0], [1,0,1,1, 0].join('')],
    '┴': [[1,1,0,1, 0], [1,1,0,1, 0].join('')],
    '┬': [[0,1,1,1, 0], [0,1,1,1, 0].join('')],
    '├': [[1,1,1,0, 0], [1,1,1,0, 0].join('')],
    '─': [[0,1,0,1, 0], [0,1,0,1, 0].join('')],
    '│': [[1,0,1,0, 0], [1,0,1,0, 0].join('')],
    '┼': [[1,1,1,1, 0], [1,1,1,1, 0].join('')],
  
    '╝': [[1,0,0,1, 1], [1,0,0,1, 1].join('')],
    '╗': [[0,0,1,1, 1], [0,0,1,1, 1].join('')],
    '╔': [[0,1,1,0, 1], [0,1,1,0, 1].join('')],
    '╚': [[1,1,0,0, 1], [1,1,0,0, 1].join('')],
    '╣': [[1,0,1,1, 1], [1,0,1,1, 1].join('')],
    '╩': [[1,1,0,1, 1], [1,1,0,1, 1].join('')],
    '╦': [[0,1,1,1, 1], [0,1,1,1, 1].join('')],
    '╠': [[1,1,1,0, 1], [1,1,1,0, 1].join('')],
    '═': [[0,1,0,1, 1], [0,1,0,1, 1].join('')],
    '║': [[1,0,1,0, 1], [1,0,1,0, 1].join('')],
    '╬': [[1,1,1,1, 1], [1,1,1,1, 1].join('')],
  
    '┛': [[1,0,0,1, 2], [1,0,0,1, 2].join('')],
    '┓': [[0,0,1,1, 2], [0,0,1,1, 2].join('')],
    '┏': [[0,1,1,0, 2], [0,1,1,0, 2].join('')],
    '┗': [[1,1,0,0, 2], [1,1,0,0, 2].join('')],
    '┫': [[1,0,1,1, 2], [1,0,1,1, 2].join('')],
    '┻': [[1,1,0,1, 2], [1,1,0,1, 2].join('')],
    '┳': [[0,1,1,1, 2], [0,1,1,1, 2].join('')],
    '┣': [[1,1,1,0, 2], [1,1,1,0, 2].join('')],
    '━': [[0,1,0,1, 2], [0,1,0,1, 2].join('')],
    '┃': [[1,0,1,0, 2], [1,0,1,0, 2].join('')],
    '╋': [[1,1,1,1, 2], [1,1,1,1, 2].join('')],
  };
  
  static CHARMAP_CHAR = {
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
  };
  
  static CHARMAP_SQUARE_MAP = {
    'top-left'    : 0,
    'top'         : 1,
    'top-right'   : 2,
    'left'        : 3,
    'middle'      : 4,
    'right'       : 5,
    'bottom-left' : 6,
    'bottom'      : 7,
    'bottom-right': 8
  };
  
  // [top, right, bottom, left]
  static CHARMAP_MISS_VALUE = {
    'top-left'    : [0,1,1,0],
    'top'         : [0,1,1,1],
    'top-right'   : [0,0,1,1],
    'left'        : [1,1,1,0],
    'middle'      : [1,1,1,1],
    'right'       : [1,0,1,1],
    'bottom-left' : [1,1,0,0],
    'bottom'      : [1,1,0,1],
    'bottom-right': [1,0,0,1]
  };
  
  static charMap(side, type='single', pre=' ') {
    // REFERENCE: https://en.wikipedia.org/wiki/Box_Drawing_(Unicode_block)
    if(!(type in PrompterCharmap.CHARMAP_CHAR)) return '';
    return PrompterCharmap.mergeChar(PrompterCharmap.CHARMAP_CHAR[type][PrompterCharmap.CHARMAP_SQUARE_MAP[side]], pre, PrompterCharmap.CHARMAP_MISS_VALUE[side]);
  }
  
  static mergeChar(ch1, ch2, miss=[0,0,0,0]) {
    if(!(ch1 in PrompterCharmap.DIRECTIONAL_CHAR_MAP) || !(ch2 in PrompterCharmap.DIRECTIONAL_CHAR_MAP)) return ch1;
    let cformat1 = PrompterCharmap.DIRECTIONAL_CHAR_MAP[ch1][0];
    let cformat2 = PrompterCharmap.DIRECTIONAL_CHAR_MAP[ch2][0];
  
    let cformat3 = [
      cformat1[0] || cformat2[0] && !miss[0]? 1: 0,
      cformat1[1] || cformat2[1] && !miss[1]? 1: 0,
      cformat1[2] || cformat2[2] && !miss[2]? 1: 0,
      cformat1[3] || cformat2[3] && !miss[3]? 1: 0,
      cformat1[4]
    ].join('');
  
    for(let f in PrompterCharmap.DIRECTIONAL_CHAR_MAP) {
      if(PrompterCharmap.DIRECTIONAL_CHAR_MAP[f][1] == cformat3) {
        return f;
      }
    }
  
    return ch1;
  }
}