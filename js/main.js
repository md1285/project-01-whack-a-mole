/*----- constants -----*/
const moleCellsArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const MAX_TIME = 30;

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
    timerStarted = false;
    molesStarted = false;
    disappearSpeed = 1000;
    popupSpeed = 1500;
    render();
}

function startGame() {
    if (!timerStarted) startTimer();
    if (!molesStarted) startMoles();
    if (countdown < 0){
        init();
        startTimer();
        startMoles();
    }
}

function startTimer() {
    timerStarted = true;
    let clockTimer = setInterval(function () {
        if (countdown >= -1) {
            //this is the one place I'm modifying the dom outside of render. workaround?
            $timerDisplay.text(countdown.toString());
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
        render();
        if (countdown <= 0) {
            clearInterval(moleCounter);
        }
    }, popupSpeed);
}


function whackMole(evt) {
    if (moleCellsArray[evt.target.value] === 1) {
        moleCellsArray[evt.target.value] = 0;
        score++;
        $(`button[value="${evt.target.value}"]`).css({
            border: `6px solid white`
        });
        setTimeout(function(){
            $(`button[value="${evt.target.value}"]`).css({
                border: `2px solid white`
            });
        }, 150);
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
                'outline': 'none',
            });
        }
    });

    $scoreDisplay.text(score);
    $missedDisplay.text(missed);
}



/*----- Initialize Game -----*/

init();