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
                effect: () => this.startAutoCollection()
            },
            betterPrices: {
                level: 0,
                baseCost: 100,
                effect: () => this.updatePrices()
            },
            largerStorage: {
                level: 0,
                baseCost: 75,
                effect: () => this.updateCollectionAmount()
            },
            quickCollection: {
                level: 0,
                baseCost: 100,
                effect: () => this.updateCollectionSpeed()
            },
            bulkSelling: {
                level: 0,
                baseCost: 150,
                effect: () => this.updateBulkBonus()
            },
            passiveIncome: {
                level: 0,
                baseCost: 200,
                effect: () => this.startPassiveIncome()
            },
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
            smartSorting: {
                level: 0,
                baseCost: 200,
                effect: () => this.updateSpawnRates()
            },
            hazardScanner: {
                level: 0,
                baseCost: 250,
                effect: () => this.updateHazardScanning()
            },
            recyclingEfficiency: {
                level: 0,
                baseCost: 300,
                effect: () => this.updateRecyclingBonus()
            },
            multiCollector: {
                level: 0,
                baseCost: 400,
                effect: () => this.updateMultiCollector()
            },
            autoSeller: {
                level: 0,
                baseCost: 350,
                effect: () => this.updateAutoSeller()
            },
            smartStorage: {
                level: 0,
                baseCost: 275,
                effect: () => this.updateStorageCapacity()
            },
            goldenTouch: {
                level: 0,
                baseCost: 500,
                effect: () => this.updateGoldenTouch()
            },
            ecoMagnet: {
                level: 0,
                baseCost: 450,
                effect: () => this.updateEcoMagnet()
            },
            cityInspiration: {
                level: 0,
                baseCost: 600,
                effect: () => this.updateCityInspiration()
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
            let profit = amount * this.prices[type];
            
            // Track total sales for recycling quest
            this.totalSales[type] += amount;
            
            // Apply bulk selling bonus if applicable
            if (amount >= 50 && this.upgrades.bulkSelling.level > 0) {
                const bulkBonus = 1 + (this.upgrades.bulkSelling.level * 0.1);
                profit = Math.floor(profit * bulkBonus);
            }
            
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
            this.updateUpgradesDisplay();  // Update all upgrade buttons
            
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
        // Get all upgrade elements
        const allUpgrades = document.querySelectorAll('.upgrade');
        
        allUpgrades.forEach(upgradeElement => {
            const upgradeId = upgradeElement.dataset.id;
            if (!upgradeId || !this.upgrades[upgradeId]) return;

            const cost = this.calculateUpgradeCost(upgradeId);
            const level = this.upgrades[upgradeId].level;

            const costElement = upgradeElement.querySelector('.cost');
            const levelElement = upgradeElement.querySelector('.level');
            const buyButton = upgradeElement.querySelector('.buy-upgrade');

            if (costElement) costElement.textContent = cost;
            if (levelElement) levelElement.textContent = level;
            if (buyButton) {
                const canAfford = this.money >= cost;
                buyButton.disabled = !canAfford;
                
                // Update button text and style immediately
                if (!canAfford) {
                    buyButton.textContent = `Need $${cost}`;
                    buyButton.classList.add('cant-afford');
                    buyButton.title = `Need $${cost - this.money} more`;
                } else {
                    buyButton.textContent = 'Purchase';
                    buyButton.classList.remove('cant-afford');
                    buyButton.title = '';
                }
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
                    const types = Object.keys(this.trashTypes);
                    // Apply golden touch chance
                    if (Math.random() < this.goldenTouchChance) {
                        spot.dataset.type = 'metal';
                        spot.textContent = this.trashTypes.metal.emoji;
                    } else {
                        // Random selection from other types
                        const otherTypes = types.filter(t => t !== 'metal');
                        spot.dataset.type = otherTypes[Math.floor(Math.random() * otherTypes.length)];
                        spot.textContent = this.trashTypes[spot.dataset.type].emoji;
                    }
                    
                    spot.classList.add('active');
                    
                    // Apply hazard scanner effect only to main collection grid
                    if (isMainGrid && this.hazardScanningLevel > 0 && !this.trashTypes[spot.dataset.type].recyclable) {
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
        
        if (!trashInfo.recyclable) {
            this.ecoPoints += 2;
            this.showRemovalAnimation(spot, '+2 🌱', '#43a047');
            spot.classList.remove('hazardous');
            this.hazardousItemsRemoved++; // Track hazardous items removed
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

    // Add new methods for upgrade effects
    updateHazardProtection() {
        this.hazardProtectionLevel = Math.max(0.2, 1 - (this.upgrades.hazardProtection.level * 0.2));
    }

    updateEcoMultiplier() {
        this.ecoMultiplier = 1 + (this.upgrades.ecoBooster.level * 0.25);
    }

    updateSpawnRates() {
        this.valuableSpawnRate = 0.3 + (this.upgrades.smartSorting.level * 0.1);
    }

    updateMultiCollector() {
        this.multiCollectorCount = 1 + this.upgrades.multiCollector.level;
        // Auto collector will now process multiple spots based on level
    }

    updateAutoSeller() {
        this.autoSellThreshold = this.upgrades.autoSeller.level * 0.1; // 10% per level
        if (this.autoSellThreshold > 0) {
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
        this.storageMultiplier = 1 + (this.upgrades.smartStorage.level * 0.5); // 50% increase per level
    }

    updateGoldenTouch() {
        this.goldenTouchChance = this.upgrades.goldenTouch.level * 0.05; // 5% chance per level
    }

    updateEcoMagnet() {
        this.spawnRate = 0.3 + (this.upgrades.ecoMagnet.level * 0.1); // 10% faster spawning per level
    }

    updateCityInspiration() {
        this.cityBonus = 1 + (this.upgrades.cityInspiration.level * 0.2); // 20% bonus per level
    }

    updateCollectionSpeed() {
        // Reduce collection cooldown
        this.collectionCooldown = Math.max(1000, 5000 - (this.upgrades.quickCollection.level * 750));
    }

    updateBulkBonus() {
        // Update bulk selling bonus
        this.bulkBonus = 1 + (this.upgrades.bulkSelling.level * 0.1);
    }

    startPassiveIncome() {
        // Start passive income based on eco points
        if (!this.passiveIncomeInterval) {
            this.passiveIncomeInterval = setInterval(() => {
                const income = Math.floor(this.ecoPoints * 0.01 * this.upgrades.passiveIncome.level);
                if (income > 0) {
                    this.money += income;
                    this.updateDisplay();
                }
            }, 10000);
        }
    }

    updateEnergyEfficiency() {
        // Make auto collector faster
        if (this.autoCollectorInterval) {
            this.startAutoCollection(); // Restart with new speed
        }
    }

    updateHazardScanning() {
        // Highlight hazardous materials
        this.hazardScanningLevel = this.upgrades.hazardScanner.level;
        // Add visual effect in updateCollectionZone
    }

    updateRecyclingBonus() {
        // Chance for bonus materials
        this.recyclingBonus = this.upgrades.recyclingEfficiency.level * 0.1;
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
        this.tutorialStep = 0;
        const tutorialSteps = [
            {
                title: "Welcome to EcoEmpire!",
                content: "Learn how to play and make a positive environmental impact. This tutorial will guide you through the basics.",
                highlight: null
            },
            {
                title: "Collection Zone",
                content: "Click on items in the collection zone to gather them. Green items are recyclable, while red items are hazardous.",
                highlight: ".collection-area"
            },
            {
                title: "Sorting Bins",
                content: "Collected recyclables go into these bins. Sell materials when bins are full to earn money.",
                highlight: ".sorting-area"
            },
            {
                title: "Sustainability Goals",
                content: "Complete quests to earn rewards and track your environmental impact. Click on quests to see details.",
                highlight: ".sdg-progress"
            },
            {
                title: "Auto Collector",
                content: "Upgrade your facility to automatically collect and process materials.",
                highlight: ".auto-collection-area"
            }
        ];

        // Create tutorial overlay
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.innerHTML = `
            <div class="tutorial-modal">
                <div class="tutorial-content"></div>
                <div class="tutorial-navigation">
                    <button class="tutorial-button-nav" id="prevStep">Previous</button>
                    <button class="tutorial-button-nav" id="nextStep">Next</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const updateTutorialContent = () => {
            const step = tutorialSteps[this.tutorialStep];
            const content = overlay.querySelector('.tutorial-content');
            content.innerHTML = `
                <h2>${step.title}</h2>
                <p>${step.content}</p>
            `;

            // Remove any existing highlights
            this.removeHighlights();

            // Add new highlight if needed
            if (step.highlight) {
                const element = document.querySelector(step.highlight);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const highlight = document.createElement('div');
                    highlight.className = 'tutorial-highlight';

                    // Add extra padding for sorting area
                    const extraPadding = step.highlight === '.sorting-area' ? 24 : 16;
                    
                    highlight.style.top = `${rect.top - extraPadding}px`;
                    highlight.style.left = `${rect.left - extraPadding}px`;
                    highlight.style.width = `${rect.width + (extraPadding * 2)}px`;
                    highlight.style.height = `${rect.height + (extraPadding * 2)}px`;
                    
                    // Adjust z-index to ensure highlight appears behind tooltips
                    highlight.style.zIndex = '998';
                    
                    document.body.appendChild(highlight);
                }
            }

            // Update navigation buttons
            const prevButton = overlay.querySelector('#prevStep');
            const nextButton = overlay.querySelector('#nextStep');
            prevButton.disabled = this.tutorialStep === 0;
            nextButton.textContent = this.tutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next';
        };

        // Add helper method to remove highlights
        this.removeHighlights = () => {
            const highlights = document.querySelectorAll('.tutorial-highlight');
            highlights.forEach(h => h.remove());
        };

        // Update the next button handler to ensure cleanup
        overlay.querySelector('#nextStep').onclick = () => {
            if (this.tutorialStep < tutorialSteps.length - 1) {
                this.tutorialStep++;
                updateTutorialContent();
            } else {
                this.removeHighlights(); // Remove highlights before removing overlay
                overlay.remove();
            }
        };

        // Add cleanup on tutorial exit
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.removeHighlights();
                overlay.remove();
            }
        }, { once: true });

        // Initialize first step
        updateTutorialContent();
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