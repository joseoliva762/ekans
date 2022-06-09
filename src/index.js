class Snake {
  constructor(xPosition, yPosition, size) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.size = size;
    this.body = [
      {
        x: this.xPosition,
        y: this.yPosition
      }
    ];
    this.xRotate = 1;
    this.yRotate = 0;
    this.color = '#ffffff';
  }

  getNewRect() {
    let newRect = {}
    let tail = this.body[this.body.length - 1];
    if (this.xRotate === 1) {
      newRect.x = tail.x + this.size;
      newRect.y = tail.y;
    } else if (this.xRotate === -1) {
      newRect.x = tail.x - this.size;
      newRect.y = tail.y;
    } else if (this.yRotate === 1) {
      newRect.x = tail.x;
      newRect.y = tail.y + this.size;
    } else if (this.yRotate === -1) {
      newRect.x = tail.x;
      newRect.y = tail.y - this.size;
    } else {
      return false;
    }
    return newRect;
  }

  move() {
    let newRect = this.getNewRect();
    this.body.shift();
    this.body.push(newRect);
  }
}

class Food {
  constructor() {
    let isTouching
    while (true) {
      isTouching = false;
      this.xPosition = Math.floor(Math.random() * board.width / snake.size) * snake.size
      this.yPosition = Math.floor(Math.random() * board.height / snake.size) * snake.size
      for (let i = 0; i < snake.body.length; i++) {
        if (this.xPosition == snake.body[i].x && this.yPosition == snake.body[i].y) {
          isTouching = true
        }
      }
      this.size = snake.size
      this.color = "#3080ea"
      if (!isTouching) break;
    }
  }
}

let board = document.getElementById('board');
let score = document.getElementById('score');
let reload = document.getElementById('reload');
let boardContext = board.getContext('2d');
let snake = new Snake(20, 20, 20);
let food = new Food();
let isGameOver = false;

const handleEatFood = () => {
  const tail = snake.body[snake.body.length - 1];
  if (tail.x === food.xPosition && tail.y === food.yPosition) {
    snake.body.push({
      x: food.xPosition,
      y: food.yPosition
    });
    food = new Food();
  }
}

const handleReload = () => {
  score.innerHTML = 'Score: 0';
  snake = new Snake(20, 20, 20);
  food = new Food();
  isGameOver = false;
  reload.style.background = '#3080ea';
  reload.style.border = '1px solid #3080ea';
  reload.innerHTML = 'Click here to play again';
}

const handleGameOver = () => {
  snake.color = '#ea4335';
  reload.style.background = '#ea4335';
  reload.style.border = '1px solid #ea4335';
  reload.innerHTML = '😭 Game Over. Click here to play again';
}

const handleKeyDown = (event) => {
  setTimeout(() => {
    if (event.keyCode === 37 && snake.xRotate !== 1) {
      snake.xRotate = -1;
      snake.yRotate = 0;
    } else if (event.keyCode === 38 && snake.yRotate !== 1) {
      snake.xRotate = 0;
      snake.yRotate = -1;
    } else if (event.keyCode === 39 && snake.xRotate !== -1) {
      snake.xRotate = 1;
      snake.yRotate = 0;
    } else if (event.keyCode === 40 && snake.yRotate !== -1) {
      snake.xRotate = 0;
      snake.yRotate = 1;
    }
  }, 0);
}

const checkHitWall = () => {
  const tail = snake.body[snake.body.length - 1];
  if (tail.x === -snake.size) {
    tail.x = board.width - snake.size;
  } else if (tail.x === board.width) {
    tail.x = 0;
  } else if (tail.y === -snake.size) {
    tail.y = board.height - snake.size;
  } else if (tail.y === board.height) {
    tail.y = 0;
  }
}

const checkGameOver = () => {
  const tail = snake.body[snake.body.length - 1];
  for (let i = 0; i < snake.body.length - 2; i++) {
    isGameOver = tail.x === snake.body[i].x && tail.y === snake.body[i].y;
    if (isGameOver) return handleGameOver();
  }
}

const update = () => {
  boardContext.clearRect(0, 0, board.width, board.height);
  snake.move();
  handleEatFood();
  checkHitWall();
}

const draw = () => {
  createRect(0, 0, board.width, board.height, '#36373a');

  for (let i = 0; i < snake.body.length; i++) {
    createRect(snake.body[i].x + 2.5, snake.body[i].y + 2.5, snake.size - 5, snake.size - 5, snake.color);
  }

  boardContext.font = '16px Arial';
  boardContext.fillStyle = 'white';
  const scoreText = `Score: ${snake.body.length - 1}`;
  boardContext.fillText(scoreText, board.width - 400, board.height);
  score.innerHTML !== scoreText && (score.innerHTML = scoreText);
  createRect(food.xPosition, food.yPosition, food.size, food.size, food.color);
}

const show = () => {
  !isGameOver && update();
  draw();
  checkGameOver();
}

const createRect = (xPosition, yPosition, width, height, color) => {
  boardContext.fillStyle = color;
  boardContext.fillRect(xPosition, yPosition, width, height);
}

const gameLoop = () => setInterval(show.bind(this), 1000/12);
window.addEventListener('keydown', handleKeyDown);
window.onload = gameLoop;
reload.onclick = handleReload;