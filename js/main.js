/*----- constants -----*/
const moleCellsArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const MAX_TIME = 30;
const ONE_SECOND = 1000;

/*----- app's state (variables) -----*/
let countdown, score, missed, timerStarted, molesStarted, disappearSpeed, popupSpeed;


/*----- cached element references -----*/
const $startButton = $('#start-button')
const $board = $('table');
const $timerDisplay = $('#timer-display');
const $scoreDisplay = $('#score-display');
const $missedDisplay = $('#missed-display');



/*----- event listeners -----*/
$startButton.on('click', startGame);
$board.on('click', whackMole)


/*----- functions -----*/
function init() {
    countdown = MAX_TIME;
    score = 0;
    missed = 0;
    disappearSpeed = 1000;
    popupSpeed = 1500;
    timerStarted = false;
    molesStarted = false;
    render();
}

function startGame() {
    if (!timerStarted) {
        startTimer();
    }
    if (!molesStarted) {
        startMoles();
    }
}

function startTimer() {
    timerStarted = true;
    setInterval(function () {
        if (countdown >= 0) {
            $timerDisplay.text(countdown.toString());
            countdown--;
        }

        if (countdown < 20 && countdown >= 10) {
            disappearSpeed = 750;
            popupSpeed = 1000;
        } else if (countdown < 10 && countdown >= 0){
            disappearSpeed = 500;
            popupSpeed = 501;
        }
    }, 1000);
}

function startMoles() {
    molesStarted = true;
    setInterval(function () {
        if (countdown >= 0) {
            let randNum = Math.floor((Math.random() * 12));
            moleCellsArray[randNum] = 1;
            setTimeout(function () {
                if (moleCellsArray[randNum] === 1) {
                    moleCellsArray[randNum] = 0;
                    missed++;
                    render();
                }
            }, disappearSpeed);
            render();
        }
    }, popupSpeed);  
}


function whackMole(evt) {
    if (moleCellsArray[evt.target.value] === 1) {
        moleCellsArray[evt.target.value] = 0;
        score++;
    }
    render();
}

function render() {
    moleCellsArray.forEach(function (cell, idx) {
        if (cell === 1) {
            $(`button[value="${idx}"]`).css({
                background: 'url(images/mole2.png)',
                'background-position': 'center',
                'background-size': '90%',
                'background-repeat': 'no-repeat',
                'outline': 'none'
            });
        } else {
            $(`button[value="${idx}"]`).css({
                background: 'black',
                'outline': 'none'
            });
        }
    });
    $scoreDisplay.text(score);
    $missedDisplay.text(missed);
}



/*----- Initialize Game -----*/

init();