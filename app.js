// SELECTORS and VARIABLES
//---------------------------------------------------------------
const computerBtn = document.querySelector('.computer');
const playerBtn = document.querySelector('.player');
const xBtn = document.querySelector('.x');
const oBtn = document.querySelector('.o');
const playBtn = document.querySelector('.play-btn');
const optionsArea = document.querySelector('.options');
const gameArea = document.querySelector('.game-area');
const displayPlayer = document.querySelector('.display-player');
const turnDisplay = document.querySelector('.display-turn');
let tiles = document.querySelectorAll('.tile');
const gameOverArea = document.querySelector('.result-page');
const gameOverText = document.querySelector('#win-text');
const restartGame = document.querySelector('.restart');
let player = {};
let opponent;
let currentPlayer = player.user;
let player2Name;
let player1Name;


const boardState = [null, null, null, null, null, null, null, null,null];

const clickSound = new Audio("./sound/click-sound.wav");
const gameOverSound = new Audio("./sound/result-sound.wav");
const playSound = new Audio('./sound/cuteClick.wav');


// EVENT HANDLERS
//---------------------------------------------------------------
computerBtn.addEventListener('click', chooseOpponent);
playerBtn.addEventListener('click', chooseOpponent);
xBtn.addEventListener('click', chooseSymbol);
oBtn.addEventListener('click', chooseSymbol);
playBtn.addEventListener('click', startGame);
tiles.forEach((tile) => tile.addEventListener('click', playTile));
restartGame.addEventListener('click', startNewGame);

// FUNCTIONS
//---------------------------------------------------------------

//Create a function solely to chose who the user picks as their opponent
function chooseOpponent(e) {
    if (e.target.className === 'computer') {
        opponent = 'computer';
            switchActive(playerBtn, computerBtn);
        console.log(`User pick ${player.user}, Computer is ${opponent}`) // undefined if they pick the player first 
    }else if (e.target.className === 'player') {
       opponent = 'friend';
        insertP2Name();
            switchActive(computerBtn, playerBtn);
       console.log(`User pick ${player.user}, Friend is ${opponent}`) // undefined if they pick the player first 
     }
     
     clickSound.play();
}
// When the users friend clicks on the player opponent they must input a name
function insertP2Name() {
    let player2 = prompt('Please enter Player 2\'s name', 'Type name here');
    if(player2 === null || player2 === ""){
    } else {
        player2Name = `${player2}`;
    } 
}

// When the user choses their symbol, they must input their name. 
function insertP1Name() {
    let player1 = prompt('Please enter Player 1\'s name', 'Type name here');
    if(player1 === null || player1 === ""){
    } else {
        player1Name = `${player1}`;
    } 
}


// This function is the logic behind which symbol is selected for the User and the Computer/Friend
function chooseSymbol(e) {
    if(e.target.className === 'x') {
        player.user = 'x';
        insertP1Name();
        player.computer = 'o';
        player.friend = 'o';
            switchActive(oBtn, xBtn)
        console.log(`User: ${player.user} , Computer: ${player.computer}, Friend: ${player.friend}`)
    } else if (e.target.className === 'o') {
        player.user = 'o';
        insertP1Name();
        player.computer = 'x';
        player.friend = 'x';
       
            switchActive(xBtn, oBtn)
        console.log(`User: ${player.user} , Computer ${player.computer}, Friend: ${player.friend}`)
    }
    
    clickSound.play();
}


// Function logic for when the user hits the play button
function startGame() {
    // Check if users does not pick an opponent
    if (!player.user) {
        xBtn.setAttribute('id','error');
        oBtn.setAttribute('id','error');
        return;
    }
    // Check if user does not pick an opponent
    if(!opponent) {
        computerBtn.setAttribute('id','error');
        playerBtn.setAttribute('id','error');
        return;
    }
    // Display user's turn symbol, before starting the game with clicking tiles
    if (turnDisplay.innerHTML === '') {
        turnDisplay.innerHTML = `${player1Name}'s [ <i class="fa-solid fa-${player.user}"></i> ] Turn`
    }
    
    // hide the Options Area
    optionsArea.classList.add('hide');
    // show Game Area
    gameArea.classList.remove('hide');
    // plays a shiny sound when you hit the play button
    playSound.play();
}


// This function switches the active over state of which one the user chooses
function switchActive(off, on){
    off.removeAttribute('id','active');
    on.setAttribute('id', 'active');
}

// Function for the Game Board area 
function playTile(e){
    
    const tile = e.target;
    const tileNumber = tile.dataset.index;
    // Check if the winning text is not showing
    if (gameOverArea.classList.contains('show')) {
        return;
    }
    
    if( opponent === 'friend') {
    // give turn to other player.
    currentPlayer = currentPlayer === player.user ? player.friend : player.user;
    // store players move onto the board
    boardState[tileNumber-1] = currentPlayer;
    //Apply FontAwesome Icons into the tiles instead of the text letter and show the icons in turnDisplay
        // If Player1 picks 'X' first
        
            if(currentPlayer === player.user) {
                tile.innerHTML = `<i class="fa-solid fa-${player.user}"></i>`  
                turnDisplay.innerHTML = `${player2Name}'s [ <i class="fa-solid fa-${player.friend}"></i> ] Turn`
            } else if (currentPlayer === player.friend) {
                tile.innerHTML = `<i class="fa-solid fa-${player.friend}"></i>`
                turnDisplay.innerHTML = `${player1Name}'s [ <i class="fa-solid fa-${player.user}"></i> ] Turn`
            }   
    }

    // ---- BOT PORTION
    if ( opponent === 'computer') {
        currentPlayer = currentPlayer === player.user ? player.computer : player.user;
        boardState[tileNumber-1] = currentPlayer;
        let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed();
        setTimeout(() => {
            bot();
        }, randomTimeDelay);
    }

    //Stops the Players from being able to reClick the tiles
    tile.style.pointerEvents = 'none';
    clickSound.play();
    checkWinner();
}


