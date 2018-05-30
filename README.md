# chess-js
This is an Object-oriented JavaScript chess-game engine.

It has a simple interface which allows you to make moves in a chess game.
The engine will check whether your move is legal, and will allow the move if it is.

No plans currently to implement an AI opponent - to use it, you will need to play against yourself or a friend :)

## To Do
* Add a Board object to the Game instance via Dependency Injection.
    This will allow facilitation of unit testing.
* Unit testing (eg. with [TAPE](https://github.com/substack/tape)) to ensure that the chess rules are thoroughly tested.
* Add rules for more pieces.
* Add rules for [*en passant*](https://en.wikipedia.org/wiki/En_passant), castling, stalemate, etc.
* Package as a module for easy inclusion in other code

* Other cool features