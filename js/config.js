// Currency configurations
const exchangeRates = {
    GBP: 1,
    USD: 1.27,  // Example rate
    EUR: 1.17   // Example rate
};

const currencySymbols = {
    GBP: '£',
    USD: '$',
    EUR: '€'
};

// Package configurations
const packagePrices = {
    rare: 7500,
    epic: 10000,
    legendary: 15000,
    mythic: 20000
};

// Package details for info modal
const packageDetails = {
    rare: `• High-quality trailer creation
• Basic motion graphics package
• One round of revisions
• Standard audio mix
• Up to 2-minute duration`,
    epic: `• Professional game capture
• Enhanced motion graphics
• Two rounds of revisions
• Premium audio mix
• Up to 2.5-minute duration`,
    legendary: `• Professional game capture
• Advanced motion graphics
• Unlimited revisions
• Custom audio design
• Up to 3-minute duration
• Paper edit approval`,
    mythic: `• Premium game capture
• Bespoke motion graphics
• Unlimited revisions
• Custom audio design
• Flexible duration
• Full creative collaboration
• Priority support`
};

// Unified service configurations
const serviceConfigs = {
    capture: {
        title: "Direct Your Capture",
        type: "range",
        min: 0,
        max: 5,
        step: 1,
        basePrice: 360,
        description: "Cost per capture session",
        labels: ["0", "1", "2", "3", "4", "5"],
        availableFor: ['rare'],
        includedMessage: "Game capture is included in this package tier",
        levelDescriptions: {
            0: "Using your provided game capture",
            1: "One directed capture session (£360)",
            2: "Two directed capture sessions (£720)",
            3: "Three directed capture sessions (£1,080)",
            4: "Four directed capture sessions (£1,440)",
            5: "Five directed capture sessions (£1,800)"
        }
    },
    voiceover: {
        title: "Voiceover",
        type: "range",
        min: 0,
        max: 1,
        step: 1,
        price: 1000,
        description: "Professional voiceover recording with remote casting",
        labels: ["No", "Yes"],
        availableFor: ['rare', 'epic', 'legendary', 'mythic'],
        levelDescriptions: {
            0: "No voiceover",
            1: "Professional voiceover (£1,000)"
        }
    },
    music: {
        title: "Music",
        type: "range",
        min: 0,
        max: 2,
        step: 1,
        description: "Choose between provided music, licensed library music, or premium custom music",
        labels: ["Provided", "Library", "Premium"],
        prices: [0, 575, 2000],
        availableFor: ['rare', 'epic', 'legendary'],
        includedMessage: "Premium music is included in the Mythic package",
        levelDescriptions: {
            0: "Using your provided music",
            1: "Licensed library music (£575)",
            2: "Premium custom music (£2,000)"
        }
    },
    audio: {
        title: "Additional Audio Design and SFX",
        type: "range",
        min: 0,
        max: 4,
        step: 1,
        description: "Enhance your trailer with additional sound design and SFX passes",
        labels: ["Standard", "Basic", "Enhanced", "Premium", "Custom"],
        prices: [0, 500, 1000, 1500, 2000],
        availableFor: ['rare', 'epic'],
        includedMessage: "Premium audio design is included in Legendary and Mythic packages",
        levelDescriptions: {
            0: "Standard audio mix",
            1: "Basic SFX package (£500)",
            2: "Enhanced audio design (£1,000)",
            3: "Premium sound design (£1,500)",
            4: "Custom audio experience (£2,000)"
        }
    },
    motion: {
        title: "Premium Motion Graphics",
        type: "range",
        min: 0,
        max: 4,
        step: 1,
        description: "Add professional motion graphics and title cards",
        labels: ["None", "Basic", "Standard", "Premium", "Custom"],
        prices: [0, 3000, 6000, 9000, 12000],
        availableFor: ['rare', 'epic'],
        includedMessage: "Advanced motion graphics are included in Legendary and Mythic packages",
        levelDescriptions: {
            0: "No additional motion graphics",
            1: "Basic motion graphics package (£3,000)",
            2: "Standard motion graphics suite (£6,000)",
            3: "Premium motion graphics package (£9,000)",
            4: "Custom motion graphics experience (£12,000)"
        }
    },
    versioning: {
        title: "Versioning",
        type: "range",
        min: 0,
        max: 1,
        step: 1,
        description: "Create additional versions of your trailer",
        labels: ["Standard", "Custom"],
        availableFor: ['rare', 'epic', 'legendary', 'mythic'],
        subOptions: {
            portrait: {
                name: "Portrait Version",
                price: 1000
            },
            landscape: {
                name: "Landscape Version",
                price: 1000
            },
            square: {
                name: "Square Version",
                price: 1000
            },
            languages: {
                name: "Language Packages",
                pricePerUnit: 500,
                max: 10,
                step: 2,
                labels: ["0", "2", "4", "6", "8", "10"]
            }
        }
    }
}; 