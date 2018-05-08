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
        return player;
    }

    move(start, end) {
        let startPiece = this.getPieceOnSquare(start);
        if (!startPiece || startPiece === null) {
            throw "No piece on square " + start;
        }
        this.setPieceOnSquare(start, '');
        this.setPieceOnSquare(end, startPiece);
    }

    debug() {
        console.log(this.squares);
    }
}

var Game = (() => {
    let board = new Board();
    let history = [];
    let activePlayer = 'w';
    let testingMoveMode = false;
    let testingMove = null;
    let lastMove = null;


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
        let piecePlayer = piece.substring(0, 1);
        return (activePlayer == piecePlayer);
    }

    /** TO DO: implement a real test for check.
      */
    function isInCheck(player) {
        // let inCheck = (player == 'b');
        let inCheck = false;
        console.log('Is player ' + player + ' in check? ' + inCheck);
        return inCheck;
    }

    function endsInOwnCheck(start, end) {
        setTestingMoveMode(true);
        doMove(start, end);
        isOwnCheck = false;
        if (isInCheck(activePlayer)) {
            isOwnCheck = true;
        }
        undoLastMove();
        setTestingMoveMode(false);
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

    function isLegalKnightMove(start, end, player) {
        let startRank = parseInt(start.substring(1, 2));
        let endRank = parseInt(end.substring(1, 2));
        let startCoords = board.getCoordinatesForSquare(start);
        let endCoords = board.getCoordinatesForSquare(end);
        let startFile = startCoords[1];
        let endFile = endCoords[1];

        // Must be the specific Knight move
        let rankDiff = Math.abs(startRank - endRank);
        let fileDiff = Math.abs(startFile - endFile);
        console.log('rank diff: ' + rankDiff + ', file diff: ' + fileDiff);
        if (!((rankDiff == 2) && (fileDiff == 1)) || ((rankDiff == 1) && (fileDiff == 2))) {
            return false;
        }

        let endPlayer = board.getPlayerForSquare(end);
        if (player == endPlayer) {
            console.log('cannot capture your own piece');
            return false;
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
            case 'wn':
            case 'bn':
                isLegal = isLegalKnightMove(start, end, player);
                break;
        }

        console.log('Is legal move? ' + isLegal);
        return isLegal;
    }

    function doMove(start, end) {
        let startPiece = board.getPieceOnSquare(start);
        let endPiece = board.getPieceOnSquare(end);
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
        board.move(start, end);
        if (testingMoveMode) {
            testingMove = currentMove;
        } else {
            console.log("MOVED: " + start + " -> " + end);
            lastMove = currentMove;
            history.push([start, end]);
            switchActivePlayer();
            debug();
        }
    }

    function undoLastMove() {
        let lastMove = (testingMoveMode ? testingMove : lastMove);
        let start = lastMove.start;
        let end = lastMove.end;
        board.setPieceOnSquare(start.square, start.piece);
        board.setPieceOnSquare(end.square, end.piece);
        if (testingMoveMode) {
            testingMove = null;
        } else {
            lastMove = null;
            switchActivePlayer();
        }
    }

    function switchActivePlayer() {
        activePlayer = (activePlayer == 'w' ? 'b' : 'w');
    }


    function setTestingMoveMode(testing) {
        testingMoveMode = !!testing;
        console.log('===================== TEST '
            + (!!testing ? 'START' : 'END')
            + ' =====================');
    }


    function debug() {
        board.debug();
        console.log('History: ');
        console.log(history);
        console.log('Next to move: ' + activePlayer);
        console.log('---------------------------------------------');
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
            doMove(start, end);
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

exports.Game = Game;
