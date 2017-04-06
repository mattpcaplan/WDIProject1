const colors = ["g", "r", "m", "b"],
      delayInMilliseconds = 600;

//app variables
//highScore set to zero only on page load
let level, score, highScore = 0, simonSays, playerSays,
    simonTurn;


$(document).ready(function(){
	$("button.start").click(initGame);
});

//EXPERIMENTAL - ideally make the reset button have same conditions as reload BUT keep highscore.

$(document).ready(function(){
	$("button.reset").click(resetGame);
});

function resetGame(){
  level = 1;
  score = 0;
  displayHighScore();
  console.log("you can hear me?");
  removeListeners();
}
function removeListeners() {
  for (let i=1; i<=colors.length; i++){
    	//each button uses the same event handler
        $("#button" + i).off('click',handleClick);
  }
}


//END EXPERIMENT

function initGame(){
	//game starts
  	level = 1;
  	score = 0;
  	//starting conditions
  	setClickListeners();
  	displayScore();
  	displayHighScore();
  	playGame();
}

function playGame(){
  	//simon's turn
  	simonTurn = true;
  	//show current level
  	displayLevel();
	//create a string of length {{level}} to represent
  	//random simon says sequence
  	simonSays = getSimonSays();
  	//play simonSays sequence for the player
  	playSimonSays(simonSays.slice(0)); //copy of string
}

function setClickListeners(){
	for (let i=1; i<=colors.length; i++){
    	//each button uses the same event handler
        $("#button" + i).click(handleClick);
        console.log("I'm in loop?")
    }
}

function handleClick(e){
    //we only care about player clicks during player's turn
	if (!simonTurn){
      	playerClick(e);
    }
}

function getSimonSays(){
	//generate random sequence
  	let sequence = "";
  	for (let i=0; i<level; i++){
      	//random index between zero and three, inclusive
    	sequence += colors[Math.floor(Math.random()*colors.length)];
    }
  	return sequence;
}

function playSimonSays(simonSequence){
    //play the sequence for the player to memorize
    console.log("playing simon says");
    let i = 0,
        len = simonSequence.length,
    //loop through simon sequence with delay
        interval = setInterval(function(){
            if (i >= len){
                //finished with simon sequence
                clearTimeout(interval);
                playerTurn();
            } else {
                //continue simon sequence
                let color = simonSequence[i],
                    index = colors.indexOf(color) + 1;
                //no longer triggering actual click event
                simonClick("#button" + index);
                i++;
            }
        }, delayInMilliseconds);
}

function playerTurn(){
    //reset app state variables
  	simonTurn = false;
  	playerSays = "";
}

function simonClick(elementId){
	//will be called when Simon is running its sequence
    //this will simulate a click event without actually creating one
  	//remove background color (not using jQuery, but could)
    let button = document.querySelector(elementId);
    button.style.backgroundColor = "transparent";
  	setTimeout(function(){
      	//reset color
    	button.removeAttribute("style");
    }, delayInMilliseconds*2/3); //delay is slightly shorter than sequence delay
}

function playerClick(e){ //"e" is the event object itself
    //will be called every time player clicks a color button
  	//get the id of the button just clicked
  	let id = e.target.id,
    //extract the last character; this is an index number
        index = id.slice(-1),
    //get color letter associated with that index
    //convert from one to four...to zero to three (minus one)
        color = colors[index-1];
  	//add color letter to playerSays string
  	playerSays += color;
  	//win or lose conditions:
  	//make a copy of simonSays that is same length as playerSays
  	let testSequence = simonSays.slice(0, playerSays.length);
  	//lose condition
  	if (testSequence !== playerSays){
        lose();
        removeListeners();
        alert("YOU LOSE");
        return;
    }
  	//correct player click!
  	score++;
    //high score?
    if (score > highScore){
      	highScore = score;
      	displayHighScore();
    }
  	displayScore();
  	//win condition
  	if (playerSays.length === simonSays.length){
        win(); //yay!
        return;
    }
  	//not win, not lose, keep playing...
    return;
}

function win(){
  	//short delay, then start over with higher level and score
  	level++;
  	//setTimeout(playGame, delayInMilliseconds);
    setTimeout(playGame, delayInMilliseconds);
}


/////HERE IS WHERE WE NEED TO REMOVE EVENT LISTENER


function lose(){
  	//short delay then reset game
  	setTimeout(initGame, delayInMilliseconds);
    $()
    }

function displayLevel(){
	$(".level h2").text("Level: " + level);
}

function displayScore(){
	$("#score").text("Score: " + score);
}

function displayHighScore(){
	$("#highScore").text("High Score: " + highScore);
}
