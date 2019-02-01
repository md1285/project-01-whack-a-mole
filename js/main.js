
    


/*----- constants -----*/ 
const moleCellsArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

/*----- app's state (variables) -----*/ 
let countdown;
let score;
let missed;
let gameStart;


/*----- cached element references -----*/ 
const $startButton = $('#start-button')
const $board = $('table');



/*----- event listeners -----*/ 
$startButton.on('click', startGame);
$board.on('click', whackMole)


/*----- functions -----*/
function init () {
    countdown = 30;
    score = 0;
    missed = 0;
    timerStarted = false;
    molesStarted = false;
    render();
}

function startGame() {
    startTimer();
    startMoles();
}

function startTimer(){

    if (timerStarted === false) {
        timerStarted = true;
        setInterval(function(){
            if (countdown >= 0){
                let timerDisp = countdown.toString()
                $('#timer-display').text(timerDisp);
                countdown--;
            }
        }, 1000);  
    }


}

function startMoles(){

    if (molesStarted === false){
        molesStarted = true;
        setInterval(function(){
            if (countdown >= 0){
            let randNum = parseInt(Math.random() * 11.9999999);

            if (moleCellsArray[randNum] === 0){
                moleCellsArray[randNum] = 1;
                setTimeout(function (){
                    if (moleCellsArray[randNum] === 1){
                        moleCellsArray[randNum] = 0;
                        missed++;
                        render();
                    }
                }, 1000);
            }

            render();
            }

        }, 1500);
    } 

}


function whackMole(evt) {
    if (moleCellsArray[evt.target.value] === 1){
        moleCellsArray[evt.target.value] = 0;
        score++;
        render();
    }
}

function render(){
    moleCellsArray.forEach(function(cell, idx){
        if (cell === 1){
            $(`button[value="${idx}"]`).css({backgroundColor: 'brown'});
        } else {
            $(`button[value="${idx}"]`).css({backgroundColor: '#DDDDDD'});
        }
    });
    $('#score-display').text(score);
    $('#missed-display').text(missed);
}



/*----- Initialize Game -----*/

init();