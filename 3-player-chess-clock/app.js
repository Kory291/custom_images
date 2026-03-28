// Chess Clock App
class ChessClock {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = null;
        this.isPaused = false;
        this.intervalId = null;
        this.wakeLock = null;
        
        this.initSetupScreen();
        this.bindEvents();
        this.requestWakeLock();
    }

    initSetupScreen() {
        const numPlayersInput = document.getElementById('numPlayers');
        const playersConfigDiv = document.getElementById('playersConfig');
        
        const colors = ['red', 'blue', 'green', 'orange', 'purple', 'yellow'];
        
        const generatePlayerConfigs = () => {
            const numPlayers = parseInt(numPlayersInput.value);
            playersConfigDiv.innerHTML = '';
            
            for (let i = 0; i < numPlayers; i++) {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'player-config';
                playerDiv.innerHTML = `
                    <h3>Player ${i + 1}</h3>
                    <div class="form-row full">
                        <div class="form-group">
                            <label>Name (optional):</label>
                            <input type="text" class="player-name-input" placeholder="Player ${i + 1}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Time (minutes):</label>
                            <input type="number" class="player-time-input" min="1" max="180" value="5">
                        </div>
                        <div class="form-group">
                            <label>Increment (seconds):</label>
                            <input type="number" class="player-increment-input" min="0" max="60" value="3">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Color:</label>
                            <select class="player-color-input">
                                ${colors.map((color, index) => 
                                    `<option value="${color}" ${index === i % colors.length ? 'selected' : ''}>${color.charAt(0).toUpperCase() + color.slice(1)}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                `;
                playersConfigDiv.appendChild(playerDiv);
            }
        };
        
        numPlayersInput.addEventListener('change', generatePlayerConfigs);
        generatePlayerConfigs();
    }

    bindEvents() {
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('pauseButton').addEventListener('click', () => this.pauseGame());
        document.getElementById('resumeButton').addEventListener('click', () => this.resumeGame());
        document.getElementById('resetButton').addEventListener('click', () => this.resetGame());
        document.getElementById('backToSetupButton').addEventListener('click', () => this.backToSetup());
    }

    startGame() {
        // Collect player configurations
        const playerConfigs = document.querySelectorAll('.player-config');
        this.players = Array.from(playerConfigs).map((config, index) => {
            const name = config.querySelector('.player-name-input').value || `Player ${index + 1}`;
            const minutes = parseInt(config.querySelector('.player-time-input').value);
            const increment = parseInt(config.querySelector('.player-increment-input').value);
            const color = config.querySelector('.player-color-input').value;
            
            return {
                name,
                timeRemaining: minutes * 60 * 1000, // Convert to milliseconds
                initialTime: minutes * 60 * 1000,
                increment: increment * 1000,
                color,
                finished: false
            };
        });
        
        this.currentPlayerIndex = null;
        this.isPaused = false;
        
        // Switch to game screen
        document.getElementById('setupScreen').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');
        
        // Render players
        this.renderGameScreen();
    }

    renderGameScreen() {
        const playersArea = document.getElementById('playersArea');
        playersArea.innerHTML = '';
        
        this.players.forEach((player, index) => {
            const button = document.createElement('button');
            button.className = `player-button player-${player.color}`;
            button.dataset.index = index;
            
            if (this.currentPlayerIndex === null) {
                button.classList.add('inactive');
            } else if (this.currentPlayerIndex === index) {
                button.classList.add('active');
            } else {
                button.classList.add('inactive');
            }
            
            if (player.finished) {
                button.classList.add('finished');
            }
            
            button.innerHTML = `
                <div class="player-name">${player.name}</div>
                <div class="player-time ${player.timeRemaining < 60000 ? 'time-warning' : ''}">${this.formatTime(player.timeRemaining)}</div>
                <div class="player-increment">+${player.increment / 1000}s increment</div>
            `;
            
            button.addEventListener('click', () => this.handlePlayerClick(index));
            playersArea.appendChild(button);
        });
    }

    handlePlayerClick(index) {
        if (this.isPaused || this.players[index].finished) return;
        
        // First click - start this player's timer
        if (this.currentPlayerIndex === null) {
            this.currentPlayerIndex = index;
            this.startTimer();
            this.renderGameScreen();
            return;
        }
        
        // Can only click the active player to switch
        if (this.currentPlayerIndex !== index) return;
        
        // Add increment to current player
        this.players[index].timeRemaining += this.players[index].increment;
        
        // Stop current timer
        this.stopTimer();
        
        // Move to next player
        this.currentPlayerIndex = this.getNextPlayerIndex();
        
        // Check if game is over
        if (this.currentPlayerIndex === -1) {
            this.endGame();
            return;
        }
        
        // Start next player's timer
        this.startTimer();
        this.renderGameScreen();
    }

    getNextPlayerIndex() {
        // Find next player who hasn't finished
        let nextIndex = (this.currentPlayerIndex + 1) % this.players.length;
        let attempts = 0;
        
        while (this.players[nextIndex].finished && attempts < this.players.length) {
            nextIndex = (nextIndex + 1) % this.players.length;
            attempts++;
        }
        
        return attempts === this.players.length ? -1 : nextIndex;
    }

    startTimer() {
        this.lastTick = Date.now();
        this.intervalId = setInterval(() => {
            if (this.isPaused) return;
            
            const now = Date.now();
            const elapsed = now - this.lastTick;
            this.lastTick = now;
            
            const player = this.players[this.currentPlayerIndex];
            player.timeRemaining -= elapsed;
            
            if (player.timeRemaining <= 0) {
                player.timeRemaining = 0;
                player.finished = true;
                this.stopTimer();
                
                // Check if only one player remains
                const activePlayers = this.players.filter(p => !p.finished);
                if (activePlayers.length <= 1) {
                    this.endGame();
                } else {
                    // Move to next player
                    this.currentPlayerIndex = this.getNextPlayerIndex();
                    if (this.currentPlayerIndex !== -1) {
                        this.startTimer();
                    }
                }
            }
            
            this.renderGameScreen();
        }, 100); // Update every 100ms for smooth display
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    pauseGame() {
        if (this.currentPlayerIndex === null) return;
        
        this.isPaused = true;
        document.getElementById('pauseModal').classList.add('active');
    }

    resumeGame() {
        this.isPaused = false;
        this.lastTick = Date.now(); // Reset last tick to avoid time jump
        document.getElementById('pauseModal').classList.remove('active');
    }

    resetGame() {
        if (confirm('Are you sure you want to reset the game?')) {
            this.stopTimer();
            this.players.forEach(player => {
                player.timeRemaining = player.initialTime;
                player.finished = false;
            });
            this.currentPlayerIndex = null;
            this.isPaused = false;
            document.getElementById('pauseModal').classList.remove('active');
            this.renderGameScreen();
        }
    }

    endGame() {
        this.stopTimer();
        const winners = this.players.filter(p => !p.finished);
        
        let message = 'Game Over!\n\n';
        if (winners.length === 1) {
            message += `Winner: ${winners[0].name}! 🎉`;
        } else if (winners.length > 1) {
            message += `Winners:\n${winners.map(w => w.name).join('\n')}`;
        } else {
            message += 'No winners - all players ran out of time!';
        }
        
        alert(message);
        this.pauseGame();
    }

    backToSetup() {
        this.stopTimer();
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('setupScreen').classList.add('active');
        document.getElementById('pauseModal').classList.remove('active');
        this.players = [];
        this.currentPlayerIndex = null;
        this.isPaused = false;
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.ceil(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }

    async requestWakeLock() {
        try {
            if ('wakeLock' in navigator) {
                this.wakeLock = await navigator.wakeLock.request('screen');
                console.log('Wake Lock activated');
                
                // Re-acquire wake lock when visibility changes
                document.addEventListener('visibilitychange', async () => {
                    if (this.wakeLock !== null && document.visibilityState === 'visible') {
                        this.wakeLock = await navigator.wakeLock.request('screen');
                    }
                });
            }
        } catch (err) {
            console.log('Wake Lock not supported or denied:', err);
        }
    }
}

// Initialize app
const app = new ChessClock();

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}
