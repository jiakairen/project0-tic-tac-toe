let naughtPlaying = true;                       // true when naught is next
let aiPlay = false;
let nextPlayer;                                 // for updating instruction only
let winner;
let isDraw;
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
    } else {
        return 'square';
    }
};

function whoIsNotPlaying () {
    if (naughtPlaying) {
        return 'square';
    } else {
        return 'naught';
    }
};

function flipPlayer () { naughtPlaying = !naughtPlaying; };

function sendLocation (player, boxID) {
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
    const winningCombos = ['012', '345', '678', '036', '147', '258', '048', '246'];
    for (let i = 0; i < winningCombos.length; i++) {
        const comboToCheck = winningCombos[i].split('');
        let foundMatch = 0;
        for (let j = 0; j < comboToCheck.length; j++) {
            if (playerPos[player][comboToCheck[j]] === 1) {
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
    if (movesPlayed() === 9 && (winner === undefined) && !isDraw) {
        playerPos.drawNumber++;
        isDraw = true;
        return true;
    }
    return false;
};

function checkNextPlayer () {
    if (naughtPlaying) {
        return 'naught';
    } 
    return 'square';
};

function getResults () { return [playerPos.naughtWon, playerPos.squareWon, playerPos.drawNumber]; };

function newGame (toggleChoiceIsNaught) {
    playerPos.naught = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    playerPos.square = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    winner = undefined;
    isDraw = false;
    naughtPlaying = toggleChoiceIsNaught;
};

function clearResults () {
    playerPos.naughtWon = 0;
    playerPos.squareWon = 0;
    playerPos.drawNumber = 0;
    playerPos.disputed = 0;
};

function changeFirstPlayer (event) {
    const toggleID = event.target.id.split('-')[0];
    if (movesPlayed() === 0) {
        if (toggleID === 'naught') {
            naughtPlaying = true;
        } else {
            naughtPlaying = false;
        }
        return true;
    } else {
        return false;
    }
};

function movesPlayed () { return (math.sum(playerPos.naught) + math.sum(playerPos.square)) };

function disputedResult () {
    if (winner === undefined && movesPlayed() > 0) {
        playerPos.disputed += 1;
    }
    return playerPos.disputed;
};

function findEmptyBoxes () {
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
    return emptyIndices;
};

function minimax (newBoard, player) {
    const emptyBoxes = findEmptyBoxes(newBoard);
    if (checkForWin(player)[0] && player === 'naught'){
        return -10;
    } else if (checkForWin(player)[0] && player === 'square') {
        return +10;
    } else if (!checkForWin(player)[0] && checkDraw()) {
        return 0;
    }

    const moves = [];

    for (let i = 0; i < emptyBoxes.length; i++) {
        const thisMove = {};

        // thisMove.index = playerPos[player][emptyBoxes[i]];
        thisMove.index = newBoard[emptyBoxes[i]];
        playerPos[player][emptyBoxes[i]] = 1;

        console.log(`testing ${thisMove}`)

        if (player === 'square') {
            let result = minimax(playerPos.naught, 'naught');
            console.log(`if ${result}`);
            thisMove.score = result.score;
        } else {
            let result = minimax(playerPos.square, 'square');
            console.log(`else ${result}`);
            // thisMove.score = result.score;
            thisMove.score = 0;
        }

        playerPos[player][emptyBoxes[i]] = 0;
        // flipPlayer ();
        moves.push(thisMove);
    }

    let bestMove;
    if (player === 'square') {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
};

// function reverseLocation (player, boxID) {
//     const shortID = Number(boxID[1]);
//     if (playerPos[player][shortID] === 1) {
//         playerPos[player][shortID] = 0;
//         console.log(`reversed ${ boxID }`);
//     }
// };

function dumbAI () {
    const emptyBoxes = findEmptyBoxes ();
    const randomIndex = Math.floor(Math.random()*(emptyBoxes.length));
    const boxToPick = emptyBoxes[randomIndex];
    const boxID = 'b' + boxToPick;
    sendLocation('square', boxID);
    return boxID;
};

function turnOffAI () { console.log('AI off'); };