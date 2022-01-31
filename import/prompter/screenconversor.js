// GLOBAL
let screen_properties = {
  'map'   : [[]],
  'effect': [[]],
  'width' : 0,
  'height': 0
};
let clean_screen = {};


// FUNCTIONS
function calcScreenSize() { /* 8.8px width x 19px height */
  if(prompt_container === null) return;
  
  clean_screen.width  = Math.floor(prompt_container.offsetWidth  / 8.8);
  clean_screen.height = Math.floor(prompt_container.offsetHeight /  19);

  clean_screen.map    = new Array(clean_screen.height).fill().map(_ => new Array(clean_screen.width).fill(' '));
  clean_screen.effect = new Array(clean_screen.height).fill().map(_ => new Array(clean_screen.width).fill().map(__ => ({})));

  clearScreen();
}

function clearScreen() {
  screen_properties = {
    effect: new Array(clean_screen.effect.length).fill().map(_ => new Array(clean_screen.effect[0].length).fill().map(__ => ({}))),
    map   : new Array(clean_screen.map.length).fill().map(_ => [...clean_screen.map[0]]),
    height: clean_screen.height,
    width : clean_screen.width
  };
  drawScreen();
}

function drawScreen() {
  const excludeTag = (key, closeTag, repeat=false) => {
    if(!repeat) {
      html     += openeds.includes(key)? closeTag: '';
      let e_pos = openeds.lastIndexOf(key);
      openeds   = openeds.substring(0, e_pos) + openeds.substring(e_pos + key.length);
    }
    else
      while(openeds.includes(key))
        excludeTag(key, closeTag);
  };
  const includeTag = (key, openTag) => {
    html    += openTag;
    openeds += key;
  }

  let html    = '';
  let aeffect = [false, false, false, '', false];
  let openeds = '';
  
  for(let y=0; y < screen_properties.map.length; y++) {
    for(let x=0; x < screen_properties.map[y].length; x++) {
      try{
        let effect    = screen_properties.effect[y][x];
        let is_effect = [
          effect.bold      && effect.bold      != aeffect[0], // bold
          effect.italic    && effect.italic    != aeffect[1], // italic
          effect.underline && effect.underline != aeffect[2], // underline
          effect.color     && effect.color     != aeffect[3], // color
          effect.event     && effect.event     != aeffect[4], // event
          effect.style     && effect.style     != aeffect[5], // style
        ];

        // EXCLUDING
        if(!is_effect[0] && !effect.bold && aeffect[0]) {
          excludeTag('#bold', '</b>');
          aeffect[0] = false;
        }
        if(!is_effect[1] && !effect.italic && aeffect[1]) {
          excludeTag('#italic', '</i>')
          aeffect[1] = false;
        }
        if(!is_effect[2] && !effect.underline && aeffect[2]) {
          excludeTag('#underline', '</u>');
          aeffect[2] = false;
        }
        if(!is_effect[4] && !effect.event && aeffect[4]) {
          excludeTag('#event', '</a>', true);
          aeffect[4] = false;
        }
        if(!is_effect[3] && !effect.color && aeffect[3]) {
          excludeTag('#color', '</span>', true);
          aeffect[3] = '';
        }
        if(!is_effect[5] && !effect.style && aeffect[5]) {
          excludeTag('#style', '</span>', true);
          aeffect[5] = '';
        }


        // INCLUDING
        if(is_effect[5] && effect.style) { // STYLE MUST BE FIRST TO OVERWRITES COLOR EFFECTS
          includeTag('#style', `<span style="${effect.style}">`);
          aeffect[5] = effect.style;
        }
        if(is_effect[3] && effect.color) { // COLOR MUST BE NEXT TO PROPERLY ON/OFF COLOR EFFECTS
          includeTag('#color', `<span style="color:${effect.color}">`);
          aeffect[3] = effect.color;
        }
        if(is_effect[4] && effect.event) {
          includeTag('#event', `<a ${effect.event}>`);
          aeffect[4] = effect.event;
        }
        if(is_effect[2] && effect.underline && !aeffect[2]) {
          includeTag('#underline', `<u>`);
          aeffect[2] = effect.underline;
        }
        if(is_effect[1] && effect.italic && !aeffect[1]) {
          includeTag('#italic', `<i>`);
          aeffect[1] = effect.italic;
        }
        if(is_effect[0] && effect.bold && !aeffect[0]) {
          includeTag('#bold', `<b>`);
          aeffect[0] = effect.bold;
        }
        
        html += screen_properties.map[y][x]? screen_properties.map[y][x]: WHITESPACE;
      }
      catch {
        html += screen_properties.map[y][x]? screen_properties.map[y][x]: WHITESPACE;
      }
    }
    html += '\n';
  }
  screen_container.innerHTML = html;
}

