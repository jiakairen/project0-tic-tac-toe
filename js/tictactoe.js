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
    drawNumber: 0
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

function flipPlayer () {
    naughtPlaying = !naughtPlaying;
};

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

function winnerIsPresent () {
    return winner !== undefined;
};

function checkDraw () {
    if ((math.sum(playerPos.naught) + math.sum(playerPos.square)) === 9 && (winner === undefined) && !isDraw) {
        playerPos.drawNumber += 1;
        isDraw = true;
        return true;
    } else {
        return false;
    }
};

function checkNextPlayer () {
    if (naughtPlaying) {
        return 'naught';
    } else {
        return 'square';
    }
};

function getResults () {
    return [playerPos.naughtWon, playerPos.squareWon, playerPos.drawNumber];
};

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
};

function changeFirstPlayer (event) {
    const toggleID = event.target.id.split('-')[0];
    if ((math.sum(playerPos.naught) + math.sum(playerPos.square)) === 0) {
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

function turnOnAI () {
    console.log('AI on');
};

function turnOffAI () {
    console.log('AI off');
};