$(document).ready(function () {
    const $smallBox = $('.small-box');              // individual boxes on board
    const $nextPlayer = $('.instruction');          // text above board
    const $main = $('.main');                       // main gaming section
    const whoStarts = {
        $naughtStarts: $('#naught-starts'),         // who starts first toggle
        $squareStarts: $('#square-starts')          // who starts first toggle
    };      
    const $toggleHousing = $('.toggle-housing');    // who starts first toggle container
    const $naughtsWon = $('#naughts-won');          // result
    const $squaresWon = $('#squares-won');          // result
    const $drawTimes = $('#draw-times');            // result
    const $aiPlay = $('#ai-play');
    const $board = $('.boxes');                     // small-box container
    const $disputedResult = $('#disputed-result');
    let flipTimer;

    $smallBox.on('click', function (event) {
        const $this = $(this);
        if (!winnerIsPresent() && !checkDraw() && !$this.hasClass('played')) {
            $this.addClass('played');
            const playerPlaying = whoIsPlaying();

            //  sets symbol in box  ////////////////////////
            const boxIsEmpty = sendLocation(playerPlaying, event.target.id);
            if (boxIsEmpty) {
                $('<div></div>').hide().addClass(playerPlaying).appendTo($this).fadeIn(200);
            } else {
                $this.children().removeClass('animate');
                setTimeout(function () {
                    $this.children().addClass('animate');
                }, 50);
            }

            //  check for win ////////////////////
            const [foundWin, winningCombo] = checkForWin(playerPlaying);
            if (foundWin) {
                celebrateWin(winningCombo, playerPlaying);
                return;
            }

            //  display instruction
            const nextPlayer = checkNextPlayer();
            $nextPlayer.html(`<div id='next-move'>Next move:</div> <div class='${ nextPlayer } animate' id='next-move-symbol'></div>`);

            // dumb AI
            if (nextPlayer === 'square' && $main.hasClass('ai-click')) {
                runDumbAI();
                if (!winnerIsPresent()) {
                    const nextPlayer = 'naught';
                    $nextPlayer.html(`<div id='next-move'>Next move:</div> <div class='naught animate' id='next-move-symbol'></div>`);
                }
            }

        } else {                        //  clicking on already played boxes
            $this.children().removeClass('animate');
            setTimeout(function () {
                $this.children().addClass('animate');
            }, 50);
        }

        if (checkDraw()) {
            $smallBox.children().addClass('fade');
            $nextPlayer.html(`Draw!`).addClass('draw-animation');
            updateResults();
        }
    });

    $('#new-game-button').on('click', function () {
        newGame(toggleChoiceIsNaught());
        clearBoard();
        if ($main.hasClass('ai-click') && whoIsPlaying() === 'square') {
            runDumbAI();
        }
    });

    $('#clear-results-button').on('click', function () {
        clearResults();
        updateResults();
        newGame(toggleChoiceIsNaught());
        clearBoard();
        deleteDisputedLine();
        if ($main.hasClass('ai-click') && whoIsPlaying() === 'square') {
            runDumbAI();
        }
    });

    $('.toggle').on('click', function (event) {
        if (changeFirstPlayer(event)) {
            const playerPlaying = whoIsPlaying();
            const playerNotPlaying = whoIsNotPlaying();
            whoStarts[`$${ playerPlaying }Starts`].removeClass('fade');
            whoStarts[`$${ playerNotPlaying }Starts`].addClass('fade');
        } else {
            $toggleHousing.removeClass('animate');
            setTimeout(function () {
                $toggleHousing.addClass('animate');
            }, 50);
        }
    });

    $aiPlay.on('click', function () {
        $main.toggleClass('ai-click');
        if ($main.hasClass('ai-click')) {
            $(this).html(`<div>ON</div>`);
        } else {
            $(this).html(`<div class="fade">OFF</div>`);
            turnOffAI();
        }
        if (whoIsPlaying() === 'square') {
            runDumbAI();
        }
    });

    whoStarts.$squareStarts.on('click', function () {
        if ($main.hasClass('ai-click')) {
            runDumbAI();
        }
    });

    $board.on('mousedown', function (event) {
        flipTimer = setTimeout( function () {
            if (event.target.id === 'board-edge' && movesPlayed() > 0) {
                $board.removeClass('flip-table-animate');
                setTimeout(function () {
                    $board.addClass('flip-table-animate');
                }, 50);
                const disputedNumber = disputedResult();
                if (disputedNumber > 0 && movesPlayed() > 0 && !winnerIsPresent()) {
                    $disputedResult.hide().html(`Disputed: <p id="disputed-times">${ disputedNumber }</p>`).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                }
                newGame(toggleChoiceIsNaught());
                clearBoard();
            }
        }, 1000);
    }).on('mouseup mouseleave', function () {
        clearTimeout(flipTimer);
    });

    function celebrateWin (winningCombo, playerPlaying) {
        for (let i = 0; i < winningCombo.length; i++) {
            $(`#b${ winningCombo[i] }`).addClass('winner');
        }
        const $winningBoxes = $('.winner');
        $smallBox.not('.winner').children().addClass('fade');
        $winningBoxes.children().removeClass('animate animate-win');
        setTimeout(function () {
            $winningBoxes.children().addClass('animate-win');
        }, 50);
        $nextPlayer.addClass('animate-win').html(`<div class='${ playerPlaying }' id='next-move-symbol'></div>wins!`);
        updateResults();
    };

    function updateResults () {
        const [naughtWon, squareWon, drawNumber] = getResults();
        $naughtsWon.html(naughtWon);
        $squaresWon.html(squareWon);
        $drawTimes.html(drawNumber);
    };

    function clearBoard () {
        const $symbols = $smallBox.children();
        $symbols.fadeOut(400, function () {$symbols.remove();});
        $smallBox.removeClass('winner grey played');
        $nextPlayer.removeClass('animate-win draw-animation');
        $nextPlayer.html('Click on board to begin.');
    };

    function toggleChoiceIsNaught () {
        return whoStarts.$naughtStarts.not('.fade').length === 1;
    };

    function deleteDisputedLine () {
        $disputedResult.fadeOut(400, function () {$disputedResult.hide();});
    }

    function runDumbAI () {
        const dumbAIChose = dumbAI();
        $('<div></div>').hide().addClass('square').appendTo($(`#${dumbAIChose}`)).fadeIn(200);
        const [foundWin, winningCombo] = checkForWin('square');
        if (foundWin) {
            celebrateWin(winningCombo, 'square');
        }
    };
});