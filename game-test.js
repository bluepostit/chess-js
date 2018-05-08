const Chess = require('./game.js');

var g = new Chess.Game();
let moves = [
    ['e2', 'e4'],
    ['d7', 'd5'],
    ['e4', 'd5'],
    ['b8', 'c6'],
    ['d5', 'c6'],
    ['b7', 'c6'],
];
for (var i = 0; i < moves.length; i++) {
    let start = moves[i][0];
    let end = moves[i][1];
    g.move(start, end);
}