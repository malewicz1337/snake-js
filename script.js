const canvas = document.getElementById("snakeGame");
const scoreElement = document.getElementById("score");
const restart = document.getElementById("restartButton");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const snakeSpeed = 150;

let snake = [{ x: 200, y: 200 }];
let food = { x: 300, y: 300 };
let dx = gridSize;
let dy = 0;
let score = 0;

document.addEventListener("keydown", changeDirection);
restart.addEventListener("click", restartGame);

function changeDirection(event) {
  const LEFT_ARROW = 37;
  const RIGHT_ARROW = 39;
  const UP_ARROW = 38;
  const DOWN_ARROW = 40;

  if (event.keyCode === LEFT_ARROW && dx === 0) {
    dx = -gridSize;
    dy = 0;
  }

  if (event.keyCode === RIGHT_ARROW && dx === 0) {
    dx = gridSize;
    dy = 0;
  }

  if (event.keyCode === UP_ARROW && dy === 0) {
    dx = 0;
    dy = -gridSize;
  }

  if (event.keyCode === DOWN_ARROW && dy === 0) {
    dx = 0;
    dy = gridSize;
  }
}

function eatFood() {
  const head = snake[0];
  return head.x === food.x && head.y === food.y;
}

function updateGameSpeed() {
  clearInterval(gameInterval);

  const newSpeed = Math.max(snakeSpeed - (snake.length - 1) * 1.1, 50); // Decrease speed by 1.5 ms per additional segment, with a minimum speed limit

  gameInterval = setInterval(gameLoop, newSpeed);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  if (head.x >= canvas.width) {
    head.x = 0;
  } else if (head.x < 0) {
    head.x = canvas.width - gridSize;
  }

  if (head.y >= canvas.height) {
    head.y = 0;
  } else if (head.y < 0) {
    head.y = canvas.height - gridSize;
  }

  snake.unshift(head);

  if (!eatFood()) {
    snake.pop();
  } else {
    score++;
    moveFood();
    updateGameSpeed();
  }
}

function moveFood() {
  let newFoodPosition;

  do {
    newFoodPosition = {
      x: Math.floor((Math.random() * canvas.width) / gridSize) * gridSize,
      y: Math.floor((Math.random() * canvas.height) / gridSize) * gridSize,
    };
  } while (isPositionOnSnake(newFoodPosition));

  food = newFoodPosition;
}

function isPositionOnSnake(position) {
  return snake.some((segment) => segment.x === position.x && segment.y === position.y);
}

function checkCollision() {
  const head = snake[0];
  const body = snake.slice(1);

  return body.some((segment) => segment.x === head.x && segment.y === head.y);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment) => {
    ctx.fillStyle = "lime";
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    ctx.strokeStyle = "black";
    ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
  });

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
  ctx.strokeStyle = "black";
  ctx.strokeRect(food.x, food.y, gridSize, gridSize);

  scoreElement.innerText = `Score: ${score}`;
}

function gameLoop() {
  if (snake.length === (canvas.width / gridSize) * (canvas.height / gridSize)) {
    endGame("You Win");
    return;
  }

  if (checkCollision()) {
    endGame("Game Over");
    return;
  }

  moveSnake();
  draw();
}

function endGame(message) {
  clearInterval(gameInterval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "50px Arial";
  ctx.fillStyle = message == "Game Over" ? "red" : "green";
  const text = message;
  const textWidth = ctx.measureText(text).width;
  const textX = canvas.width / 2 - textWidth / 2;
  const textY = canvas.height / 2 + 25 / 2;
  ctx.fillText(text, textX, textY);

  restart.style.display = "block";
}

let gameInterval = setInterval(gameLoop, snakeSpeed);

function restartGame() {
  snake = [{ x: 200, y: 200 }];
  food = { x: 300, y: 300 };
  dx = gridSize;
  dy = 0;
  score = 0;
  scoreElement.innerText = `Score: ${score}`;
  restart.style.display = "none";
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, snakeSpeed);
}
