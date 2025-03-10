class TrashTycoon {
    constructor() {
        this.money = 0;
        this.ecoPoints = 0;
        this.trashItems = {
            plastic: 0,
            paper: 0,
            metal: 0,
            computer: 0,
            glass: 0,
            gemstone: 0,
            gold: 0,
            battery: 0
        };
        
        this.prices = {
            plastic: 1,
            paper: 2,
            metal: 5,
            computer: 25,
            glass: 15,
            gemstone: 50,
            gold: 75,
            battery: 20
        };

        // Add upgrades configuration
        this.upgrades = {
            // Collection Upgrades
            quickCollection: {
                level: 0,
                baseCost: 100,
                effect: () => this.updateCollectionSpeed()
            },
            smartStorage: {
                level: 0,
                baseCost: 150,
                effect: () => this.updateStorageCapacity()
            },
            autoCollector: {
                level: 0,
                baseCost: 200,
                effect: () => this.startAutoCollection()
            },
            
            // Economic Upgrades
            betterPrices: {
                level: 0,
                baseCost: 100,
                effect: () => this.updatePrices() // Now affects rare items less
            },
            bulkSelling: {
                level: 0,
                baseCost: 150,
                effect: () => this.updateBulkBonus()
            },
            rareValueBonus: { // New upgrade replacing passiveIncome
                level: 0,
                baseCost: 200,
                effect: () => this.updateRareValueBonus()
            },
            
            // Environmental Upgrades
            hazardProtection: {
                level: 0,
                baseCost: 150,
                effect: () => this.updateHazardProtection()
            },
            ecoBooster: {
                level: 0,
                baseCost: 125,
                effect: () => this.updateEcoMultiplier()
            },
            greenEnergy: {
                level: 0,
                baseCost: 175,
                effect: () => this.updateEnergyEfficiency()
            },
            
            // Technology Upgrades
            rareScanner: { // New upgrade replacing smartSorting
                level: 0,
                baseCost: 250,
                effect: () => this.updateRareScanner()
            },
            multiCollector: {
                level: 0,
                baseCost: 300,
                effect: () => this.updateMultiCollector()
            },
            autoSeller: {
                level: 0,
                baseCost: 400,
                effect: () => this.updateAutoSeller()
            },
            
            // Special Upgrades
            goldenTouch: {
                level: 0,
                baseCost: 500,
                effect: () => this.updateGoldenTouch() // Already balanced
            },
            ecoMagnet: {
                level: 0,
                baseCost: 450,
                effect: () => this.updateEcoMagnet()
            },
            treasureHunter: { // New upgrade replacing cityInspiration
                level: 0,
                baseCost: 600,
                effect: () => this.updateTreasureHunter()
            },
            materialAnalyzer: {
                level: 0,
                baseCost: 275,
                effect: () => this.updateMaterialAnalyzer()
            },
            recyclingAI: {
                level: 0,
                baseCost: 325,
                effect: () => this.updateRecyclingAI()
            }
        };

        this.baseCollectionAmount = 1;
        this.autoCollectorInterval = null;

        // Add SDG tracking
        this.sdgProgress = {
            sdg11: 0, // Sustainable Cities
            sdg12: 0, // Responsible Consumption
            sdg13: 0,  // Climate Action
            sdg14: 0,  // Life Below Water
            sdg15: 0,  // Life on Land
            sdg7: 0   // Clean Energy
        };

        // Add quest pool
        this.questPool = {
            sdg11: [
                {
                    id: 'cleanCity',
                    title: 'Clean City Initiative',
                    description: 'Clean up 100 pieces of trash',
                    target: 100,
                    checkProgress: () => this.ecoPoints,
                    reward: 500
                },
                {
                    id: 'recyclingCenter',
                    title: 'Build Recycling Centers',
                    description: 'Sell 50 pieces of each material',
                    target: 50,
                    checkProgress: () => Math.min(...Object.values(this.totalSales)),
                    reward: 1000
                },
                {
                    id: 'urbanDevelopment',
                    title: 'Urban Development',
                    description: 'Earn $1000 from sales',
                    target: 1000,
                    checkProgress: () => this.money,
                    reward: 800
                },
                {
                    id: 'cityPlanner',
                    title: 'City Planner',
                    description: 'Upgrade storage capacity 3 times',
                    target: 3,
                    checkProgress: () => this.upgrades.smartStorage.level,
                    reward: 1200
                },
                {
                    id: 'wasteManager',
                    title: 'Waste Management Expert',
                    description: 'Remove 20 hazardous items',
                    target: 20,
                    checkProgress: () => this.hazardousItemsRemoved || 0,
                    reward: 1500
                },
                {
                    id: 'urbanEfficiency',
                    title: 'Urban Efficiency',
                    description: 'Process 50 items in under a minute',
                    target: 50,
                    checkProgress: () => this.rapidProcessingCount || 0,
                    reward: 2000
                }
            ],
            sdg12: [
                {
                    id: 'efficientSorting',
                    title: 'Efficient Waste Management',
                    description: 'Upgrade Auto Collector to level 3',
                    target: 3,
                    checkProgress: () => this.upgrades.autoCollector.level,
                    reward: 750
                },
                {
                    id: 'wasteReduction',
                    title: 'Waste Reduction Program',
                    description: 'Process 200 total items',
                    target: 200,
                    checkProgress: () => Object.values(this.totalSales).reduce((a, b) => a + b, 0),
                    reward: 1500
                },
                {
                    id: 'resourceEfficiency',
                    title: 'Resource Efficiency',
                    description: 'Collect 100 metal items',
                    target: 100,
                    checkProgress: () => this.totalSales.metal,
                    reward: 1200
                },
                {
                    id: 'materialSpecialist',
                    title: 'Material Specialist',
                    description: 'Collect 100 pieces of paper',
                    target: 100,
                    checkProgress: () => this.totalSales.paper,
                    reward: 1300
                },
                {
                    id: 'bulkProcessor',
                    title: 'Bulk Processing Master',
                    description: 'Sell 100 items at once',
                    target: 100,
                    checkProgress: () => Math.max(...Object.values(this.trashItems)),
                    reward: 1800
                },
                {
                    id: 'efficientOperator',
                    title: 'Efficient Operator',
                    description: 'Reach 3x collection speed',
                    target: 3,
                    checkProgress: () => this.upgrades.quickCollection.level,
                    reward: 1600
                }
            ],
            sdg13: [
                {
                    id: 'greenTech',
                    title: 'Green Technology Pioneer',
                    description: 'Purchase 3 different upgrades',
                    target: 3,
                    checkProgress: () => Object.values(this.upgrades).filter(u => u.level > 0).length,
                    reward: 2000
                },
                {
                    id: 'carbonReduction',
                    title: 'Carbon Footprint Reduction',
                    description: 'Earn 1000 eco points',
                    target: 1000,
                    checkProgress: () => this.ecoPoints,
                    reward: 3000
                },
                {
                    id: 'sustainableOperations',
                    title: 'Sustainable Operations',
                    description: 'Have auto collector running for 5 minutes',
                    target: 300,
                    checkProgress: () => this.autoCollectorTime || 0,
                    reward: 1500
                },
                {
                    id: 'greenInnovator',
                    title: 'Green Innovator',
                    description: 'Purchase 5 environmental upgrades',
                    target: 5,
                    checkProgress: () => {
                        const envUpgrades = ['ecoBooster', 'greenEnergy', 'hazardProtection'];
                        return envUpgrades.reduce((sum, upgrade) => sum + this.upgrades[upgrade].level, 0);
                    },
                    reward: 2500
                },
                {
                    id: 'sustainabilityPioneer',
                    title: 'Sustainability Pioneer',
                    description: 'Maintain 100% eco-friendly processing for 2 minutes',
                    target: 120,
                    checkProgress: () => this.cleanProcessingTime || 0,
                    reward: 2200
                },
                {
                    id: 'climateChampion',
                    title: 'Climate Champion',
                    description: 'Earn 2000 eco points without any contamination',
                    target: 2000,
                    checkProgress: () => this.cleanEcoPoints || 0,
                    reward: 3000
                }
            ],
            sdg14: [
                {
                    id: 'oceanCleanup',
                    title: 'Ocean Cleanup',
                    description: 'Remove 30 plastic items',
                    target: 30,
                    checkProgress: () => this.totalSales.plastic,
                    reward: 1000
                },
                {
                    id: 'marineProtection',
                    title: 'Marine Protection',
                    description: 'Process waste without contamination 10 times',
                    target: 10,
                    checkProgress: () => this.cleanProcessingStreak || 0,
                    reward: 1500
                },
                {
                    id: 'coastalConservation',
                    title: 'Coastal Conservation',
                    description: 'Earn $2000 from recycling plastic',
                    target: 2000,
                    checkProgress: () => this.plasticEarnings || 0,
                    reward: 2000
                }
            ],
            sdg15: [
                {
                    id: 'forestPreservation',
                    title: 'Forest Preservation',
                    description: 'Recycle 50 paper items',
                    target: 50,
                    checkProgress: () => this.totalSales.paper,
                    reward: 1200
                },
                {
                    id: 'biodiversityProtection',
                    title: 'Biodiversity Protection',
                    description: 'Remove 15 toxic waste items',
                    target: 15,
                    checkProgress: () => this.hazardousItemsRemoved,
                    reward: 1800
                },
                {
                    id: 'ecosystemBalance',
                    title: 'Ecosystem Balance',
                    description: 'Maintain clean processing for 3 minutes',
                    target: 180,
                    checkProgress: () => this.cleanProcessingTime,
                    reward: 2200
                }
            ],
            sdg7: [
                {
                    id: 'renewableEnergy',
                    title: 'Renewable Energy',
                    description: 'Purchase 3 green energy upgrades',
                    target: 3,
                    checkProgress: () => this.upgrades.greenEnergy.level,
                    reward: 1500
                },
                {
                    id: 'energyEfficiency',
                    title: 'Energy Efficiency',
                    description: 'Process 100 items with auto collector',
                    target: 100,
                    checkProgress: () => this.autoProcessedItems || 0,
                    reward: 1700
                },
                {
                    id: 'cleanPower',
                    title: 'Clean Power Pioneer',
                    description: 'Reach 5x collection speed',
                    target: 5,
                    checkProgress: () => this.upgrades.quickCollection.level,
                    reward: 2500
                },
                {
                    id: 'sustainableGrid',
                    title: 'Sustainable Grid',
                    description: 'Have all automation upgrades active',
                    target: 3,
                    checkProgress: () => {
                        const autoUpgrades = ['autoCollector', 'autoSeller', 'multiCollector'];
                        return autoUpgrades.filter(u => this.upgrades[u].level > 0).length;
                    },
                    reward: 2000
                },
                {
                    id: 'energyInnovator',
                    title: 'Energy Innovator',
                    description: 'Process 500 items without manual collection',
                    target: 500,
                    checkProgress: () => this.autoProcessedTotal || 0,
                    reward: 3000
                },
                {
                    id: 'powerOptimization',
                    title: 'Power Optimization',
                    description: 'Maintain maximum efficiency for 5 minutes',
                    target: 300,
                    checkProgress: () => this.optimalProcessingTime || 0,
                    reward: 2800
                }
            ]
        };

        // Initialize active quests
        this.initializeActiveQuests();

        // Add non-recyclable types
        this.trashTypes = {
            // Regular items
            plastic: { emoji: '🥤', recyclable: true, value: 1 },
            paper: { emoji: '📄', recyclable: true, value: 2 },
            metal: { emoji: '🥫', recyclable: true, value: 5 },
            // Hazardous items
            hazard: { emoji: '⚠️', recyclable: false, value: 0 },
            // Rare items
            computer: { emoji: '💻', recyclable: true, value: 25, rare: true },
            glass: { emoji: '🔮', recyclable: true, value: 15, rare: true },
            gemstone: { emoji: '💎', recyclable: true, value: 50, rare: true },
            gold: { emoji: '🏆', recyclable: true, value: 75, rare: true },
            battery: { emoji: '🔋', recyclable: true, value: 20, rare: true }
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

        // Add new properties
        this.hazardProtectionLevel = 1;
        this.ecoMultiplier = 1;
        this.valuableSpawnRate = 0.3;
        this.multiCollectorCount = 1;
        this.autoSellThreshold = 0;
        this.storageMultiplier = 1;
        this.goldenTouchChance = 0;
        this.spawnRate = 0.3;
        this.cityBonus = 1;

        // Start periodic upgrade display updates
        setInterval(() => this.updateUpgradesDisplay(), 100);

        // Add sales tracking for the recycling quest
        this.totalSales = {
            plastic: 0,
            paper: 0,
            metal: 0
        };

        // Add developer console
        this.devConsoleActive = false;
        this.initDevConsole();

        // Add tracking properties
        this.hazardousItemsRemoved = 0;
        this.rapidProcessingCount = 0;
        this.cleanProcessingTime = 0;
        this.cleanEcoPoints = 0;
        this.cleanProcessingStreak = 0;
        this.plasticEarnings = 0;
        this.autoProcessedItems = 0;
        this.autoProcessedTotal = 0;
        this.optimalProcessingTime = 0;

        // Add rare items collection tracking
        this.rareItemsCollected = {
            computer: 0,
            glass: 0,
            gemstone: 0,
            gold: 0,
            battery: 0
        };

        // Base spawn rates
        this.baseRareSpawnRate = 0.08; // Increase to 8% chance for rare items
    }

    init() {
        // Initialize event listeners
        document.getElementById('collectTrash').addEventListener('click', () => this.collectTrash());
        
        // Initialize bins
        document.querySelectorAll('.bin').forEach(bin => {
            bin.addEventListener('click', () => this.sellTrash(bin.dataset.type));
        });

        // Initialize all upgrade buttons
        document.querySelectorAll('.upgrade').forEach(upgrade => {
            const id = upgrade.dataset.id;
            if (!id || !this.upgrades[id]) return;
            
            const upgradeInfo = this.upgrades[id];
            const cost = Math.floor(upgradeInfo.baseCost * Math.pow(1.5, upgradeInfo.level));
            
            // Set initial text and state
            const button = upgrade.querySelector('.buy-upgrade');
            if (button) {
                button.textContent = `Need $${cost}`;
                button.disabled = true;
                button.classList.add('cant-afford');
                
                // Add click handler
                button.onclick = () => this.purchaseUpgrade(id);
            }
            
            // Set initial level
            const levelElement = upgrade.querySelector('.level');
            if (levelElement) {
                levelElement.textContent = '0';
            }
            
            // Set initial cost
            const costElement = upgrade.querySelector('.cost');
            if (costElement) {
                costElement.textContent = cost;
            }
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
            // First remove the click handler from the quest itself
            quest.onclick = null;
            
            // Get the header element
            const header = quest.querySelector('.quest-header');
            if (header) {
                // Remove any existing click handlers
                header.onclick = null;
                
                // Add new click handler
                header.onclick = (e) => {
                    e.stopPropagation();
                    quest.classList.toggle('expanded');
                };
            }
        });
    }

    initializeActiveQuests() {
        // Initialize with random quest pairs from each SDG
        this.sdgQuests = {
            sdg11: this.getRandomQuestPair('sdg11'),
            sdg12: this.getRandomQuestPair('sdg12'),
            sdg13: this.getRandomQuestPair('sdg13'),
            sdg14: this.getRandomQuestPair('sdg14'),
            sdg15: this.getRandomQuestPair('sdg15'),
            sdg7: this.getRandomQuestPair('sdg7')
        };
    }

    getRandomQuestPair(sdg) {
        // Get available quests that haven't been used recently
        const availableQuests = this.questPool[sdg].filter(quest => 
            !Object.values(this.sdgQuests || {}).flat().some(q => q && q.id === quest.id)
        );

        // Select two random quests
        const shuffled = availableQuests.sort(() => 0.5 - Math.random());
        const selectedQuests = shuffled.slice(0, 2);
        
        // Create quest objects with progress tracking
        return selectedQuests.map(quest => ({
            ...quest,
            progress: 0,
            completed: false
        }));
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
            // Apply reduced fine based on hazard protection
            const baseFine = 10;
            const fine = Math.floor(baseFine * this.hazardProtectionLevel);
            this.money = Math.max(0, this.money - fine);
            this.ecoPoints = Math.max(0, this.ecoPoints - Math.floor(5 * this.hazardProtectionLevel));
            
            const notification = document.createElement('div');
            notification.className = 'contamination-alert';
            notification.innerHTML = `
                <h3>⚠️ Environmental Violation Notice</h3>
                <p>Hazardous materials detected in recycling stream.</p>
                <p>Municipal Code Violation: Section 7.4</p>
                <div class="penalty-details">
                    <p class="penalty">Fine: -$${fine}</p>
                    <p class="penalty">Eco Impact: -${Math.floor(5 * this.hazardProtectionLevel)} 🌱</p>
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
                // Apply eco multiplier and city bonus to points earned
                this.ecoPoints += Math.floor(totalCollected * this.ecoMultiplier * this.cityBonus);
                document.getElementById('lastCollected').textContent = `${totalCollected} items`;
                document.getElementById('collectionSpeed').textContent = 
                    `${this.baseCollectionAmount}x`;
            }
        }

        // Clear all spots in main collection grid
        spots.forEach(spot => {
            spot.textContent = '';
            spot.dataset.type = 'empty';
            // Make sure to remove both hazardous and valuable classes
            spot.classList.remove('hazardous', 'valuable');
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
    const amount = this.trashItems[type];
    if (amount > 0) {
        const basePrice = this.prices[type] || 0; // Ensure basePrice is never undefined
        const bulkBonus = (amount >= 100) ? (this.bulkBonus || 1) : 1; // Default to 1 if undefined

        const totalPrice = Math.floor(amount * basePrice * bulkBonus);

        // 🚨 Prevent NaN errors
        if (isNaN(totalPrice) || totalPrice < 0) {
            console.error(`Invalid total price: ${totalPrice}`);
            return;
        }

        this.money += totalPrice;
        this.trashItems[type] = 0;

        // Update total sales tracking
        if (this.totalSales[type] !== undefined) {
            this.totalSales[type] += amount;
        }

        this.updateDisplay();
        this.updateUpgradesDisplay();
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

    purchaseUpgrade(id) {
        const upgrade = this.upgrades[id];
        if (!upgrade) return;
        
        // Calculate actual cost with exponential scaling
        const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level));
        
        // Check if player can afford it
        if (this.money < cost) return;
        
        // Purchase the upgrade
        this.money -= cost;
        upgrade.level++;
        upgrade.effect();
        
        this.updateDisplay();
        this.updateUpgradesDisplay();
    }

    updateUpgradesDisplay() {
        document.querySelectorAll('.upgrade').forEach(upgrade => {
            const id = upgrade.dataset.id;
            if (!id || !this.upgrades[id]) return;
            
            // Calculate current cost for this upgrade
            const cost = Math.floor(this.upgrades[id].baseCost * Math.pow(1.5, this.upgrades[id].level));
            
            // Update level and cost display
            const levelElement = upgrade.querySelector('.level');
            const costElement = upgrade.querySelector('.cost');
            
            if (levelElement) levelElement.textContent = this.upgrades[id].level;
            if (costElement) costElement.textContent = cost;
            
            // Update button state
            const button = upgrade.querySelector('.buy-upgrade');
            if (button) {
                const canAfford = this.money >= cost;
                button.disabled = !canAfford;
                button.textContent = canAfford ? 'Purchase' : `Need $${cost}`;
                button.classList.toggle('cant-afford', !canAfford);
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
            
            spots.forEach(spot => {
                if (spot.dataset.type !== 'empty') {
                    const trashInfo = this.trashTypes[spot.dataset.type];
                    
                    if (!trashInfo.recyclable) {
                        this.ecoPoints += 2;
                        this.showRemovalAnimation(spot, '+2 🌱 (Auto)', '#43a047');
                    } else {
                        const amount = (Math.floor(Math.random() * 2) + 1) * this.baseCollectionAmount;
                        this.trashItems[spot.dataset.type] += amount;
                        totalCollected += amount;
                        this.showRemovalAnimation(spot, `+${amount} ${spot.dataset.type}`, '#2e7d32');
                        this.autoProcessedItems++;
                        this.autoProcessedTotal++;
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
                // Make sure to remove both hazardous and valuable classes
                spot.classList.remove('hazardous', 'valuable');
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
        const multiplier = 1 + (0.15 * Math.log2(this.upgrades.betterPrices.level + 1));
        this.prices = {
            // Regular items get full multiplier
            plastic: Math.floor(1 * multiplier),
            paper: Math.floor(2 * multiplier),
            metal: Math.floor(5 * multiplier),
            // Rare items get reduced multiplier to prevent exponential scaling
            computer: Math.floor(25 * (1 + (multiplier - 1) * 0.5)),
            glass: Math.floor(15 * (1 + (multiplier - 1) * 0.5)),
            gemstone: Math.floor(50 * (1 + (multiplier - 1) * 0.5)),
            gold: Math.floor(75 * (1 + (multiplier - 1) * 0.5)),
            battery: Math.floor(20 * (1 + (multiplier - 1) * 0.5))
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
            
            // Only show badge unlock if all quests are completed
            if (completedQuests === quests.length) {
                this.showBadgeUnlocked(sdg);
            }
        });
    }

    updateQuestProgress() {
        Object.entries(this.sdgQuests).forEach(([sdg, quests]) => {
            quests.forEach(quest => {
                const progress = quest.checkProgress();
                quest.progress = progress;

                const questElement = document.querySelector(`.quest[data-quest="${quest.id}"]`);
                if (questElement) {
                    const progressBar = questElement.querySelector('.quest-progress');
                    const progressText = questElement.querySelector('.quest-progress-text');
                    const progressPercent = Math.min(100, (progress / quest.target) * 100);

                    progressBar.style.width = `${progressPercent}%`;
                    progressText.textContent = `${progress}/${quest.target}`;

                    if (progress >= quest.target && !quest.completed) {
                        quest.completed = true;
                        questElement.classList.add('completed');
                        this.showQuestComplete(quest);
                    }
                }
            });
        });
    }

    showQuestComplete(quest) {
        // Add completing animation to the quest element
        const questElement = document.querySelector(`.quest[data-quest="${quest.id}"]`);
        if (questElement) {
            questElement.classList.add('completing');
            setTimeout(() => questElement.classList.remove('completing'), 1000);
        }

        const notification = document.createElement('div');
        notification.className = 'quest-complete';
        notification.innerHTML = `
            <h3>🎉 Quest Complete!</h3>
            <p>${quest.title}</p>
            <p class="reward">+$${quest.reward}</p>
        `;
        document.body.appendChild(notification);
        
        // Add reward with animation
        this.money += quest.reward;
        this.updateDisplay();

        // Remove notification after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);

        // Replace completed quest with a new one from a different SDG
        setTimeout(() => this.replaceCompletedQuest(quest), 1500);
    }

    replaceCompletedQuest(completedQuest) {
        const currentSdg = Object.entries(this.sdgQuests).find(([_, quests]) => 
            quests.some(q => q.id === completedQuest.id)
        )[0];

        // Get next SDG in rotation (11 -> 12 -> 13 -> 14 -> 15 -> 7 -> 11)
        const sdgOrder = ['sdg11', 'sdg12', 'sdg13', 'sdg14', 'sdg15', 'sdg7'];
        const currentIndex = sdgOrder.indexOf(currentSdg);
        const nextSdg = sdgOrder[(currentIndex + 1) % sdgOrder.length];

        const newQuest = this.getRandomQuestPair(nextSdg);
        this.sdgQuests[currentSdg] = newQuest;
        this.updateQuestDisplay(currentSdg, newQuest);
    }

    getRandomQuestPair(sdg) {
        // Get available quests that haven't been used recently
        const availableQuests = this.questPool[sdg].filter(quest => 
            !Object.values(this.sdgQuests || {}).flat().some(q => q && q.id === quest.id)
        );

        // Select two random quests
        const shuffled = availableQuests.sort(() => 0.5 - Math.random());
        const selectedQuests = shuffled.slice(0, 2);
        
        // Create quest objects with progress tracking
        return selectedQuests.map(quest => ({
            ...quest,
            progress: 0,
            completed: false
        }));
    }

    updateQuestDisplay(sdg, quests) {
        const questElement = document.querySelector(`.sdg-badge[data-sdg="${sdg.slice(-2)}"] .quest-list`);
        if (questElement) {
            questElement.innerHTML = quests.map(quest => {
                // Check if quest needs material progress display
                const isRecyclingQuest = quest.id === 'recyclingCenter';
                
                const progressDisplay = isRecyclingQuest ? `
                    <div class="material-progress">
                        <span>Plastic: <span class="progress-count">0</span>/50</span>
                        <span>Paper: <span class="progress-count">0</span>/50</span>
                        <span>Metal: <span class="progress-count">0</span>/50</span>
                    </div>
                ` : `
                    <div class="quest-progress-bar">
                        <div class="quest-progress" style="width: 0%"></div>
                    </div>
                    <span class="quest-progress-text">0/${quest.target}</span>
                `;

                return `
                    <div class="quest" data-quest="${quest.id}">
                        <div class="quest-header" style="cursor: pointer;">
                            <p>${quest.title}</p>
                            <span class="expand-arrow">▼</span>
                        </div>
                        <div class="quest-details">
                            <small>${quest.description}</small>
                            ${progressDisplay}
                        </div>
                    </div>
                `;
            }).join('');

            // Reinitialize quest click handlers
            this.initializeQuests();
        }
    }

    showBadgeUnlocked(sdg) {
        const badgeNames = {
            sdg11: 'Sustainable Cities',
            sdg12: 'Responsible Consumption',
            sdg13: 'Climate Action',
            sdg14: 'Life Below Water',
            sdg15: 'Life on Land',
            sdg7: 'Clean Energy'
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
        const isMainGrid = selector.includes('collection-grid');
        
        spots.forEach(spot => {
            if (spot.dataset.type === 'empty') {
                if (Math.random() < this.spawnRate) {
                    // First check for rare spawn
                    const isRareSpawn = Math.random() < this.baseRareSpawnRate;
                    if (isRareSpawn) {
                        const rareTypes = ['computer', 'glass', 'gemstone', 'gold', 'battery'];
                        const rareType = rareTypes[Math.floor(Math.random() * rareTypes.length)];
                        spot.dataset.type = rareType;
                        spot.textContent = this.trashTypes[rareType].emoji;
                        spot.classList.add('valuable');
                    } else {
                        // Then check for golden touch
                        if (Math.random() < this.goldenTouchChance) {
                            spot.dataset.type = 'metal';
                            spot.textContent = this.trashTypes.metal.emoji;
                        } else {
                            // Normal spawn logic
                            const normalTypes = ['plastic', 'paper', 'metal', 'hazard'];
                            const type = normalTypes[Math.floor(Math.random() * normalTypes.length)];
                            spot.dataset.type = type;
                            spot.textContent = this.trashTypes[type].emoji;
                        }
                    }
                    
                    // Add hazardous class for non-recyclable items
                    if (!this.trashTypes[spot.dataset.type].recyclable) {
                        spot.classList.add('hazardous');
                    }
                    
                    if (isMainGrid) {
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
        
        if (trashInfo.rare) {
            this.rareItemsCollected[type]++;
            this.ecoPoints += trashInfo.value;
            this.money += trashInfo.value * 2;
            this.showRemovalAnimation(spot, `+${trashInfo.value}🌱 +$${trashInfo.value * 2}`, '#ffd700');
        } else if (!trashInfo.recyclable) {
            this.ecoPoints += 2;
            this.showRemovalAnimation(spot, '+2 🌱', '#43a047');
            this.hazardousItemsRemoved++;
        } else {
            this.ecoPoints = Math.max(0, this.ecoPoints - 1);
            this.showRemovalAnimation(spot, '-1 🌱', '#e53935');
        }
        
        // Clear the spot
        spot.textContent = '';
        spot.dataset.type = 'empty';
        spot.classList.remove('hazardous', 'valuable');
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

    // Add new methods for upgrade effects
    updateHazardProtection() {
        // Reduce fines by 15% per level, caps at 80%
        const reduction = Math.min(0.8, this.upgrades.hazardProtection.level * 0.15);
        this.hazardProtectionLevel = Math.max(0.2, 1 - reduction);
    }

    updateEcoMultiplier() {
        // 15% increase per level, logarithmic scaling
        const level = this.upgrades.ecoBooster.level;
        this.ecoMultiplier = 1 + (0.15 * Math.log2(level + 1));
    }

    updateSpawnRates() {
        // Increase valuable spawn rate by 5% per level, caps at 50%
        this.valuableSpawnRate = 0.2 + Math.min(0.3, this.upgrades.rareScanner.level * 0.05);
    }

    updateMultiCollector() {
        // Add 1 spot every 2 levels, caps at 4 additional spots
        this.multiCollectorCount = 1 + Math.min(4, Math.floor(this.upgrades.multiCollector.level / 2));
    }

    updateAutoSeller() {
        // Start at 50% full, improve by 5% per level
        this.autoSellThreshold = Math.max(0.2, 0.5 - (this.upgrades.autoSeller.level * 0.05));
        if (this.autoSellThreshold < 1) {
            this.startAutoSeller();
        }
    }

    startAutoSeller() {
        setInterval(() => {
            Object.keys(this.trashItems).forEach(type => {
                if (this.trashItems[type] >= 100 * this.autoSellThreshold) {
                    this.sellTrash(type);
                }
            });
        }, 5000);
    }

    updateStorageCapacity() {
        // 25% increase per level, diminishing returns after level 10
        const level = this.upgrades.smartStorage.level;
        this.storageMultiplier = 1 + (0.25 * Math.min(level, 10) + 0.1 * Math.max(0, level - 10));
    }

    updateGoldenTouch() {
        // Logarithmic scaling from 5% to 50%
        const maxChance = 0.5;
        const level = this.upgrades.goldenTouch.level;
        this.goldenTouchChance = Math.min(maxChance, 0.05 * Math.log2(level + 1));
    }

    updateEcoMagnet() {
        // Increase spawn rate by 7% per level, logarithmic scaling
        const level = this.upgrades.ecoMagnet.level;
        this.spawnRate = 0.3 + (0.07 * Math.log2(level + 1));
    }

    updateTreasureHunter() {
        // 5% chance per level to get bonus rare items when collecting, caps at 25%
        const level = this.upgrades.treasureHunter.level;
        this.treasureHunterChance = Math.min(0.25, level * 0.05);
    }

    updateCollectionSpeed() {
        // Start at 5s, decrease by 0.4s per level, minimum 1s
        this.collectionCooldown = Math.max(1000, 5000 - (this.upgrades.quickCollection.level * 400));
    }

    updateBulkBonus() {
        // 5% bonus per level, caps at 50%
        this.bulkBonus = 1 + Math.min(0.5, this.upgrades.bulkSelling.level * 0.05);
    }

    updateRareValueBonus() {
        // 10% value increase per level, logarithmic scaling
        const level = this.upgrades.rareValueBonus.level;
        this.rareValueBonus = 1 + (0.1 * Math.log2(level + 1));
    }

    updateRareScanner() {
        // Increases rare spawn rate by 2% per level, caps at 20% total
        const level = this.upgrades.rareScanner.level;
        this.baseRareSpawnRate = 0.08 + Math.min(0.12, level * 0.02);
    }

    updateMaterialAnalyzer() {
        // 5% chance per level to upgrade a rare item to a more valuable one
        const level = this.upgrades.materialAnalyzer.level;
        this.materialAnalyzerChance = Math.min(0.3, level * 0.05);
    }

    updateRecyclingAI() {
        // 10% bonus per level to rare item processing efficiency
        const level = this.upgrades.recyclingAI.level;
        this.recyclingAIBonus = 1 + (0.1 * Math.log2(level + 1));
    }

    initDevConsole() {
        // Create dev console element
        const devConsole = document.createElement('div');
        devConsole.className = 'dev-console';
        devConsole.style.display = 'none';
        devConsole.innerHTML = `
            <div class="dev-console-header">
                <h3>Developer Console</h3>
                <button class="dev-console-close">×</button>
            </div>
            <div class="dev-console-content">
                <button onclick="game.addMoney(100)">Add $100</button>
                <button onclick="game.addEcoPoints(50)">Add 50 Eco Points</button>
                <button onclick="game.fillBins()">Fill Bins</button>
                <button onclick="game.completeAllQuests()">Complete All Quests</button>
            </div>
        `;
        document.body.appendChild(devConsole);

        // Add keyboard listener for toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === '+' || e.key === '=') {
                this.toggleDevConsole();
            }
        });

        // Add close button listener
        devConsole.querySelector('.dev-console-close').addEventListener('click', () => {
            this.toggleDevConsole();
        });

        // Store reference
        this.devConsoleElement = devConsole;
    }

    toggleDevConsole() {
        this.devConsoleActive = !this.devConsoleActive;
        this.devConsoleElement.style.display = this.devConsoleActive ? 'block' : 'none';
    }

    // Dev console commands
    addMoney(amount) {
        this.money += amount;
        this.updateDisplay();
    }

    addEcoPoints(amount) {
        this.ecoPoints += amount;
        this.updateDisplay();
        this.updateSDGProgress();
    }

    fillBins() {
        Object.keys(this.trashItems).forEach(type => {
            this.trashItems[type] += 50;
        });
        this.updateDisplay();
    }

    completeAllQuests() {
        Object.keys(this.sdgQuests).forEach(sdg => {
            this.sdgQuests[sdg].forEach(quest => {
                if (!quest.completed) {
                    quest.completed = true;
                    this.showQuestComplete(quest);
                }
            });
        });
        this.updateSDGProgress();
    }

    // Add method to track rapid processing
    startRapidProcessingTracking() {
        this.rapidProcessingCount = 0;
        this.rapidProcessingTimer = setTimeout(() => {
            this.rapidProcessingCount = 0;
        }, 60000); // Reset after 1 minute
    }

    // Add method to track clean processing time
    startCleanProcessingTracking() {
        let cleanTime = 0;
        this.cleanProcessingInterval = setInterval(() => {
            if (!this.hasContamination) {
                cleanTime++;
                this.cleanProcessingTime = cleanTime;
            } else {
                cleanTime = 0;
            }
        }, 1000);
    }

    // Add method to track clean eco points
    updateCleanEcoPoints(points) {
        if (!this.hasContamination) {
            this.cleanEcoPoints += points;
        } else {
            this.cleanEcoPoints = 0;
        }
    }

    startTutorial() {
        // Remove the old tutorial implementation
        if (window.startTutorial) {
            this.activeTutorial = window.startTutorial(this);
        } else {
            console.error("Tutorial system not loaded");
        }
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
