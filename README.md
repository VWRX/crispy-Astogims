# Star Clicker - Telegram Mini App

A simple Tap2Earn clicker game for Telegram Mini Apps, similar to Notcoin but with Stars instead of coins.

## Features

- ⭐ **Star Clicking**: Tap the main star to earn stars
- ⚡ **Energy System**: Each click consumes energy that regenerates over time
- 🚀 **Upgrades**: Four different upgrade types to boost your earning power
- 💾 **Persistent Progress**: Game state is saved locally and restored on reload
- 📱 **Telegram Integration**: Full Telegram Web App SDK support
- 🎨 **Beautiful UI**: Star-themed design with smooth animations
- 🔄 **Offline Progress**: Energy regenerates even when the app is closed

## Upgrades

1. **🚀 Rocket Boost** - +1 star per click
2. **🌟 Star Power** - +2 stars per click  
3. **💫 Cosmic Energy** - +500 max energy
4. **🌌 Galaxy Multiplier** - +5 stars per click

## Quick Start with Your Bot

**Your Bot Token is already configured!** 
Token: `8426766291:AAExX-8L9loJv96TAJQaCZMGf-stcP8_CkI`

### Option 1: Auto Setup (Windows)
```bash
setup.bat
```

### Option 2: Manual Setup
1. Install dependencies:
```bash
npm install
```

2. Start the bot:
```bash
npm start
```

3. Your bot will be running at `http://localhost:3000`

4. Test your bot by messaging it on Telegram: [Find your bot here](https://t.me/YourBotUsername)

### Bot Commands
- `/start` - Welcome message with game button
- `/game` - Direct access to the game
- `/help` - Show help information

## Installation & Setup

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and go to `http://localhost:3000`

### Telegram Bot Setup

1. Create a new bot with [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Set up a web app with your bot:
   - Send `/newapp` to BotFather
   - Choose your bot
   - Enter app name and description
   - Upload app icon (512x512 PNG)
   - Enter your web app URL (where you host this game)
   - Enter short description

### Hosting Options

#### Option 1: Netlify (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Deploy automatically
4. Use the provided URL for your Telegram bot

#### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts
4. Use the provided URL for your Telegram bot

#### Option 3: GitHub Pages
1. Push your code to a GitHub repository
2. Go to Settings > Pages
3. Select source branch (usually `main`)
4. Use the provided GitHub Pages URL

### Telegram Bot Commands

Add these commands to your bot via BotFather:

```
start - Start playing Star Clicker
game - Open the game
help - Show help information
```

### File Structure

```
ClickerTG/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── script.js           # Game logic and functionality
├── bot.js              # Telegram bot server (NEW!)
├── package.json        # Project configuration
├── .env                # Bot configuration (your token)
├── .env.example        # Environment template
├── setup.bat           # Windows auto-setup script
└── README.md          # This file
```

## Game Mechanics

- **Starting Stats**: 1000 energy, 1 star per click
- **Energy**: Regenerates at 1 energy per second
- **Upgrades**: Cost increases with each purchase using exponential scaling
- **Offline Progress**: Energy continues to regenerate when app is closed
- **Save System**: Game automatically saves every 5 seconds and on page unload

## Development

### Adding New Upgrades

1. Add upgrade data to the `upgrades` object in the `StarClickerGame` constructor
2. Add HTML elements for the upgrade in `index.html`
3. Add event listeners in the `bindEvents()` method
4. Update the `buyUpgrade()` method to handle the new upgrade type

### Customizing Theme

Modify the CSS variables in `styles.css`:

```css
:root {
  --primary-color: #ffd700;
  --secondary-color: #00ff88;
  --background-gradient: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d2d5f 100%);
}
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Telegram in-app browser
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## Performance Tips

- Game uses `requestAnimationFrame` for smooth animations
- Local storage for persistent data (no server required)
- Optimized click handling with event delegation
- CSS transforms for hardware-accelerated animations

## Security

- No sensitive data stored
- Client-side only (no server communication required)
- Uses Telegram's secure environment when running as Mini App

## Troubleshooting

### Game doesn't load in Telegram
- Ensure your hosting URL is HTTPS
- Check that the URL is correctly set in BotFather
- Verify the bot token is correct

### Progress not saving
- Check browser's local storage permissions
- Ensure the domain has storage access
- Try clearing browser cache and restarting

### Performance issues
- Close other apps to free up memory
- Ensure stable internet connection
- Try refreshing the page

## License

MIT License - feel free to modify and distribute!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Enjoy playing Star Clicker! ⭐✨