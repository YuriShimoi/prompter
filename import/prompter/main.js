// GLOBAL
const FOLDERNAME   = "prompter";
const importScript = (src, format='js') => {
  let f_path   = document.querySelector(`[src*="${FOLDERNAME}"]`).getAttribute('src').split('/').slice(0,-1).join('/');
  let src_file = `${f_path}/${src}.${format}`;
  let src_tag  = format == "js"? `<script src="${src_file}"></script>`: `<link rel="stylesheet" href="${src_file}">`;
  document.writeln(src_tag);
};
importScript("style","css");
importScript("charmap","js");
importScript("elementsupport","js");
importScript("screenconversor","js");


const GLOBAL_VARIABLE_REGISTER = {
  _parseText: (pText) => {
    let keyIndex = -1;
    while((keyIndex = pText.indexOf('${')) !== -1) {
      let keyName  = pText.slice(keyIndex+2, pText.indexOf('}'));
      let keyValue = '';
      if(GLOBAL_VARIABLE_REGISTER._searchByName(keyName)) {
        keyValue = GLOBAL_VARIABLE_REGISTER._getByName(keyName);
      }
      else {
        console.warn(GLOBAL_VARIABLE_REGISTER._warningMessage(keyName));
      }
      
      pText = pText.slice(0, keyIndex)
          + String(keyValue)
          + pText.slice(pText.indexOf('}')+1, pText.length);
    }

    return pText;
  },
  _searchByName: (scKeyName, _iteration=null) => {
    scKeyName = String(scKeyName);
    if(scKeyName.includes('.') && (_iteration?? GLOBAL_VARIABLE_REGISTER) instanceof Object)
      return scKeyName.split('.')[0] in (_iteration?? GLOBAL_VARIABLE_REGISTER)
          && GLOBAL_VARIABLE_REGISTER._searchByName(scKeyName.slice(scKeyName.indexOf('.')+1),
                                                  (_iteration?? GLOBAL_VARIABLE_REGISTER)[scKeyName.split('.')[0]]);
    else
      return (_iteration?? GLOBAL_VARIABLE_REGISTER) instanceof Object && scKeyName in (_iteration?? GLOBAL_VARIABLE_REGISTER);
  },
  _getByName: (gtKeyName, _iteration=null) => {
    if(gtKeyName.includes('.'))
      return GLOBAL_VARIABLE_REGISTER._getByName(gtKeyName.slice(gtKeyName.indexOf('.')+1),
                                                (_iteration?? GLOBAL_VARIABLE_REGISTER)[gtKeyName.split('.')[0]]);
    else
      return (_iteration?? GLOBAL_VARIABLE_REGISTER)[gtKeyName];
  },
  _warningMessage: (warnKeyName) => {
    if(warnKeyName.includes('.')) {
      return `${warnKeyName} not registered in GLOBAL_VARIABLE_REGISTER.`+
            `\nTry:` +
            `\n${warnKeyName} = "SomeStringValue";` +
            `\nGLOBAL_VARIABLE_REGISTER["${warnKeyName.split('.')[0]}"] = ${warnKeyName.split('.')[0]};`;
    }
    else {
      return `${warnKeyName} not registered in GLOBAL_VARIABLE_REGISTER.`+
            `\nTry:` +
            `\nGLOBAL_VARIABLE_REGISTER["${warnKeyName}"] = "SomeStringValue";`;
    }
  }
};


class PrompterPlotting {
  static screen_properties = {
    'map'   : [[]],
    'effect': [[]],
    'width' : 0,
    'height': 0,
    'x'     : 0,
    'y'     : 0
  };
  static prompt_container = null;
  static screen_container = {};

  static DoBox(x, y, sx, sy, type="single", fill=true, color=false, style=false) {
    const isValid = (coord, axis) => {
      if(axis == 0) // y
        return coord >= 0 && coord < PrompterPlotting.screen_properties.map.length;
      else // x
        return coord >= 0 && coord < PrompterPlotting.screen_properties.map[0].length;
    };
    let endx = x + sx + 1;
    let endy = y + sy + 1;
  
    let charmapMiddle = PrompterCharmap.CharMap('middle', type);
    for(let i=y; i <= endy; i++) {
      if(i < 0 || i >= PrompterPlotting.screen_properties.map.length) continue;
      let row = PrompterPlotting.screen_properties.map[i];
      if(i > y && i < endy) {
        row[x]    = PrompterCharmap.CharMap('left' , type, row[x]);
        row[endx] = PrompterCharmap.CharMap('right', type, row[endx]);
      }
  
      for(let l=x; l <= endx; l++) {
        if(l < 0 || l >= PrompterPlotting.screen_properties.map[0].length) continue;
        if(fill) {
          PrompterPlotting.screen_properties.effect[i][l] = {};
          if(l > x && l < endx) {
            PrompterPlotting.screen_properties.map[i][l] = charmapMiddle;
          }
        }
        PrompterPlotting.screen_properties.effect[i][l].color = color;
        PrompterPlotting.screen_properties.effect[i][l].style = style;
  
        if(i == y && (l > x && l < endx)) {
          PrompterPlotting.screen_properties.map[i][l] = PrompterCharmap.CharMap('top', type, PrompterPlotting.screen_properties.map[i][l]);
        }
        if(i == endy && (l > x && l < endx)) {
          PrompterPlotting.screen_properties.map[endy][l] = PrompterCharmap.CharMap('bottom', type, PrompterPlotting.screen_properties.map[endy][l]);
        }
      }
    }
  
    if(isValid(y, 0) && isValid(x, 1))
      PrompterPlotting.screen_properties.map[y][x]       = PrompterCharmap.CharMap('top-left'    , type, PrompterPlotting.screen_properties.map[y][x]);
    if(isValid(y, 0) && isValid(endx, 1))
      PrompterPlotting.screen_properties.map[y][endx]    = PrompterCharmap.CharMap('top-right'   , type, PrompterPlotting.screen_properties.map[y][endx]);
    if(isValid(endy, 0) && isValid(x, 1))
      PrompterPlotting.screen_properties.map[endy][x]    = PrompterCharmap.CharMap('bottom-left' , type, PrompterPlotting.screen_properties.map[endy][x]);
    if(isValid(endy, 0) && isValid(endx, 1))
      PrompterPlotting.screen_properties.map[endy][endx] = PrompterCharmap.CharMap('bottom-right', type, PrompterPlotting.screen_properties.map[endy][endx]);
  }
  
