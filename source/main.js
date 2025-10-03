//#region [INITIALIZATION]
_documentready = setInterval((f)=>{if(document.readyState == "complete"){clearInterval(_documentready);f();}}, 1, ()=>{
	PrompterScreen.startScreen();

	// bind UpdateScreen as window is resized and call for the first time
	window.onresize = PrompterScreen.UpdateScreen;
	PrompterScreen.ConvertObjectsToASCII();
	PrompterScreen.Draw();
});
//#endregion

/// Support for variables to be used and readed inside prompt strings
//#region [VARIABLE SUPPORT]
class VariableRegister {
    static language = "eng";
    static _variable_list = {};
		static refresh_when_updated = true;

    static set(vKey, vValue, vLanguage=VariableRegister.language) {
			if(!(vLanguage in VariableRegister._variable_list)) {
				VariableRegister._variable_list[vLanguage] = {[vKey]: vValue};
			}
			else {
				VariableRegister._variable_list[vLanguage][vKey] = vValue;
			}
			if(VariableRegister.refresh_when_updated) PrompterScreen.Refresh();
    }

    static get(vKey, vLanguage=VariableRegister.language, _iteration=null) {
			if(vKey.includes('.')) {
				return VariableRegister.get(
					vKey.slice(vKey.indexOf('.')+1),
					vLanguage,
					(_iteration?? VariableRegister._variable_list[vLanguage])[vKey.split('.')[0]]
				);
			}
			else {
				return (_iteration?? VariableRegister._variable_list[vLanguage])[vKey];
			}
    }

    static has(vKey, vLanguage=VariableRegister.language, _iteration=null, checkBrackets=false) {
			vKey = String(vKey);
			if(checkBrackets) {
				if(vKey.match(/^\$\{.*\}$/) === null) return false;
				else vKey = vKey.substring(2, vKey.length-1);
			}
			if(vKey.includes('.') && (_iteration?? VariableRegister._variable_list[vLanguage]) instanceof Object) {
				return vKey.split('.')[0] in (_iteration?? VariableRegister._variable_list[vLanguage])
					&& VariableRegister.has(
						vKey.slice(vKey.indexOf('.')+1),
						vLanguage,
						(_iteration?? VariableRegister._variable_list[vLanguage])[vKey.split('.')[0]]
					);
			}
			else {
				return (_iteration?? VariableRegister._variable_list[vLanguage]) instanceof Object && vKey in (_iteration?? VariableRegister._variable_list[vLanguage]);
			}
    }

    static parse(vText) {
			let keyIndex = -1;
			while((keyIndex = vText.indexOf('${')) !== -1) {
				let keyName  = vText.slice(keyIndex+2, vText.indexOf('}'));
				let keyValue = '';
				if(VariableRegister.has(keyName)) {
					keyValue = VariableRegister.get(keyName);
				}
				else {
					console.warn(VariableRegister._warning(keyName));
				}
					
				vText = vText.slice(0, keyIndex) + String(keyValue)
							+ vText.slice(vText.indexOf('}')+1, vText.length);
			}

			return vText;
    }

    static _warning(warnKeyName) {
			if(warnKeyName.includes('.')) {
				return `"${warnKeyName}" not registered in VariableRegister.`+
								`\nTry:` +
								`\n${warnKeyName} = "SomeValue";` +
								`\nVariableRegister("${warnKeyName.split('.')[0]}", ${warnKeyName.split('.')[0]});` +
								`\nAnd so access on prompt by using "\${${warnKeyName}}"`;
				}
			else {
				return `"${warnKeyName}" not registered in VariableRegister.`+
								`\nTry:` +
								`\nVariableRegister.set("${warnKeyName}", "SomeValue");` +
								`\nAnd so access on prompt by using "\${${warnKeyName}}"`;
			}
    }
}
//#endregion

/// Side class to make the line merging trick using box unicodes
/// Reference: https://en.wikipedia.org/wiki/Box_Drawing_(Unicode_block)
//#region [CHARMAP]
class PrompterCharmap {
	static CHARSIZE = [8.8, 17.6]; /* [width, height] in pixels */

