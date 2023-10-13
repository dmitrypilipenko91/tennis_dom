const MIN_POS_X = 0;
const MIN_POS_Y = 0;
const MAX_POS_X = 400;
const MAX_POS_Y = 350;
const BALL_DIAMETER = 10;
const MAX_POS_BALL_X = MAX_POS_X - BALL_DIAMETER;
const MAX_POS_BALL_Y = MAX_POS_Y - BALL_DIAMETER;
const START_POS_X = 200;
const START_POS_Y = 175;
const ONE_STEP = 3;
const ONE_STEP_IF_RUN = 7;
const ONE_TICK = 1000 / 25;
const NO_TIMER_VALUE = 'no-timer';
const PADDLE_START_POSITION = 0;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 70;
const PADDLE_ONE_STEP = 3;
const PADDLE_START_DIRECTION = 0;
const MAX_POS_PADDLE_Y = MAX_POS_Y - PADDLE_HEIGHT;

// model
const state = {
    posX: START_POS_X,
    posY: START_POS_Y,
    isRun: false,
    directionX: Math.SQRT1_2,
    directionY: Math.SQRT1_2,
    isLost: false
}

const leftPaddleState = {
    paddlePosition: PADDLE_START_POSITION,
    paddleWidth: PADDLE_WIDTH,
    paddleHeight: PADDLE_HEIGHT,
    paddleDirection: PADDLE_START_DIRECTION
}

const rightPaddleState = {
    paddlePosition: PADDLE_START_POSITION,
    paddleWidth: PADDLE_WIDTH,
    paddleHeight: PADDLE_HEIGHT,
    paddleDirection: PADDLE_START_DIRECTION
}

function randBetween(min, max) {
    const length = Math.random() * (max - min);
    return min + length;
}
// normalization
function setStartDirections() {
    const directionX = randBetween(-1, 1);
    const directionYSign = Math.sign(randBetween(-1, 1));
    const directionY = directionYSign * Math.sqrt(1 - directionX**2);

    state.directionX = directionX;
    state.directionY = directionY;
}

// paddleDirectionSign -1, 0, 1
function setPaddleDirection(paddleDirectionSign) {
    leftPaddleState.paddleDirection = Math.sign(paddleDirectionSign);
    rightPaddleState.paddleDirection = Math.sign(paddleDirectionSign);
}

let countLeft = 0;
let countRight = 0;
const counterLeft = document.getElementById('counterLeft');
const counterRight = document.getElementById('counterRight');
counterLeft.innerText = `${countLeft}`;
counterRight.innerText = `${countRight}`;

function move() {
    // ball
    if(state.isLost) {
        return;
    }
    
    const step = state.isRun ? ONE_STEP_IF_RUN : ONE_STEP;

    state.posX = Math.round(state.posX + state.directionX * step);
    state.posX = Math.max(MIN_POS_X, state.posX);
    state.posX = Math.min(MAX_POS_BALL_X, state.posX);

    if (state.posX === MIN_POS_X || state.posX === MAX_POS_BALL_X) {
        state.directionX *= -1;
    } 
    
    state.posY = Math.round(state.posY + state.directionY * step);
    state.posY = Math.max(MIN_POS_Y, state.posY);
    state.posY = Math.min(MAX_POS_BALL_Y, state.posY);

    if (state.posY === MIN_POS_Y || state.posY === MAX_POS_BALL_Y) {
        state.directionY *= -1;
    }
    
    // game over handling and counters
    if (state.posX === MIN_POS_X && !state.isLost) {
        countLeft++;
        counterLeft.innerText = `${countLeft}`;
        state.isLost = true;
    } else if (state.posX === MAX_POS_X - BALL_DIAMETER && !state.isLost) {
        countRight++;
        counterRight.innerText = `${countRight}`;
        state.isLost = true;
    }
    
    // paddle
    if ((leftPaddleUpPressed && !leftPaddleDownPressed) || (!leftPaddleUpPressed && leftPaddleDownPressed)) {
        leftPaddleState.paddlePosition = Math.round(leftPaddleState.paddlePosition + leftPaddleState.paddleDirection * PADDLE_ONE_STEP);
    }
    leftPaddleState.paddlePosition = Math.max(MIN_POS_Y, leftPaddleState.paddlePosition);
    leftPaddleState.paddlePosition = Math.min(MAX_POS_PADDLE_Y, leftPaddleState.paddlePosition);

    if ((rightPaddleUpPressed && !rightPaddleDownPressed) || (!rightPaddleUpPressed && rightPaddleDownPressed)) {
        rightPaddleState.paddlePosition = Math.round(rightPaddleState.paddlePosition + rightPaddleState.paddleDirection * PADDLE_ONE_STEP);
    }
    rightPaddleState.paddlePosition = Math.max(MIN_POS_Y, rightPaddleState.paddlePosition);
    rightPaddleState.paddlePosition = Math.min(MAX_POS_PADDLE_Y, rightPaddleState.paddlePosition);

    // hitting the ball by left paddle
    const ballCenterY = state.posY + BALL_DIAMETER / 2;
    const ballCenterX = state.posX;
    if (ballCenterY >= leftPaddleState.paddlePosition 
        && ballCenterY <= leftPaddleState.paddlePosition + PADDLE_HEIGHT
        && ballCenterX <= PADDLE_WIDTH) {
            state.directionX = 1;
    }

    // hitting the ball by right paddle
    if (ballCenterY >= rightPaddleState.paddlePosition 
        && ballCenterY <= rightPaddleState.paddlePosition + PADDLE_HEIGHT
        && ballCenterX >= MAX_POS_X - BALL_DIAMETER - PADDLE_WIDTH) {
            state.directionX = -1;
    }
}

