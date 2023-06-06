class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.element = this.createHTMLElement();
        this.isLit = false;
        this.isClicked = false;
    }

    createHTMLElement() {
        const td = document.createElement('td');
        td.addEventListener('click', () => this.handleClick());
        return td;
    }

    handleClick() {
        if (this.isLit && !this.isClicked) {
            this.isClicked = true;
            this.element.style.backgroundImage = '';
            this.element.style.backgroundColor = 'green';
            game.updateScore(true);
        }
    }

    lightUp() {
        this.isLit = true;
        this.isClicked = false;
        this.element.style.backgroundImage = "url('mole.png')";
        setTimeout(() => this.turnOff(), game.level.delay);
    }

    turnOff() {
        this.isLit = false;
        if (!this.isClicked) {
            this.element.style.backgroundImage = '';
            this.element.style.backgroundColor = 'red';
            game.updateScore(false);
        }
    }

    isEmpty() {
        return this.element.style.backgroundColor === '';
    }

    reset() {
        this.isLit = false;
        this.isClicked = false;
        this.element.style.backgroundImage = '';
        this.element.style.backgroundColor = '';
    }
}

class Game {
    constructor(level) {
        this.level = level;
        this.boardSize = 10;
        this.cells = [];
        this.playerScore = 0;
        this.computerScore = 0;
        this.gameOver = false;
        this.intervalId = null;
        this.generateBoard();
    }

    generateBoard() {
        const gameBoard = document.getElementById('game-board');

        for (let i = 0; i < this.boardSize; i++) {
            const row = document.createElement('tr');
            const cellRow = [];

            for (let j = 0; j < this.boardSize; j++) {
                const cell = new Cell(i, j);
                row.appendChild(cell.element);
                cellRow.push(cell);
            }

            gameBoard.appendChild(row);
            this.cells.push(cellRow);
        }
    }

    updateScore(isPlayer) {
        if (isPlayer) {
            this.playerScore++;
            document.getElementById('player-score').textContent = `Player: ${this.playerScore}`;
        } else {
            this.computerScore++;
            document.getElementById('computer-score').textContent = `Computer: ${this.computerScore}`;
        }

        if (this.isGameOver()) {
            this.endGame();
        }
    }

    isGameOver() {
        const totalCells = this.boardSize * this.boardSize;
        return this.playerScore + this.computerScore >= totalCells / 2;
    }

    endGame() {
        this.gameOver = true;
        clearInterval(this.intervalId);
        const message = document.getElementById('message');
        const resultMessage =
            this.playerScore > this.computerScore ? 'Player wins!' :
                this.playerScore < this.computerScore ? 'Computer wins!' :
                    'It\'s a tie!';
        message.textContent = `Game Over. ${resultMessage}`;
        document.getElementById('start-btn').disabled = false;
    }

    startGame() {
        this.resetGame();
        this.playerScore = 0;
        this.computerScore = 0;
        this.gameOver = false;
        document.getElementById('player-score').textContent = 'Player: 0';
        document.getElementById('computer-score').textContent = 'Computer: 0';
        document.getElementById('message').textContent = '';
        document.getElementById('start-btn').disabled = true;
        this.intervalId = setInterval(() => this.lightUpRandomCell(), this.level.interval);
    }

    resetGame() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = this.cells[row][col];
                cell.reset();
            }
        }
        this.score = 0;
    }

    lightUpRandomCell() {
        const unlitEmptyCells = [];

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = this.cells[row][col];

                if (!cell.isLit && !cell.isClicked && cell.isEmpty()) {
                    unlitEmptyCells.push(cell);
                }
            }
        }

        if (unlitEmptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * unlitEmptyCells.length);
            const cell = unlitEmptyCells[randomIndex];
            cell.lightUp();
        }
    }
}

const difficultyLevel = {
    easy: { interval: 1500, delay: 1000 },
    medium: { interval: 1000, delay: 1000 },
    hard: { interval: 500, delay: 500 },
};

const startButton = document.getElementById('start-btn');
const levelSelect = document.getElementById('level');
const game = new Game(difficultyLevel[levelSelect.value]);

startButton.addEventListener('click', () => {
    game.startGame();
});

levelSelect.addEventListener('change', () => {
    game.level = difficultyLevel[levelSelect.value];
});