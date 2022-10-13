# Tic Tac Toe - Project 0
 This is a Tic Tac Toe game that allows two users to play on the same device which runs on a web browser. This is project 0 for the General Assembly Software Engineering Immersive course (SEI57). Consolidating learnings on JavaScript, HTML and CSS.

You can play the game by clicking [here](https://jiakairen.github.io/project0-tic-tac-toe/).


## Project Snapshot
![Home Page](/img/homepage.jpg)

---

## Features
* The 'How to play' section on the homepage explains the user interface buttons.
* The AI play can be switched on at any time during the game play, which uses the minimax search algorithm.
* The interface displays if any winner is found, or if it is a draw at the end of each round. It also hightlights the pieces which caused the win.
* The interface should prevent user from performing forbidden actions during game play. For example, trying to change 'who starts first' when the game has already started, or trying to overwrite an existing piece on board.
* The user can hold down on the edge of the game board when the game has started (with at least 1 piece already placed on board) to cause the board to be flipped and invokes a hidden stats counter.

---

## Known Issues
* The AI causes a short period of lag picking the first move when it's moving first. It may appear to be frozen and causing the user to click on new game again and in turn causing more lag.
* The AI may place its first symbol before symbols from the last round clear when restarting a round. Resulting in two symbols are squeezed into one box short a short period of time.
* The page does not rescale properly when window width is decreased.

---

## Future Plan
I would like to make the UI responsive when used on smaller screens.

---

## Resources Used
* math.js
* animate.css

---

## Special Thanks
I would like to thank Loden ([Github Link](https://github.com/Tenzang)) and Joel ([Github Link](https://github.com/wofockham)), our TA and instructor for SEI57 at General Assembly Sydney, Australia, for their guidance throughout the project.

Also thanks to this video on [Recursion](https://www.youtube.com/watch?v=VrrnjYgDBEk&t=634s) by CS50 for explaining how recursive functions work, and this video [Coding Challenge 154: Tic Tac Toe AI with Minimax Algorithm](https://www.youtube.com/watch?v=trKjYdBASyQ) by The Coding Train on explaining the minimax algorithm.