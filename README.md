# Prompter
Auto interpreter to convert HTML to fully character prompt-like interface.

<details open>
<summary><b>Table of Contents</b></summary>

  - [How To](#how-to)
  - [Currently](#currently)
    - [Formatting](#formatting)
    - [Script Support](#script-support)
      - [Internal Script Support](#internal-script-support)
    - [Image Support](#image-support)
    - [HTML Support](#html-support)
  - [On Going](#on-going)
  - [Known Issues](#known-issues)

</details>

## How To

To start this lib copy **prompter** folder and import *prompter/main.js* file as script or add a script import to `https://yurishimoi.github.io/prompter/import/prompter/main.js`, create a **<prompt>** element and create elements like above [Currently](#currently) description, any other elements inside prompt will be ignored and hidden.
You can check the *[online demo page](https://yurishimoi.github.io/prompter/)* where the new features will be in implementation test phase.

Prompt color scheme can be easily changed with *type* attribute:
  - default: `background: black; color: white`
  - white: `background: white; color: black`
  - retro: `background: black; color: green`
  - blueprint: `background: blue; color: white`

> Also, if needed, in *main.css* you can manually change prompt base color or inside a *style property*, changing *background* and *color* will affect everything.

Adding the attribute **debug** on **prompt** enable manually edit entire screen text.

```HTML
<prompt debug>
</prompt>
```

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
          onclick="Prompter.ToggleElement('inventory')"></text>
  </div>
  <div id="inventory" title="Inventory" xalign="center" yalign="center"
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
  <div type='none' xalign='center' yalign='center' width=53 height=17>
    <div title="1" xalign='center' y=-3 width=51></div>
    <div title="2" width=25 height=15>
      <div type="double" title="2.1" xalign='center'></div>
      <div type="double" title="2.2" xalign='center'
           yalign='center'></div>
      <div type="double" title="2.3" xalign='center'
           yalign='bottom'></div>
    </div>
    <div title="3" xalign='right' width=25 height=15>
      <div type="none" title="3.1" xalign='center' yalign='center'
           height=7>
        <div type="double" title="3.1.1" x=0 y=0></div>
        <div type="double" title="3.1.2" x=0 y=2
             yalign='bottom'></div>
      </div>
    </div>
    <div title="4" xalign='center' yalign='center'></div>
    <div title="5" xalign='center' yalign='bottom' y=5
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

### Formatting

Every **text** and **title** properties accept `${variable}` format, every called variable must be registered in **GLOBAL_VARIABLE_REGISTER**.

<details>
  <summary><b>Variable in title and text example</b></summary>
<table>
  <tr>
    <th>Code</th>
    <th>Preview</th>
  </tr>
  <tr>
<td>

```HTML
<prompt>
  <div id="menu" title="${sometitle}" width=12 height=4 x=2>
    <text text="${Translator.eng}" x=0 xalign="right"
      yalign="bottom">
    </text>
  </div>
</prompt>
<script>
  GLOBAL_VARIABLE_REGISTER["sometitle"]  =
    "My Title";
  GLOBAL_VARIABLE_REGISTER["Translator"] =
    {"eng": "cool", "ptb": "legal"};
</script>
```

</td>
<td>

```text
┌ My Title ──┐
│            │
│            │
│            │
│        cool│
└────────────┘
```

</td>
  </tr>
</table>
</details>

Actually, any numeric attribute (E.g **with**, **height**, **value**, etc) can be set with a single variable.

```HTML
<prompt>
  <progress width="prg_siz" value="prg_val" max="prg_max"></progress>
</prompt>
<script>
  GLOBAL_VARIABLE_REGISTER['prg_siz'] = 20;
  GLOBAL_VARIABLE_REGISTER['prg_val'] = 100;
  GLOBAL_VARIABLE_REGISTER['prg_max'] = 200;
</script>
```

### Script Support

- **Prompter.EnableElement(eid, draw=true)** - Remove disabled attribute of given element;
- **Prompter.DisableElement(eid, draw=true)** - Add disabled attribute of given element;
- **Prompter.ToggleElement(eid, draw=true)** - Toggle disabled attribute of given element;
- **Prompter.UpdateElement(eid, attrs, draw=true)** - Update given attributes, attrs must be in **{\<attribute>:\<value>,...}** format;
- **Prompter.NewElement(type, attrs={}, pid=null, draw=true)** - Create an element, id can be passed on attrs, second argument is the parent id, if null its prompt;
- **Prompter.DelElement(eid, draw=true)** - Delete element with given id.

> Note:
  If has no element with given id (same in parent id cases), this functions will return **false**. By default, at end of function will redraw the screen as long *draw* argument is **true**.

#### Internal Script Support

I do really hope you never have to manually call no one other than **UpdateScreen** when you need to refresh the page.

- **PrompterScreen.UpdateScreen()** - Calls for **PrompterScreen.CalcScreenSize** passing *false*, and calls for **PrompterScreen.HtmlConvert**;
- **PrompterScreen.CalcScreenSize(drawAtEnd=true)** - Recalculate the screen sizes, at end calls for **PrompterScreen.ClearScreen** passing the *drawAtEnd* property;
- **PrompterScreen.HtmlConvert()** - Query over every element in *HTML prompt* and starts populate the internal mapping, at end calls for **PrompterScreen.DrawScreen**;
- **PrompterScreen.ClearScreen(drawAtEnd=true)** - Emptyes the internal mapping based on default configurations, at end calls for **PrompterScreen.DrawScreen**;
- **PrompterScreen.DrawScreen()** - Reads intern char mapping and do the magic to as fast as possible shows they as text in the screen.

### Image Support

Images can be plotted in the canvas! If you have that awesome pixel art you just need to show in the prompt, you just need to convert to a properly readable string.

Actually images are **read** with full color support, but **drawed** in the prompt as **monochromaticaly only**, coloring will be supported in a new update soon, if you reading that warning, wait just a bit.

In the root of this library you can find an file called *imageConversor.html* that contains a web page with a easy to use converter from an image file to string based readable image, you can also access it [here](https://yurishimoi.github.io/prompter/imageConversor.html), the conversor tool will show the actual supported mapping of the image prompted, as well the string you will need to pass in the **src** field when adding the image in the screen.

> Hint:
  You can save your string-like images anywhere you want, but its easier pass they all to the [GLOBAL_VARIABLE_REGISTER](#formatting) to make a more readable HTML on development when passing to **src** image field.

> Note:
When using the variable format `"${variable}"` in a *img src* they will send an error message in console, if you are like me and want to suppress the error you can add a "#" at start of the *src*, so the interpreter will ignore that and also the browser will not shoot the error anymore. So will be just like `"#${variable}"`.

### HTML Support

- **DIV**: converted to box
  Property | Argument type | Description
  --- | --- | ---
  | id | *String* | Id of element
  | border-color | *String* | Changes bordering color, any CSS valid color is available, including hex color
  | clip | *Boolean* | If true clip text at end of line **(default: false)**
  | color | *String* | Changes text color, any CSS valid color is available, including hex color
  | disabled | *Boolean* | Disable element to be seen on screen **(default: false)**
  | height | *Number* | Height of the box, can be a number or a percentage *(E.g: "100%")* **(default: 3)**
  | style | *String* | CSS style, overwrites any other argument styling **(Not recommended, use only if really necessary)**
  | text | *String* | Text printed inside the box
  | title | *String* | Text printed at top of the box
  | type | *String* | Box bordering type, can be none, single, bold, double, chess, bold|chess, double|chess **(default: single)**
  | width | *Number* | Width of the box, can be a number or a percentage *(E.g: "100%")* **(default: 10)**
  | x | *Number* | Position x in screen **(default: 1)**
  | xalign | *String* | X alignment relative to parent, can be 'left', 'right' or 'center' **(default: 'left')**
  | y | *Number* | Position y in screen **(default: 1)**
  | yalign | *String* | Y alignment relative to parent, can be 'top', 'bottom' or 'center' **(default: 'top')**
  
- **TEXT**: converted to interactive text
  Property | Argument type | Description
  --- | --- | ---
  | id | *String* | Id of element
  | color | *String* | Changes text color, any CSS valid color is available, including hex color
  | disabled | *Boolean* | Disable element to be seen on screen **(default: false)**
  | onclick | *String* | Script to execute on click
  | style | *String* | CSS style, overwrites any other argument styling **(Not recommended, use only if really necessary)**
  | text | *String* | Actual text to display
  | type | *String* | List of styles separated by space, valid ones are bold, underline and italic **(default: '')**
  | x | *Number* | Position x in screen **(default: 1)**
  | xalign | *String* | X alignment relative to parent, can be 'left', 'right' or 'center' **(default: 'left')**
  | y | *Number* | Position y in screen **(default: 1)**
  | yalign | *String* | Y alignment relative to parent, can be 'top', 'bottom' or 'center' **(default: 'top')**
  
- **PROGRESS**: converted to horizontal progress bar, if *width* is adjusted to 1 can simulate a simple vertical bar
  Property | Argument type | Description
  --- | --- | ---
  | id | *String* | Id of element
  | color | *String* | Changes text color, any CSS valid color is available, including hex color
  | disabled | *Boolean* | Disable element to be seen on screen **(default: false)**
  | empty | *String* | Set the char to be used on unfilled part, setting as '' will not infill **(default: ' ')**
  | fill | *String* | Set the char to be used on filled part **(default: '█')**
  | height | *Number* | Height of the progress bar, can be a number or a percentage *(E.g: "100%")* **(default: 1)**
  | max | *Number* | Defines the limit of progress **(default: 100)**
  | style | *String* | CSS style, overwrites any other argument styling **(Not recommended, use only if really necessary)**
  | value | *Number* | Defines the progress amount **(default: 50)**
  | width | *Number* | Width of the progress bar, can be a number or a percentage *(E.g: "100%")* **(default: 10)**
  | x | *Number* | Position x in screen **(default: 1)**
  | xalign | *String* | X alignment relative to parent, can be 'left', 'right' or 'center' **(default: 'left')**
  | y | *Number* | Position y in screen **(default: 1)**
  | yalign | *String* | Y alignment relative to parent, can be 'top', 'bottom' or 'center' **(default: 'top')**

- **HR**: a simple horizontal line
  Property | Argument type | Description
  --- | --- | ---
  | id | *String* | Id of element
  | color | *String* | Changes text color, any CSS valid color is available, including hex color
  | disabled | *Boolean* | Disable element to be seen on screen **(default: false)**
  | fill | *String* | Set the char to be used, overwrite **type** argument **(default: null)**
  | style | *String* | CSS style, overwrites any other argument styling **(Not recommended, use only if really necessary)**
  | type | *String* | line type, can be none, single, bold, double, chess, bold|chess, double|chess **(default: single)**
  | width | *Number* | Width of the line, can be a number or a percentage *(E.g: "100%")* **(default: 10)**
  | x | *Number* | Position x in screen **(default: 1)**
  | xalign | *String* | X alignment relative to parent, can be 'left', 'right' or 'center' **(default: 'left')**
  | y | *Number* | Position y in screen **(default: 1)**
  | yalign | *String* | Y alignment relative to parent, can be 'top', 'bottom' or 'center' **(default: 'top')**

- **IMAGE**: converted to a pixel art image
  Property | Argument type | Description
  --- | --- | ---
  | id | *String* | Id of element
  | color | *String* | Changes image color, any CSS valid color is available, including hex color
  | disabled | *Boolean* | Disable element to be seen on screen **(default: false)**
  | height | *Number* | Height of the image, can be a number or a percentage *(E.g: "100%")* **(default: 3)**
  | ignore | *String* | List of hexadecimals to be transparent, must be separated by commas and without spaces, and must use full 6 digits with **#** at start and no alpha. **(example: "#000000,#ff0000", will ignore black and red and set as transparent pixel)**
  | src | *String* | Image mapping, need to be in a strict format, see more in [Image Support](#image-support)
  | style | *String* | CSS style, overwrites any other argument styling **(Not recommended, use only if really necessary)**
  | width | *Number* | Width of the image, can be a number or a percentage *(E.g: "100%")* **(default: 10)**
  | x | *Number* | Position x in screen **(default: 1)**
  | xalign | *String* | X alignment relative to parent, can be 'left', 'right' or 'center' **(default: 'left')**
  | y | *Number* | Position y in screen **(default: 1)**
  | yalign | *String* | Y alignment relative to parent, can be 'top', 'bottom' or 'center' **(default: 'top')**

## On Going

- Add *hover* property to **TEXT** element to configure hover color;
- Add *Transparent=True/False* to **DIV** / **IMAGE** elements to configure infill;
- Width/height can be calculated (E.g. 100% - 30);
- Add *scroll* property to **DIV** element;
- Make **IMG** plot every color in src and consider transparent from **PNG**;

## Known Issues

- Title not clipping as expected;
- Right/Bottom aligned does'nt affect x/y orientation;
- IMG can't read **PNG** transparency, already planned as future feature.