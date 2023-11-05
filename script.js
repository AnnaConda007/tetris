const boardWidth = 10;
const boardHeight = 20;
const tetrisContainer = document.querySelector(".tetris-board");
const resetBtn = document.querySelector(".reset");
const scoreElement = document.querySelector(".score");
let currentBlock = { shape: [[1]], x: 4, y: 0 };
let score = 0;
const board = createBoard(boardHeight, boardWidth);

function createBoard(height, width) {
  return Array.from({ length: height }, () => Array(width).fill(0));
}

const drawBoard = () => {
  tetrisContainer.innerHTML = "";
  board.forEach((row) => {
    row.forEach((cell) => {
      const cellDiv = document.createElement("div");
      const className = cell ? "redBack" : "blackBack";
      cellDiv.classList.add(className);
      tetrisContainer.appendChild(cellDiv);
    });
  });
};

const toBlackBlock = () => {
  currentBlock.shape.forEach((row) => {
    //   первый уровень вложенности
    row.forEach((_, j) => {
      board[currentBlock.y][j + currentBlock.x] = 0;
    });
  });
};

const toRedBlock = () => {
  currentBlock.shape.forEach((row) => {
    // обращение к масиву первого уровня вложенности
    row.forEach((value, j) => {
      //обращение к масиву второго уровня вложенности
      board[currentBlock.y][j + currentBlock.x] = value; // перезаписываем значение для "квадртика"
    });
  });
};

const checkBorder = (horizontalMove = 0, verticalMove = 1) => {
  for (let i = 0; i < currentBlock.shape.length; i++) {
    for (let j = 0; j < currentBlock.shape[i].length; j++) {
      if (currentBlock.shape[i][j] !== 0) {
        let newX = j + currentBlock.x + horizontalMove;
        let newY = i + currentBlock.y + verticalMove;
        if (newX < 0 || newX >= boardWidth || newY >= boardHeight) {
          return true; // выход за пределы
        }
        if (board[newY][newX] !== 0) {
          // столкновение
          return true;
        }
      }
    }
  }
  return false;
};

const resetPosition = () => {
  currentBlock = { shape: [[1]], x: 4, y: 0 };
};

const resetGame = () => {
  for (let i = 0; i < boardHeight; i++) {
    for (let j = 0; j < boardWidth; j++) {
      board[i][j] = 0; // в черный
    }
  }
  score = 0;
  scoreElement.innerText = `Счет: ${score}`;
  resetPosition();
};

const checkGameOver = () => {
  for (let i = 0; i < boardWidth; i++) {
    if (board[0][i] !== 0) {
      // каждая ячейка верхней строки
      return true;
    }
  }
  return false;
};

const blockDown = () => {
  if (!checkBorder(0, 1)) {
    toBlackBlock();
    currentBlock.y++;
    toRedBlock();
  } else {
    toRedBlock();
    if (checkGameOver()) {
      alert("Игра окончена! Ваш счет: " + score);
      resetGame();
      drawBoard();
      return;
    }
    resetPosition();
    score++;
    scoreElement.innerText = `Счет: ${score}`;
  }
};
drawBoard();

setInterval(() => {
  blockDown();
  drawBoard();
}, 1000);

resetBtn.addEventListener("click", () => {
  resetGame();
  drawBoard();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && !checkBorder(-1)) {
    toBlackBlock();
    currentBlock.x--;
    toRedBlock();
  } else if (e.key === "ArrowRight" && !checkBorder(1)) {
    toBlackBlock();
    currentBlock.x++;
    toRedBlock();
  } else if (e.key === "ArrowDown") {
    blockDown();
  }
});
