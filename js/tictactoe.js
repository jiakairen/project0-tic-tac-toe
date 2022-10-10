$(document).ready(function () {
    $smallBox = $('.small-box');
    $nextPlayer = $('.instruction');
    const playerOne = 'naught';
    const playerTwo = 'square';
    let playerOnePlaying = true;
    let nextPlayer;

    const playerPositions = {
        naught: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
        square: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
        naughtWon: 0,
        squareWon: 0,
        drawNumber: 0
    };

    let winner;
    let reason;
    let isDraw;
    
    $smallBox.on('click', function (event) {
        $this = $(this);

        if (!$this.hasClass('played') && winner === undefined) {
            if (playerOnePlaying) {
                $this.addClass('played');
                winnerReason = checkWin('naught', event.target.id);
                $('<div></div>').hide().addClass('naught').appendTo($this).fadeIn(200);
                nextPlayer = playerTwo;

            } else {
                $this.addClass('played');
                winnerReason = checkWin('square', event.target.id);
                $('<div></div>').hide().addClass('square').appendTo($this).fadeIn(200);
                nextPlayer = playerOne;

            }

            winner = winnerReason[0];
            reason = winnerReason[1];
            if (winner !== undefined) {
                congratulate(winner, reason);
                updateResults();
                return;
            }

            playerOnePlaying = !playerOnePlaying;
            $nextPlayer.html(`<div id='next-move'>Next move:</div> <div class='${ nextPlayer }' id='next-move-symbol'></div>`);
        } else {
            $this.children().effect('shake', {distance: 10, times: 4});
        }

        if ($smallBox.not('.played').length === 0 && winner === undefined && !isDraw) {
            $('.small-box').children().addClass('fade');
            $nextPlayer.html(`Draw!`);
            playerPositions.drawNumber += 1;
            isDraw = true;
            updateResults();
        }
    });

    function checkWin (player, id) {
        
        const cS = produceCombo(player, id);    // currentState
        const row1 = math.sum(cS[0]);
        const row2 = math.sum(cS[1]);
        const row3 = math.sum(cS[2]);
        const col1 = math.sum([cS[0][0], cS[1][0], cS[2][0]]);
        const col2 = math.sum([cS[0][1], cS[1][1], cS[2][1]]);
        const col3 = math.sum([cS[0][2], cS[1][2], cS[2][2]]);
        const dia1 = math.sum([cS[0][0], cS[1][1], cS[2][2]]);
        const dia2 = math.sum([cS[2][0], cS[1][1], cS[0][2]]);
        
        const sumOfThree = [row1, row2, row3, col1, col2, col3, dia1, dia2];
        const winReason = ['012', '345', '678', '036', '147', '258', '048', '642'];
        for (let i = 0; i < sumOfThree.length; i++) {
            if (sumOfThree[i] === 3) {
                return [player, winReason[i]];
            }
        }
        return [undefined, 0]
    };

    function produceCombo (player, id) {
        const boxID = Number(id.charAt(1));
        const row = Math.floor(boxID / 3);
        const col = boxID % 3;
        playerPositions[player][row][col] = 1;
        return playerPositions[player];
    };

    function congratulate (player, reason) {
        for (let i = 0; i < reason.length; i++) {
            $(`#b${ reason[i] }`).addClass('winner');
        }
        $('.small-box').not('.winner').children().addClass('fade');
        $nextPlayer.html(`<div class='${ player }' id='next-move-symbol'></div> wins!`);
        $('.winner').children().effect("bounce", { times: 3 }, "slow");
        playerPositions[`${ player }Won`] += 1;
        // console.log(playerPositions[`${ player }Won`]);
    };

    $('#new-game-button').on('click', function (event) {
        // const $this = $(this);
        newGame();
    });

    $('#clear-results-button').on('click', function () {
        playerPositions.naughtWon = 0;
        playerPositions.squareWon = 0;
        playerPositions.drawNumber = 0;
        updateResults();
        newGame();
    });

    function newGame (event) {
        const $symbols = $('.small-box').children();
        playerPositions['naught'] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        playerPositions['square'] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        isDraw = false;
        nextPlayer;
        winner = undefined;
        reason = undefined;
        $symbols.fadeOut(400, function () {$symbols.remove();});
        $('.small-box').removeClass('winner grey played');
        $nextPlayer.html('Click on board to begin.');
        playerOnePlaying = $('#naught-starts').not('.fade').length === 1;
    };

    function updateResults () {
        $('#naughts-won').html(`${ playerPositions.naughtWon }`);
        $('#squares-won').html(`${ playerPositions.squareWon }`);
        $('#draw-times').html(`${ playerPositions.drawNumber }`);
    };

    $('.toggle').on('click', function (event) {

        const toggleID = event.target.id.split('-')[0];
        if ($smallBox.not('.played').length === 9) {
            if (toggleID === 'naught') {
                playerOnePlaying = true;
                $('#naught-starts').removeClass('fade');
                $('#square-starts').addClass('fade');
            } else {
                playerOnePlaying = false;
                $('#naught-starts').addClass('fade');
                $('#square-starts').removeClass('fade');
            }
        } else {
            $('.toggle-housing').effect('shake', {distance: 5, times: 2});
        }
    });
});