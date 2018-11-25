const Chess = require('./game.js');

function testKnights() {
    var g = new Chess.Game();
    let moves = [
        ['b1', 'c3'],
        ['d7', 'd5'],
        ['c3', 'd5'],
        ['a7', 'a5'],
        ['d5', 'f4'],
        ['a5', 'a4'],
        ['f4', 'g2'],
    ];
    for (var i = 0; i < moves.length; i++) {
        let start = moves[i][0];
        let end = moves[i][1];
        g.move(start, end);
    }
}

function testBishops() {
	console.log("Testing bishops");
}

testKnights();
testBishops();

