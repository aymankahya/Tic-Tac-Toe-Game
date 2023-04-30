// Creating Player object using factory function

const Player = (name) => {
  let currentScore = 0;
  let isTurn = false;
  let playingSymbol = "";
  const getName = () => name;

  return { getName, currentScore, isTurn, playingSymbol };
};

//Create screenController module

const screenController = function () {
  //   function updateGameboard() {}

  const $DOMelements = cacheDOM();

  function cacheDOM() {
    // Retrieve DOM control elements from screen (buttons, display updtae)
    const $AImodeButton = document.querySelector(".ai-mode");
    const $friendModeButton = document.querySelector(".friend-mode");
    const $inputNameButton = document.querySelector(".name-button");
    const $restartGameButton = document.querySelector(".restart");
    const $startGameButton = document.querySelector(".side-button");
    const $displayPlayMode = document.querySelector(".play-mode");
    const $displayNameInput = document.querySelector(".player-names");
    const $displayPickSide = document.querySelector(".pick-side");
    const $displayGameboard = document.querySelector(".main-container");

    // Retrieve information displaying elements from DOM
    const $sidePickingPlayer = document.querySelector(".choosing-player");
    const $firstPlayerName = document.querySelector(".first-name");
    const $secondPlayerName = document.querySelector(".second-name");
    const $firstPlayerScore = document.querySelector(".first-score");
    const $secondPlayerScore = document.querySelector(".second-score");
    const $winnerMessage = document.querySelector(".winner-card.winner");
    const $winnerName = document.querySelector(".winner-name");

    //Retrieve input fields elements
    const $firstPlayerNameInput = document.querySelector("#player-one");
    const $secondPlayerNameInput = document.querySelector("#player-two");
    const $cercleSelect = document.querySelector("#cercle");
    const $crossSelect = document.querySelector("#cross");

    document.querySelector(".pick-side-prompt");

    return {
      $AImodeButton,
      $friendModeButton,
      $inputNameButton,
      $restartGameButton,
      $startGameButton,
      $sidePickingPlayer,
      $firstPlayerName,
      $secondPlayerName,
      $firstPlayerScore,
      $secondPlayerScore,
      $displayGameboard,
      $displayNameInput,
      $displayPickSide,
      $displayPlayMode,
      $firstPlayerNameInput,
      $secondPlayerNameInput,
      $cercleSelect,
      $crossSelect,
      $winnerMessage,
      $winnerName,
    };
  }

  function getName() {
    // Retrieve player names from input field
    const firstPlayerName = document.querySelector("#player-one").value;
    const secondPlayerName = document.querySelector("#player-two").value;

    return {
      firstPlayerName,
      secondPlayerName,
    };
  }

  function pickSide() {
    // Get the first player symbol choice
    const crossChecked = document.querySelector("#cross").checked;
    const cercleChecked = document.querySelector("#cercle").checked;

    return {
      crossChecked,
      cercleChecked,
    };
  }

  function getGameboard() {
    // Retrieve the game baord grid cells DOM elements
    const $gameboard = document.querySelectorAll(".grid-item");

    return {
      $gameboard,
    };
  }

  function resetGameboard() {
    const cells = getGameboard();
    for (let i = 0; i < Object.values(cells)[0].length; i++) {
      Object.values(cells)[0][i].innerHTML = "";
    }
  }

  function updateDisplay(targetElement) {
    if (
      targetElement.className.includes("friend-mode") ||
      targetElement.className.includes("ai")
    ) {
      $DOMelements.$displayPlayMode.style.display = "none";
      $DOMelements.$displayNameInput.style.display = "flex";
    } else if (targetElement.className.includes("name")) {
      $DOMelements.$displayNameInput.style.display = "none";
      $DOMelements.$displayPickSide.style.display = "flex";
    } else if (targetElement.className.includes("side")) {
      $DOMelements.$displayPickSide.style.display = "none";
      $DOMelements.$displayGameboard.style.display = "flex";
    } else if (targetElement.className.includes("restart")) {
      $DOMelements.$displayGameboard.style.display = "none";
      $DOMelements.$displayPlayMode.style.display = "flex";
    }
  }

  function updateScore(Players) {
    $DOMelements.$firstPlayerScore.innerHTML = Players.firstPlayer.currentScore;
    $DOMelements.$secondPlayerScore.innerHTML =
      Players.secondPlayer.currentScore;
  }

  function displayWinner() {
    const $gameboard = document.querySelectorAll(".gameBoard");
    $gameboard[0].classList.add("winner");
    $DOMelements.$winnerMessage.style.display = "flex";
  }

  function removeDisplayWinner() {
    const $gameboard = document.querySelectorAll(".gameBoard");
    $gameboard[0].classList.remove("winner");
    $DOMelements.$winnerMessage.style.display = "none";
  }

  function displayPlayerNames(firstPlayerName, secondPlayerName) {
    $DOMelements.$sidePickingPlayer.innerHTML = firstPlayerName;
    $DOMelements.$firstPlayerName.innerHTML = firstPlayerName;
    $DOMelements.$secondPlayerName.innerHTML = secondPlayerName;
  }
  return {
    $DOMelements,
    getName,
    pickSide,
    getGameboard,
    updateDisplay,
    displayPlayerNames,
    resetGameboard,
    displayWinner,
    removeDisplayWinner,
    updateScore,
  };
};

