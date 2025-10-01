const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
require('dotenv').config();

// Your bot token
const BOT_TOKEN = process.env.BOT_TOKEN || '8426766291:AAExX-8L9loJv96TAJQaCZMGf-stcP8_CkI';
const GAME_URL = process.env.GAME_URL || 'https://your-domain.com'; // Replace with your HTTPS URL

// Create bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Create Express app to serve the game
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (your game)
app.use(express.static(path.join(__dirname)));

// Bot commands with Web App buttons (for HTTPS deployment)
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Player';
    
    const welcomeMessage = `🌟 Welcome to Star Clicker, ${firstName}!

🎮 Tap the star to earn stars
⚡ Manage your energy wisely
🚀 Buy upgrades to earn more
💫 Become the ultimate star collector!

Click the button below to start playing:`;

    const options = {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: '🌟 Play Star Clicker',
                    web_app: { url: GAME_URL }
                }
            ]]
        }
    };

    bot.sendMessage(chatId, welcomeMessage, options);
});

bot.onText(/\/game/, (msg) => {
    const chatId = msg.chat.id;
    
    const options = {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: '🌟 Open Star Clicker',
                    web_app: { url: GAME_URL }
                }
            ]]
        }
    };

    bot.sendMessage(chatId, '🎮 Click to open Star Clicker game:', options);
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    const helpMessage = `🌟 Star Clicker Help

🎯 How to play:
• Tap the star to earn stars
• Each tap consumes 1 energy
• Energy regenerates over time
• Buy upgrades to earn more stars per tap

🚀 Upgrades:
• Rocket Boost - +1 star per click
• Star Power - +2 stars per click
• Cosmic Energy - +500 max energy
• Galaxy Multiplier - +5 stars per click

💡 Tips:
• Your progress is saved automatically
• Energy regenerates even when you're offline
• Upgrade costs increase with each purchase

Commands:
/start - Start the game
/game - Open game
/help - Show this help`;

    bot.sendMessage(chatId, helpMessage);
});

// Handle errors
bot.on('error', (error) => {
    console.error('Bot error:', error);
});

// Start Express server
app.listen(PORT, () => {
    console.log(`🌟 Star Clicker server running on port ${PORT}`);
    console.log(`🤖 Bot is active with token: ${BOT_TOKEN.substring(0, 10)}...`);
    console.log(`📱 Game available at: ${GAME_URL}`);
});

// Export for potential use
module.exports = { bot, app };