// START
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
let prompt_container = null;
let screen_container = null;
let screen = {
  'map'      : [[]],
  'effect'   : [[]],
  'decorator': [[]],
  'width'    : 0,
  'height'   : 0
};


// FUNCTIONS
function calcScreenSize(){ /* 8.8px width x 19px height */
  if(prompt_container === null) return;
  let prwidth  = prompt_container.offsetWidth  / 8.8;
  let prheight = prompt_container.offsetHeight /  19;

  screen.width     = Math.floor(prwidth);
  screen.height    = Math.floor(prheight);
  screen.map       = new Array(screen.height).fill().map(_ => new Array(screen.width).fill(' '));
  screen.effect    = new Array(screen.height).fill().map(_ => new Array(screen.width).fill().map(e => new Array(4).fill(false)));
  screen.decorator = new Array(screen.height).fill().map(_ => new Array(screen.width).fill(''));
}

function drawScreen(){
  let html    = '';
  let effect  = [false, false, false, ''];
  let openeds = '';
  
  for(let y=0; y < screen.map.length; y++){
    for(let x=0; x < screen.map[y].length; x++){
      try{
        // EXCLUDING
        if((!screen.effect[y][x][0] || screen.effect[y][x][0] == effect[0]) && !screen.effect[y][x][0] && effect[0]) {
          html     += openeds.includes('b')? '</b>': '';
          effect[0] = false;
          openeds   = openeds.split('b').slice(0,-1).join('b') + openeds.split('b').slice(-1)[0];
        }
        if((!screen.effect[y][x][1] || screen.effect[y][x][1] == effect[1]) && !screen.effect[y][x][1] && effect[1]) {
          html     += openeds.includes('i')? '</i>': '';
          effect[1] = false;
          openeds   = openeds.split('i').slice(0,-1).join('i') + openeds.split('i').slice(-1)[0];
        }
        if((!screen.effect[y][x][2] || screen.effect[y][x][2] == effect[2]) && !screen.effect[y][x][2] && effect[2]) {
          html     += openeds.includes('u')? '</u>': '';
          effect[2] = false;
          openeds   = openeds.split('u').slice(0,-1).join('u') + openeds.split('u').slice(-1)[0];
        }
        if((!screen.effect[y][x][3] || screen.effect[y][x][3] == effect[3]) && !screen.effect[y][x][3] && effect[3]) {
          while(openeds.includes('span')){
            html   += '</span>';
            openeds = openeds.split('span').slice(0,-1).join('span') + openeds.split('span').slice(-1)[0];
          }
          effect[3] = '';
        }

        // INCLUDING
        if(screen.effect[y][x][3] && screen.effect[y][x][3] != effect[3] && screen.effect[y][x][3]){ // color
          effect[3] = screen.effect[y][x][3];
          html    += `<span style="color:${screen.effect[y][x][3]}">`;
          openeds += 'span';
        }

        if(screen.effect[y][x][0] && screen.effect[y][x][0] != effect[0] && screen.effect[y][x][0] && !effect[0]){ // bold
          effect[0] = screen.effect[y][x][0];
          html    += `<b>`;
          openeds += 'b';
        }
        
        if(screen.effect[y][x][1] && screen.effect[y][x][1] != effect[1] && screen.effect[y][x][1] && !effect[1]){ // italic
          effect[1] = screen.effect[y][x][1];
          html    += `<i>`;
          openeds += 'i';
        }

        if(screen.effect[y][x][2] && screen.effect[y][x][2] != effect[2] && screen.effect[y][x][2] && !effect[2]){ // underline
          effect[2] = screen.effect[y][x][2];
          html    += `<u ${screen.decorator[y][x]?screen.decorator[y][x]:''}>`;
          openeds += 'u';
        }
        
        html += screen.map[y][x]? screen.map[y][x]: ' ';
      }
      catch {
        html += screen.map[y][x]? screen.map[y][x]: ' ';
      }
    }
    html += '\n';
  }
  screen_container.innerHTML = html;
}

function clearScreen(){
  calcScreenSize();
  drawScreen();
}

function doBox(x, y, sx, sy, type="single", fill=true, color=false){
  let endx = x + sx + 1;
  let endy = y + sy + 1;

  screen.map.forEach((row, i) => {
    if(i >= y && i <= endy){
      screen.map[i].forEach((_, l) => {
        if(l >= x && l <= endx){
          screen.effect[i][l] = [false, false, false, color];
          screen.decorator[i][l] = '';
        }
    });
    }
    if(i > y && i < endy){
      row[x]    = charMap('left', type, row[x]);
      row[endx] = charMap('right', type, row[endx]);
      if(fill) screen.map[i].forEach((_, l) => {if(l>x && l<endx) screen.map[i][l] = charMap('middle', type)});
    }
  });

  if(y >= 0 && y < screen.map.length){
    screen.map[y].forEach((e, i) => {if(i>x && i<endx) screen.map[y][i] = charMap('top', type, e)});
    screen.map[y][x]    = charMap('top-left', type, screen.map[y][x]);
    screen.map[y][endx] = charMap('top-right', type, screen.map[y][endx]);
  }

  if(endy >= 0 && endy < screen.map.length){
    screen.map[endy].forEach((e, i) => {if(i>x && i<endx) screen.map[endy][i] = charMap('bottom', type, e)});
    screen.map[endy][x]    = charMap('bottom-left', type, screen.map[endy][x]);
    screen.map[endy][endx] = charMap('bottom-right', type, screen.map[endy][endx]);
  }
}

