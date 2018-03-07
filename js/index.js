// MVC OOP approach to TicTacToe

//TODO: 
//  implement minimax algo for Hard CPU mode
//  implement "color" mode, substitue symbols for colors




// MODEL ======================================================================
var model = {
  settings : {
    panel : "visible",
    p1Sym : "X",
    p2Sym : "O",
    ai: 0,
    diff : 0,
    colorMode : 0  
  },
  
  player : function(playerName, playerSymbol, isAi, aiDiff) {
      this.name = playerName;
      this.ai = isAi;
      this.aiDiff = aiDiff;
      this.symbol = playerSymbol;
      this.score = 0;
      this.isWinner = false;
    },
  
  board: {
      numTiles : 9,
      playerTurn : 1,
      active: false,
      occupied: 0
    } 
};

// CONTROLLER ==================================================================
function controller() {
  let player1, player2, 
      gameOver = false,
      threeSymRow = [7,56,448,73,146,292,273,84],
      idPairs = {
        7: [0,1,2],
        56: [3,4,5],
        448: [6,7,8],
        73: [0,3,6],
        146: [1,4,7],
        292: [2,5,8],
        273: [0,4,8],
        84: [2,4,6]
      }
      
  //game logic
  
  function notOccupied(tileId) {
    if (document.getElementById(tileId).innerHTML!=="") {
      
      console.log("occupied");
      return false;
    }
    return true;
  }
  controller.notOccupied = notOccupied;
  
  function takeAiTurn() {
    let allTiles = document.querySelectorAll('td');
    let remainingTiles = [];
    let choice,choiceId;
    allTiles.forEach(function(e){
      if (e.innerHTML === "") {
        remainingTiles.push(e);
      }
    })
    //Easy AI
    if (player2.aiDiff === 0) {
      choice = Math.floor(Math.random() * remainingTiles.length) + 0;
      console.log(remainingTiles);
      choiceId = remainingTiles[choice].id;
      console.log(choiceId);
      controller.takeTurn(2,choiceId);
    }
    
    //Hard AI
    else if (player2.aiDiff === 1) {
      console.log("minimax alg goes here");
    }
  }
  controller.takeAiTurn = takeAiTurn;
  
  function takeTurn(playerTurn,tileId) {
      if (playerTurn === 1) {
      document.getElementById(tileId).innerHTML = player1.symbol;
      model.board.occupied += 1;
      player1.score += Math.pow(2,tileId);
      model.board.playerTurn = 2;
      if((!controller.isWinner(player1)) && player2.ai === 1){
        controller.takeAiTurn();
      }
      
        
    } 
    else if (playerTurn === 2) {
      document.getElementById(tileId).innerHTML = player2.symbol;
      model.board.occupied +=1;
      player2.score += Math.pow(2, tileId);
      controller.isWinner(player2);
      model.board.playerTurn = 1;
    }
  
    
  }
  controller.takeTurn = takeTurn;
  
  
  function isWinner(player) {
    var score = player.score;
    var name = player.name.toUpperCase();
  
    for (var i = 0; i<threeSymRow.length; i+=1) {
      if ((threeSymRow[i] & score) === threeSymRow[i]) {
        document.querySelector('#footer').innerHTML =name + ' WINS! <br> click anywhere to restart';
        styleWinTiles(threeSymRow[i]);
        gameOver = true;
        if (player1.symbol === "X") {
          model.board.playerTurn = 1;
        } 
        else if (player1.symbol === "O") {
          model.board.playerTurn = 2;
        }
        return true;
      }   
    }
    
    if (model.board.occupied >= 9) {
      document.querySelector('#footer').innerHTML = "TIE! <br> click anywhere to restart";
      gameOver = true;
      return false;
    }
    
    return false;
    
  };
  controller.isWinner=isWinner;
  
  function styleWinTiles (winningScore) {
    var ids = idPairs[winningScore];
    console.log(ids);
    ids.forEach(function(e){
      document.getElementById(e).style.color = "#912F40";
    });
    
  }
  controller.styleWinTiles = styleWinTiles;
  
  //click events
  function cEvent() {
    
   function handleClickEvent (id){
    if (id === "setBtn") {
      //call show/hide func
      controller.cEvent.showHide();
      //
    } else if (id === "startBtn") {
      controller.cEvent.showHide();
      controller.cEvent.startNewGame();
      
    } else {
      //take a turn
      if (gameOver) {
        controller.cEvent.startNewGame();
      } else if (controller.notOccupied(id) && (!gameOver)) {
        controller.takeTurn(model.board.playerTurn,id);
      }
      
      
    }
  }
   cEvent.handleClickEvent = handleClickEvent;
  
    function showHide() {
    if (model.settings.panel === "visible") {
      document.querySelector('#setContainer').style.visibility = "hidden";
      document.querySelector('#board').style.visibility = "visible";
      model.settings.panel = "hidden";
    } else if (model.settings.panel === "hidden") {
      document.querySelector('#setContainer').style.visibility = "visible";
      document.querySelector('#board').style.visibility = "hidden";
      model.settings.panel = "visible";
    }
  }
    cEvent.showHide = showHide;
  
    function applySettingStyle(setKeys,index) {
    if (index % 2 === 0) {
      console.log('index is even');
      setKeys[index].style.color = "#912F40";
      console.log('next index is' + setKeys[index+1].id);
      setKeys[index+1].style.color = "white";
      
    } else {
      console.log('index is odd');
      setKeys[index].style.color = "#912f40";
      console.log('next index is' + setKeys[index-1].id)
      setKeys[index-1].style.color = "white";
    }
    
  }
    cEvent.applySettingStyle = applySettingStyle;
  
    function updateModelSettings(setKeys,index) {
    if (index===0) {
      model.settings.p1Sym = "X";
      model.settings.p2Sym = "O";
      model.board.playerTurn = 1;
    } else if (index===1) {
      model.settings.p1Sym = "O";
      model.settings.p2Sym = "X";
      model.board.playerTurn = 2;
    } else if (index === 2 || index === 3) {
      model.settings.ai = index - 2;
    } else if (index === 4 || index === 5) {
      model.settings.diff = index - 4;
    }
  }
    cEvent.updateModelSettings = updateModelSettings;
    
    function startNewGame() {
      document.querySelectorAll('td').forEach(function(e){
        e.innerHTML = "";
        e.style.color = "white";
      });
      model.board.occupied = 0;
      gameOver = false;
      player1 = new model.player("player 1",model.settings.p1Sym,0,0);
      player2 = new model.player('player 2',model.settings.p2Sym,model.settings.ai,model.settings.diff);
      console.log(player1);
      console.log(player2);
      console.log(model.board.playerTurn);
      document.getElementById('footer').innerHTML = "...";
      if (player2.symbol === "X" && (player2.ai)) {
        controller.takeAiTurn()
      }
      
      
      
    }
    cEvent.startNewGame = startNewGame;
  };
  controller.cEvent = cEvent;
  
}

