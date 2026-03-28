# ♟️ Multi-Player Chess Clock

A Progressive Web App (PWA) chess clock that supports 2-6 players on a single device.

## Features

✅ **Multi-player support** - 2 to 6 players  
✅ **Customizable settings** - Time, increment, colors, and names for each player  
✅ **Touch-friendly interface** - Optimized for phones and tablets  
✅ **Screen wake lock** - Keeps display on during games  
✅ **Offline capable** - Works without internet once loaded  
✅ **Installable** - Add to home screen as a native-like app  
✅ **Responsive design** - Adapts to portrait and landscape modes  

## How to Use

### Setup
1. Choose the number of players (2-6)
2. For each player, configure:
   - Name (optional)
   - Time in minutes
   - Increment in seconds
   - Color theme
3. Click **Start Game**

### During Game
- Tap a player's area to start their timer (first tap of the game)
- Active player taps their area when done to:
  - Add their increment
  - Switch to the next player
- Use **Pause** to stop all timers temporarily
- Use **Reset** to restart the game with current settings
- Players run out of time are marked as finished

### Game End
- Game ends when only one player has time remaining
- Winner is announced

## Running Locally

### Option 1: Simple HTTP Server (Python)
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000

### Option 2: Node.js HTTP Server
```bash
npx http-server -p 8000
```
Then open http://localhost:8000

### Option 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Installing as PWA

### Android
1. Open the app in Chrome
2. Tap the menu (⋮) → "Add to Home screen"
3. The app will appear on your home screen like a native app

### iOS
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

## Deployment

Deploy to any static hosting service:

- **GitHub Pages**: Push to repo, enable Pages
- **Netlify**: Drag and drop the folder
- **Vercel**: Import from GitHub
- **Firebase Hosting**: `firebase deploy`

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and animations
- `app.js` - Chess clock logic
- `manifest.json` - PWA configuration
- `service-worker.js` - Offline functionality

## Browser Compatibility

- Chrome/Edge (Android/Desktop) ✅
- Safari (iOS/macOS) ✅
- Firefox ✅

## License

MIT - Free to use and modify
