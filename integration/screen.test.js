const screen = require('../src/screen');

// create a screen buffer
const sb = screen.screenBuffer();
sb.initialize();

const display = screen.display();
display.initialize(sb);

sb.toggle(0, 5);
sb.toggle(5, 0);

display.render();
