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
            switchActive(computerBtn, playerBtn);
       console.log(`User pick ${player.user}, Friend is ${opponent}`) // undefined if they pick the player first 
     }
     
     clickSound.play();
}


// This function is the logic behind which symbol is selected for the User and the Computer/Friend
function chooseSymbol(e) {
    if(e.target.className === 'x') {
        player.user = 'x';
        player.computer = 'o';
        player.friend = 'o';
            switchActive(oBtn, xBtn)
        console.log(`User: ${player.user} , Computer: ${player.computer}, Friend: ${player.friend}`)
    } else if (e.target.className === 'o') {
        player.user = 'o';
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
        turnDisplay.innerHTML = `<i class="fa-solid fa-${player.user}"></i>`
    }
    
    // hide the Options Area
    optionsArea.classList.add('hide');
    // show Game Area
    gameArea.classList.remove('hide');
    
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
    const tileNumber = tile.dataset.index; // this is the implemented data-set-index that we added into the HTML 
    // console.log(botTileNumber);
    console.log(`User: ${tileNumber}`);  // 1-9
    // console.log(boardState); // 0-8
    // Check if the winning text is not showing
    if (gameOverArea.classList.contains('show')) {
        return;
    }

    // if the opponent is player.friend
   if (opponent === 'friend') {
        // give turn to other player.
        currentPlayer = currentPlayer === player.user ? player.friend : player.user;
        // store players move onto the board
        boardState[tileNumber-1] = currentPlayer;
        //Apply FontAwesome Icons into the tiles instead of the text letter and show the icons in turnDisplay
        // if (currentPlayer === player.user) {
        //     tile.innerHTML = `<i class="fa-solid fa-x"></i>`  
        //     turnDisplay.innerHTML = `<i class="fa-solid fa-o"></i>`

        // } else {
        //     tile.innerHTML = `<i class="fa-solid fa-o"></i>`
        //     turnDisplay.innerHTML = `<i class="fa-solid fa-x"></i>`
        // }
        
         
    }
    
    // if the opponent is the bot;
    if ( opponent === 'computer') {
        bot(currentPlayer);
    } else {
        // currentPlayer = currentPlayer === player.user ? player.computer : player.user;
        tile.style.pointerEvents = 'none';
    }
  
    tile.style.pointerEvents = 'none';
    
    //Stops the Players from being able to reClick the tiles
    clickSound.play();
    checkWinner();
}
//What I want to do is get the bot to click on the board tile wherever the player has not clicked it.
//The Random Number Generator function gets a random number from 1-9, which is used as the dataset.index for the bot to be applied 
// to the BoardState which index goes by 0-8 
// Must make sure Computers random number does not get repeated. 

// MUST FIND A WAY WHERE THE BOT CANNOT MAKE ON A MOVE THAT HAS A SYMBOL WITHIN THE BOX. AND USER CANNOT RECLICK THE POSITION THE BOT PLACED ITS SYMBOL



// this creates teh bot
function bot() {
    let botTileNumber = Math.floor(Math.random() * 9) - 1; //Bots randomNumber tile index. 1-9 just like tileNumberIndex
        //Check if the bots move index tile is valid or not
        while (boardState[botTileNumber] !== null) {
             botTileNumber = Math.floor(Math.random() * 9) -1 ;
        }

    // stores bots move index 
    boardState[botTileNumber] = player.computer;

        if ( currentPlayer === 'x') {
            tiles[botTileNumber].innerHTML = `<i class="fa-solid fa-x"></i>`;
    //     turnDisplay.innerHTML = `<i class="fa-solid fa-o"></i>`
        } else {
            tiles[botTileNumber].innerHTML = `<i class="fa-solid fa-o"></i>`;
    //     turnDisplay.innerHTML = `<i class="fa-solid fa-x"></i>`
        }
    // if(currentPlayer === opponent && opponent === 'x') {
    //     tiles[botTileNumber].innerHTML = `<i class="fa-solid fa-x"></i>`;
    //     turnDisplay.innerHTML = `<i class="fa-solid fa-o"></i>`
    // } else {
    //     tiles[botTileNumber].innerHTML = `<i class="fa-solid fa-o"></i>`;
    //     turnDisplay.innerHTML = `<i class="fa-solid fa-x"></i>`
    // }
        // if (opponent === player.computer) {
        //     if (player.computer === 'x') {
        //         tiles[botTileNumber-1].innerHTML = `<i class="fa-solid fa-x"></i>`;
              
        //     } else {
        //         tiles[botTileNumber-1].innerHTML = `<i class="fa-solid fa-o"></i>`;
        //     }
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
            tiles.forEach((tile) => {
                // stops players from clicking on tiles after a winner has been declared
                tile.style.pointerEvents = 'none';
                //invokes the function with the winningValue
                gameOverDisplay(tileValue1);
                return;
            });
           
           displayPlayer.innerHTML =`PLAYER <i class="fa-solid fa-${currentPlayer}"></i> WON`; // displays the winning player symbol
           let hr = document.createElement('hr');
           hr.classList.add('divide');
           displayPlayer.append(hr);
        }
    }
    // Check for a Draw/TIE
    const noWinner = boardState.every((tile) => tile !== null);
        if (noWinner) {
            gameOverDisplay(null);
        }
}


function gameOverDisplay(winnerText) {
    let text = 'TIE';

    if (winnerText !== null) {
        text = `<i class="fa-solid fa-${currentPlayer}"></i> WON!`;
    }

    gameOverArea.classList.remove('hide');
    gameOverArea.classList.add('show');
    gameOverText.innerHTML = text;
    gameOverSound.play();
}



function startNewGame() {
    // playSound.play();
    // gameOverArea.classList.add('hide');
    // gameOverArea.classList.remove('show');
    // boardState.fill(null);
    // tiles.forEach((tile) => {
    //     tile.removeChild(tile.firstChild);
    //     tiles.style.pointerEvents = 'auto';
    // });
    
// WORK ON RESTARTING THE GAME AND THEN ADDING AN AI AND INPUT NAMES OF PLAYERS MAYBE LUL

    window.location.reload();
    
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































// BOTS FUNCTION COMMENT CODE
   // // if the opponent IS player.computer then loop through the boardState to see if an index is NULL, if NULL 
    // if( opponent === player.computer) {
    //    let botIndex = randomNumber();
    // }
    // let randomNumber = Math.random() * 8; 
    // while(boardState[randomNumber] !== null) {
    
    // }
    // return randomNumber + 1 ;

//    let botsRandomNum = [];
//     for (let i = 0; i < tiles.length; i++) {
//         if(tiles[i].childElementCount === 0) {
//             botsRandomNum.push(i);
//         }
//     }
//     let randomBoxNum = botsRandomNum[Math.floor(Math.random() * botsRandomNum.length)];
// console.log(randomBoxNum + ' this is the bots move index');