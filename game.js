class TrashTycoon {
    constructor() {
        this.money = 0;
        this.ecoPoints = 0;
        this.trashItems = {
            plastic: 0,
            paper: 0,
            metal: 0
        };
        
        this.prices = {
            plastic: 1,
            paper: 2,
            metal: 5
        };

        // Add upgrades configuration
        this.upgrades = {
            autoCollector: {
                level: 0,
                baseCost: 50,
                effect: () => {
                    this.startAutoCollection();
                }
            },
            betterPrices: {
                level: 0,
                baseCost: 100,
                effect: () => {
                    this.updatePrices();
                }
            },
            largerStorage: {
                level: 0,
                baseCost: 75,
                effect: () => {
                    this.updateCollectionAmount();
                }
            }
        };

        this.baseCollectionAmount = 1;
        this.autoCollectorInterval = null;

        // Add SDG tracking
        this.sdgProgress = {
            sdg11: 0, // Sustainable Cities
            sdg12: 0, // Responsible Consumption
            sdg13: 0  // Climate Action
        };

        // Add SDG quests and progress tracking
        this.sdgQuests = {
            sdg11: [
                {
                    id: 'cleanCity',
                    title: 'Clean City Initiative',
                    description: 'Clean up 100 pieces of trash',
                    target: 100,
                    progress: 0,
                    reward: 500,
                    completed: false
                },
                {
                    id: 'recyclingCenter',
                    title: 'Build Recycling Centers',
                    description: 'Sell 50 pieces of each material type',
                    target: 50,
                    progress: { plastic: 0, paper: 0, metal: 0 },
                    reward: 1000,
                    completed: false
                }
            ],
            sdg12: [
                {
                    id: 'efficientSorting',
                    title: 'Efficient Waste Management',
                    description: 'Upgrade Auto Collector to level 3',
                    target: 3,
                    progress: 0,
                    reward: 750,
                    completed: false
                },
                {
                    id: 'wasteReduction',
                    title: 'Waste Reduction Program',
                    description: 'Process 200 total items',
                    target: 200,
                    progress: 0,
                    reward: 1500,
                    completed: false
                }
            ],
            sdg13: [
                {
                    id: 'greenTech',
                    title: 'Green Technology Pioneer',
                    description: 'Purchase all upgrades at least once',
                    progress: { autoCollector: false, betterPrices: false, largerStorage: false },
                    reward: 2000,
                    completed: false
                },
                {
                    id: 'carbonReduction',
                    title: 'Carbon Footprint Reduction',
                    description: 'Earn 1000 eco points',
                    target: 1000,
                    progress: 0,
                    reward: 3000,
                    completed: false
                }
            ]
        };

        // Add non-recyclable types
        this.trashTypes = {
            plastic: { emoji: '🥤', recyclable: true },
            paper: { emoji: '📰', recyclable: true },
            metal: { emoji: '🥫', recyclable: true },
            organic: { emoji: '🍎', recyclable: false },
            toxic: { emoji: '☢️', recyclable: false },
            unknown: { emoji: '❓', recyclable: false }
        };

        // Add contamination tracking
        this.binContamination = {
            plastic: false,
            paper: false,
            metal: false
        };

        // Initialize separate collection zones
        this.mainCollectionActive = true;  // Flag to track which zone is being updated
        this.init();
    }

    init() {
        // Initialize event listeners
        document.getElementById('collectTrash').addEventListener('click', () => this.collectTrash());
        
        // Initialize bins
        document.querySelectorAll('.bin').forEach(bin => {
            bin.addEventListener('click', () => this.sellTrash(bin.dataset.type));
        });

        // Initialize upgrade buttons
        document.querySelectorAll('.buy-upgrade').forEach(button => {
            const upgrade = button.closest('.upgrade');
            button.addEventListener('click', () => this.purchaseUpgrade(upgrade.dataset.id));
        });

        this.updateDisplay();
        this.updateUpgradesDisplay();
        
        // Initialize main collection zone only
        this.updateCollectionZone('.collection-grid .trash-spot');
        
        // Update main collection zone periodically
        setInterval(() => this.updateCollectionZone('.collection-grid .trash-spot'), 5000);

        // Initialize quest UI
        this.initializeQuests();
    }

    initializeQuests() {
        // Add click handlers for quest expansion
        document.querySelectorAll('.quest').forEach(quest => {
            quest.addEventListener('click', () => {
                quest.classList.toggle('expanded');
            });
        });
    }

    collectTrash() {
        const spots = document.querySelectorAll('.collection-grid .trash-spot');
        let totalCollected = 0;
        let contaminated = false;
        
        // Check for contamination first
        spots.forEach(spot => {
            if (spot.dataset.type !== 'empty') {
                const trashInfo = this.trashTypes[spot.dataset.type];
                if (!trashInfo.recyclable) {
                    contaminated = true;
                }
            }
        });
        
        if (contaminated) {
            // Apply monetary fine and eco points penalty
            const fine = 10;
            this.money = Math.max(0, this.money - fine);
            this.ecoPoints = Math.max(0, this.ecoPoints - 5);
            
            const notification = document.createElement('div');
            notification.className = 'contamination-alert';
            notification.innerHTML = `
                <h3>⚠️ Environmental Violation Notice</h3>
                <p>Hazardous materials detected in recycling stream.</p>
                <p>Municipal Code Violation: Section 7.4</p>
                <div class="penalty-details">
                    <p class="penalty">Fine: -$${fine}</p>
                    <p class="penalty">Eco Impact: -5 🌱</p>
                </div>
                <small>Please remove hazardous materials before collection.</small>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } else {
            // Collect all recyclable items
            spots.forEach(spot => {
                if (spot.dataset.type !== 'empty' && this.trashTypes[spot.dataset.type].recyclable) {
                    const type = spot.dataset.type;
                    const amount = (Math.floor(Math.random() * 3) + 1) * this.baseCollectionAmount;
                    this.trashItems[type] += amount;
                    totalCollected += amount;
                }
            });

            if (totalCollected > 0) {
                this.ecoPoints += totalCollected;
                document.getElementById('lastCollected').textContent = `${totalCollected} items`;
                document.getElementById('collectionSpeed').textContent = 
                    `${this.baseCollectionAmount}x`;
            }
        }

        // Clear all spots in main collection grid
        spots.forEach(spot => {
            spot.textContent = '';
            spot.dataset.type = 'empty';
            spot.classList.remove('active');
            spot.classList.add('spawning');
            spot.onclick = null;
            setTimeout(() => spot.classList.remove('spawning'), 300);
        });
        
        this.updateDisplay();
        this.updateUpgradesDisplay();
        this.updateSDGProgress();
        
        // Spawn new items after a delay only in main collection grid
        setTimeout(() => {
            this.updateCollectionZone('.collection-grid .trash-spot');
        }, 500);
    }

    sellTrash(type) {
        if (this.trashItems[type] > 0) {
            const amount = this.trashItems[type];
            const profit = amount * this.prices[type];
            this.money += profit;
            this.trashItems[type] = 0;
            this.updateDisplay();
            this.showSellAnimation(profit, amount, type);
            this.updateSDGProgress();
        }
    }

    updateDisplay() {
        document.getElementById('money').textContent = this.money;
        document.getElementById('ecoPoints').textContent = this.ecoPoints;
        
        // Update bin counts and potential profits
        Object.keys(this.trashItems).forEach(type => {
            const bin = document.querySelector(`.bin[data-type="${type}"]`);
            if (bin) {
                bin.querySelector('.bin-count').textContent = this.trashItems[type];
                const potentialProfit = this.trashItems[type] * this.prices[type];
                bin.querySelector('.potential-profit').textContent = 
                    potentialProfit > 0 ? `Sell for $${potentialProfit}` : '';
            }
        });
    }

    showCollectionAnimation(type, amount) {
        // Simple animation placeholder
        const trashSpawnArea = document.getElementById('trashSpawnArea');
        const notification = document.createElement('div');
        notification.textContent = `+${amount} ${type}`;
        notification.style.cssText = `
            position: absolute;
            animation: fadeUp 1s ease-out;
            color: green;
        `;
        trashSpawnArea.appendChild(notification);
        setTimeout(() => notification.remove(), 1000);
    }

    showSellAnimation(profit, amount, type) {
        // Create container for multiple notifications
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 1000;
        `;

        // Add amount sold notification
        const amountNote = document.createElement('div');
        amountNote.textContent = `-${amount} ${type}`;
        amountNote.style.cssText = `
            color: #e74c3c;
            font-size: 20px;
            margin-bottom: 5px;
            animation: fadeUp 1s ease-out;
        `;
        container.appendChild(amountNote);

        // Add profit notification
        const profitNote = document.createElement('div');
        profitNote.textContent = `+$${profit}`;
        profitNote.style.cssText = `
            color: gold;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 0 0 3px rgba(0,0,0,0.5);
            animation: fadeUp 1s ease-out;
        `;
        container.appendChild(profitNote);

        document.body.appendChild(container);
        setTimeout(() => container.remove(), 1000);
    }

    purchaseUpgrade(upgradeId) {
        const upgrade = this.upgrades[upgradeId];
        const cost = this.calculateUpgradeCost(upgradeId);

        if (this.money >= cost) {
            this.money -= cost;
            upgrade.level++;
            
            // Call the effect function
            if (typeof upgrade.effect === 'function') {
                upgrade.effect();
            }
            
            // Update displays
            this.updateDisplay();
            this.updateUpgradesDisplay();
            
            // Show purchase animation
            this.showPurchaseAnimation(cost, upgradeId);
            this.updateSDGProgress();
        }
    }

    calculateUpgradeCost(upgradeId) {
        const upgrade = this.upgrades[upgradeId];
        return Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level));
    }

    updateUpgradesDisplay() {
        Object.keys(this.upgrades).forEach(upgradeId => {
            const upgradeElement = document.querySelector(`.upgrade[data-id="${upgradeId}"]`);
            if (!upgradeElement) return;

            const cost = this.calculateUpgradeCost(upgradeId);
            const level = this.upgrades[upgradeId].level;

            const costElement = upgradeElement.querySelector('.cost');
            const levelElement = upgradeElement.querySelector('.level');
            const buyButton = upgradeElement.querySelector('.buy-upgrade');

            if (costElement) costElement.textContent = cost;
            if (levelElement) levelElement.textContent = level;
            if (buyButton) {
                buyButton.disabled = this.money < cost;
                buyButton.textContent = this.money < cost ? 'Not enough money' : 'Purchase';
            }
        });
    }

    showPurchaseAnimation(cost, upgradeId) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 1000;
            color: #e74c3c;
            font-size: 24px;
            font-weight: bold;
            animation: fadeUp 1s ease-out;
        `;
        container.textContent = `-$${cost}`;
        
        document.body.appendChild(container);
        setTimeout(() => container.remove(), 1000);

        // Add visual feedback to the upgraded item
        const upgradeElement = document.querySelector(`.upgrade[data-id="${upgradeId}"]`);
        upgradeElement.style.backgroundColor = '#e8f5e9';
        setTimeout(() => upgradeElement.style.backgroundColor = '', 500);
    }

    startAutoCollection() {
        if (this.autoCollectorInterval) {
            clearInterval(this.autoCollectorInterval);
        }

        const collectionSpeed = Math.max(5000 - (this.upgrades.autoCollector.level * 500), 1000);
        document.getElementById('autoSpeed').textContent = 
            `${((5000 - collectionSpeed) / 500 + 1).toFixed(1)}x`;
        
        // Initial population of auto collector grid
        this.updateCollectionZone('.auto-collection-grid .trash-spot');
        
        this.autoCollectorInterval = setInterval(() => {
            const spots = document.querySelectorAll('.auto-collection-grid .trash-spot');
            let totalCollected = 0;
            
            // Process all spots
            spots.forEach(spot => {
                if (spot.dataset.type !== 'empty') {
                    const trashInfo = this.trashTypes[spot.dataset.type];
                    
                    if (!trashInfo.recyclable) {
                        // Auto remove hazardous items
                        this.ecoPoints += 2;
                        this.showRemovalAnimation(spot, '+2 🌱 (Auto)', '#43a047');
                    } else {
                        // Collect recyclable items
                        const amount = (Math.floor(Math.random() * 2) + 1) * this.baseCollectionAmount;
                        this.trashItems[spot.dataset.type] += amount;
                        totalCollected += amount;
                        this.showRemovalAnimation(spot, `+${amount} ${spot.dataset.type}`, '#2e7d32');
                    }
                }
            });

            if (totalCollected > 0) {
                this.ecoPoints += totalCollected;
            }

            // Clear all spots
            spots.forEach(spot => {
                spot.textContent = '';
                spot.dataset.type = 'empty';
                spot.classList.remove('active');
                spot.classList.add('spawning');
            });

            // Update displays
            this.updateDisplay();
            this.updateUpgradesDisplay();
            this.updateSDGProgress();

            // Spawn new items after a delay
            setTimeout(() => {
                this.updateCollectionZone('.auto-collection-grid .trash-spot');
            }, 300);

        }, collectionSpeed);
    }

    updatePrices() {
        const multiplier = 1 + (this.upgrades.betterPrices.level * 0.25);
        this.prices = {
            plastic: Math.floor(1 * multiplier),
            paper: Math.floor(2 * multiplier),
            metal: Math.floor(5 * multiplier)
        };
    }

    updateCollectionAmount() {
        this.baseCollectionAmount = 1 + this.upgrades.largerStorage.level;
    }

    updateSDGProgress() {
        // Update quest progress
        this.updateQuestProgress();

        // Calculate SDG progress based on quest completion
        Object.keys(this.sdgQuests).forEach(sdg => {
            const quests = this.sdgQuests[sdg];
            const completedQuests = quests.filter(q => q.completed).length;
            const progress = Math.floor((completedQuests / quests.length) * 100);
            
            this.sdgProgress[sdg] = progress;

            // Update the display
            const progressBar = document.getElementById(`${sdg}-progress`);
            const progressText = progressBar.parentElement.nextElementSibling;
            
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;

            if (progress === 100 && !progressBar.classList.contains('completed')) {
                progressBar.classList.add('completed');
                this.showBadgeUnlocked(sdg);
            }
        });
    }

    updateQuestProgress() {
        // SDG 11 Quests
        const cleanCityQuest = this.sdgQuests.sdg11[0];
        cleanCityQuest.progress = this.ecoPoints;
        const cleanCityElement = document.querySelector('.quest[data-quest="cleanCity"]');
        if (cleanCityElement) {
            const progressBar = cleanCityElement.querySelector('.quest-progress');
            const progressText = cleanCityElement.querySelector('.quest-progress-text');
            const progress = Math.min(100, (cleanCityQuest.progress / cleanCityQuest.target) * 100);
            
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${cleanCityQuest.progress}/${cleanCityQuest.target}`;

            if (cleanCityQuest.progress >= cleanCityQuest.target && !cleanCityQuest.completed) {
                cleanCityQuest.completed = true;
                cleanCityElement.classList.add('completed');
                this.showQuestComplete(cleanCityQuest);
            }
        }

        const recyclingQuest = this.sdgQuests.sdg11[1];
        const recyclingElement = document.querySelector('.quest[data-quest="recyclingCenter"]');
        if (recyclingElement) {
            const progressCounts = recyclingElement.querySelectorAll('.progress-count');
            Object.entries(this.trashItems).forEach(([type, amount], index) => {
                const progress = Math.min(recyclingQuest.target, amount);
                recyclingQuest.progress[type] = progress;
                if (progressCounts[index]) {
                    progressCounts[index].textContent = progress;
                }
            });

            if (Object.values(recyclingQuest.progress).every(p => p >= recyclingQuest.target) && !recyclingQuest.completed) {
                recyclingQuest.completed = true;
                recyclingElement.classList.add('completed');
                this.showQuestComplete(recyclingQuest);
            }
        }

        // SDG 12 Quests
        const sortingQuest = this.sdgQuests.sdg12[0];
        sortingQuest.progress = this.upgrades.autoCollector.level;
        if (sortingQuest.progress >= sortingQuest.target && !sortingQuest.completed) {
            sortingQuest.completed = true;
            this.showQuestComplete(sortingQuest);
        }

        // SDG 13 Quests
        const greenTechQuest = this.sdgQuests.sdg13[0];
        greenTechQuest.progress = {
            autoCollector: this.upgrades.autoCollector.level > 0,
            betterPrices: this.upgrades.betterPrices.level > 0,
            largerStorage: this.upgrades.largerStorage.level > 0
        };
        if (Object.values(greenTechQuest.progress).every(p => p) && !greenTechQuest.completed) {
            greenTechQuest.completed = true;
            this.showQuestComplete(greenTechQuest);
        }

        const carbonReductionQuest = this.sdgQuests.sdg13[1];
        carbonReductionQuest.progress = this.ecoPoints;
        if (carbonReductionQuest.progress >= carbonReductionQuest.target && !carbonReductionQuest.completed) {
            carbonReductionQuest.completed = true;
            this.showQuestComplete(carbonReductionQuest);
        }
    }

    showQuestComplete(quest) {
        const notification = document.createElement('div');
        notification.className = 'quest-complete';
        notification.innerHTML = `
            <h3>🎉 Quest Complete!</h3>
            <p>${quest.title}</p>
            <p class="reward">+$${quest.reward}</p>
        `;
        document.body.appendChild(notification);
        
        // Add reward
        this.money += quest.reward;
        this.updateDisplay();

        setTimeout(() => notification.remove(), 3000);
    }

    showBadgeUnlocked(sdg) {
        const badgeNames = {
            sdg11: 'Sustainable Cities',
            sdg12: 'Responsible Consumption',
            sdg13: 'Climate Action'
        };

        const notification = document.createElement('div');
        notification.className = 'badge-unlocked';
        notification.innerHTML = `
            <h3>🏆 Badge Unlocked!</h3>
            <p>${badgeNames[sdg]}</p>
            <p>All quests completed!</p>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }

    updateCollectionZone(selector) {
        const spots = document.querySelectorAll(selector);
        spots.forEach(spot => {
            // Only update empty spots
            if (spot.dataset.type === 'empty') {
                if (Math.random() < 0.3) { // 30% chance for each empty spot
                    const types = Object.keys(this.trashTypes);
                    const randomType = types[Math.floor(Math.random() * types.length)];
                    spot.dataset.type = randomType;
                    spot.textContent = this.trashTypes[randomType].emoji;
                    spot.classList.add('active');
                    
                    // Add click handler for manual removal only to main collection zone
                    if (selector.includes('collection-grid')) {
                        spot.onclick = (e) => {
                            e.stopPropagation();
                            this.handleTrashClick(spot);
                        };
                    }
                }
            }
        });
    }

    handleTrashClick(spot) {
        const type = spot.dataset.type;
        const trashInfo = this.trashTypes[type];
        
        if (!trashInfo.recyclable) {
            // Add eco points for responsible disposal
            this.ecoPoints += 2;
            this.showRemovalAnimation(spot, '+2 🌱', '#43a047');
        } else {
            // Penalize for removing recyclable items
            this.ecoPoints = Math.max(0, this.ecoPoints - 1);
            this.showRemovalAnimation(spot, '-1 🌱', '#e53935');
        }
        
        // Clear the spot
        spot.textContent = '';
        spot.dataset.type = 'empty';
        spot.classList.remove('active');
        spot.classList.add('spawning');
        spot.onclick = null;
        
        this.updateDisplay();
        this.updateSDGProgress();
    }

    showRemovalAnimation(spot, text, color) {
        const rect = spot.getBoundingClientRect();
        const notification = document.createElement('div');
        notification.textContent = text;
        notification.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top}px;
            transform: translate(-50%, -100%);
            color: ${color};
            font-weight: bold;
            animation: fadeUp 1s ease-out;
            pointer-events: none;
            z-index: 1000;
            font-size: ${spot.classList.contains('small') ? '0.8em' : '1em'};
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 1000);
    }
}

// Start the game
window.addEventListener('DOMContentLoaded', () => {
    window.game = new TrashTycoon();
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style); 