// Jiakai Ren - SEI57 - Project 0 Tic Tac Toe

let naughtPlaying = true;                       // true when naught is to make next move
let aiPlay = false;
let nextPlayer;                                 // for updating instruction only
let winner;                                     // only defined when winner is found
let isDraw;                                     // only defined when a draw happens
const playerPos = {
    naught: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    square: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    naughtWon: 0,
    squareWon: 0,
    drawNumber: 0,
    disputed: 0,
};

function whoIsPlaying () {
    if (naughtPlaying) {
        return 'naught';
    }
    return 'square';
};

function whoIsNotPlaying () {
    if (naughtPlaying) {
        return 'square';
    }
    return 'naught';
};

function flipPlayer () { naughtPlaying = !naughtPlaying; };

function sendLocation (player, boxID) {
    //  returns true if the box the 'player' chose is empty, returns false otherwise

    const shortID = Number(boxID[1]);
    if (playerPos[player][shortID] === 0) {
        playerPos[player][shortID] = 1;
        flipPlayer();
        return true;
    } else {
        return false;
    }
};

function checkForWin (player) {
    //  returns true if the board position of 'player' matches one of the winningCombos

    const winningCombos = ['012', '345', '678', '036', '147', '258', '048', '246'];
    for (let i = 0; i < winningCombos.length; i++) {
        const comboToCheck = winningCombos[i].split('');
        let foundMatch = 0;
        for (let j = 0; j < comboToCheck.length; j++) {
            if (playerPos[player][Number(comboToCheck[j])] === 1) {
                foundMatch++;
            }
        }
        if (foundMatch === 3) {
            winner = player;
            playerPos[`${ player }Won`]++;
            return [true, comboToCheck];
        }
    }
    return [false, undefined];
};

function winnerIsPresent () { return winner !== undefined; };

function checkDraw () {
    // returns true if a draw happens, false otherwise

    if (movesPlayed() === 9 && (winner === undefined) && !isDraw) {
        playerPos.drawNumber++;
        isDraw = true;
        return true;
    }
    return false;
};

function getResults () { return [playerPos.naughtWon, playerPos.squareWon, playerPos.drawNumber]; };

function newGame (toggleChoiceIsNaught) {
    // resets all global variables except results

    playerPos.naught = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    playerPos.square = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    winner = undefined;
    isDraw = false;
    naughtPlaying = toggleChoiceIsNaught;
};

function clearResults () {
    // resets results in playerPos but not other global variables

    playerPos.naughtWon = 0;
    playerPos.squareWon = 0;
    playerPos.drawNumber = 0;
    playerPos.disputed = 0;
};

function changeFirstPlayer (event) {
    //  checks if 'who starts first' can be changed, and changes it and returns true if possible

    const toggleID = event.target.id.split('-')[0];
    if (movesPlayed() === 0) {
        //  only allow change when the round has not been started

        if (toggleID === 'naught') {
            naughtPlaying = true;
        } else {
            naughtPlaying = false;
        }
        return true;
    }
    return false;
};

function movesPlayed () { return (math.sum(playerPos.naught) + math.sum(playerPos.square)) };

function disputedResult () {
    if (winner === undefined && movesPlayed() > 0) {
        playerPos.disputed += 1;
    }
    return playerPos.disputed;
};

function findEmptyBoxes () {
    // returns an [array] containing indices of empty boxes and
    // and [array] of occupied and unoccupied boxes represented by 1 and 0 respectively.

    const occupiedBoxes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const emptyBoxes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const emptyIndices = [];
    for (let i = 0; i < playerPos.naught.length; i++) {
        occupiedBoxes[i] = (playerPos.naught[i] || playerPos.square[i]) === 1;
    }
    for (let i = 0; i < playerPos.naught.length; i++) {
        emptyBoxes[i] = !occupiedBoxes[i];
        if (emptyBoxes[i]) {
            emptyIndices.push(i);
        }
    }
    return [emptyIndices, occupiedBoxes];
};

function bestMove () {
    let emptyBoxes = findEmptyBoxes()[0];
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < emptyBoxes.length; i++) {
        playerPos.square[emptyBoxes[i]] = 1;
        const board = findEmptyBoxes()[1];
        let score = minimax(board, 0, false);
        playerPos.square[emptyBoxes[i]] = 0;
        if (score > bestScore) {
            bestScore = score;
            move = emptyBoxes[i];
        }
    }
    playerPos.square[move] = 1;
    flipPlayer();
    winner = undefined;
    isDraw = false;
    return 'b' + move;
};

function minimax (board, depth, isMaximasing) {
    if (checkForWin('square')[0]) {
        winner = undefined;
        playerPos.squareWon--;
        return 10 - depth;
    } else if (checkForWin('naught')[0]) {
        winner = undefined;
        playerPos.naughtWon--;
        return depth - 10;
    } else if (checkDraw()) {
        playerPos.drawNumber--;
        isDraw = false;
        return 0;
    }

    if (isMaximasing) {
        //  when AI - square is playing
        
        let emptyBoxes = findEmptyBoxes()[0];
        let bestScore = -Infinity;
        for (let i = 0; i < emptyBoxes.length; i++) {
            playerPos.square[emptyBoxes[i]] = 1;
            const board = findEmptyBoxes()[1];
            let score = minimax(board, depth + 1, false);
            playerPos.square[emptyBoxes[i]] = 0;
            bestScore = Math.max(score, bestScore);
        }
        return bestScore;
    } else {
        let emptyBoxes = findEmptyBoxes()[0];
        let bestScore = Infinity;
        for (let i = 0; i < emptyBoxes.length; i++) {
            playerPos.naught[emptyBoxes[i]] = 1;
            const board = findEmptyBoxes()[1];
            let score = minimax(board, depth + 1, true);
            playerPos.naught[emptyBoxes[i]] = 0;
            bestScore = Math.min(score, bestScore);
        }
        return bestScore;
    }
};