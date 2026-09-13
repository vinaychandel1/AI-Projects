# Tic-Tac-Toe Web Game

A modern, responsive two-player Tic-Tac-Toe game built with vanilla HTML, CSS, and JavaScript.

## Features

✨ **Core Gameplay**
- Two-player mode (X vs O)
- Turn indicator showing whose turn it is
- Win detection (horizontal, vertical, diagonal)
- Draw detection
- Prevent moves on occupied cells

🎮 **User Experience**
- Clean, modern responsive UI
- Beautiful gradient background
- Smooth animations and transitions
- Score tracking with persistent storage
- Restart button to play again
- Visual feedback on hover and click

📊 **Scoreboard**
- Tracks wins for Player X
- Tracks wins for Player O
- Tracks number of draws
- Scores persist in browser localStorage

## Files

- `index.html` - Game structure and layout
- `style.css` - Responsive styling and animations
- `script.js` - Game logic and interactivity
- `test.js` - Comprehensive test suite

## How to Play

1. Open `index.html` in a web browser
2. Player X goes first
3. Click on an empty cell to make your move
4. The game detects wins and draws automatically
5. Click "Restart Game" to play again
6. Scores are saved automatically

## Game Rules

- Players alternate between X and O
- First player to get three in a row (horizontally, vertically, or diagonally) wins
- If all 9 cells are filled with no winner, it's a draw
- You cannot place a mark on an already occupied cell

## Technical Details

- **No external dependencies** - Pure vanilla JavaScript
- **Responsive design** - Works on desktop, tablet, and mobile
- **localStorage** - Scores persist between sessions
- **Well-organized code** - Single TicTacToe class handles all logic

## Testing

Run the test suite:
```bash
node test.js
```

The test suite validates:
- Board initialization
- Win detection (horizontal, vertical, diagonal, anti-diagonal)
- Draw detection
- Player switching
- Game restart functionality

All 10 tests pass ✅

## Browser Support

Works on all modern browsers that support:
- ES6 JavaScript classes
- CSS Grid
- CSS Flexbox
- localStorage API

## How to Run Locally

### Option 1: Direct File Access
Simply open `index.html` in your browser (file:// protocol works fine for this game)

### Option 2: Using a Local Server
If you have Node.js installed:
```bash
npx http-server -p 8000
```
Then visit: `http://localhost:8000`

Or with Python 3:
```bash
python -m http.server 8000
```

## Customization

### Change Colors
Edit the gradient colors in `style.css`:
- Primary gradient: `#667eea` and `#764ba2`
- Player X color: `#667eea`
- Player O color: `#764ba2`

### Adjust Game Board Size
The CSS Grid layout uses `grid-template-columns: repeat(3, 1fr)` - modify as needed

### Add AI Opponent
The game structure makes it easy to add an AI opponent by implementing a minimax algorithm in the `script.js` file

## License

Free to use and modify
