/*----- constants -----*/
const moleCellsArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const MAX_TIME = 30;
const sounds = {
    molePopupSound: './sfx/01-popup.mp3',
    malletWhackSound: './sfx/02-mallet-whack.mp3',
    missWhackSound: './sfx/03-dull-whack.mp3',
    startBellSound: './sfx/05-start-bell.mp3'
};
const randNums = [null, null, null];

/*----- app's state (variables) -----*/
let countdown, score, missed, timerStarted, molesStarted, disappearSpeed, popupSpeed, highScore, gameStarted;


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
$startButton.on('click', clickStartButton);
$startButton.on('touchstart', renderStartButtonTap);
$board.on('click', whackMole)
$body.on('click', clickOffBoard);


/*----- functions -----*/
function gameState() {
    if (!localStorage.moleHighScore){
        localStorage.moleHighScore = 0;
    }

    highScore = localStorage.moleHighScore;
    gameStarted = false;
    newGame()
}

function newGame() {
    score = 0;
    missed = 0;
    lvl = 1;
    playLvl();
}

function playLvl() {
    countdown = MAX_TIME;
    timerStarted = false;
    molesStarted = false;
    disappearSpeed = 1500;
    popupSpeed = 2000;
    render();
}

function clickStartButton() {
    if (!gameStarted) {
        playStartBellSound();
    } else {
        playMissWhackSound();
    }
    startGame();
}

function startGame() {
    $startButton.removeAttr('id');
    renderButtonText();
    if (!timerStarted) {
        startTimer();
    }
    if (!molesStarted) startMoles();
    if (countdown < 0 && lvl < 4) {
        playLvl();
        startTimer();
        startMoles();
    } else if (countdown < 0 && lvl >= 4) {
        newGame();
        startTimer();
        startMoles();
    }
}


function startTimer() {
    timerStarted = true;
    gameStarted = true;
    let clockTimer = setInterval(function () {
        if (countdown >= -1) {
            renderClock();
            countdown--;
        }
        if ((countdown === Math.floor(MAX_TIME*.667)) || (countdown === Math.floor(MAX_TIME*.334))) {
            disappearSpeed *= 0.8;
            popupSpeed *= 0.8;
        }
        if (countdown < 0) {
            clearInterval(clockTimer);
            $startButton.attr('id', 'start-button-click');
            lvl++;
            gameStarted = false;
            render();
        }
    }, 1000);
}

function startMoles() {
    molesStarted = true;
    if (lvl === 1) {
        startMolesLvl1();
    } else if (lvl === 2) {
        startMolesLvl2();
    } else if (lvl === 3) {
        startMolesLvl3();
    }
}

function startMolesLvl1(){
    let moleCounter = setInterval(function () {
        generateRandNums();
        moleCellsArray[randNums[0]] = 1;
        // console.log(moleCellsArray);
        playMolePopupSound();
        render();
        setTimeout(function () {
            moleCellsArray.forEach(function(moleCell, idx){
                if (moleCell === 1) {
                    moleCellsArray[idx] = 0;
                    missed++;
                }
            });
            render();
        }, disappearSpeed);
        if (countdown <= 0) {
            clearInterval(moleCounter);
        }
    }, popupSpeed);
}
function startMolesLvl2(){
    let moleCounter = setInterval(function () {
        generateRandNums();
        moleCellsArray[randNums[0]] = moleCellsArray[randNums[1]] = 1;
        // console.log(moleCellsArray);
        playMolePopupSound();
        render();
        setTimeout(function () {
            moleCellsArray.forEach(function(moleCell, idx){
                if (moleCell === 1) {
                    moleCellsArray[idx] = 0;
                    missed++;
                }
            });
            render();
        }, disappearSpeed);
        if (countdown <= 0) {
            clearInterval(moleCounter);
        }
    }, popupSpeed);
}
function startMolesLvl3(){
    let moleCounter = setInterval(function () {
        generateRandNums();
        moleCellsArray[randNums[0]] = moleCellsArray[randNums[1]] = moleCellsArray[randNums[2]] = 1;
        // console.log(moleCellsArray);
        playMolePopupSound();
        render();
        setTimeout(function () {
            moleCellsArray.forEach(function(moleCell, idx){
                if (moleCell === 1) {
                    moleCellsArray[idx] = 0;
                    missed++;
                }
            });
            render();
        }, disappearSpeed);
        if (countdown <= 0) {
            clearInterval(moleCounter);
        }
    }, popupSpeed);
}

function generateRandNums() {
    do {
        randNums[0] = Math.floor((Math.random() * 12));
        randNums[1] = Math.floor((Math.random() * 12));
        randNums[2] = Math.floor((Math.random() * 12));
    } while ((randNums[0] === randNums[1]) || (randNums[0] === randNums[2]) || (randNums[1] === randNums[2]))
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
        localStorage.moleHighScore = highScore;
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

    if (countdown < 0 && lvl === 2) {
        setTimeout(function(){
            $startButton.text('LVL 2');
        }, 1000);
    } else if (countdown < 0 && lvl === 3){
        setTimeout(function(){
            $startButton.text('LVL 3');
        }, 1000);
    } else if (countdown < 0 && lvl >= 4) {
        setTimeout(function(){
            $startButton.text('PLAY AGAIN');
        }, 1000);
    }
    $highScoreDisplay.text(highScore);
}

function renderClock() {
    $timerDisplay.text(countdown.toString());
}

function renderButtonText() {
    $startButton.text(`GET 'EM!`);
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

function playStartBellSound() {
    player.src = sounds.startBellSound;
    player.volume = 1;
    player.play().catch(err => console.log(err));
}

function clickOffBoard(evt) {
    if (evt.target.className !== 'click-button start-button' && evt.target.className !== 'click-button'){
        playMissWhackSound();  
    } 
}

/*----- Set Game State -----*/
gameState();