// Function that creates the Bots Clicks 
function bot() {
    let botTileNumber = Math.floor(Math.random() * 9)-1 ; //Bots randomNumber tile index. 1-9 just like tileNumberIndex // -1
        currentPlayer = currentPlayer === player.user ? player.computer: player.user;
        // Check if the bots move index tile is valid or not
        while (boardState[botTileNumber] !== null) {
             botTileNumber = Math.floor(Math.random() * 9)-1;
        }
        // stores bots move index 
        boardState[botTileNumber] = currentPlayer;
        //Apply FontAwesome Icons into the tiles instead of the text letter and show the icons in turnDisplay
        if(currentPlayer === 'x') {
            tiles[botTileNumber].innerHTML = `<i class="fa-solid fa-x"></i>`  
            turnDisplay.innerHTML = `<i class="fa-solid fa-${player.computer}"></i>`
        } else {
            tiles[botTileNumber].innerHTML = `<i class="fa-solid fa-o"></i>`
            turnDisplay.innerHTML = `${player1Name} <i class="fa-solid fa-${player.user}"></i>`
        }
        // if(currentPlayer === player.user) {
        //     tiles[botTileNumber].innerHTML = `<i class="fa-solid fa-${player.user}"></i>`  
        //     turnDisplay.innerHTML = `Computer's [ <i class="fa-solid fa-${player.computer}"></i> ] Turn`
        // } else if (currentPlayer === player.computer) {
        //     tiles[botTileNumber].innerHTML = `<i class="fa-solid fa-${player.computer}"></i>`
        //     // turnDisplay.innerHTML = `${player1Name} [ <i class="fa-solid fa-${player.user}"></i> ] Turn`
        // }

    console.log(`Bots:${botTileNumber}`) 
}


function checkWinner() {
    // Check for A Winner
    for(winCombo of winningCombination) {
        const {combo} = winCombo;
        const tileValue1 = boardState[combo[0] - 1];
        const tileValue2 = boardState[combo[1] - 1];
        const tileValue3 = boardState[combo[2] - 1];

        if(tileValue1 !== null && tileValue1 === tileValue2 && tileValue1 === tileValue3) {
            console.log('YOU WIN');
                gameOverDisplay(tileValue1);
                return;
        }
    }
 
    // Check for a Draw/TIE
    const noWinner = boardState.every((tile) => tile !== null);
        if (noWinner) {
            gameOverDisplay(null);
            turnDisplay.innerHTML =`IT'S A TIE`;
        }
}

function gameOverDisplay(winnerText) {
    let text = 'TIE';

    if (winnerText !== null) {
        text = `<i class="fa-solid fa-${currentPlayer}"></i> WON!`;
        turnDisplay.innerHTML =`<i class="fa-solid fa-${currentPlayer}"></i> WON!`;
    }

    gameOverArea.classList.remove('hide');
    gameOverArea.classList.add('show');
    gameOverText.innerHTML = text;
    gameOverSound.play();
}


function startNewGame() {
    playSound.play();
    boardState.fill(null);
    turnDisplay.innerHTML = '';
    // making the names and player/opponents sign values blank
    player1Name = '';
    player2Name = '';
    player.user = '';
    player.friend = '';
    player.computer = '';
    opponent = '';
    // This removes the hover state from the x/o buttons and computer/player buttons
    xBtn.removeAttribute('id','active');
    oBtn.removeAttribute('id','active');
    computerBtn.removeAttribute('id','active');
    playerBtn.removeAttribute('id','active');
    // remove the icons within the boardArea
       tiles.forEach((tile) => {
        let child = tile.lastElementChild;
            while (child) {
                tile.removeChild(child);
                child = tile.lastElementChild;
            }
        tile.style.pointerEvents = 'auto';
    });
    // hides the gameOver Overlay
    gameOverArea.classList.add('hide');
    gameOverArea.classList.remove('show');
    // hide the gameboard Area
    gameArea.classList.add('hide');
    gameArea.classList.remove('show');
    // show Options Area
    optionsArea.classList.add('show');
    optionsArea.classList.remove('hide');
}


// Too big to put on top, so I keep it on the bottom
const winningCombination = [
    //Rows
    {combo: [1, 2, 3]},
    {combo: [4, 5, 6]},
    {combo: [7, 8, 9]},
    //Columns
    {combo: [1, 4, 7]},
    {combo: [2, 5, 8]},
    {combo: [3, 6, 9]},
    //Diagonal
    {combo: [1, 5, 9]},
    {combo: [3, 5, 7]}
];