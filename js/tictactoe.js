$(document).ready(function () {
    const $smallBox = $('.small-box');              // individual boxes on board
    const $nextPlayer = $('.instruction');          // text above board
    const $main = $('.main');                       // main gaming section
    const $naughtStarts = $('#naught-starts');      // who starts first toggle
    const $squareStarts = $('#square-starts');      // who starts first toggle
    const $toggleHousing = $('.toggle-housing');    // who starts first toggle container
    const $naughtsWon = $('#naughts-won');          // result
    const $squaresWon = $('#squares-won');          // result
    const $drawTimes = $('#draw-times');            // result
    const playerOne = 'naught';
    const playerTwo = 'square';
    let playerOnePlaying = true;                    // true when naught is next
    let nextPlayer;                                 // for updating instruction only
    let winner;
    let reason;                                     // winning reason (grid)
    let isDraw;
    const playerPositions = {
        naught: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
        square: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
        naughtWon: 0,
        squareWon: 0,
        drawNumber: 0
    };
    
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
            $nextPlayer.html(`<div id='next-move'>Next move:</div> <div class='${ nextPlayer } animate' id='next-move-symbol'></div>`);

        } else {
            $this.children().removeClass('animate');
            setTimeout(function () {
                $this.children().addClass('animate');
            }, 50);
        }

        if ($smallBox.not('.played').length === 0 && winner === undefined && !isDraw) { // draw
            $smallBox.children().addClass('fade');
            $nextPlayer.html(`Draw!`).addClass('draw-animation');
            playerPositions.drawNumber += 1;
            isDraw = true;
            updateResults();
        }
    });

    $('#new-game-button').on('click', function (event) { newGame(); });

    $('#clear-results-button').on('click', function () {
        playerPositions.naughtWon = 0;
        playerPositions.squareWon = 0;
        playerPositions.drawNumber = 0;
        updateResults();
        newGame();
    });

    $('.toggle').on('click', function (event) {
        const toggleID = event.target.id.split('-')[0];
        if ($smallBox.not('.played').length === 9) {
            if (toggleID === 'naught') {
                playerOnePlaying = true;
                $naughtStarts.removeClass('fade');
                $squareStarts.addClass('fade');
            } else {
                playerOnePlaying = false;
                $naughtStarts.addClass('fade');
                $squareStarts.removeClass('fade');
            }
        } else {
            $toggleHousing.removeClass('animate');
            setTimeout(function () {
                $toggleHousing.addClass('animate');
            }, 50);
        }
    });

    $('#ai-play').on('click', function () {
        $main.toggleClass('ai-click');
        if ($main.hasClass('ai-click')) {
            $(this).html(`<div>ON</div>`).addClass('pulse');
        } else {
            $(this).html(`<div class="fade">OFF</div>`).removeClass('pulse');
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

        const $winningBoxes = $('.winner');
        $smallBox.not('.winner').children().addClass('fade');
        $nextPlayer.addClass('animate-win').html(`<div class='${ player }' id='next-move-symbol'></div>wins!`);

        $winningBoxes.children().removeClass('animate-win');
        setTimeout(function () {
            $winningBoxes.children().addClass('animate-win');
        }, 50);

        playerPositions[`${ player }Won`] += 1;
    };

    function newGame (event) {
        const $symbols = $smallBox.children();
        playerPositions['naught'] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        playerPositions['square'] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        isDraw = false;
        nextPlayer;
        winner = undefined;
        reason = undefined;
        $symbols.fadeOut(400, function () {$symbols.remove();});
        $smallBox.removeClass('winner grey played');
        $nextPlayer.removeClass('animate-win draw-animation');
        $nextPlayer.html('Click on board to begin.');
        playerOnePlaying = $naughtStarts.not('.fade').length === 1;
    };

    function updateResults () {
        $naughtsWon.html(`${ playerPositions.naughtWon }`);
        $squaresWon.html(`${ playerPositions.squareWon }`);
        $drawTimes.html(`${ playerPositions.drawNumber }`);
    };
});