function htmlConvert() {
  clearScreen();
  prompt_container.querySelectorAll(":not(screen)").forEach(child => {
    let valid_elements = ["DIV", "TEXT", "PROGRESS", "HR"];
    if(!valid_elements.includes(child.tagName)) return;
    
    let get_attr = (attrs, a, d) => a in attrs? attrs[a].value: d;
    let glob_var = (attrs, a, d, checkNumeric=true) => {
      let val = get_attr(attrs, a, d);
      if((!checkNumeric || isNaN(val)) && GLOBAL_VARIABLE_REGISTER._searchByName(val))
        return GLOBAL_VARIABLE_REGISTER._getByName(val);
      return val;
    };
    let get_pos  = (ch, pos) => {
      let final_pos = 0;
      let pr        = ch.parentElement;
      let [dir, sz] = pos == 'x'? ['right', 'width']: ['bottom', 'height'];
      let sz_def    = {
        'PROMPT'  : {'width': screen_properties.width, 'height': screen_properties.height},
        'DIV'     : {'width': 10, 'height': 3},
        'TEXT'    : {'width': ch.attributes.text? Math.floor(GLOBAL_VARIABLE_REGISTER._parseText(ch.attributes.text.value).length-2): 0, 'height': 1},
        'PROGRESS': {'width': 10, 'height': 1},
        'HR'      : {'width': 10, 'height': 1}
      };
      let sz_adjust = {
        'PROMPT'  : {'width': 0, 'height':  0},
        'DIV'     : {'width': 1, 'height':  0},
        'TEXT'    : {'width': 0, 'height': -2},
        'PROGRESS': {'width': 0, 'height': -2},
        'HR'      : {'width': 0, 'height': -2}
      }
      let chsz = (parseInt(get_attr(ch.attributes, sz, sz_def[ch.tagName][sz])) + sz_adjust[ch.tagName][sz]) / 2;
      let ch_attrs = ch.attributes;
      let pr_attrs = pr.attributes;


      if(ch.localName == "prompt") return 0;
      
      if(pos in ch.attributes) {
        if(ch.attributes[pos].value == "center") {
          if(pr.localName == "prompt") {
            final_pos = Math.floor(screen_properties[sz]/2 - chsz);
          }
          else {
            final_pos = Math.floor(get_pos(pr, pos) + (parseInt(get_attr(pr_attrs, sz,sz_def[pr.tagName][sz])) + sz_adjust[pr.tagName][sz])/2 - chsz);
          }
        }
        else {
          final_pos = Math.floor(parseFloat(ch.attributes[pos].value) + get_pos(pr, pos));
        }
      }
      else {
        final_pos = 1 + get_pos(pr, pos);
      }

      if(!(pos in ch.attributes) || ch.attributes[pos].value != "center") {
        final_pos += (`${pos}align` in ch.attributes && ch.attributes[`${pos}align`].value == dir?
                        (parseInt(get_attr(pr_attrs, sz, sz_def[pr.tagName][sz])) + sz_adjust[pr.tagName][sz])
                      - (parseInt(get_attr(ch_attrs, sz, sz_def[ch.tagName][sz])) + sz_adjust[ch.tagName][sz]) - 2: 0);
      }

      return final_pos;
    };
    let child_attrs = child.attributes;

    // disabling
    let parent_disabled = (ch) => ch.parentElement.localName == "prompt"? false: ch.parentElement.attributes.disabled?.value === "true"? true: parent_disabled(ch.parentElement);
    let disabled = get_attr(child_attrs, 'disabled', false) == "true";
    if(disabled || parent_disabled(child)) return;

    // sizes
    let width  = parseInt(glob_var(child_attrs, 'width', 10));
    let height = parseInt(glob_var(child_attrs, 'height', 3));

    // positioning
    let posX = get_pos(child, 'x');
    let posY = get_pos(child, 'y');

    switch(child.tagName) {
      case 'DIV':
        // default keys
        var clip = get_attr(child_attrs, 'clip', false) == 'true';
        var type = get_attr(child_attrs, 'type', 'single');

        if(type !== 'none') {
          doBox(posX, posY, width, height, type, true, get_attr(child_attrs, 'border-color', false), get_attr(child_attrs, 'style', false));
          if(child.attributes.title) {
            var title = ` ${child.attributes.title.value} `;
            doText(title, posX+1, posY, width-1, 1, true, {
              bold: type.includes('bold'),
              italic: type.includes('double'),
              color: get_attr(child_attrs, 'border-color', false),
              style: get_attr(child_attrs, 'style', false)
          });
          }
        }
        if(child.attributes.text) {
          var text = child.attributes.text.value;
          doText(text, posX+1, posY+1, width, height, clip, { color: get_attr(child_attrs, 'color', false), style: get_attr(child_attrs, 'style', false) });
        }
        break;
      case 'TEXT':
        // default keys
        var type = get_attr(child_attrs, 'type', '').toLowerCase();
        // events
        let onclick = get_attr(child_attrs, 'onclick', false)? `onclick="${child.attributes.onclick.value}"`: '';

        if(child.attributes.text) {
          var text = child.attributes.text.value;
          width    = text.length;
          height   = 1;
          doText(text, posX, posY, width, height, true, {
            bold: type.includes('bold'), italic: type.includes('italic'), underline: type.includes('underline'),
            color: get_attr(child_attrs, 'color', false), event: onclick,
            style: get_attr(child_attrs, 'style', false)
          });
        }
        break;
      case 'PROGRESS':
        // default keys
        var max = parseInt(glob_var(child_attrs, 'max',  100));
        var val = parseInt(glob_var(child_attrs, 'value', 50));
        width   = parseInt(glob_var(child_attrs, 'width', 10));
        height  = parseInt(glob_var(child_attrs, 'height', 1));
        
        doProgress(posX, posY, width, height, val, max,
          { bold: true, color: get_attr(child_attrs, 'color'), style: get_attr(child_attrs, 'style', false) }, // effects
          [get_attr(child_attrs, 'fill', ''), get_attr(child_attrs, 'empty', null)] // style
        );
        break;
      case 'HR':
        var type = get_attr(child_attrs, 'type', 'single').toLowerCase();
        var char = get_attr(child_attrs, 'fill', null);
        width    = parseInt(glob_var(child_attrs, 'width', 10));
        doLine(posX, posY, width, type, { color: get_attr(child_attrs, 'color'), style: get_attr(child_attrs, 'style', false) }, char);
        break;
    }
  });

  drawScreen();
}

function updateScreen() {
  calcScreenSize();
  htmlConvert();
}