	static WHITESPACE = " ";
	static FILLSPACE = "█";
	// [top, right, bottom, left, x]
	//  x = [single, double, bold]
	static DIRECTIONAL_CHAR_MAP = {
		' ': [[0,0,0,0, 0], "00000"],
	
		'┘': [[1,0,0,1, 0], "10010"],
		'┐': [[0,0,1,1, 0], "00110"],
		'┌': [[0,1,1,0, 0], "01100"],
		'└': [[1,1,0,0, 0], "11000"],
		'┤': [[1,0,1,1, 0], "10110"],
		'┴': [[1,1,0,1, 0], "11010"],
		'┬': [[0,1,1,1, 0], "01110"],
		'├': [[1,1,1,0, 0], "11100"],
		'─': [[0,1,0,1, 0], "01010"],
		'│': [[1,0,1,0, 0], "10100"],
		'┼': [[1,1,1,1, 0], "11110"],
	
		'╝': [[1,0,0,1, 1], "10011"],
		'╗': [[0,0,1,1, 1], "00111"],
		'╔': [[0,1,1,0, 1], "01101"],
		'╚': [[1,1,0,0, 1], "11001"],
		'╣': [[1,0,1,1, 1], "10111"],
		'╩': [[1,1,0,1, 1], "11011"],
		'╦': [[0,1,1,1, 1], "01111"],
		'╠': [[1,1,1,0, 1], "11101"],
		'═': [[0,1,0,1, 1], "01011"],
		'║': [[1,0,1,0, 1], "10101"],
		'╬': [[1,1,1,1, 1], "11111"],
	
		'┛': [[1,0,0,1, 2], "10012"],
		'┓': [[0,0,1,1, 2], "00112"],
		'┏': [[0,1,1,0, 2], "01102"],
		'┗': [[1,1,0,0, 2], "11002"],
		'┫': [[1,0,1,1, 2], "10112"],
		'┻': [[1,1,0,1, 2], "11012"],
		'┳': [[0,1,1,1, 2], "01112"],
		'┣': [[1,1,1,0, 2], "11102"],
		'━': [[0,1,0,1, 2], "01012"],
		'┃': [[1,0,1,0, 2], "10102"],
		'╋': [[1,1,1,1, 2], "11112"],
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

	static ForceConnect(map, y, x) {
		const validPos = (vy, vx) => {
			return vy >= 0 && vy < map.length && vx >= 0 && vx < map[vy].length;
		};
		const connectChar = (cy, cx, dir) => {
			if(Object.keys(PrompterCharmap.DIRECTIONAL_CHAR_MAP).includes(map[cy][cx].value)) {
				return PrompterCharmap.DIRECTIONAL_CHAR_MAP[map[cy][cx].value][0][dir];
			}
			return false;
		};
		
		let final_dir_map = [...PrompterCharmap.DIRECTIONAL_CHAR_MAP[map[y][x].value][0]];
		// TOP CHAR
		if(final_dir_map[0] === 0 && validPos(y-1, x) && connectChar(y-1, x, 2)) {
			final_dir_map[0] = 1;
			// console.log('connected to TOP');
		}
		// RIGHT CHAR
		if(final_dir_map[1] === 0 && validPos(y, x+1) && connectChar(y, x+1, 3)) {
			final_dir_map[1] = 1;
			// console.log('connected to RIGHT');
		}
		// BOTTOM CHAR
		if(final_dir_map[2] === 0 && validPos(y+1, x) && connectChar(y+1, x, 0)) {
			final_dir_map[2] = 1;
			// console.log('connected to BOTTOM');
		}
		// LEFT CHAR
		if(final_dir_map[3] === 0 && validPos(y, x-1) && connectChar(y, x-1, 1)) {
			final_dir_map[3] = 1;
			// console.log('connected to LEFT');
		}

		// console.log(map[y][x].value, PrompterCharmap.FindDirChar(final_dir_map.join('')), final_dir_map.join(''));
		return PrompterCharmap.FindDirChar(final_dir_map.join(''));
	}

	static FindDirChar(dirMap="00000") {
		for(const dchar in PrompterCharmap.DIRECTIONAL_CHAR_MAP) {
			if(PrompterCharmap.DIRECTIONAL_CHAR_MAP[dchar][1] === dirMap) return dchar;
		}
		return ' ';
	}
    
	static CharMap(side, type='single', pre=' ') {
		if(!(type in PrompterCharmap.CHARMAP_CHAR)) return '';
		return PrompterCharmap.MergeChar(PrompterCharmap.CHARMAP_CHAR[type][PrompterCharmap.CHARMAP_SQUARE_MAP[side]], pre, PrompterCharmap.CHARMAP_MISS_VALUE[side]);
	}
	
	static MergeChar(ch1, ch2, miss=[0,0,0,0]) {
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
//#endregion

/// Classes to be used on the communication between the interpreter and the conversor
//#region [PROMPT OBJECTS]
class PrompterElement {
	static _id_buffer = 1;
	static DEFAULT_DOM_ID = "prompter-id";

	position = -1;
	default_size = {
		'width': 10,
		'height': 3
	}

	_internal_html_object = null;
	get html_object() {
		if(this._internal_html_object === null) {
			this._internal_html_object = this.to_html();
		}
		return this._internal_html_object;
	}
	set html_object(newVal) {
		this._internal_html_object = newVal;
	}

	get child_objects() {
		return [];
	}

	constructor(element, x, y, width, height, z=1, effect=null, events={}) {
		if(element) this._id = PrompterElement._id_buffer++;
		this.element = element;
		this.enabled = true;

		this.x = parseInt(x);
		this.y = parseInt(y);
		this.z = parseInt(z);
		this.width = parseInt(width) >= 0? parseInt(width): 0;
		this.height = parseInt(height) >= 0? parseInt(height): 0;

		this.effect = effect?? new PrompterScreenDotEffect(effect);
		this.events = events? new PrompterScreenDotEvent(events, this._id): events;

		this.default_size.width = PrompterScreen.screen_properties.width;
		this.default_size.height = PrompterScreen.screen_properties.height;
	}

	update(properties) {
		for(let property in properties) {
			this[property] = properties[property];
		}
	}

	to_html() {
		console.warn("That object must not be converted to HTML or html conversor is not implemented yet.");
		return false;
	}
}
class PrompterElText extends PrompterElement {
	default_size = {
		'width': 0,
		'height': 1
	}

	constructor(element, text, x, y, width, height, z=1, clip=false, effect=null, events=null, line_break=true) {
		super(element, x, y, width, height, z, effect, events);

		this.text = text;
		this.clip = clip;
		this.line_break = line_break;

		if(text) {
			this.default_size.width = VariableRegister.parse(text?text:"").length;
		}

		this.width = this.default_size.width;
	}

	update(properties) {
		if('text' in properties && properties.text !== this.text) this.html_object = null;

		super.update(properties);

		if('text' in properties) {
			this.default_size.width = VariableRegister.parse(properties.text).length;
		}

		this.width = this.default_size.width;
	}

	to_html() {
		let html_object = new Array(this.height).fill().map(_ => new Array(this.width).fill(null));

		let pivot = 0;
		for(let py=0; py < this.height; py++) {
			for(let px=0; px < this.width; px++) {
				html_object[py][px] = this.text[pivot];
				pivot++;
				if(pivot >= this.text.length) break;
			}
			if(pivot >= this.text.length) break;
		}
		return html_object;
	}
}
class PrompterElDiv extends PrompterElement {
	default_size = {
		'width': 10,
		'height': 3
	}

	get child_objects() {
		return this.title_element? [this.title_element]: [];
	}

	title_element = null;

	set title(new_text) {
		const formatTitle = (ttext) => {
			if(ttext !== null) {
				if((ttext.length + 2) > (this.width - 2)) {
					return ` ${ttext}`.substring(0, this.width-4) + '… ';
				}
				return ` ${ttext} `;
			}
			return ttext;
		};

		if(new_text !== null && new_text.replaceAll(' ', '') !== "") {
			this.title_element = new PrompterElText(null, formatTitle(new_text), this.x+1, this.y, this.width-2, 1, this.z, true, this.effect, this.events, false);
		}
		else {
			this.title_element = null;
		}
	}

	constructor(element, x, y, width, height, z=1, type="single", title=null, fill=true, effect=null, events=null) {
		super(element, x, y, width, height, z, effect, events);

		this.type = type;
		this.fill = fill;
		this.title = title;
	}

	to_html() {
		let html_object = new Array(this.height).fill().map(_ => new Array(this.width).fill(null));

		let side_char = {
			'top-middle'   : 'top',
			'bottom-middle': 'bottom',
			'middle-left'  : 'left',
			'middle-right' : 'right',
			'middle-middle': 'middle'
		};
		for(let py=0; py < this.height; py++) {
			for(let px=0; px < this.width; px++) {
				let vert = py == 0?   'top': py == this.height-1? 'bottom': 'middle';
				let horz = px == 0? '-left': px == this.width-1?  '-right': '-middle';
				let pos = vert + horz;
				if(pos == 'middle-middle' && !this.fill) {
					px = this.width-2; // send to last position
					continue;
				}
				html_object[py][px] = PrompterCharmap.CharMap(side_char[pos] || pos, this.type);
			}
		}
		if(this.title_element instanceof PrompterElText && this.title) {
			// actually not using the object
			let pivot = 0;
			html_object[0][px] = ' ';
			for(let px=2; px < this.width-2; px++) {
				html_object[0][px] = this.title[pivot++];
				if(pivot >= this.title.length) {
					html_object[0][px+1] = ' ';
					break;
				}
			}
			if(this.title.length > this.width-4) {
				html_object[0][this.width-1] = ' ';
			}
		}

		return html_object;
	}
}
class PrompterElProgress extends PrompterElText {
	default_size = {
		'width': 10,
		'height': 1
	}

	constructor(element, x, y, width=10, height=1, z=1, value=50, max=100, effect=null, events=null, fill_char='#', empty_char='-') {
		super(element, "", x, y, width, height, z, true, effect, events, true);

		this.max = max;
		this.value = value;
		this.fill_char = fill_char;
		this.empty_char = empty_char;
	}

	to_html() {
		let fill_part = new Array(Math.floor(this.value / this.max * this.width)).fill(this.fill_char).join('');
		this.text = fill_part + new Array(this.width-fill_part.length).fill(this.empty_char).join('');
		console.log(this.width);
		return super.to_html();
	}

	update(properties) {
		for(let property in properties) {
			this[property] = properties[property];
		}
	}
}
class PrompterElHr extends PrompterElText {
	default_size = {
		'width': 10,
		'height': 1
	}

	constructor(element, x, y, width=10, z=1, effect=null, events=null, fill_char='-') {
		super(element, "", x, y, width, 1, z, true, effect, events, true);

		this.fill_char = fill_char;
	}

	to_html() {
		this.text = new Array(this.width).fill(this.fill_char).join('');
		return super.to_html();
	}

	update(properties) {
		for(let property in properties) {
			this[property] = properties[property];
		}
	}
}
class PrompterElImage extends PrompterElText {
	default_size = {
		'width': 10,
		'height': 3
	}

	constructor(element, x, y, width, height, z=1, source, ignore_list=[], fill=true, effect=null, events=null) {
		super(element, x, y, width, height, z, effect, events);
		
		this.default_size.width = parseInt(width);
		
		// TODO: NEED REWRITING
		this.source = VariableRegister.parse(source);
		// let imageStyle = (style || "") + `; color: ${color? color:"var(--color); background: var(--background-color)"}`;
		// for(let h=0; h < height; h++) {
		// 	let fillChart = source.split(',').slice(h*width, width+h*width);
		// 	fillChart = fillChart.map(p => ignoreList.includes(p) || ignoreList.includes(p.replaceAll('#',''))? PrompterCharmap.WHITESPACE+PrompterCharmap.WHITESPACE: pixelBlock);
		// 	if(fill || fillChart.includes(pixelBlock)) {
		// 		PrompterPlotting.DoText(fillChart.join(''), x, y+h, width*2, 1, true, color?{'color':color}:{}, false, imageStyle);
		// 	}
		// }
	}
}
//#endregion

/// Classes to be used on the communication between the conversor and the screen
//#region [SCREEN OBJECTS]
class PrompterScreenMap {
	constructor(width, height, mapFill=' ') {
		this.width = width;
		this.height = height;
		this.map = PrompterScreenMap.genMap(width, height, mapFill);
	}

	checkScreenSize() {
		if(PrompterScreen.prompt === null) return null;

		let newWidth = Math.floor(PrompterScreen.prompt.offsetWidth  / PrompterCharmap.CHARSIZE[0]);
		let newHeight = Math.floor(PrompterScreen.prompt.offsetHeight /  PrompterCharmap.CHARSIZE[1]);

		if(newWidth !== this.width || newHeight !== this.height) {
			this.width = newWidth;
			this.height = newHeight;
			
			// Update PrompterScreen.screen_properties
			PrompterScreen.screen_properties.width = newWidth;
			PrompterScreen.screen_properties.height = newHeight;

			return { 'width': this.width, 'height': this.height };
		}

		return null;
	}
	
	static genMap(width, height, mapFill=' ') {
		return new Array(height).fill().map(_ => new Array(width).fill().map(__ => new PrompterScreenDot(mapFill)));
	}
}
class PrompterScreenDot {
	constructor(value, effect = null, events = null, element_id=null) {
		this.value = value;
		this.effect = effect?? new PrompterScreenDotEffect(effect);
		this.events = events? new PrompterScreenDotEvent(events, element_id): events;
		this.element_id = element_id;
	}
}
class PrompterScreenDotEffect {
	static valid_props = ['bold', 'italic', 'underline', 'color', 'style'];
	static prop_element = {
		'bold': 'b',
		'italic': 'i',
		'undeline': 'u',
		'color': 'span',
		'style': 'span',
	};
	#prop_list = {};

	get list() {
		return this.#prop_list;
	}

	constructor(props) {
		for(let prop in props) {
				if(PrompterScreenDotEffect.valid_props.includes(prop)) {
				this.#prop_list[prop] = props[prop] || true;
			}
		}
	}
}
class PrompterScreenDotEvent {
	static valid_events = ['onclick', 'onmouseenter', 'onmouseleave'];
	#prop_list = {};

	get list() {
		return this.#prop_list;
	}
	
	constructor(events, inherit_id=null) {
		this.inherit_id = inherit_id;
		for(let event in events) {
			if(PrompterScreenDotEvent.valid_events.includes(event)) {
				this.#prop_list[event] = events[event] || "";
			}
		}
	}

	static parseHTML(events) {
		let ev_str = "";
		for(let event in events) {
			if(PrompterScreenDotEvent.valid_events.includes(event)) {
				ev_str += ` ${event}="${events[event].function}"`;
			}
		}
		return ev_str;
	}
}
//#endregion

/// Screen interface between DOM and the lib, hold all objects, set mutations and conversors
//#region [SCREEN INTERFACE]
class PrompterScreen {
	//#region [Props]
	static screen_properties = {
		'width' : 0,
		'height': 0,
		'x'     : 0,
		'y'     : 0
	};
	static mapping = [[]];

	static prompt = null;
	static container = null;

	static observer = null;

	static valid_elements = {
		'PROMPT'  : PrompterElement,
		'DIV'     : PrompterElDiv,
		'TEXT'    : PrompterElText,
		'PROGRESS': PrompterElProgress,
		'HR'      : PrompterElHr,
		'IMG'     : PrompterElImage
	};

	static clean_screen = null; // PrompterScreenMap

	static z_index_flag = {1: 0}; // index of each first element from each 'z' layer
	static element_list = []; // elements ordened by layer, for overlapping control
	static id_elem_list = {}; // elements referenced by the _id for optimization purposes

	static cursorPosition = [null, null];
	//#endregion

	//#region [Utils]
	static buildElement(eTag, element=null) {
		if(PrompterScreen.isValid(eTag)) {
			if(element === null) {
				return new PrompterScreen.valid_elements[eTag.toUpperCase()]();
			}
			else {
				return new PrompterScreen.valid_elements[eTag.toUpperCase()](element);
			}
		}
		
		console.error(`"${eTag}" is not a valid element.`);
		return null;
	}

	static isValid(eTag) {
		return eTag.toUpperCase() in PrompterScreen.valid_elements;
	}
	//#endregion

	//#region [Init]
	static startScreen() {
		//get prompt element and set screen inside
		PrompterScreen.prompt = document.getElementsByTagName("prompt")[0];
		PrompterScreen.prompt.innerHTML += "<screen></screen>";

		// get screen element and set editable if is debug flag on
		PrompterScreen.container = PrompterScreen.prompt.getElementsByTagName("screen")[0];
		if(PrompterScreen.prompt.hasAttribute("debug")) PrompterScreen.container.setAttribute("contenteditable", true);

		PrompterScreen.bindMutation();
		PrompterScreen.MountCleanScreen();
		PrompterScreen.ConvertHTMLToObjects();

		PrompterScreen.trackCursor();
	}

	static MountCleanScreen() {
		if(PrompterScreen.prompt === null) return;
		
		let psWidth = Math.floor(PrompterScreen.prompt.offsetWidth  / PrompterCharmap.CHARSIZE[0]);
		let psHeight = Math.floor(PrompterScreen.prompt.offsetHeight /  PrompterCharmap.CHARSIZE[1]);
		PrompterScreen.clean_screen = new PrompterScreenMap(psWidth, psHeight, ' ');

		// Update PrompterScreen.screen_properties
		PrompterScreen.screen_properties.width = psWidth;
		PrompterScreen.screen_properties.height = psHeight;
	}
	//#endregion

	//#region [Update]
	static bindMutation() {
		const observerConfig = { attributes: true, childList: true, subtree: true };
		PrompterScreen.observer = new MutationObserver(PrompterScreen.mutationCallback);
		PrompterScreen.observer.observe(PrompterScreen.prompt, observerConfig);
	}

	static mutationCallback(mutationList) {
		const isInsideScreen = (el) =>
			el === PrompterScreen.container || el.parentNode === PrompterScreen.container? true:
			el.parentNode === document? false: isInsideScreen(el.parentNode);
		
		// Clean mutations on observer to avoid callback duplication
		PrompterScreen.observer.takeRecords();

		let hasUpdates = false;
		for(let mutation of mutationList) {
			if(!isInsideScreen(mutation.target)) {
				let attr = {
					'name' : mutation.attributeName,
					'value': mutation.target.attributes[mutation.attributeName]?.value
				};
				if(attr.name == PrompterElement.DEFAULT_DOM_ID) return;

				hasUpdates = true;
				
				// console.log(attr);
				// console.log(mutation.target);

				// TODO: Update elements by getting the prompter id on DOM element and
				// using the PrompterScreen.id_elem_list to update the object without
				// changing the entire scene
				// OBS: Must create new DOM elements, and delete if needed from the lists
				PrompterScreen.ConvertHTMLToObjects(mutation.target);
			}
		}

		if(hasUpdates) {
			PrompterScreen.ConvertObjectsToASCII();
			PrompterScreen.Draw();
		}
	}

	static UpdateScreen() {
		let hasUpdate = PrompterScreen.clean_screen.checkScreenSize();
		if(hasUpdate !== null) {
			// Call for aligned objects update
			const screen_childs = PrompterScreen.prompt.parentNode.querySelectorAll("prompt > :not(screen)");
			const updateChildren = (parent_element) => {
				for(const pchild of parent_element.children) {
					PrompterScreen.ConvertHTMLToObjects(pchild);
					updateChildren(pchild);
				}
			};
			for(const schild of screen_childs) {
				if(schild.hasAttribute('xalign') || schild.hasAttribute('yalign')) {
					PrompterScreen.ConvertHTMLToObjects(schild);
					updateChildren(schild);
				}
			}
			PrompterScreen.ConvertObjectsToASCII();
			PrompterScreen.Draw();
		}
	}
	//#endregion

	//#region [Conversor]
	static ConvertHTMLToObjects(specific_element=null) { // before called HtmlConvert
		//#region [Conversor Utilities]
		const isPercentageFormat = (value) => {
			return typeof value == "string"
				&& value.substring(value.length-1) == '%' // ends with '%'
				&& !isNaN(value.substring(0, value.length-1));
		}
		const calcByPercentage = (percentage, total, default_value) => {
			if(isPercentageFormat(percentage) && !isNaN(total)) {
				let numeric = Number(percentage.substring(0, percentage.length-1));
				return Math.floor(numeric * (total / 100)) - 2; // -2 for bordering adjust, considering its inside another element
			}
			return default_value;
		}
		const parentAttrPercentage = (parent, attr_name, value, default_value) => {
			if(parent.localName == "prompt") {
				return calcByPercentage(value, PrompterScreen.screen_properties[attr_name], default_value);
			}
			return calcByPercentage(value, get_var(parent.attributes, attr_name, default_value, false, true, false, parent), default_value);
		};
		const isParentDisabled = (child) => {
			if(child.parentElement.localName == "prompt") return false;
			if(get_var(child.parentElement.attributes, 'disabled', "false", false) != "false") return true;
			
			return isParentDisabled(child.parentElement);
		}
		const get_attr = (attributes, attr_name, default_value) => {
			return attr_name in attributes? attributes[attr_name].value: default_value;
		};
		const get_var = (attributes, attr_name, default_value, checkNumeric=true, checkPercentage=false, checkBrackets=false, ch=null) => {
			let value = get_attr(attributes, attr_name, default_value);
			if(checkPercentage && isPercentageFormat(value)) {
				return parentAttrPercentage(ch.parentElement, attr_name, value, default_value);
			}
			if((!checkNumeric || isNaN(value)) && VariableRegister.has(value, undefined, undefined, checkBrackets)) {
				return checkBrackets? VariableRegister.parse(value): VariableRegister.get(value);
			}
			return value;
		}
		const get_size = (element) => {
			let size = {
				'width': PrompterScreen.screen_properties.width,
				'height': PrompterScreen.screen_properties.height
			};

			if(element.localName == "prompt") return size;
			
			let parent_size = null;
			let default_size = PrompterScreen.buildElement(element.tagName).default_size;

			//#region [Width]
			if('width' in element.attributes) {
				if(isPercentageFormat(element.attributes.width)) {
					parent_size = get_size(element.parentElement);
					size.width = calcByPercentage(get_var(element.attributes, 'width', "100%"), parent_size, default_size.width);
				}
				else {
					size.width = parseInt(get_var(element.attributes, 'width', default_size.width));
				}
			}
			else {
				if(element.tagName.toUpperCase() === 'TEXT') {
					size.width = get_var(element.attributes, 'text', '').length;
				}
				else {
					size.width = default_size.width;
				}
			}
			//#endregion
			//#region [Height]
			if('height' in element.attributes) {
				if(isPercentageFormat(element.attributes.height)) {
					if(parent_size === null) parent_size = get_size(element.parentElement);
					size.height = calcByPercentage(get_var(element.attributes, 'height', "100%"), parent_size, default_size.height);
				}
				else {
					size.height = parseInt(get_var(element.attributes, 'height', default_size.height));
				}
			}
			else {
				size.height = default_size.height;
			}
			//#endregion

			size.width = parseInt(size.width);
			size.height = parseInt(size.height);
			return size;
		}
		const get_pos = (child) => {
			let pos = { 'x': -1, 'y': -1 };

			if(child.localName == "prompt") return pos;

			let size = null;

			let parent = child.parentElement;
			let parent_pos = get_pos(parent);
			let parent_size = null;

			//#region [X Position]
			pos.x = parent_pos.x + 1;
			
			if('xalign' in child.attributes) {
				switch(get_var(child.attributes, 'xalign', 'left').toLowerCase()) {
					case 'right':
						if(parent_size === null) parent_size = get_size(parent);
						if(size === null) size = get_size(child);

						pos.x = parent_pos.x + parent_size.width - size.width - 1;
						break;
					case 'center':
						if(parent_size === null) parent_size = get_size(parent);
						if(size === null) size = get_size(child);

						pos.x = parent_pos.x + (parent_size.width/2) - (size.width/2);
						break;
				}
			}
			if('x' in child.attributes) {
				if(!isPercentageFormat(child.attributes.x.value)) {
					pos.x = parseInt(get_var(child.attributes, 'x', 0)) + pos.x;
				}
				else {
					parent_size = get_size(parent);
					pos.x = calcByPercentage(get_var(child.attributes, 'x', "0%"), parent_size.width, 0) + pos.x;
				}
			}
			//#endregion
			//#region [Y Position]
			pos.y = parent_pos.y + 1;
			if('yalign' in child.attributes) {
				switch(get_var(child.attributes, 'yalign', 'top').toLowerCase()) {
					case 'bottom':
						if(parent_size === null) parent_size = get_size(parent);
						if(size === null) size = get_size(child);

						pos.y = parent_pos.y + parent_size.height - size.height - 1;
						break;
					case 'center':
						if(parent_size === null) parent_size = get_size(parent);
						if(size === null) size = get_size(child);

						pos.y = parent_pos.y + (parent_size.height/2) - (size.height/2);
						break;
				}
			}
			if('y' in child.attributes) {
				if(!isPercentageFormat(child.attributes.y.value)) {
					pos.y = parseInt(get_var(child.attributes, 'y', 0)) + pos.y;
				}
				else {
					if(parent_size === null) parent_size = get_size(parent);
					pos.y = calcByPercentage(get_var(child.attributes, 'y', "0%"), parent_size. height, 0) + pos.y;
				}
			}
			//#endregion

			pos.x = parseInt(pos.x);
			pos.y = parseInt(pos.y);
			return pos;
		}
		const set_element = (element, z) => {
			let startLayer = z in PrompterScreen.z_index_flag? Object.keys(PrompterScreen.z_index_flag).indexOf(String(z)): -1;
			let layers = Object.keys(PrompterScreen.z_index_flag);
			let position = null;
			let increased_nexts_flag = false;
			for(let layer=startLayer+1; layer < layers.length; layer++) {
				if(position === null) {
					position = PrompterScreen.z_index_flag[layers[layer]];
				}
				if(!increased_nexts_flag) {
					increased_nexts_flag = true;
					for(let el = PrompterScreen.z_index_flag[layers[layer]]; el < PrompterScreen.element_list.length; el++) {
						PrompterScreen.element_list[el].position++;
					}
				}
				if(parseInt(layers[layer]) > z) {
					PrompterScreen.z_index_flag[layers[layer]]++;
				}
			}
			if(position === null) {
				position = PrompterScreen.element_list.length;
			}
			if(!(z in PrompterScreen.z_index_flag)) PrompterScreen.z_index_flag[z] = position;
			if(position == PrompterScreen.element_list.length) {
				PrompterScreen.element_list.push(element);
			}
			else {
				PrompterScreen.element_list.splice(position, 0, element);
			}
			element.position = position;
		}
		//#endregion
		
		const process_element = (child) => {
			if(!(child.tagName in PrompterScreen.valid_elements)) return;

			//#region [Disabling]
			let disabled = get_var(child.attributes, 'disabled', "false", false) != "false";
			if(disabled || isParentDisabled(child)) {
				let element_id = get_attr(child.attributes, PrompterElement.DEFAULT_DOM_ID, null);
				if(element_id !== null) {
					// disable already existent object
					PrompterScreen.id_elem_list[element_id].enabled = false;
				}
				return;
			}
			else if(!disabled && !isParentDisabled(child)) {
				let element_id = get_attr(child.attributes, PrompterElement.DEFAULT_DOM_ID, null);
				if(element_id !== null) {
					// enable already existent object
					PrompterScreen.id_elem_list[element_id].enabled = true;
				}
			}
			//#endregion
			
			//#region [Properties]
			let pos = get_pos(child);
			let size = get_size(child);
			let props = {
				'x': pos.x,
				'y': pos.y,
				'z': parseInt(get_var(child.attributes, 'z', 1)),
				'width': size.width,
				'height': size.height,
				'effect': null,
				'events': {}
			};
			//#endregion

			//#region [Effects]
			let effect_list = {};
			for(let effect_name of PrompterScreenDotEffect.valid_props) {
				let effect = get_var(child.attributes, effect_name, null, false);
				if(effect !== null) {
					effect_list[effect_name] = effect;
				}
			}
			if(Object.keys(effect_list).length) { // has some effect
				props.effect = new PrompterScreenDotEffect(effect_list);
			}
			//#endregion

			//#region [Events]
			for(let event of PrompterScreenDotEvent.valid_events) {
				let event_function = get_attr(child.attributes, event, null);
				if(event_function !== null) {
					props.events[event] = {
						function: event_function,
						source: child
					};
				}
			}
			//#endregion

			// get specific props for every element variation based on child.tagName
			switch(child.tagName.toUpperCase()) {
				case 'DIV': // element, x, y, width, height, z=1, type="single", title=null, fill=true, effect=null, events={}
					props.type = get_var(child.attributes, 'type', "single", false);
					props.title = get_var(child.attributes, 'title', null, false, false, true);
					props.fill = get_var(child.attributes, 'fill', true, false);
					break;
				case 'TEXT': // element, text, x, y, width, height, z=1, clip=false, effect=null, events={}, line_break=true
					props.text = get_var(child.attributes, 'text', "", false, false, true);
					props.clip = get_var(child.attributes, 'clip', false, false);
					props.line_break = get_var(child.attributes, 'line_break', true, false);
					break;
				case 'PROGRESS': // element, x, y, width=10, height=1, z=1, value=50, max=100, effect=null, events={}, fill_char='', empty_char=null
					props.value = get_var(child.attributes, 'value', 50);
					props.max = get_var(child.attributes, 'max', 100);
					props.fill_char = get_var(child.attributes, 'fill_char', PrompterCharmap.FILLSPACE, false);
					props.empty_char = get_var(child.attributes, 'empty_char', '-', false);
					break;
				case 'HR': // element, x, y, width=10, z=1, effect=null, events={}, fill_char=''
					delete props.height;
					props.fill_char = get_var(child.attributes, 'fill_char', '-', false);
					break;
				case 'IMG': // element, x, y, width, height, z=1, source, ignoreList=[], fill=true, effect=null, events={}
					props.source = get_var(child.attributes, 'source', "", false);
					props.ignore_list = get_var(child.attributes, 'ignore_list', [], false);
					props.fill = get_var(child.attributes, 'fill', '', false);
					break;
			}

			
			// populate PrompterScreen.element_list, PrompterScreen.z_index_flag and PrompterScreen.id_elem_list
			let element_id = get_attr(child.attributes, PrompterElement.DEFAULT_DOM_ID, null);
			if(element_id === null) { // create new Object
				let element = PrompterScreen.buildElement(child.tagName, child);
				element.update(props);

				// push element to element_list on props.z+1 position or end of list and update nexts z positions to +1
				set_element(element, props.z);
				
				// register element on PrompterScreen.id_elem_list and write object id on DOM element
				PrompterScreen.id_elem_list[element._id] = element;
				child.setAttribute(PrompterElement.DEFAULT_DOM_ID, element._id);
			}
			else { // Object already exist
				let element = PrompterScreen.id_elem_list[element_id];
				if(element.z !== props.z) { // changed z, reorder id_elem_list and z_index_flag
					// decrease nexts old z
					let z_index = Object.keys(PrompterScreen.z_index_flag).indexOf(props.z);
					let layers = Object.keys(PrompterScreen.z_index_flag);
					let already_deleted = false;
					let decreased_nexts_flag = false;
					for(let layer=z_index+1; layer < layers.length; layer++) {
						if(!decreased_nexts_flag) {
							decreased_nexts_flag = true;
							for(let el = PrompterScreen.z_index_flag[layers[layer]]; el < PrompterScreen.element_list.length; el++) {
								PrompterScreen.element_list[el].position--;
							}
						}
						PrompterScreen.z_index_flag[layers[layer]]--;
						if(!already_deleted && (PrompterScreen.z_index_flag[layers[layer]] == PrompterScreen.z_index_flag[layers[layer-1]])) {
							already_deleted = true;
							delete PrompterScreen.z_index_flag[layers[layer-1]];
						}
					}
					if(!already_deleted && ((z_index+1) === Object.keys(PrompterScreen.z_index_flag).length)) { // last index
						delete PrompterScreen.z_index_flag[props.z];
					}

					// remove from ordened list
					PrompterScreen.element_list.splice(element.position, 1);

					// change element position on PrompterScreen.element_list and add 1 nexts new z
					set_element(element, props.z);
				}
				element.update(props);
			}
		};

		if(specific_element !== null) {
			process_element(specific_element);
		}
		else {
			PrompterScreen.prompt.querySelectorAll(":not(screen)").forEach(process_element);
		}
	}

	static ConvertObjectsToASCII() { // before called DrawScreen
		// filling up mapping with null
		PrompterScreen.mapping = PrompterScreenMap.genMap(PrompterScreen.clean_screen.width, PrompterScreen.clean_screen.height, null);
		
		const parseHtmlMap = (el, htmlmap) => {
			for(let y in htmlmap) {
				y = Number(y);
				if((y+el.y) >= PrompterScreen.mapping.length
				|| (y+el.y) < 0) continue;
				for(let x in htmlmap[y]) {
					x = Number(x);
					if(PrompterScreen.mapping[y+el.y] === undefined) {
						console.warn(y, el.y, PrompterScreen.mapping);
					}
					if((x+el.x) >= PrompterScreen.mapping[y+el.y].length
					|| (x+el.x) < 0) continue;
					if(PrompterScreen.mapping[y+el.y][x+el.x].value === null && htmlmap[y][x] !== null) {
						PrompterScreen.mapping[y+el.y][x+el.x] = new PrompterScreenDot(htmlmap[y][x], el.effect, el.events, el._id);
					}
				}
			}
		};

		for(let e=PrompterScreen.element_list.length-1; e >= 0; e--) {
			const element = PrompterScreen.element_list[e];
			if(!element.enabled) continue;

			// childs must be first, so they can overwrite the parent element
			for(const childElement of element.child_objects) {
				parseHtmlMap(childElement, childElement.html_object);
			}

			parseHtmlMap(element, element.html_object);
		}
	}
	//#endregion

	static Refresh() {
		if(document.readyState == "complete") {
			PrompterScreen.ConvertHTMLToObjects();
			PrompterScreen.ConvertObjectsToASCII();
			PrompterScreen.Draw();
		}
	}

	static Draw() {
		const prepStr = tags => { // only added tags compared to previous dot
			let str_final = "";
			let effect = "";

			if('event' in tags) {
				let events = PrompterScreenDotEvent.parseHTML(tags.event);
				str_final += `<a${events}>`;
			}
			if('style' in tags) {
				if('color' in tags) effect = `style="${tags.style};color:${tags.color}"`;
				else effect = `style="${tags.style};"`;
			}
			else if('color' in tags) {
				effect = `style="color:${tags.color};"`;
			}
			if(effect !== "") str_final += `<span ${effect}>`;

			for(let prop of PrompterScreenDotEffect.valid_props) {
				if(prop in tags && prop !== 'color' && prop !== 'style') {
					str_final += `<${PrompterScreenDotEffect.prop_element[prop]}>`;
				}
			}

			return str_final;
		};
		const pospStr = tags => { // only lost tags compared to next dot
			let str_final = "";

			for(let prop of PrompterScreenDotEffect.valid_props.reverse()) {
				if(prop in tags && prop !== 'color' && prop !== 'style') {
					str_final += `</${PrompterScreenDotEffect.prop_element[prop]}>`;
				}
			}
			if('style' in tags || 'color' in tags) str_final += "</span>";
			if('event' in tags) str_final += "</a>";

			return str_final;
		};

		const except = (alist, blist) => {
			const deepCompare = (a, b) => a === b || (a instanceof Object && b instanceof Object && JSON.stringify(a) === JSON.stringify(b));
			return Object.keys(alist).reduce((acc, i) => ({...acc, ...(i in blist && deepCompare(alist[i], blist[i])? {}: {[i]: alist[i]})}), {});
		};

		let final_text = "";
		for(let y in PrompterScreen.mapping) {
			y = Number(y);

			let last_tags = {};
			for(let x in PrompterScreen.mapping[y]) {
				x = Number(x);
				let str_line = PrompterScreen.mapping[y][x]?.value?? PrompterCharmap.WHITESPACE;

				if(str_line !== PrompterCharmap.WHITESPACE && str_line !== ' '
				&& Object.keys(PrompterCharmap.DIRECTIONAL_CHAR_MAP).includes(str_line)) {
					str_line = PrompterCharmap.ForceConnect(PrompterScreen.mapping, y, x);
				}
				
				let tags = PrompterScreen.mapping[y][x].effect?.list || {};
				let next_tags = PrompterScreen.mapping[y][x+1]?.effect?.list || {};


				if(Object.keys(PrompterScreen.mapping[y][x].events?.list || {}).length) {
					tags['event'] = PrompterScreen.mapping[y][x].events.list;
				}

				if(Object.keys(PrompterScreen.mapping[y][x+1]?.events?.list || {}).length) {
					next_tags['event'] = PrompterScreen.mapping[y][x+1].events.list;
				}

				final_text += prepStr(except(tags, last_tags)) + str_line + pospStr(except(tags, next_tags));
				last_tags = tags;
			}
			final_text += '\n';
		}

		PrompterScreen.container.innerHTML = final_text;
	}

	//#region [Cursor]
	static trackCursor() {
		PrompterScreen.container.addEventListener('mousemove', (ev) => {
			PrompterScreen.cursorPosition = [ev.offsetX, ev.offsetY];
		});
	}

	static getCursorPosition() {
		let cursorPosX = Math.floor(PrompterScreen.cursorPosition[0] / PrompterCharmap.CHARSIZE[0]);
		let cursorPosY = Math.floor(PrompterScreen.cursorPosition[1] / PrompterCharmap.CHARSIZE[1]);
		return [cursorPosX, cursorPosY];
	}
	//#endregion
}
//#endregion