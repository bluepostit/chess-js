class Board {
    constructor() {
        this.activePlayer = 'w';
        this.squares = [
            ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
            ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
            [''  , ''  , ''  , ''  , ''  , ''  , ''  , ''  ],
            [''  , ''  , ''  , ''  , ''  , ''  , ''  , ''  ],
            [''  , ''  , ''  , ''  , ''  , ''  , ''  , ''  ],
            [''  , ''  , ''  , ''  , ''  , ''  , ''  , ''  ],
            ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
            ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
        ];
    }
    getCoordinatesForSquare(square) {
        let file = square.substring(0, 1);
        let rank = square.substring(1, 2);

        let y = 8 - parseInt(rank);
        let x = -1;
        switch (file) {
            case 'a':
                x = 0;
                break;
            case 'b':
                x = 1;
                break;
            case 'c':
                x = 2;
                break;
            case 'd':
                x = 3;
                break;
            case 'e':
                x = 4;
                break;
            case 'f':
                x = 5;
                break;
            case 'g':
                x = 6;
                break;
            case 'h':
                x = 7;
                break;
        }
        console.log(this.squares[y][x]);
        return [y, x];
    }

    getPieceOnSquare(square) {
        let coords = this.getCoordinatesForSquare(square);
        let piece = null;
        if (!!coords) {
            let x = coords[1];
            let y = coords[0];
            piece = this.squares[y][x];
        }
        return piece;
    }

    getActivePlayer() {
        return this.activePlayer;
    }

    getPlayerForPiece(square) {
        let piece = this.getPieceOnSquare(square);
        let player = '';
        if (!!piece && piece.length >= 2) {
            player = piece.substring(0, 1);
        }
        //console.log('player for ' + square + ' is: ' + player);
        return player;
    }
}

var Game = (() => {
    let b = new Board();

    function isEmptySquare(square) {
        return (b.getPlayerForPiece(square) == '');
    }

    function doesPieceBelongToCurrentPlayer(square) {
        // Is it your piece?
        let activePlayer = b.getActivePlayer();
        let piecePlayer = b.getPlayerForPiece(square);
        return (activePlayer == piecePlayer);
    }

    return class {
        constructor() {
            this.board = b;
        }

        move(start, finish) {
            if (!this.canMove(start, finish)) {
                throw 'Invalid move';
            }
        }

        canMove(start, end) {
            if (isEmptySquare(start)) {
                throw "Square " + start + " is empty";
            }
            if (!doesPieceBelongToCurrentPlayer(start)) {
                throw "Square " + start + " is not your piece";
            }


            return true;
        }
    };
})();

g = new Game();