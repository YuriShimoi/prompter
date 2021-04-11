# Prompter
Converts HTML to fully char prompt-like interface.

## How To
To start the lib, import _prompter/main.js_ file as script, create a **prompt** element and create elements like above Currently description.

Prompt color scheme can be changed with *type* attribute:
  - default: `background: black; color: white`
  - white: `background: white; color: black`
  - retro: `background: black; color: green`
  
Any other elements inside prompt will be ignored and hidden.

<br>
Basic example:
```html
<prompt type="retro">
  <div width=15 height=10 y=2 x=3></div>
  <div id="menu" title="Main Menu" text="Main text" width=15 height=10 x=2>
    <button text="Inventory" x=6 y=11 onclick="toggleElement('inventory')"></button>
  </div>
  <div id="inventory" title="Inventory" x='center' y='center' disabled="true" width=15></div>
</prompt>
```
<br>
Positioning example:
```html
<prompt type="retro">
  <div type='none' x='center' y='center' width=52 height=17>
    <div title="1" x='center' y=-4 width=50></div>
    <div title="2" width=24 height=15>
      <div title="2.1" x='center' y='center'></div>
    </div>
    <div title="3" x=27 width=24 height=15>
      <div title="3.1" x='center' y='center'></div>
    </div>
    <div title="4" x='center' y='center'></div>
    <div title="5" x='center' y=18 width=50></div>
  </div>
</prompt>
```

## Currently
#### HTML Support
- **DIV**: converted to box
  - id **(String)** - Id of element
  - x **(Number)** - Position x in screen, can also be 'center' **(default: 1)**
  - y **(Number)** - Position y in screen, can also be 'center' **(default: 1)**
  - disabled **(Boolean)** - Disable element to be seen on screen **(default: false)**
  - width **(Number)** - Width of the box **(default: 10)**
  - height **(Number)** - Height of the box **(default: 3)**
  - type **(String)** - Box bordering type, can be none, single, bold, double, chess, bold-chess, double-chess **(default: single)**
  - text **(String)** - Text printed inside the box
  - clip **(Boolean)** - If true clip text at end of line **(default: false)**
  - title **(String)** - Text printed at top of the box
- **BUTTON**: converted to interactive text
  - id **(String)** - id of element
  - x **(Number)** - Position x in screen, can also be 'center' **(default: 1)**
  - y **(Number)** - Position y in screen, can also be 'center' **(default: 1)**
  - disabled **(Boolean)** - Disable element to be seen on screen **(default: false)**
  - text **(String)** - Button text
  - onclick **(String)** - Script to execute on click

#### Script Support
- **enableElement(eid)** - Remove disabled attribute of given element
- **toggleElement(eid)** - Toggle disabled attribute of given element
- **changeElement(eid, attrs)** - Change given attributes with **{\<attribute>:\<value>,...}** format
- **newElement(type, attrs={}, pid=null)** - Create an element, id can be passed on attrs, last argument is the parent id, if null its prompt
- **delElement(eid)** - Delete element with given id

## Future
- More elements
- Percentage allowed in width and height
- Bold, Italic and Underline as option to do inside the texts