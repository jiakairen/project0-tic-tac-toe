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
                return;
            }

            //  display instruction
            const nextPlayer = checkNextPlayer();
            $nextPlayer.html(`<div id='next-move'>Next move:</div> <div class='${ nextPlayer } animate' id='next-move-symbol'></div>`);

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
    });

    $('#clear-results-button').on('click', function () {
        clearResults();
        updateResults();
        newGame(toggleChoiceIsNaught());
        clearBoard();
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

    $('#ai-play').on('click', function () {
        $main.toggleClass('ai-click');
        if ($main.hasClass('ai-click')) {
            $(this).html(`<div>ON</div>`).addClass('pulse');
            turnOnAI();
        } else {
            $(this).html(`<div class="fade">OFF</div>`).removeClass('pulse');
            turnOffAI();
        }
    });

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

});