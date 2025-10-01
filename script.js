// Game state
class StarClickerGame {
    constructor() {
        this.score = 0;
        this.energy = 1000;
        this.maxEnergy = 1000;
        this.starsPerClick = 1;
        this.energyRegenRate = 1; // Energy per second
        this.lastUpdate = Date.now();
        
        // Upgrade levels and costs
        this.upgrades = {
            rocketBoost: { level: 0, baseCost: 10, multiplier: 1.5, starsBonus: 1 },
            starPower: { level: 0, baseCost: 50, multiplier: 2, starsBonus: 2 },
            cosmicEnergy: { level: 0, baseCost: 100, multiplier: 2.5, energyBonus: 500 },
            galaxyMultiplier: { level: 0, baseCost: 500, multiplier: 3, starsBonus: 5 }
        };
        
        this.initializeGame();
        this.bindEvents();
        this.startGameLoop();
    }
    
    initializeGame() {
        // Load saved game state
        this.loadGameState();
        
        // Initialize Telegram Web App
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();
            tg.MainButton.hide();
            
            // Set theme colors
            document.body.style.backgroundColor = tg.themeParams.bg_color || '#0f0f23';
        }
        
        // Update UI
        this.updateUI();
    }
    
    bindEvents() {
        // Main star click
        const mainStar = document.getElementById('mainStar');
        mainStar.addEventListener('click', (e) => this.handleStarClick(e));
        mainStar.addEventListener('touchstart', (e) => this.handleStarClick(e));
        
        // Upgrade buttons
        document.getElementById('upgrade1').addEventListener('click', () => this.buyUpgrade('rocketBoost'));
        document.getElementById('upgrade2').addEventListener('click', () => this.buyUpgrade('starPower'));
        document.getElementById('upgrade3').addEventListener('click', () => this.buyUpgrade('cosmicEnergy'));
        document.getElementById('upgrade4').addEventListener('click', () => this.buyUpgrade('galaxyMultiplier'));
        
        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Save game periodically
        setInterval(() => this.saveGameState(), 5000);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => this.saveGameState());
    }
    
    handleStarClick(event) {
        event.preventDefault();
        
        // Check if player has enough energy
        if (this.energy < 1) {
            this.showNotification('Not enough energy!', 'error');
            return;
        }
        
        // Consume energy
        this.energy = Math.max(0, this.energy - 1);
        
        // Add stars
        this.score += this.starsPerClick;
        
        // Visual effects
        this.showClickEffect(event);
        this.animateMainStar();
        this.showClickCounter();
        
        // Haptic feedback (if supported)
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        
        this.updateUI();
    }
    
    showClickEffect(event) {
        const clickEffects = document.getElementById('clickEffects');
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.textContent = `+${this.starsPerClick}`;
        
        // Position based on click/touch location
        const rect = event.target.getBoundingClientRect();
        let x, y;
        
        if (event.touches && event.touches[0]) {
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        } else {
            x = event.clientX || rect.left + rect.width / 2;
            y = event.clientY || rect.top + rect.height / 2;
        }
        
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        
        clickEffects.appendChild(effect);
        
        // Remove effect after animation
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
    }
    
    animateMainStar() {
        const mainStar = document.getElementById('mainStar');
        mainStar.style.transform = 'scale(0.95)';
        setTimeout(() => {
            mainStar.style.transform = 'scale(1)';
        }, 100);
    }
    
    showClickCounter() {
        const counter = document.getElementById('clickCounter');
        counter.textContent = `+${this.starsPerClick}`;
        counter.classList.remove('show');
        // Force reflow
        counter.offsetHeight;
        counter.classList.add('show');
    }
    
    buyUpgrade(upgradeType) {
        const upgrade = this.upgrades[upgradeType];
        const cost = this.getUpgradeCost(upgradeType);
        
        if (this.score < cost) {
            this.showNotification('Not enough stars!', 'error');
            return;
        }
        
        // Deduct cost and upgrade
        this.score -= cost;
        upgrade.level++;
        
        // Apply upgrade effects
        switch (upgradeType) {
            case 'rocketBoost':
            case 'starPower':
            case 'galaxyMultiplier':
                this.updateStarsPerClick();
                break;
            case 'cosmicEnergy':
                this.maxEnergy += upgrade.energyBonus;
                this.energy = Math.min(this.energy + upgrade.energyBonus, this.maxEnergy);
                break;
        }
        
        // Haptic feedback
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
        
        this.showNotification(`${this.getUpgradeName(upgradeType)} upgraded!`, 'success');
        this.updateUI();
    }
    
    getUpgradeCost(upgradeType) {
        const upgrade = this.upgrades[upgradeType];
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, upgrade.level));
    }
    
    getUpgradeName(upgradeType) {
        const names = {
            rocketBoost: 'Rocket Boost',
            starPower: 'Star Power',
            cosmicEnergy: 'Cosmic Energy',
            galaxyMultiplier: 'Galaxy Multiplier'
        };
        return names[upgradeType];
    }
    
    updateStarsPerClick() {
        this.starsPerClick = 1 + 
            (this.upgrades.rocketBoost.level * this.upgrades.rocketBoost.starsBonus) +
            (this.upgrades.starPower.level * this.upgrades.starPower.starsBonus) +
            (this.upgrades.galaxyMultiplier.level * this.upgrades.galaxyMultiplier.starsBonus);
    }
    
    updateUI() {
        // Update score and energy
        document.getElementById('currentScore').textContent = this.formatNumber(this.score);
        document.getElementById('currentEnergy').textContent = this.energy;
        document.getElementById('maxEnergy').textContent = this.maxEnergy;
        document.getElementById('starsPerClick').textContent = this.starsPerClick;
        
        // Update upgrade costs and levels
        this.updateUpgradeCard('upgrade1', 'rocketBoost');
        this.updateUpgradeCard('upgrade2', 'starPower');
        this.updateUpgradeCard('upgrade3', 'cosmicEnergy');
        this.updateUpgradeCard('upgrade4', 'galaxyMultiplier');
        
        // Update energy bar
        this.updateEnergyBar();
    }
    
    updateUpgradeCard(cardId, upgradeType) {
        const cost = this.getUpgradeCost(upgradeType);
        const level = this.upgrades[upgradeType].level;
        
        document.getElementById(`${cardId}Cost`).textContent = this.formatNumber(cost);
        document.getElementById(`${cardId}Level`).textContent = level;
        
        const card = document.getElementById(cardId);
        if (this.score >= cost) {
            card.classList.remove('disabled');
        } else {
            card.classList.add('disabled');
        }
    }
    
    updateEnergyBar() {
        const energyContainer = document.querySelector('.energy-container');
        const percentage = (this.energy / this.maxEnergy) * 100;
        energyContainer.style.setProperty('--energy-width', `${percentage}%`);
    }
    
    startGameLoop() {
        const gameLoop = () => {
            const now = Date.now();
            const deltaTime = (now - this.lastUpdate) / 1000; // Convert to seconds
            this.lastUpdate = now;
            
            // Regenerate energy
            if (this.energy < this.maxEnergy) {
                this.energy = Math.min(this.maxEnergy, this.energy + (this.energyRegenRate * deltaTime));
                this.updateUI();
            }
            
            requestAnimationFrame(gameLoop);
        };
        
        requestAnimationFrame(gameLoop);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#4444ff'};
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 10000;
            font-size: 14px;
            animation: notificationSlide 3s ease-out forwards;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    saveGameState() {
        const gameState = {
            score: this.score,
            energy: this.energy,
            maxEnergy: this.maxEnergy,
            starsPerClick: this.starsPerClick,
            upgrades: this.upgrades,
            lastSave: Date.now()
        };
        
        localStorage.setItem('starClickerGame', JSON.stringify(gameState));
    }
    
    loadGameState() {
        try {
            const savedState = localStorage.getItem('starClickerGame');
            if (savedState) {
                const gameState = JSON.parse(savedState);
                
                // Calculate offline progress
                const offlineTime = (Date.now() - (gameState.lastSave || Date.now())) / 1000;
                const offlineEnergy = Math.min(gameState.maxEnergy, gameState.energy + (this.energyRegenRate * offlineTime));
                
                this.score = gameState.score || 0;
                this.energy = Math.floor(offlineEnergy);
                this.maxEnergy = gameState.maxEnergy || 1000;
                this.starsPerClick = gameState.starsPerClick || 1;
                this.upgrades = { ...this.upgrades, ...gameState.upgrades };
                
                // Show offline progress if significant
                if (offlineTime > 60) {
                    const offlineEnergyGained = Math.floor(offlineEnergy - gameState.energy);
                    if (offlineEnergyGained > 0) {
                        setTimeout(() => {
                            this.showNotification(`Welcome back! +${offlineEnergyGained} energy`, 'success');
                        }, 1000);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load game state:', error);
        }
    }
}

// Add notification animation CSS
const notificationCSS = `
@keyframes notificationSlide {
    0% {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
    }
    10%, 90% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
    100% {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
    }
}
`;

const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new StarClickerGame();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        window.game?.saveGameState();
    }
});