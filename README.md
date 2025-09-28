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

To start using this library, download the **source** folder and import `source/main.js` file as script, or add a script import to `https://yurishimoi.github.io/prompter/source/main.js`, create a **\<prompt>** element with any elements like below in [HTML Support](#html-support) description, any other elements inside the prompt will be ignored and hidden.
There is also an script support to change the elements on the screen, its just a shorthand in case if there is nothing like jQuery so you can update the elements easily, it is currently under `source/elementSupport.js`.
You can check the *[online demo page](https://yurishimoi.github.io/prompter/)* where the new features will be in implementation test phase.

Prompt color scheme can be easily changed with *type* attribute:
  - default: `background: black; color: white`
  - white: `background: white; color: black`
  - retro: `background: black; color: green`
  - blueprint: `background: blue; color: white`

> Also, if you want to, in *main.css* you can check the prompt base colors that you can change to make your custom visuals.

Adding the attribute **debug** on **prompt** enable manually edit the entire screen text on time.

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
  <div width=15 height=10 x=3 y=2></div>
  <div id="menu" title="Main Menu" text="Main text"
    width=15 height=10 x=2 y="1">
    <text text="Inventory" x="-1" xalign="right" yalign="bottom"
    onclick="Prompter('inventory').toggle()"></text>
  </div>
  <div title="Inventory" xalign="center" yalign="center" 
  disabled="true" width=15 id="inventory"></div>
</prompt>
```

</td>
<td>

```text
 ┌ Main Menu ──┐
 │Main text    ├┐
 │             ││
 │             ││
 │             ││┌ Inventory ──┐
 │             │││             │
 │             ││└─────────────┘
 │             ││
 │             ││
 │             ││
 │   Inventory ││
 └┬────────────┘│
  └─────────────┘
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
  <div type="none" xalign='center' yalign='center' width=51 height=19>
    <div title="1" xalign='center' y=-4 width=49 height=5></div>
    <div title="2" width=25 height=17>
      <div type="double" title="2.1" xalign='center' height=5></div>
      <div type="double" title="2.2" xalign='center' yalign='center'
        height=5></div>
      <div type="double" title="2.3" xalign='center' yalign='bottom'
        height=5></div>
    </div>
    <div title="3" xalign='right' width=25 height=17>
      <div type="none" title="3.1" xalign='center' yalign='center'
        height=9>
        <div type="double" title="3.1.1" y=-1 height=5></div>
        <div type="double" title="3.1.2" y=1 yalign='bottom'
          height=5></div>
      </div>
    </div>
    <div title="4" xalign='center' height=5 yalign='center'></div>
    <div title="5" xalign='center' yalign='bottom' y=4 width=49
      height=5></div>
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

Every tag properties accepts `${variable}` format, once they are properly registered in `VariableRegister.set(<key>, <value>)`, when its on a numeric property it has no need for `${...}`, the variable can be typed as it is.

<details>
  <summary><b>Variable use case example</b></summary>
<table>
  <tr>
    <th>Code</th>
    <th>Preview</th>
  </tr>
  <tr>
<td>

```HTML
<prompt>
  <div id="menu" title="${sometitle}" width=20 height=4 x=2>
    <text text="${antext}" x="posx" yalign="bottom">
    </text>
  </div>
</prompt>
<script>
  VariableRegister.set("sometitle", "Title");
  VariableRegister.set("antext", "Test Text");
  VariableRegister.set("posx", 6);
</script>
```

</td>
<td>

```text
  ┌ Title ───────────┐
  │                  │
  │      Test Text   │
  └──────────────────┘
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
  VariableRegister.set('prg_siz', 20);
  VariableRegister.set('prg_val', 100);
  VariableRegister.set('prg_max', 200);
</script>
```

### Script Support

- **Prompter(id).get()** - Get the DOM element from the given id;
- **Prompter(id).move(x, y)** - Sum to the **x** and **y** attributes;
- **Prompter(id).moveTo(x, y)** - Set the **x** and **y** attributes;
- **Prompter(id).enable()** - Remove disabled attribute;
- **Prompter(id).disable()** - Add disabled attribute;
- **Prompter(id).toggle()** - Toggle disabled attribute;
- **Prompter(id).update(attrs)** - Update given attributes, attrs must be in **{\<attribute>:\<value>,...}** format;
- **Prompter(id).append(type, attrs={})** - Create an [element](#html-support), id can be passed on attrs;
- **Prompter(id).delete()** - Delete element.

> Note:
  If has no element with given id (same in parent id cases), this functions will return **undefined**. By default, except the delete function, all returns the prompter object so you can call the other functions in sequence (E.g: Prompter("id").enable().moveTo(5, 5)).

#### Internal Script Support

I really hope you never have to manually call any other than **Refresh** when you need to refresh the page.

- **PrompterScreen.Refresh()** - Calls for the convertions and draw functions below;
- **PrompterScreen.ConvertHTMLToObjects(element=null)** - Query over the elements inside the *prompt* and update the internal objects, a given element can be specified to be updated instead of the whole *prompt*;
- **PrompterScreen.ConvertObjectsToASCII()** - Get all internal elements and repopulate the Prompter mapping;
- **PrompterScreen.Draw()** - Reads the Prompter mapping and do the magic to create the text in the screen.

### Image Support

> Image support was removed due architecture changes, i do have plans on rework it in the future, but it will take time.

### HTML Support

> Event tags like onclick, onmouseenter and onmouseleave have support on all elements.

- **DIV**: converted to box
  Property | Argument type | Description
  --- | --- | ---
  | id | *String* | Id of element
  | color | *String* | Changes title and border color, any CSS valid color is available, including hex color
  | disabled | *Boolean* | Disable element to be seen on screen **(default: false)**
  | height | *Number* | Height of the box, can be a number or a percentage *(E.g: "100%")* **(default: 3)**
  | style | *String* | CSS style, overwrites any other argument styling **(Not recommended, use only if really necessary)**
  | text | *String* | Text printed inside the box
  | title | *String* | Text printed at top of the box
  | type | *String* | Box bordering type, can be none, single, bold, double, chess, bold|chess, double|chess **(default: single)**
  | width | *Number* | Width of the box, can be a number or a percentage *(E.g: "100%")* **(default: 10)**
  | x | *Number* | Position x relative to its parent **(default: 1)**
  | xalign | *String* | X alignment relative to parent, can be 'left', 'right' or 'center' **(default: 'left')**
  | y | *Number* | Position y relative to its parent **(default: 1)**
  | yalign | *String* | Y alignment relative to parent, can be 'top', 'bottom' or 'center' **(default: 'top')**
  
- **TEXT**: converted to interactive text
  Property | Argument type | Description
  --- | --- | ---
  | id | *String* | Id of element
  | color | *String* | Changes text color, any CSS valid color is available, including hex color
  | disabled | *Boolean* | Disable element to be seen on screen **(default: false)**
  | style | *String* | CSS style, overwrites any other argument styling **(Not recommended, use only if really necessary)**
  | text | *String* | Actual text to display
  | x | *Number* | Position x relative to its parent **(default: 1)**
  | xalign | *String* | X alignment relative to parent, can be 'left', 'right' or 'center' **(default: 'left')**
  | y | *Number* | Position y relative to its parent **(default: 1)**
  | yalign | *String* | Y alignment relative to parent, can be 'top', 'bottom' or 'center' **(default: 'top')**
  | bold | *Boolean* | Bold text effect **(default: false)**
  | italic | *Boolean* | Italic text effect **(default: false)**
  | underline | *Boolean* | Underline text effect **(default: false)**
  
- **PROGRESS**: converted to horizontal progress bar, if *width* is adjusted to 1 can simulate a simple vertical bar
  Property | Argument type | Description
  --- | --- | ---
  | id | *String* | Id of element
  | color | *String* | Changes text color, any CSS valid color is available, including hex color
  | disabled | *Boolean* | Disable element to be seen on screen **(default: false)**
  | fill_char | *String* | Set the char to be used on filled part **(default: '█')**
  | empty_char | *String* | Set the char to be used on unfilled part, setting as '' will not infill **(default: '-')**
  | height | *Number* | Height of the progress bar, can be a number or a percentage *(E.g: "100%")* **(default: 1)**
  | max | *Number* | Defines the limit of progress **(default: 100)**
  | style | *String* | CSS style, overwrites any other argument styling **(Not recommended, use only if really necessary)**
  | value | *Number* | Defines the progress amount **(default: 50)**
  | width | *Number* | Width of the progress bar, can be a number or a percentage *(E.g: "100%")* **(default: 10)**
  | x | *Number* | Position x relative to its parent **(default: 1)**
  | xalign | *String* | X alignment relative to parent, can be 'left', 'right' or 'center' **(default: 'left')**
  | y | *Number* | Position y relative to its parent **(default: 1)**
  | yalign | *String* | Y alignment relative to parent, can be 'top', 'bottom' or 'center' **(default: 'top')**
  | bold | *Boolean* | Bold text effect **(default: false)**
  | italic | *Boolean* | Italic text effect **(default: false)**
  | underline | *Boolean* | Underline text effect **(default: false)**

- **HR**: a simple horizontal line
  Property | Argument type | Description
  --- | --- | ---
  | id | *String* | Id of element
  | color | *String* | Changes text color, any CSS valid color is available, including hex color
  | disabled | *Boolean* | Disable element to be seen on screen **(default: false)**
  | fill_char | *String* | Set the char to be used, overwrite **type** argument **(default: '-')**
  | style | *String* | CSS style, overwrites any other argument styling **(Not recommended, use only if really necessary)**
  | width | *Number* | Width of the line, can be a number or a percentage *(E.g: "100%")* **(default: 10)**
  | x | *Number* | Position x relative to its parent **(default: 1)**
  | xalign | *String* | X alignment relative to parent, can be 'left', 'right' or 'center' **(default: 'left')**
  | y | *Number* | Position y relative to its parent **(default: 1)**
  | yalign | *String* | Y alignment relative to parent, can be 'top', 'bottom' or 'center' **(default: 'top')**
  | bold | *Boolean* | Bold text effect **(default: false)**
  | italic | *Boolean* | Italic text effect **(default: false)**
  | underline | *Boolean* | Underline text effect **(default: false)**

## On Going

- Add *Transparent=True/False* to **DIV** / **IMAGE** elements to configure infill;
- Width/height can be calculated (E.g. 100% - 30);
- Add *scroll* property to **DIV** element;
- Make **IMG** plot every color in src and consider transparent from **PNG**;

## Known Issues

- There is no easy way to set global variables independent from language;
- Mutation Callbacks not treating deletion and creation as expected;
- IMG was entirely removed in comparison with previous version.