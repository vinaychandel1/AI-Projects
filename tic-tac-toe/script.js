class TicTacToe {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0,
            draw: 0
        };

        // Winning combinations (indices)
        this.winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        this.initializeGame();
        this.loadScores();
    }

    initializeGame() {
        this.cells = document.querySelectorAll('.cell');
        this.statusText = document.getElementById('statusText');
        this.restartBtn = document.getElementById('restartBtn');
        this.scoreXDisplay = document.getElementById('scoreX');
        this.scoreODisplay = document.getElementById('scoreO');
        this.scoreDrawDisplay = document.getElementById('scoreDraw');

        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.updateStatus();
    }

    handleCellClick(event) {
        const cell = event.target;
        const index = cell.getAttribute('data-index');

        // Prevent move if cell is occupied or game is not active
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }

        // Update board and UI
        this.board[index] = this.currentPlayer;
        cell.textContent = this.currentPlayer;
        cell.setAttribute('data-player', this.currentPlayer);
        cell.disabled = true;

        // Check for win or draw
        if (this.checkWin()) {
            this.endGame(`🎉 Player ${this.currentPlayer} Wins!`);
            this.scores[this.currentPlayer]++;
            this.updateScoreDisplay();
            return;
        }

        if (this.checkDraw()) {
            this.endGame("🤝 It's a Draw!");
            this.scores.draw++;
            this.updateScoreDisplay();
            return;
        }

        // Switch player
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    checkWin() {
        for (let combination of this.winningCombinations) {
            const [a, b, c] = combination;
            if (
                this.board[a] !== '' &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]
            ) {
                return true;
            }
        }
        return false;
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    endGame(message) {
        this.gameActive = false;
        this.statusText.textContent = message;
        this.saveScores();
    }

    updateStatus() {
        this.statusText.textContent = `Player ${this.currentPlayer}'s Turn`;
    }

    restartGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;

        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.removeAttribute('data-player');
            cell.disabled = false;
        });

        this.updateStatus();
    }

    updateScoreDisplay() {
        this.scoreXDisplay.textContent = this.scores.X;
        this.scoreODisplay.textContent = this.scores.O;
        this.scoreDrawDisplay.textContent = this.scores.draw;
    }

    saveScores() {
        localStorage.setItem('ticTacToeScores', JSON.stringify(this.scores));
    }

    loadScores() {
        const saved = localStorage.getItem('ticTacToeScores');
        if (saved) {
            this.scores = JSON.parse(saved);
            this.updateScoreDisplay();
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