  static DoText(text, x, y, width, height, clip=false, textdec={}, parseText=true, style=false) {
    // textdec = {bold, italic, underlined, color}
  
    // parsing variables
    if(parseText) {
      text  = GLOBAL_VARIABLE_REGISTER._parseText(text);
      width = text.length;
    }
  
    text += ' '; // just for clip adjust purpoises
    
    let pivot = 0;
    let first_word_size = text.split(' ')[0].length;
  
    for(let i = y; i < height+y; i++) {
      for(let l = x; l < width+x; l++) {
        if(!clip && pivot > first_word_size && text[pivot] != ' ' && text.slice(pivot).indexOf(' ') >= ((width+x) - l)) break;
        if((i >= 0&& i < PrompterPlotting.screen_properties.map.length) && (l >= 0 && l < PrompterPlotting.screen_properties.map[i].length)) {
          PrompterPlotting.screen_properties.map[i][l]    = text[pivot];
          PrompterPlotting.screen_properties.effect[i][l] = textdec;
          if(style) PrompterPlotting.screen_properties.effect[i][l].style = style;
        }
        pivot++;
  
        if(pivot+1 >= text.length) break;
      }
      if(pivot+1 >= text.length) break;
    }
  }
  
  static DoProgress(x, y, width=10, height=1, value=50, max=100, textdec={}, cst_char=['', null]) {
    // textdec  = {bold, italic, underlined, color}
    // cst_char = [<fill>,<empty>]
    value  = value  < 0? 0: value > max? max: value;
    width  = width  < 0? 0: width;
    height = height < 1? 1: height;
  
    let fill_char  = cst_char[0] !== ''  ? cst_char[0] != ' '? cst_char[0]: PrompterCharmap.WHITESPACE: '█';
    let empty_char = cst_char[1] !== null? cst_char[1] != ' '? cst_char[1]: PrompterCharmap.WHITESPACE: PrompterCharmap.WHITESPACE;
    let fill_amm   = ((width*height) / max) * value;
    fill_amm       = value <= Math.ceil(max/4)? Math.ceil(fill_amm): value >= Math.floor(max/4)*2? Math.floor(fill_amm): Math.round(fill_amm);
    let empty_amm  = (width * height) - fill_amm;
    let ptext = new Array(fill_amm).fill(fill_char).join('') + new Array(empty_amm).fill(empty_char).join('');
  
    for(let i=0; i < height; i++) {
      PrompterPlotting.DoText(ptext.substr(width*i, width), x, y+parseInt(i), width, 1, true, textdec);
    }
  }
  
  static DoLine(x, y, width, type="single", textdec={}, cst_char=null) {
    width = width  < 0? 0: width;
    let fillChar = cst_char !== null && cst_char !== ''? cst_char: PrompterCharmap.CharMap('top', type);
    let ptext    = new Array(width).fill(fillChar).join('');
    PrompterPlotting.DoText(ptext, x, y, width, 1, true, textdec);
  }
  
  static DoImage(x, y, width, height, source, ignoreList=[], fill=true, color=false, style=false) {
    let pixelBlock = '██';
  
    source = GLOBAL_VARIABLE_REGISTER._parseText(source);
  
    let imageStyle = (style || "") + `;text-shadow: 1px 0 0; color: ${color? color:"var(--color)"}`;
    for(let h=0; h < height; h++) {
      let fillChart = source.split(',').slice(h*width, width+h*width);
      fillChart = fillChart.map(p => ignoreList.includes(p) || ignoreList.includes(p.replaceAll('#',''))? PrompterCharmap.WHITESPACE+PrompterCharmap.WHITESPACE: pixelBlock);
      if(fill || fillChart.includes(pixelBlock)) {
        PrompterPlotting.DoText(fillChart.join(''), x, y+h, width*2, 1, true, color?{'color':color}:{}, false, imageStyle);
      }
    }
  }
}