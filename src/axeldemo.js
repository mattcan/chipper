const screen = require('axel');

screen.clear();

screen.bg(255, 0, 0);
screen.box(2, 2, 8, 4);

screen.cursor.restore();
console.log(screen.rows, screen.cols);

/**
 * So biggest problem is that this uses the entirety of
 * the console. We don't know what size the console is and
 * if it is too large its possible that everything sits
 * to the left.
 */
