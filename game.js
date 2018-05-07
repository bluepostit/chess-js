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
        this.testingMoveMode = false;
        this.testingMove = null;
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
        //console.log(this.squares[y][x]);
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
        let startPiece = this.getPieceOnSquare(start);
        let endPiece = this.getPieceOnSquare(end);
        if (!startPiece || startPiece === null) {
            throw "No piece on square " + start;
        }
        // Store this move for easy undo
        let currentMove = {
            start : {
                square: start,
                piece: startPiece
            },
            end : {
                square: end,
                piece: endPiece
            }
        };
        if (this.testingMoveMode) {
            this.testingMove = currentMove;
        } else {
            this.lastMove = currentMove;
        }

        this.setPieceOnSquare(start, '');
        this.setPieceOnSquare(end, startPiece);
    }

    undoLastMove() {
        let lastMove = (this.testingMoveMode ? this.testingMove : this.lastMove);
        let start = lastMove.start;
        let end = lastMove.end;
        this.setPieceOnSquare(start.square, start.piece);
        this.setPieceOnSquare(end.square, end.piece);
        if (this.testingMoveMode) {
            this.testingMove = null;
        } else {
            this.lastMove = null;
        }
    }

    setTestingMoveMode(testing) {
        this.testingMoveMode = !!testing;
        console.log('===================== TEST '
            + (!!testing ? 'START' : 'END')
            + ' =====================');
    }

    debug() {
        console.log(this.squares);
    }
}

var Game = (() => {
    let board = new Board();
    let history = [];
    let activePlayer = 'w';

    function isEmptySquare(square) {
        return (board.getPieceOnSquare(square) == '');
    }

    function doesPieceBelongToCurrentPlayer(piece) {
        // Is it your piece?
        let piecePlayer = piece.substring(0, 1);
        return (activePlayer == piecePlayer);
    }

    function isInCheck(player) {
        let inCheck = (player == 'b');
        console.log('is player ' + player + ' in check? ' + inCheck);
        return inCheck;
    }

    function endsInOwnCheck(start, end) {
        board.setTestingMoveMode(true);
        board.move(start, end);
        console.log('Checking for check...');
        board.debug();
        isOwnCheck = false;
        if (isInCheck(activePlayer)) {
            isOwnCheck = true;
        }
        console.log('Undoing last move');
        board.undoLastMove();
        board.setTestingMoveMode(false);
        debug();
        return isOwnCheck;
    }

    function debug() {
        board.debug();
        console.log('History: ');
        console.log(history);
        console.log('Next move: ' + activePlayer);
    }

    return class {
        move(start, end) {
            if (!start || !end) {
                throw "Invalid square";
            }
            if (!this.canMove(start, end)) {
                throw 'Invalid move';
            }
            board.move(start, end);
            history.push([start, end]);
            activePlayer = (activePlayer == 'w' ? 'b' : 'w');
            debug();
        }

        canMove(start, end) {
            if (isEmptySquare(start)) {
                throw "Square " + start + " is empty";
            }
            let piece = board.getPieceOnSquare(start);
            if (!doesPieceBelongToCurrentPlayer(piece)) {
                throw "Piece at square " + start + " (" + piece + ") is not yours";
            }
            if (endsInOwnCheck(start, end)) {
                throw "That leaves your king in check";
            }


            return true;
        }
    };
})();

g = new Game();
// g.move('e2', 'e4');
// g.move('e7', 'e5');