/*----- constants -----*/
const moleCellsArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const MAX_TIME = 30;
const sounds = {
    molePopupSound: "./sfx/01-popup.mp3",
    malletWhackSound: "./sfx/02-mallet-whack.mp3",
    missWhackSound: './sfx/03-dull-whack.mp3',
    startBellSound: './sfx/05-start-bell.mp3'
};

/*----- app's state (variables) -----*/
let countdown, score, missed, timerStarted, molesStarted, disappearSpeed, popupSpeed, bellOn, highScore;
//highScore is not in init function because it does NOT get reset. will need to cache it to local storage later.
highScore = 0;

/*----- cached element references -----*/
const $startButton = $('footer section button')
const $board = $('#game-container');
const $timerDisplay = $('#timer-display');
const $scoreDisplay = $('#score-display');
const $missedDisplay = $('#missed-display');
const $body = $('body');
const player = new Audio();
const molePopupPlayer = new Audio();
const $highScoreDisplay = $('#high-score-display');

/*----- event listeners -----*/
$startButton.on('touchstart', renderStartButtonTap);
$startButton.on('click', startGame);
$board.on('click', whackMole)
$body.on('click', clickOffBoard);


/*----- functions -----*/
function init() {
    countdown = MAX_TIME;
    score = 0;
    missed = 0;
    bellOn = true;
    timerStarted = false;
    molesStarted = false;
    disappearSpeed = 1000;
    popupSpeed = 1500;
    render();
}

function startGame() {
    $startButton.removeAttr('id');
    if (bellOn === true){
        bellOn = false;
    }
    if (!timerStarted) {
        startTimer();
    } else {
        playMissWhackSound();
    }
    if (!molesStarted) startMoles();
    if (countdown < 0) {
        init();
        startTimer();
        startMoles();
    }
}

function startTimer() {
    playStartBellSound();
    timerStarted = true;
    let clockTimer = setInterval(function () {
        if (countdown >= -1) {
            renderClock();
            countdown--;
        }
        if (countdown < 20 && countdown >= 10) {
            disappearSpeed = 825;
            popupSpeed = 1000;
        } else if (countdown < 10 && countdown >= 0) {
            disappearSpeed = 650;
            popupSpeed = 850;
        }
        if (countdown < 0) {
            clearInterval(clockTimer);
            bellOn = true;
            $startButton.attr('id', 'start-button-click');
            render();
        }
    }, 1000);
}

function startMoles() {
    molesStarted = true;
    let moleCounter = setInterval(function () {
        let randNum = Math.floor((Math.random() * 12));
        moleCellsArray[randNum] = 1;
        setTimeout(function () {
            if (moleCellsArray[randNum] === 1) {
                moleCellsArray[randNum] = 0;
                missed++;
                render();
            }
        }, disappearSpeed);
        playMolePopupSound();
        render();
        if (countdown <= 0) {
            clearInterval(moleCounter);
        }
    }, popupSpeed);
}

function whackMole(evt) {
    if (moleCellsArray[evt.target.value] === 0) {
        playMissWhackSound();
    } 
    if (moleCellsArray[evt.target.value] === 1) {
        moleCellsArray[evt.target.value] = 0;
        score++;
        updateHighScore();
        playMalletWhackSound();
        $(`button[value="${evt.target.value}"]`).css({
            border: `6px solid white`
        });
        setTimeout(function () {
            $(`button[value="${evt.target.value}"]`).css({
                border: `2px solid white`
            });
        }, 150);
    }
    render();
}

function updateHighScore(){
    if (score > highScore){
        highScore++;
        render();
    }
}

/*----- Render functions -----*/

function render() {
    moleCellsArray.forEach(function (cell, idx) {
        if (cell === 1) {
            $(`button[value="${idx}"]`).css({
                background: 'url(images/mole2.png)',
                'background-position': 'center',
                'background-size': '90%',
                'background-repeat': 'no-repeat',
            });
        } else {
            $(`button[value="${idx}"]`).css({
                background: 'black',
            });
        }
    });
    $scoreDisplay.text(score);
    $missedDisplay.text(missed);

    if (countdown < 0) {
        setTimeout(function(){
            $startButton.text('TRY AGAIN');
        }, 1000);
    }

    $highScoreDisplay.text(highScore);

}

function renderClock() {
    $timerDisplay.text(countdown.toString());
}

function renderStartButtonTap() {
    if ($startButton[0].hasAttribute('id')){
        $startButton.css({
            color: 'black',
            'background-color': 'white'
        });
        setInterval(function(){
            $startButton.css({
                color: 'white',
                'background-color': 'black'
            });
        }, 150);
    }   
}


/*----- Sound functions -----*/

function playMolePopupSound() {
    molePopupPlayer.src = sounds.molePopupSound;
    molePopupPlayer.volume = 0.9;
    molePopupPlayer.play();
}

function playMalletWhackSound() {
    player.src = sounds.malletWhackSound;
    player.volume = 0.5;
    player.play();
}

function playMissWhackSound() {
    player.src = sounds.missWhackSound;
    player.volume = 1;
    player.play();
}

function playStartBellSound(){
    player.src = sounds.startBellSound;
    player.volume = 1;
    player.play();
}

function clickOffBoard(evt) {
    if (evt.target.className !== 'click-button start-button' && evt.target.className !== 'click-button'){
        playMissWhackSound();
    } 
}





/*----- Initialize Game -----*/
init();