# Prompter
Converts HTML to fully char prompt-like interface.

## How To
To start this lib copy **prompter** folder and import *prompter/main.js* file as script, create a **<prompt>** element and create elements like above *Currently* description, any other elements inside prompt will be ignored and hidden.

Prompt color scheme can be easily changed with *type* attribute:
  - default: `background: black; color: white`
  - white: `background: white; color: black`
  - retro: `background: black; color: green`
  - blueprint: `background: blue; color: white`

> Also, if needed, in *main.css* you can manually change prompt base color or inside a *style property*, changing *background* and *color* will affect everything.

<details open>
<summary><b>Basic example</b></summary>
<table>
  <tr>
    <th>Code</th>
    <th>Preview</th>
  </tr>
  <tr>
<td>
      
```HTML
<prompt type="retro">
  <div width=15 height=10 y=2 x=3></div>
  <div id="menu" title="Main Menu" text="Main text"
       width=15 height=10 x=2>
    <text text="Inventory" x=0 xalign="right" yalign="bottom"
          onclick="toggleElement('inventory')"></text>
  </div>
  <div id="inventory" title="Inventory" x="center" y="center"
       disabled="true" width=15></div>
</prompt>
```
      
</td>
<td>
      
```text
 ┌ Main Menu ────┐
 │Main text      ├┐
 │               ││
 │               ││
 │               ││┌ Inventory ────┐
 │               │││               │
 │               │││               │
 │               │││               │
 │               ││└───────────────┘
 │               ││
 │     Inventory ││
 └┬──────────────┘│
  └───────────────┘
```
      
</td>
  </tr>
</table>
</details>


<details open>
  <summary><b>Complex positioned example</b></summary>
<table>
  <tr>
    <th>Code</th>
    <th>Preview</th>
  </tr>
  <tr>
<td>
      
```HTML
<prompt type="retro">
  <div type='none' x='center' y='center' width=53 height=17>
    <div title="1" x='center' y=-3 width=51></div>
    <div title="2" width=25 height=15>
      <div type="double" title="2.1" x='center'></div>
      <div type="double" title="2.2" x='center'
           y='center'></div>
      <div type="double" title="2.3" x='center'
           yalign='bottom'></div>
    </div>
    <div title="3" xalign='right' width=25 height=15>
      <div type="none" title="3.1" x='center' y='center'
           height=7>
        <div type="double" title="3.1.1" x=0 y=0></div>
        <div type="double" title="3.1.2" x=0 y=2
             yalign='bottom'></div>
      </div>
    </div>
    <div title="4" x='center' y='center'></div>
    <div title="5" x='center' yalign='bottom' y=5
         width=51></div>
  </div>
</prompt>
```
      
</td>
<td>
      
```text
 ┌ 1 ────────────────────────────────────────────────┐
 │                                                   │
 │                                                   │
 │                                                   │
 ├ 2 ──────────────────────┬ 3 ──────────────────────┤
 │      ╔ 2.1 ═════╗       │                         │
 │      ║          ║       │                         │
 │      ║          ║       │                         │
 │      ║          ║       │      ╔ 3.1.1 ═══╗       │
 │      ╚══════════╝       │      ║          ║       │
 │      ╔ 2.2 ═════╗ ┌ 4 ──┴────┐ ║          ║       │
 │      ║          ║ │          │ ║          ║       │
 │      ║          ║ │          │ ╠ 3.1.2 ═══╣       │
 │      ║          ║ │          │ ║          ║       │
 │      ╚══════════╝ └─────┬────┘ ║          ║       │
 │      ╔ 2.3 ═════╗       │      ║          ║       │
 │      ║          ║       │      ╚══════════╝       │
 │      ║          ║       │                         │
 │      ║          ║       │                         │
 │      ╚══════════╝       │                         │
 ├ 5 ──────────────────────┴─────────────────────────┤
 │                                                   │
 │                                                   │
 │                                                   │
 └───────────────────────────────────────────────────┘
```
      
</td>
  </tr>
</table>
</details>


Check the *index.html* file to see examples on hold.

## Currently

#### Script Support

