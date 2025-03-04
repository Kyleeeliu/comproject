class GameTutorial {
    constructor(game) {
        this.game = game;
        this.currentStep = 0;
        this.tutorialSteps = [
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
                title: "Valuable Items",
                content: "Keep an eye out for rare items with a golden glow! These include electronics 💻, glass 🔮, gems 💎, gold 🏆, and batteries 🔋. They're worth much more than regular items!",
                highlight: ".collection-grid"
            },
            {
                title: "Sorting Bins",
                content: "Regular materials go into the standard bins. Rare items have their own special golden bins - check them out!",
                highlight: ".sorting-area"
            },
            {
                title: "Rare Item Bins",
                content: "Rare items are automatically sorted into these special bins. Sell them for premium prices!",
                highlight: ".rare-bin"
            },
            {
                title: "Sustainability Goals",
                content: "Complete quests to earn rewards and track your environmental impact. Click on quests to see details.",
                highlight: ".sdg-progress"
            },
            {
                title: "Auto Collector",
                content: "Upgrade your facility to automatically collect and process materials, including rare items!",
                highlight: ".auto-collection-area"
            },
            {
                title: "Upgrades",
                content: "Purchase upgrades to improve your recycling operation. Some upgrades like Golden Touch can help you find more valuable materials!",
                highlight: ".upgrades-panel"
            }
        ];
    }

    start() {
        this.createTutorialOverlay();
        this.showStep(0);
        
        // Add keyboard listener for ESC to exit tutorial
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTutorial();
            }
        });
        
        // Add scroll and resize listeners to update highlight positions
        this.scrollHandler = () => this.updateHighlightPosition();
        this.resizeHandler = () => this.updateHighlightPosition();
        
        window.addEventListener('scroll', this.scrollHandler);
        window.addEventListener('resize', this.resizeHandler);
    }

    createTutorialOverlay() {
        // Create tutorial container that will float at the top
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-container';
        overlay.innerHTML = `
            <div class="tutorial-box">
                <div class="tutorial-content"></div>
                <div class="tutorial-navigation">
                    <button class="tutorial-button-nav" id="prevStep">Previous</button>
                    <span class="tutorial-progress">1/${this.tutorialSteps.length}</span>
                    <button class="tutorial-button-nav" id="nextStep">Next</button>
                </div>
                <button class="tutorial-close">×</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // Add event listeners
        overlay.querySelector('#prevStep').addEventListener('click', () => this.prevStep());
        overlay.querySelector('#nextStep').addEventListener('click', () => this.nextStep());
        overlay.querySelector('.tutorial-close').addEventListener('click', () => this.closeTutorial());
        
        this.overlay = overlay;
    }

    showStep(stepIndex) {
        this.currentStep = stepIndex;
        const step = this.tutorialSteps[stepIndex];
        
        // Update content
        const content = this.overlay.querySelector('.tutorial-content');
        content.innerHTML = `
            <h2>${step.title}</h2>
            <p>${step.content}</p>
        `;
        
        // Update progress indicator
        this.overlay.querySelector('.tutorial-progress').textContent = 
            `${stepIndex + 1}/${this.tutorialSteps.length}`;
        
        // Update navigation buttons
        const prevButton = this.overlay.querySelector('#prevStep');
        const nextButton = this.overlay.querySelector('#nextStep');
        prevButton.disabled = stepIndex === 0;
        nextButton.textContent = stepIndex === this.tutorialSteps.length - 1 ? 'Finish' : 'Next';
        
        // Remove any existing highlights
        this.removeHighlights();
        
        // Add new highlight if needed
        if (step.highlight) {
            this.highlightElement(step.highlight);
        }
    }

    highlightElement(selector) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        // Create highlight element
        const highlight = document.createElement('div');
        highlight.className = 'tutorial-highlight';
        
        // Position the highlight - use fixed positioning based on viewport
        const rect = element.getBoundingClientRect();
        const extraPadding = 16;
        
        // Set position with fixed positioning to ensure it stays in place
        highlight.style.position = 'fixed';
        highlight.style.top = `${rect.top - extraPadding}px`;
        highlight.style.left = `${rect.left - extraPadding}px`;
        highlight.style.width = `${rect.width + (extraPadding * 2)}px`;
        highlight.style.height = `${rect.height + (extraPadding * 2)}px`;
        
        document.body.appendChild(highlight);
        
        // Scroll to the highlighted element with a slight delay to ensure proper positioning
        setTimeout(() => {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    }

    removeHighlights() {
        const highlights = document.querySelectorAll('.tutorial-highlight');
        highlights.forEach(h => h.remove());
    }

    nextStep() {
        if (this.currentStep < this.tutorialSteps.length - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.closeTutorial();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    updateHighlightPosition() {
        if (this.currentStep >= 0 && this.tutorialSteps[this.currentStep].highlight) {
            this.removeHighlights();
            this.highlightElement(this.tutorialSteps[this.currentStep].highlight);
        }
    }

    closeTutorial() {
        this.removeHighlights();
        if (this.overlay) {
            this.overlay.remove();
        }
        
        // Remove event listeners
        window.removeEventListener('scroll', this.scrollHandler);
        window.removeEventListener('resize', this.resizeHandler);
    }
}

// This will be called from the main game class
function startTutorial(game) {
    const tutorial = new GameTutorial(game);
    tutorial.start();
    return tutorial;
} 