function doText(text, x, y, width, height, clip=false, textdec=[false, false, false, false], decorators=''){
  // textdec = [bold, italic, underlined, color]
  let pivot = 0;
  text = text + ' '; // just for clip adjust purpoises
  for(let i = y; i < height+y; i++){
    for(let l = x; l < width+x; l++){
      if(!clip && pivot > text.split(' ')[0].length && text[pivot] != ' ' && text.slice(pivot).indexOf(' ') >= ((width+x) - l)) break;
      if((i >= 0&& i < screen.map.length) && (l >= 0 && l < screen.map[i].length)){
        screen.map[i][l]       = text[pivot];
        screen.effect[i][l]    = textdec;
        screen.decorator[i][l] = decorators;
      }
      pivot++;

      if(pivot+1 >= text.length) break;
    }
    if(pivot+1 >= text.length) break;
  }
}

function htmlConvert(){
  clearScreen();
  prompt_container.querySelectorAll(":not(screen)").forEach(child => {
    let get_attr = (e, a, d) => a in e.attributes? e.attributes[a].value: d;
    let get_pos  = (ch, pos) => {
      let final_pos = 0;
      let dir       = pos == 'x'? 'right': 'bottom';
      let sz        = pos == 'x'? 'width': 'height';
      let sz_def    = {
        'PROMPT': {'width': screen.width, 'height': screen.height},
        'DIV'   : {'width': 10, 'height': 3},
        'BUTTON': {'width': 'text' in ch.attributes? Math.floor(ch.attributes.text.value.length-2): 0, 'height': -1}
      };
      let chsz = sz in ch.attributes? ch.attributes[sz].value/2: sz_def[ch.tagName][sz]/2;
      if(ch.localName == "prompt") return 0;
      if(pos in ch.attributes){
        if(ch.attributes[pos].value == "center"){
          if(ch.parentElement.localName == "prompt"){
            final_pos = Math.floor(screen[sz]/2 - chsz);
          }
          else {
            final_pos = Math.floor(get_pos(ch.parentElement, pos) + get_attr(ch.parentElement, sz,sz_def[ch.parentElement.tagName][sz])/2 - chsz);
          }
        }
        else {
          final_pos = Math.floor(parseFloat(ch.attributes[pos].value) + get_pos(ch.parentElement, pos));
        }
      }
      else {
        final_pos = 1 + get_pos(ch.parentElement, pos);
      }

      if(!(pos in ch.attributes) || ch.attributes[pos].value != "center"){
        final_pos += (`${pos}align` in ch.attributes && ch.attributes[`${pos}align`].value == dir?
          parseInt(get_attr(ch.parentElement, sz, sz_def[ch.tagName][sz])  - get_attr(ch, sz, sz_def[ch.tagName][sz])) - 2: 0);
      }

      return final_pos;
    };

    // disabling
    let parent_disabled = (ch) => ch.parentElement.localName == "prompt"? false: 'disabled' in ch.parentElement.attributes? true: parent_disabled(ch.parentElement);
    let disabled = get_attr(child, 'disabled', false) == "true";
    if(disabled || parent_disabled(child)) return;

    // sizes
    let width  = parseInt(get_attr(child, 'width', 10));
    let height = parseInt(get_attr(child, 'height', 3));
    // positioning
    let posX = get_pos(child, 'x');
    let posY = get_pos(child, 'y');

    switch(child.tagName){
      case 'DIV':
        // default keys
        var clip = get_attr(child, 'clip', false) == 'true';
        var type = get_attr(child, 'type', 'single');

        if(type !== 'none'){
          doBox(posX, posY, width, height, type, true, get_attr(child, 'border-color', false));
          if('title' in child.attributes){
            var title = ` ${child.attributes.title.value} `;
            doText(title, posX+1, posY, width-1, 1, true, [type.includes('bold'), type.includes('double'), false, get_attr(child, 'border-color', false)]);
          }
        }
        if('text' in child.attributes){
          var text = child.attributes.text.value;
          doText(text, posX+1, posY+1, width, height, clip, [false, false, false, get_attr(child, 'color', false)]);
        }
        break;
      case 'BUTTON':
        // default keys
        var type = get_attr(child, 'type', 'bold');
        // events
        let onclick = get_attr(child, 'onclick', false)? `onclick="${child.attributes.onclick.value}"`: '';

        if('text' in child.attributes){
          var text = child.attributes.text.value;
          width = text.length;
          height = 1;
          doText(text, posX, posY, width, height, true, [true, false, true, get_attr(child, 'color', false)], onclick);
        }
        break;
    }
  });

  drawScreen();
}


// WAKE UP
_documentready = setInterval((f)=>{if(document.readyState == "complete"){clearInterval(_documentready);delete _documentready;f();}}, 1, ()=>{
  //get prompt element
  prompt_container = document.getElementsByTagName("prompt")[0];
  prompt_container.innerHTML += "<screen></screen>";
  screen_container = prompt_container.getElementsByTagName("screen")[0];

  calcScreenSize();
  window.onresize = htmlConvert;

  htmlConvert();
});