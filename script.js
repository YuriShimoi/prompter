const player = Prompter('player');

const move = {
  'up': () => {
    player.move(0, -1);
  },
  'left': () => {
    player.move(-2, 0);
  },
  'down': () => {
    player.move(0, 1);
  },
  'right': () => {
    player.move(2, 0);
  },
};