// Create gameController module

const gameController = (function () {
  // Initiliaze screenController module
  const gameScreen = new screenController();
  let Players = {};
  let gameBoardMatrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  function createPlayer([name1, name2]) {
    const firstPlayer = Player(name1);
    const secondPlayer = Player(name2);

    gameScreen.displayPlayerNames(
      firstPlayer.getName(),
      secondPlayer.getName()
    );
    return {
      firstPlayer,
      secondPlayer,
    };
  }

  function deletePlayers() {
    Object.keys(Players).forEach((key) => {
      delete Players[key];
    });
  }

  function startGame() {
    //AI Mode (not yet implemented)
    gameScreen.$DOMelements.$AImodeButton.addEventListener("click", () =>
      alert("Coming Soon")
    );
    //Manage With a friend Playing Mode choice
    gameScreen.$DOMelements.$friendModeButton.addEventListener(
      "click",
      (event) => gameScreen.updateDisplay(event.target)
    );

    // Manage transition to the side picking page and input validation
    gameScreen.$DOMelements.$inputNameButton.addEventListener(
      "click",
      (event) => {
        const playerNames = gameScreen.getName();
        const onlyText = new RegExp(/^[a-z\sA-Z]*$/);
        let validInput = true;
        Object.values(playerNames).forEach((element) => {
          if (onlyText.test(element) == false || element.length == 0) {
            validInput = false;
          }
        });

        if (validInput == true) {
          Object.assign(Players, createPlayer(Object.values(playerNames)));
          gameScreen.updateDisplay(event.target);
        } else {
          alert("Enter a valid name");
        }
      }
    );

    // Manage transition to the gameboard display and choice validation
    gameScreen.$DOMelements.$startGameButton.addEventListener(
      "click",
      (event) => {
        const checkedResult = gameScreen.pickSide();
        if (Object.values(checkedResult).includes(true)) {
          getChosenSymbol();
          Players["firstPlayer"].isTurn = true;
          gameScreen.updateDisplay(event.target);
        } else {
          alert("You have to choose a side");
        }
      }
    );
  }

  function restartGame() {
    // Manage game restart
    gameScreen.$DOMelements.$restartGameButton.addEventListener(
      "click",
      (event) => {
        gameScreen.updateDisplay(event.target);
        gameScreen.$DOMelements.$firstPlayerNameInput.value = "";
        gameScreen.$DOMelements.$secondPlayerNameInput.value = "";
        gameScreen.$DOMelements.$crossSelect.checked = false;
        gameScreen.$DOMelements.$cercleSelect.checked = false;
        deletePlayers();
        gameScreen.resetGameboard();
        gameScreen.$DOMelements.$firstPlayerName.className =
          "playerName first-name isTurn";
        gameScreen.$DOMelements.$secondPlayerName.className =
          "playerName second-name";
      }
    );
  }

  function getChosenSymbol() {
    const firstPlayerChoice = gameScreen.pickSide();
    if (firstPlayerChoice["crossChecked"] == true) {
      Players["firstPlayer"].playingSymbol = "cross";
      Players["secondPlayer"].playingSymbol = "cercle";
    } else {
      Players["firstPlayer"].playingSymbol = "cercle";
      Players["secondPlayer"].playingSymbol = "cross";
    }
  }

  function disableCells() {
    const cells = gameScreen.getGameboard();
    for (let i = 0; i < Object.values(cells)[0].length; i++) {
      Object.values(cells)[0][i].style.pointerEvents = "none";
    }
  }

  function enableCells() {
    const cells = gameScreen.getGameboard();
    for (let i = 0; i < Object.values(cells)[0].length; i++) {
      Object.values(cells)[0][i].style.pointerEvents = "all";
    }
  }

  function isWinner(winnerPlayer) {
    disableCells();
    gameScreen.$DOMelements.$winnerName.innerHTML = winnerPlayer.getName();
    winnerPlayer.currentScore += 1;
    gameScreen.displayWinner();
    setTimeout(() => gameScreen.removeDisplayWinner(), 3000);
    setTimeout(() => enableCells(), 4000);
    setTimeout(() => gameScreen.resetGameboard(), 3000);
    gameScreen.updateScore(Players);
    gameBoardMatrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }

  function switchPlayerTurn() {
    if (Players["firstPlayer"].isTurn == true) {
      Players["firstPlayer"].isTurn = false;
      Players["secondPlayer"].isTurn = true;
      gameScreen.$DOMelements.$firstPlayerName.classList.remove("isTurn");
      gameScreen.$DOMelements.$secondPlayerName.classList.add("isTurn");
    } else {
      Players["firstPlayer"].isTurn = true;
      Players["secondPlayer"].isTurn = false;
      gameScreen.$DOMelements.$secondPlayerName.classList.remove("isTurn");
      gameScreen.$DOMelements.$firstPlayerName.classList.add("isTurn");
    }
  }

  function markCell() {
    const cells = gameScreen.getGameboard();
    for (let i = 0; i < Object.values(cells)[0].length; i++) {
      Object.values(cells)[0][i].addEventListener("click", function (event) {
        if (event.target.innerHTML == "") {
          if (Players.firstPlayer.isTurn == true) {
            if (Players.firstPlayer.playingSymbol == "cross") {
              const crossSpan = document.createElement("span");
              crossSpan.className = "cross";
              crossSpan.innerHTML = "X";
              event.target.appendChild(crossSpan);
              gameBoardMatrix[event.target.attributes[1].value - 1][
                event.target.attributes[2].value - 1
              ] = 1;
              if (checkWinner()) {
                isWinner(Players.firstPlayer);
              } else {
                switchPlayerTurn();
              }
            } else {
              const cercleSpan = document.createElement("span");
              cercleSpan.className = "cercle";
              cercleSpan.innerHTML = "O";
              event.target.appendChild(cercleSpan);
              gameBoardMatrix[event.target.attributes[1].value - 1][
                event.target.attributes[2].value - 1
              ] = 2;
              if (checkWinner()) {
                isWinner(Players.firstPlayer);
              } else {
                switchPlayerTurn();
              }
            }
          } else {
            if (Players.secondPlayer.playingSymbol == "cross") {
              console.log("row : ", event.target.attributes[1].value);
              console.log("column : ", event.target.attributes[2].value);
              const crossSpan = document.createElement("span");
              crossSpan.className = "cross";
              crossSpan.innerHTML = "X";
              event.target.appendChild(crossSpan);

              gameBoardMatrix[event.target.attributes[1].value - 1][
                event.target.attributes[2].value - 1
              ] = 1;
              if (checkWinner()) {
                isWinner(Players.secondPlayer);
                switchPlayerTurn();
              } else {
                switchPlayerTurn();
              }
            } else {
              const cercleSpan = document.createElement("span");
              cercleSpan.className = "cercle";
              cercleSpan.innerHTML = "O";
              event.target.appendChild(cercleSpan);
              gameBoardMatrix[event.target.attributes[1].value - 1][
                event.target.attributes[2].value - 1
              ] = 2;
              if (checkWinner()) {
                isWinner(Players.secondPlayer);
                switchPlayerTurn();
              } else {
                switchPlayerTurn();
              }
            }
          }
        }
      });
    }
  }

  function checkWinner() {
    const firstColumn = [
      gameBoardMatrix[0][0],
      gameBoardMatrix[1][0],
      gameBoardMatrix[2][0],
    ];

    const secondColumn = [
      gameBoardMatrix[0][1],
      gameBoardMatrix[1][1],
      gameBoardMatrix[2][1],
    ];

    const thirdColumn = [
      gameBoardMatrix[0][2],
      gameBoardMatrix[1][2],
      gameBoardMatrix[2][2],
    ];

    const firstRow = gameBoardMatrix[0];
    const secondRow = gameBoardMatrix[1];
    const thirdRow = gameBoardMatrix[2];

    const firstDiag = [
      gameBoardMatrix[0][0],
      gameBoardMatrix[1][1],
      gameBoardMatrix[2][2],
    ];

    const secondDiag = [
      gameBoardMatrix[0][2],
      gameBoardMatrix[1][1],
      gameBoardMatrix[2][0],
    ];

    //First Column Cross populated
    if (
      firstColumn.includes(1) &&
      !(firstColumn.includes(2) || firstColumn.includes(0))
    ) {
      return true;
    }
    //First Column Cercle populated
    if (
      firstColumn.includes(2) &&
      !(firstColumn.includes(1) || firstColumn.includes(0))
    ) {
      return true;
    }

    //Second Column Cross populated
    if (
      secondColumn.includes(1) &&
      !(secondColumn.includes(2) || secondColumn.includes(0))
    ) {
      return true;
    }

    //Second Column Cercle populated
    if (
      secondColumn.includes(2) &&
      !(secondColumn.includes(1) || secondColumn.includes(0))
    ) {
      return true;
    }

    //Third Column Cross populated
    if (
      thirdColumn.includes(1) &&
      !(thirdColumn.includes(2) || thirdColumn.includes(0))
    ) {
      return true;
    }

    //Third Column Cercle populated
    if (
      thirdColumn.includes(2) &&
      !(thirdColumn.includes(1) || thirdColumn.includes(0))
    ) {
      return true;
    }

    //================================

    //First Row Cross populated
    if (
      firstRow.includes(1) &&
      !(firstRow.includes(2) || firstRow.includes(0))
    ) {
      return true;
    }
    //First Row Cercle populated
    if (
      firstRow.includes(2) &&
      !(firstRow.includes(1) || firstRow.includes(0))
    ) {
      return true;
    }

    //Second Row Cross populated
    if (
      secondRow.includes(1) &&
      !(secondRow.includes(2) || secondRow.includes(0))
    ) {
      return true;
    }

    //Second Row Cercle populated
    if (
      secondRow.includes(2) &&
      !(secondRow.includes(1) || secondRow.includes(0))
    ) {
      return true;
    }

    //Third Row Cross populated
    if (
      thirdRow.includes(1) &&
      !(thirdRow.includes(2) || thirdRow.includes(0))
    ) {
      return true;
    }

    //Third Row Cercle populated
    if (
      thirdRow.includes(2) &&
      !(thirdRow.includes(1) || thirdRow.includes(0))
    ) {
      return true;
    }

    //First Diag Cross populated
    if (
      firstDiag.includes(1) &&
      !(firstDiag.includes(2) || firstDiag.includes(0))
    ) {
      return true;
    }

    //firstDiag Cercle populated
    if (
      firstDiag.includes(2) &&
      !(firstDiag.includes(1) || firstDiag.includes(0))
    ) {
      return true;
    }

    //secondDiagCross populated
    if (
      secondDiag.includes(1) &&
      !(secondDiag.includes(2) || secondDiag.includes(0))
    ) {
      return true;
    }

    //secondDiag Cercle populated
    if (
      secondDiag.includes(2) &&
      !(secondDiag.includes(1) || secondDiag.includes(0))
    ) {
      return true;
    }
  }

  function init() {
    startGame();
    restartGame();
    markCell();
  }

  return {
    init,
  };
})();

gameController.init();
