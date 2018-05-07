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

    getPlayerForSquare(square) {
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

    function isRealSquare(square) {
        let file = square.substring(0, 1);
        let rank = parseInt(square.substring(1, 2));

        if (rank < 1 || rank > 8) {
            return false;
        }

        switch (file) {
            case 'a':
            case 'b':
            case 'c':
            case 'd':
            case 'e':
            case 'f':
            case 'g':
            case 'h':
                return true;
            default:
                return false;
        }
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
        console.log('Checking for check...');
        board.setTestingMoveMode(true);
        board.move(start, end);
        board.debug();
        isOwnCheck = false;
        if (isInCheck(activePlayer)) {
            isOwnCheck = true;
        }
        console.log('Undoing last move');
        board.undoLastMove();
        board.setTestingMoveMode(false);
        console.log('Would put you in check? ' + isOwnCheck);
        return isOwnCheck;
    }

    function isLegalPawnMove(start, end, player) {
        let startFile = start.substring(0, 1);
        let startRank = parseInt(start.substring(1, 2));
        let endFile = end.substring(0, 1);
        let endRank = parseInt(end.substring(1, 2));

        let isWhite = (player == 'w');
        let hasMovedYet = (isWhite ? startRank != 2 : startRank != 7);

        let forwards = (isWhite ? endRank > startRank : endRank < startRank);
        if (!forwards) {
            console.log('must move forwards');
            return false;
        }

        if (startFile == endFile) {
            // Can't move more than one square if it's moved before
            if (hasMovedYet && (Math.abs(endRank - startRank) > 1)) {
                console.log('cannot move more than 1 square');
                return false;
            }
            // Can't move more than 2 squares
            if (Math.abs(endRank - startRank) > 2) {
                console.log('cannot move more than 2 squares');
                return false;
            }
            // Can't capture
            if (!isEmptySquare(end)) {
                console.log('cannot capture');
                return false;
            }
            // Can't jump over another piece
            if (Math.abs(endRank - startRank) == 2) {
                let intermediateRank = (isWhite ? startRank + 1 : startRank - 1);
                let intermediateSquare = startFile + intermediateRank;
                if (!isEmptySquare(intermediateSquare)) {
                    console.log('cannot jump over the piece at ' + intermediateSquare);
                    return false;
                }
            }
        } else {
            if (Math.abs(endRank - startRank) > 1) {
                console.log('cannot move more than 1 square');
                return false;
            }
            let endPlayer = board.getPlayerForSquare(end);
            if (endPlayer == '') {
                console.log('must capture on a diagonal move');
                return false;
            }
            if ((isWhite && endPlayer == 'w') || (!isWhite && endPlayer == 'b')) {
                console.log('cannot capture your own piece');
                return false;
            }
        }
        return true;
    }

    /**
      * This gets called after determining that
      * it's your turn, and the piece belongs to you.
      */
    function isLegalMove(start, end) {
        let startPiece = board.getPieceOnSquare(start);
        let endPiece = board.getPieceOnSquare(end);
        let player = startPiece.substring(0, 1);
        let isLegal = false;
        switch (startPiece) {
            case 'wp':
            case 'bp':
                isLegal = isLegalPawnMove(start, end, player);
                break;
        }

        console.log('Is legal move? ' + isLegal);
        return isLegal;
    }

    function debug() {
        board.debug();
        console.log('History: ');
        console.log(history);
        console.log('Next to move: ' + activePlayer);
    }

    return class {
        move(start, end) {
            if (!start || !end) {
                throw "Invalid square";
            }
            start = start.toLowerCase();
            end = end.toLowerCase();
            if (!isRealSquare(start) || !isRealSquare(end)) {
                throw "Not a real square";
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
            if (!isLegalMove(start, end)) {
                throw "That move is not legal";
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
// g.move('e7', 'd6');