// VIEW ========================================================================
function view(){
  const setKeys = Array.from(document.querySelectorAll('.setSelect'));
  const startBtn = document.querySelector('#startBtn');
  const setBtn = document.querySelector('#setBtn');
  const tileKeys = Array.from(document.querySelectorAll('td'));
  
  // Settings Keys  
  for (var i = 0; i<setKeys.length; i++) {
    setKeys[i].onclick = function() {
      console.log(this.id);
      console.log(setKeys.indexOf(this));
      controller.cEvent.applySettingStyle(setKeys,setKeys.indexOf(this));
      controller.cEvent.updateModelSettings(setKeys,setKeys.indexOf(this));
      console.log(model.settings);
      
    }
  }
  
  startBtn.onclick = function() {
    console.log('start the game, close the settings panel');
    controller.cEvent.handleClickEvent(this.id);
    //handleClickEvent('id')
  };
  
  setBtn.onclick = function() {
    console.log('open settings if closed')
    controller.cEvent.handleClickEvent(this.id);
  };
  
  // Tile Keys
  for (var i = 0; i<tileKeys.length; i++) {
    tileKeys[i].onclick = function() {
      controller.cEvent.handleClickEvent(this.id);
    }
  }
  
};

// Init 
var model = model || {};
controller();
controller.cEvent();
view()
