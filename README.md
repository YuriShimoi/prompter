# Prompter
Converts HTML to fully char prompt-like interface

### Currently
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

### Future
- More elements
- Parent relative positioning
- Bold, Italic and Underline as option to do inside the texts