- **enableElement(eid, draw=true)** - Remove disabled attribute of given element
- **disableElement(eid, draw=true)** - Add disabled attribute of given element
- **toggleElement(eid, draw=true)** - Toggle disabled attribute of given element
- **changeElement(eid, attrs, draw=true)** - Change given attributes with **{\<attribute>:\<value>,...}** format
- **newElement(type, attrs={}, pid=null, draw=true)** - Create an element, id can be passed on attrs, last argument is the parent id, if null its prompt
- **delElement(eid, draw=true)** - Delete element with given id

> Note:
  If has no element with given id (same in parent id cases), this functions will return **false** in that cases.
  By default at end of function will redraw the screen.


#### HTML Support

- **DIV**: converted to box
  Property | Argument type | Description
  --- | --- | ---
  | id | *String* | Id of element
  | border-color | *String* | Changes bordering color, any CSS valid color is available, including hex color
  | clip | *Boolean* | If true clip text at end of line **(default: false)**
  | color | *String* | Changes text color, any CSS valid color is available, including hex color
  | disabled | *Boolean* | Disable element to be seen on screen **(default: false)**
  | height | *Number* | Height of the box **(default: 3)**
  | text | *String* | Text printed inside the box
  | title | *String* | Text printed at top of the box
  | type | *String* | Box bordering type, can be none, single, bold, double, chess, bold|chess, double|chess **(default: single)**
  | width | *Number* | Width of the box **(default: 10)**
  | x | *Number* | Position x in screen, can also be 'center', 'center' has priority above xalign **(default: 1)**
  | xalign | *String* | X alignment relative to parent, can be 'left' or 'right' **(default: 'left')**
  | y | *Number* | Position y in screen, can also be 'center', 'center' has priority above yalign **(default: 1)**
  | yalign | *String* | Y alignment relative to parent, can be 'top' or 'bottom' **(default: 'top')**
  
- **TEXT**: converted to interactive text
  Property | Argument type | Description
  --- | --- | ---
  | id | *String* | Id of element
  | color | *String* | Changes text color, any CSS valid color is available, including hex color
  | disabled | *Boolean* | Disable element to be seen on screen **(default: false)**
  | onclick | *String* | Script to execute on click
  | text | *String* | Actual text to display
  | type | *String* | List of styles separated by space, valid ones are bold, underline and italic **(default: '')**
  | x | *Number* | Position x in screen, can also be 'center', 'center' has priority above xalign **(default: 1)**
  | xalign | *String* | X alignment relative to parent, can be 'left' or 'right' **(default: 'left')**
  | y | *Number* | Position y in screen, can also be 'center', 'center' has priority above yalign **(default: 1)**
  | yalign | *String* | Y alignment relative to parent, can be 'top' or 'bottom' **(default: 'top')**
  
- **PROGRESS**: converted to horizontal progress bar, if *width* is adjusted to 1 can simulate a simple vertical bar
  Property | Argument type | Description
  --- | --- | ---
  | id | *String* | Id of element
  | color | *String* | Changes text color, any CSS valid color is available, including hex color
  | disabled | *Boolean* | Disable element to be seen on screen **(default: false)**
  | empty | *String* | Set the char to be used on unfilled part, setting as '' will not infill **(default: ' ')**
  | fill | *String* | Set the char to be used on filled part **(default: '█')**
  | height | *Number* | Height of the progress bar **(default: 1)**
  | max | *Number* | Defines the limit of progress **(default: 100)**
  | value | *Number* | Defines the progress amount **(default: 50)**
  | width | *Number* | Width of the progress bar **(default: 10)**
  | x | *Number* | Position x in screen, can also be 'center', 'center' has priority above xalign **(default: 1)**
  | xalign | *String* | X alignment relative to parent, can be 'left' or 'right' **(default: 'left')**
  | y | *Number* | Position y in screen, can also be 'center', 'center' has priority above yalign **(default: 1)**
  | yalign | *String* | Y alignment relative to parent, can be 'top' or 'bottom' **(default: 'top')**


## On Going

- More elements ( **IMAGE**, **HR** )
- Add *hover* property to **TEXT** element to configure hover color
- Add *Transparent=True/False* to **DIV** / **IMAGE** elements to configure infill
- Percentage allowed in width and height
- Width/height can be calculated (E.g. 100% - 30)
- Add *scroll* property to **DIV** element

## Known Issues

- Title not clipping properly
- Right/Bottom aligned does'nt effect x/y orientation
