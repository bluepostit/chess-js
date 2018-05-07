class Board {
    constructor() {
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

    setPieceOnSquare(square, piece) {
        let coords = this.getCoordinatesForSquare(square);
        if (!!coords) {
            let x = coords[1];
            let y = coords[0];
            this.squares[y][x] = piece;
        }
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

    move(start, end) {
        let piece = this.getPieceOnSquare(start);
        if (!piece || piece === null) {
            throw "No piece on square " + start;
        }
        this.setPieceOnSquare(start, '');
        this.setPieceOnSquare(end, piece);
    }

    debug() {
        console.log(this.squares);
    }
}

var Game = (() => {
    let b = new Board();
    let activePlayer = 'w';

    function isEmptySquare(square) {
        return (b.getPlayerForPiece(square) == '');
    }

    function doesPieceBelongToCurrentPlayer(piece) {
        // Is it your piece?
        let piecePlayer = piece.substring(0, 1);
        return (activePlayer == piecePlayer);
    }

    function debug() {
        b.debug();
        console.log('Next move: ' + activePlayer);
    }

    return class {
        constructor() {
            this.board = b;
        }

        move(start, end) {
            if (!start || !end) {
                throw "Invalid square";
            }
            if (!this.canMove(start, end)) {
                throw 'Invalid move';
            }
            this.board.move(start, end);
            activePlayer = (activePlayer == 'w' ? 'b' : 'w');
            debug();
        }

        canMove(start, end) {
            if (isEmptySquare(start)) {
                throw "Square " + start + " is empty";
            }
            let piece = this.board.getPieceOnSquare(start);
            if (!doesPieceBelongToCurrentPlayer(piece)) {
                throw "Piece at square " + start + " (" + piece + ") is not yours";
            }


            return true;
        }
    };
})();

g = new Game();