function toggleIsRunning() {
    state.isRun = !state.isRun;
}

function setPaddleUpDirection() {
    setPaddleDirection(-1);
}
function setPaddleDownDirection() {
    setPaddleDirection(1);
}
function setPaddleNoDirection() {
    setPaddleDirection(0);
}

function resetGame() {
    state.posX = START_POS_X;
    state.posY = START_POS_Y;
    state.isLost = false;
    setStartDirections();
    step();
}

// view
function updatePosition() {
    leftPaddle.style.top = `${leftPaddleState.paddlePosition}px`;
    rightPaddle.style.top = `${rightPaddleState.paddlePosition}px`;

    ball.style.left = `${state.posX}px`;
    ball.style.top = `${state.posY}px`;
}

function step() {
    move();
    updatePosition();
}

const field = document.getElementById('field');
const ball = document.getElementById('ball');

const leftPaddle = document.getElementById('leftPaddle');
const rightPaddle = document.getElementById('rightPaddle');

const buttonStart = document.getElementById('buttonStart');
const buttonRun = document.getElementById('buttonRun');

// controllers

buttonRun.addEventListener('click', () => {
    toggleIsRunning();
    buttonRun.classList.toggle('active');
})

let leftPaddleUpPressed = false;
let leftPaddleDownPressed = false;
let rightPaddleUpPressed = false;
let rightPaddleDownPressed = false;

document.addEventListener('keydown', (event) => {
    if(event.code === 'ShiftLeft') {
        leftPaddleUpPressed = true;
        setPaddleUpDirection();
    } else if(event.code === 'ControlLeft') {
        leftPaddleDownPressed = true;
        setPaddleDownDirection();
    } else if(event.code === 'ArrowUp') {
        rightPaddleUpPressed = true;
        setPaddleUpDirection();
    } else if(event.code === 'ArrowDown') {
        rightPaddleDownPressed = true;
        setPaddleDownDirection();
    }
})

document.addEventListener('keyup', (event) => {
    if(event.code === 'ArrowDown') {
        setPaddleNoDirection();
        rightPaddleDownPressed = false;
    } else if(event.code === 'ArrowUp') {
        setPaddleNoDirection();
        rightPaddleUpPressed = false;
    } else if(event.code === 'ShiftLeft') { 
        setPaddleNoDirection();
        leftPaddleUpPressed = false;
    } else if(event.code === 'ControlLeft') { 
        setPaddleNoDirection();
        leftPaddleDownPressed = false;
    }
})

let intervalId = NO_TIMER_VALUE;

buttonStart.addEventListener('click', () => {
    if(intervalId === NO_TIMER_VALUE) {
        setStartDirections();
        intervalId = setInterval(step, ONE_TICK);
        buttonStart.innerText = 'New Game';
    } else {
        clearInterval(intervalId);
        intervalId = NO_TIMER_VALUE;
        buttonStart.innerText = 'Start';
        resetGame();
    }
})