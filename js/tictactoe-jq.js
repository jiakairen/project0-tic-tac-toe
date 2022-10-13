// Jiakai Ren - SEI57 - Project 0 Tic Tac Toe

$(document).ready(function () {
    const $smallBox = $('.small-box');              // individual boxes on board
    const $nextPlayer = $('.instruction');          // text above board
    const $main = $('.main');                       // main gaming section
    const whoStarts = {
        $naughtStarts: $('#naught-starts'),         // 'who starts first' button
        $squareStarts: $('#square-starts')          // 'who starts first' button
    };      
    const $toggleHousing = $('.toggle-housing');    // who starts first options container
    const $naughtsWon = $('#naughts-won');          // result
    const $squaresWon = $('#squares-won');          // result
    const $drawTimes = $('#draw-times');            // result
    const $aiPlay = $('#ai-play');                  // AI play button
    const $board = $('.boxes');                     // small-box container
    const $disputedResult = $('#disputed-result');  // hidden result
    let flipTimer;                                  // setTimeout for board flipping animation

    $smallBox.on('click', function (event) {
        const $this = $(this);
        if (!winnerIsPresent() && !checkDraw() && !$this.hasClass('played')) {
            //  only proceed here if the box has not been played
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

            //  check for win   ////////////////////////////
            const [foundWin, winningCombo] = checkForWin(playerPlaying);
            if (foundWin) {
                celebrateWin(winningCombo, playerPlaying);
                return;
            }

            //  display instruction //////////////////////////
            const nextPlayer = whoIsPlaying();
            $nextPlayer.html(`<div id='next-move'>Next move:</div> <div class='${ nextPlayer } animate' id='next-move-symbol'></div>`);

            // run AI if AI is on ///////////////////////
            if (nextPlayer === 'square' && $main.hasClass('ai-click')) {
                runAI();
                if (!winnerIsPresent()) {
                    $nextPlayer.html(`<div id='next-move'>Next move:</div> <div class='naught animate' id='next-move-symbol'></div>`);
                }
            }
        } else {
            //  proceed here if clicked on an already played box
            $this.children().removeClass('animate');
            setTimeout(function () {
                $this.children().addClass('animate');
            }, 50);
        }

        if (checkDraw()) {
            //  only proceed here if no winner has been found and all boxes have been played
            $smallBox.children().addClass('fade');
            $nextPlayer.html(`Draw!`).addClass('draw-animation');
            updateResults();
        }
    });

    $('#new-game-button').on('click', newGameButtonPressed);
    $('#clear-results-button').on('click', clearResultsButtonPressed);

    $('.toggle').on('click', function (event) {
        if (changeFirstPlayer(event)) {
            //  change 'who starts first' permitted by changeFirstPlayer(), proceed to switch player

            const playerPlaying = whoIsPlaying();
            const playerNotPlaying = whoIsNotPlaying();
            whoStarts[`$${ playerPlaying }Starts`].removeClass('fade');
            whoStarts[`$${ playerNotPlaying }Starts`].addClass('fade');
        } else {
            //  change 'who starts first' NOT permitted by changeFirstPlayer(), shake both bottons

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
        }
        if (whoIsPlaying() === 'square') {
            //  if it's current square's turn, runAI() immediately
            runAI();
        }
    });

    whoStarts.$squareStarts.on('click', function () {
        if ($main.hasClass('ai-click')) {
            //  if AI play is already on, runAI() immediately
            runAI();
        }
    });

    $board.on('mousedown', function (event) {
        // allows user to 'flip the board' when the round has already started by holding down on the edge of the board

        flipTimer = setTimeout( function () {
            if (event.target.id === 'board-edge' && movesPlayed() > 0) {
                $board.removeClass('flip-table-animate');
                setTimeout(function () {
                    $board.addClass('flip-table-animate');
                }, 50);
                const disputedNumber = disputedResult();

                if (disputedNumber > 0 && movesPlayed() > 0 && !winnerIsPresent() && !isDraw) {
                    // flash the hidden 'Disputed' counter
                    $disputedResult.hide().html(`Disputed: <p id="disputed-times">${ disputedNumber }</p>`).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                }
                newGame(toggleChoiceIsNaught());    // restarts the round when board is flipped
                clearBoard();
                checkIfAIShouldRun();
            }
        }, 1000);   // millisecond the user must hold down on mouse
    }).on('mouseup mouseleave', function () {
        //  if the user does not hold for 1 second, nothing happens
        clearTimeout(flipTimer);
    });

    function celebrateWin (winningCombo, playerPlaying) {
        // add 'winner' class to symbols that caused the win and then animate
        for (let i = 0; i < winningCombo.length; i++) {
            $(`#b${ winningCombo[i] }`).addClass('winner');
        }
        const $winningBoxes = $('.winner');
        $smallBox.not('.winner').children().addClass('fade');
        $winningBoxes.children().removeClass('animate animate-win');
        setTimeout(function () {
            $winningBoxes.children().addClass('animate-win');
        }, 50);

        // update 'instruction' section to show who wins
        $nextPlayer.addClass('animate-win').html(`<div class='${ playerPlaying }' id='next-move-symbol'></div>wins!`);
        updateResults();
    };

    function newGameButtonPressed () {
        newGame(toggleChoiceIsNaught());    // pass in current 'who starts first' selection
        clearBoard();
        checkIfAIShouldRun();
    };

    function clearResultsButtonPressed () {
        newGameButtonPressed();
        clearResults();
        updateResults();
        deleteDisputedLine();
    };

    function updateResults () {
        const [naughtWon, squareWon, drawNumber] = getResults();
        $naughtsWon.html(naughtWon);
        $squaresWon.html(squareWon);
        $drawTimes.html(drawNumber);
    };

    function clearBoard () {
        // removes symbols from all played boxes and all added classes
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

    function checkIfAIShouldRun () {
        if ($main.hasClass('ai-click') && whoIsPlaying() === 'square') {
            runAI();
        }
    };

    function runAI () {
        // asks AI algorithm to pick a box to play then update it on board

        const boxPickedByAI = bestMove();   // this is linked to minimax
        $(`#${ boxPickedByAI }`).addClass('played').append($('<div></div>').hide().addClass('square').fadeIn(200));
        const [foundWin, winningCombo] = checkForWin('square');
        if (foundWin) {
            celebrateWin(winningCombo, 'square');
        }
    };
});