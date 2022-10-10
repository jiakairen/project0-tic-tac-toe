$(document).ready(function () {
    $smallBox = $('.small-box');
    $nextPlayer = $('.instruction span');
    const playerOne = 'red';
    const playerTwo = 'green';
    let playerOnePlaying = true;
    let nextPlayer;
    
    $smallBox.on('click', function (event) {
        $this = $(this);

        if (!$this.hasClass('played')) {


            if (playerOnePlaying) {
                $this.addClass('one played');
                nextPlayer = playerTwo;
            } else {
                $this.addClass('two played');
                nextPlayer = playerOne;
            }
            playerOnePlaying = !playerOnePlaying;
            $nextPlayer.html(`${ nextPlayer }`);
        } else {
            $this.effect('shake', {distance: 10, times: 4})
        }

        if ($smallBox.not('.played').length === 0) {
            console.log('all played')
        }
    });






});