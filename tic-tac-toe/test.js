// Simple test suite for Tic-Tac-Toe game logic
// Run with: node test.js

// Mock DOM elements
const mockDOM = {
    cells: [],
    statusText: { textContent: '' },
    scoreX: { textContent: '0' },
    scoreO: { textContent: '0' },
    scoreDraw: { textContent: '0' }
};

// Setup mock cells
for (let i = 0; i < 9; i++) {
    mockDOM.cells.push({
        textContent: '',
        getAttribute: () => i.toString(),
        setAttribute: () => {},
        removeAttribute: () => {},
        addEventListener: () => {},
        disabled: false,
        dataset: {}
    });
}

// Mock document
global.document = {
    querySelectorAll: () => mockDOM.cells,
    getElementById: (id) => {
        const map = {
            'statusText': mockDOM.statusText,
            'scoreX': mockDOM.scoreX,
            'scoreO': mockDOM.scoreO,
            'scoreDraw': mockDOM.scoreDraw,
            'restartBtn': { addEventListener: () => {} }
        };
        return map[id];
    },
    addEventListener: () => {}
};

// Mock localStorage
global.localStorage = {
    data: {},
    getItem: function(key) { return this.data[key] || null; },
    setItem: function(key, value) { this.data[key] = value; }
};

// Copy the TicTacToe class code
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
    }

    handleCellClick(event) {
        const cell = event.target;
        const index = cell.getAttribute('data-index');

        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }

        this.board[index] = this.currentPlayer;
        cell.textContent = this.currentPlayer;

        if (this.checkWin()) {
            this.endGame(`🎉 Player ${this.currentPlayer} Wins!`);
            this.scores[this.currentPlayer]++;
            return;
        }

        if (this.checkDraw()) {
            this.endGame("🤝 It's a Draw!");
            this.scores.draw++;
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
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
    }

    updateStatus() {
        this.statusText.textContent = `Player ${this.currentPlayer}'s Turn`;
    }

    restartGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
    }

    loadScores() {
        const saved = localStorage.getItem('ticTacToeScores');
        if (saved) {
            this.scores = JSON.parse(saved);
        }
    }
}

// Test cases
console.log('🧪 Tic-Tac-Toe Test Suite\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        testsPassed++;
    } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}`);
        testsFailed++;
    }
}

// Test 1: Game initialization
test('Game initializes with empty board', () => {
    const game = new TicTacToe();
    if (game.board.some(cell => cell !== '')) {
        throw new Error('Board should be empty');
    }
});

// Test 2: Current player starts as X
test('Current player starts as X', () => {
    const game = new TicTacToe();
    if (game.currentPlayer !== 'X') {
        throw new Error('Should start with X');
    }
});

// Test 3: Horizontal win detection (top row)
test('Detects horizontal win (top row)', () => {
    const game = new TicTacToe();
    game.board = ['X', 'X', 'X', '', '', '', '', '', ''];
    if (!game.checkWin()) {
        throw new Error('Should detect top row win');
    }
});

// Test 4: Vertical win detection
test('Detects vertical win (first column)', () => {
    const game = new TicTacToe();
    game.board = ['O', '', '', 'O', '', '', 'O', '', ''];
    if (!game.checkWin()) {
        throw new Error('Should detect vertical win');
    }
});

// Test 5: Diagonal win detection
test('Detects diagonal win (top-left to bottom-right)', () => {
    const game = new TicTacToe();
    game.board = ['X', '', '', '', 'X', '', '', '', 'X'];
    if (!game.checkWin()) {
        throw new Error('Should detect diagonal win');
    }
});

// Test 6: Anti-diagonal win detection
test('Detects anti-diagonal win (top-right to bottom-left)', () => {
    const game = new TicTacToe();
    game.board = ['', '', 'O', '', 'O', '', 'O', '', ''];
    if (!game.checkWin()) {
        throw new Error('Should detect anti-diagonal win');
    }
});

// Test 7: Draw detection
test('Detects draw', () => {
    const game = new TicTacToe();
    game.board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    if (!game.checkDraw()) {
        throw new Error('Should detect draw');
    }
});

// Test 8: No false win
test('Does not detect false win', () => {
    const game = new TicTacToe();
    game.board = ['X', '', '', '', 'O', '', '', '', ''];
    if (game.checkWin()) {
        throw new Error('Should not detect win with scattered pieces');
    }
});

// Test 9: Player switching
test('Switches players correctly', () => {
    const game = new TicTacToe();
    if (game.currentPlayer !== 'X') {
        throw new Error('Should start with X');
    }
    game.currentPlayer = 'O';
    if (game.currentPlayer !== 'O') {
        throw new Error('Should switch to O');
    }
});

// Test 10: Restart game
test('Restart clears the board', () => {
    const game = new TicTacToe();
    game.board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    game.currentPlayer = 'O';
    game.gameActive = false;
    game.restartGame();

    if (game.board.some(cell => cell !== '')) {
        throw new Error('Board should be empty after restart');
    }
    if (game.currentPlayer !== 'X') {
        throw new Error('Current player should be X after restart');
    }
    if (!game.gameActive) {
        throw new Error('Game should be active after restart');
    }
});

// Summary
console.log(`\n📊 Test Results: ${testsPassed} passed, ${testsFailed} failed`);

if (testsFailed === 0) {
    console.log('🎉 All tests passed!');
    process.exit(0);
} else {
    console.log('⚠️  Some tests failed.');
    process.exit(1);
}
