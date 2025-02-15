// Service configurations
const serviceConfigs = {
    capture: {
        title: "Direct Your Capture",
        type: "range",
        min: 0,
        max: 5,
        step: 1,
        basePrice: 360,
        description: "Cost per capture session",
        labels: ["0", "1", "2", "3", "4", "5"]
    },
    voiceover: {
        title: "Voiceover",
        type: "toggle",
        price: 1000,
        description: "Professional voiceover recording with remote casting"
    },
    music: {
        title: "Music",
        type: "select",
        options: [
            { label: "Using Provided Music", price: 0 },
            { label: "Library Music", price: 575 },
            { label: "Premium Music", price: 2000 }
        ],
        description: "Choose between provided music, licensed library music, or premium custom music"
    },
    audio: {
        title: "Additional Audio Design and SFX",
        type: "stepped-range",
        min: 0,
        max: 2000,
        step: 500,
        labels: ["Standard", "£500", "£1,000", "£1,500", "£2,000"],
        description: "Enhance your trailer with additional sound design and SFX passes"
    },
    motion: {
        title: "Premium Motion Graphics",
        type: "tiered",
        tiers: [
            { label: "None", price: 0 },
            { label: "Basic", price: 3000 },
            { label: "Standard", price: 6000 },
            { label: "Premium", price: 9000 },
            { label: "Custom", price: 12000 }
        ],
        description: "Add professional motion graphics and title cards to your trailer"
    },
    versioning: {
        title: "Versioning",
        type: "composite",
        toggle: {
            type: "toggle",
            label: "Enable Custom Versions"
        },
        subOptions: {
            portrait: {
                type: "toggle",
                label: "Portrait Version",
                price: 1000
            },
            landscape: {
                type: "toggle",
                label: "Landscape Version",
                price: 1000
            },
            square: {
                type: "toggle",
                label: "Square Version",
                price: 1000
            },
            languages: {
                type: "range",
                label: "Language Packages",
                min: 0,
                max: 10,
                step: 1,
                pricePerUnit: 500,
                labels: ["0", "2", "4", "6", "8", "10"]
            }
        }
    }
};

// Load configurations on page load
document.addEventListener('DOMContentLoaded', () => {
    loadServiceConfigs();
});

function loadServiceConfigs() {
    const container = document.getElementById('serviceConfigs');
    
    Object.entries(serviceConfigs).forEach(([id, config]) => {
        const section = createServiceSection(id, config);
        container.appendChild(section);
    });
}

function createServiceSection(id, config) {
    const section = document.createElement('div');
    section.className = 'service-config';
    
    const title = document.createElement('h3');
    title.className = 'h5 fw-semibold mb-3';
    title.textContent = config.title;
    
    const content = document.createElement('div');
    content.className = 'row g-3';
    
    switch(config.type) {
        case 'range':
            content.innerHTML = `
                <div class="col-md-6">
                    <label class="form-label">Base Price</label>
                    <div class="input-group">
                        <span class="input-group-text">£</span>
                        <input type="number" class="form-control" 
                               id="${id}_price" value="${config.basePrice}">
                    </div>
                </div>
                <div class="col-md-2">
                    <label class="form-label">Min</label>
                    <input type="number" class="form-control" 
                           id="${id}_min" value="${config.min}">
                </div>
                <div class="col-md-2">
                    <label class="form-label">Max</label>
                    <input type="number" class="form-control" 
                           id="${id}_max" value="${config.max}">
                </div>
                <div class="col-md-2">
                    <label class="form-label">Step</label>
                    <input type="number" class="form-control" 
                           id="${id}_step" value="${config.step}">
                </div>
                <div class="col-12">
                    <label class="form-label">Labels (comma-separated)</label>
                    <input type="text" class="form-control" 
                           id="${id}_labels" value="${config.labels.join(', ')}">
                </div>
            `;
            break;

        case 'toggle':
            content.innerHTML = `
                <div class="col-md-6">
                    <label class="form-label">Price when Enabled</label>
                    <div class="input-group">
                        <span class="input-group-text">£</span>
                        <input type="number" class="form-control" 
                               id="${id}_price" value="${config.price}">
                    </div>
                </div>
            `;
            break;

        case 'select':
            let optionsHtml = config.options.map((opt, index) => `
                <div class="col-12 border-bottom pb-2 mb-2">
                    <div class="row g-2">
                        <div class="col-md-8">
                            <label class="form-label">Option ${index + 1} Label</label>
                            <input type="text" class="form-control" 
                                   id="${id}_opt${index}_label" value="${opt.label}">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Price</label>
                            <div class="input-group">
                                <span class="input-group-text">£</span>
                                <input type="number" class="form-control" 
                                       id="${id}_opt${index}_price" value="${opt.price}">
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            content.innerHTML = optionsHtml;
            break;

        case 'tiered':
            let tiersHtml = config.tiers.map((tier, index) => `
                <div class="col-12 border-bottom pb-2 mb-2">
                    <div class="row g-2">
                        <div class="col-md-8">
                            <label class="form-label">Tier ${index + 1} Label</label>
                            <input type="text" class="form-control" 
                                   id="${id}_tier${index}_label" value="${tier.label}">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Price</label>
                            <div class="input-group">
                                <span class="input-group-text">£</span>
                                <input type="number" class="form-control" 
                                       id="${id}_tier${index}_price" value="${tier.price}">
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            content.innerHTML = tiersHtml;
            break;

        case 'composite':
            content.innerHTML = `
                <div class="col-12 mb-3">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" 
                               id="${id}_enabled" checked>
                        <label class="form-check-label" for="${id}_enabled">
                            ${config.toggle.label}
                        </label>
                    </div>
                </div>
                <div class="col-12" id="${id}_subOptions">
                    ${Object.entries(config.subOptions).map(([subId, subConfig]) => `
                        <div class="border-start border-danger ps-4 mb-3">
                            <h4 class="h6 mb-2">${subConfig.label}</h4>
                            ${subConfig.type === 'toggle' ? `
                                <div class="input-group">
                                    <span class="input-group-text">£</span>
                                    <input type="number" class="form-control" 
                                           id="${id}_${subId}_price" value="${subConfig.price}">
                                </div>
                            ` : `
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <label class="form-label">Price per Unit</label>
                                        <div class="input-group">
                                            <span class="input-group-text">£</span>
                                            <input type="number" class="form-control" 
                                                   id="${id}_${subId}_price" value="${subConfig.pricePerUnit}">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Maximum Units</label>
                                        <input type="number" class="form-control" 
                                               id="${id}_${subId}_max" value="${subConfig.max}">
                                    </div>
                                </div>
                            `}
                        </div>
                    `).join('')}
                </div>
            `;
            break;
    }
    
    // Add description if present
    if (config.description) {
        content.innerHTML += `
            <div class="col-12 mt-3">
                <label class="form-label">Service Description</label>
                <textarea class="form-control" id="${id}_description" rows="2">${config.description}</textarea>
            </div>
        `;
    }
    
    section.appendChild(title);
    section.appendChild(content);
    return section;
}

function saveConfigurations() {
    const config = {
        // Package base prices
        packages: {
            rare: {
                name: "Rare",
                price: parseInt(document.getElementById('rarePrice').value),
                description: "Using your game capture, we'll create a high-quality trailer with motion graphics"
            },
            epic: {
                name: "Epic",
                price: parseInt(document.getElementById('epicPrice').value),
                description: "We handle the game capture plus additional edit iterations"
            },
            legendary: {
                name: "Legendary",
                price: parseInt(document.getElementById('legendaryPrice').value),
                description: "Extended collaboration with paper edit and motion graphics feedback"
            },
            mythic: {
                name: "Mythic",
                price: parseInt(document.getElementById('mythicPrice').value),
                description: "Premium experience with advanced gameplay and intricate storytelling"
            }
        },
        
        // Additional services
        services: {
            capture: {
                name: "Direct Your Capture",
                type: "range",
                pricePerUnit: parseInt(document.getElementById('capture_price').value),
                min: 0,
                max: parseInt(document.getElementById('capture_max').value),
                step: parseInt(document.getElementById('capture_step').value),
                description: document.getElementById('capture_description').value,
                labels: document.getElementById('capture_labels').value.split(',').map(l => l.trim())
            },
            voiceover: {
                name: "Professional Voiceover",
                type: "toggle",
                price: parseInt(document.getElementById('voiceover_price').value),
                description: document.getElementById('voiceover_description').value
            },
            music: {
                name: "Music",
                type: "select",
                description: document.getElementById('music_description').value,
                options: [
                    {
                        label: document.getElementById('music_opt0_label').value,
                        price: parseInt(document.getElementById('music_opt0_price').value)
                    },
                    {
                        label: document.getElementById('music_opt1_label').value,
                        price: parseInt(document.getElementById('music_opt1_price').value)
                    },
                    {
                        label: document.getElementById('music_opt2_label').value,
                        price: parseInt(document.getElementById('music_opt2_price').value)
                    }
                ]
            },
            audio: {
                name: "Additional Audio Design and SFX",
                type: "stepped-range",
                min: 0,
                max: parseInt(document.getElementById('audio_max').value),
                step: parseInt(document.getElementById('audio_step').value),
                description: document.getElementById('audio_description').value,
                labels: document.getElementById('audio_labels').value.split(',').map(l => l.trim())
            },
            motion: {
                name: "Premium Motion Graphics",
                type: "tiered",
                description: document.getElementById('motion_description').value,
                tiers: Array.from({ length: 5 }).map((_, i) => ({
                    label: document.getElementById(`motion_tier${i}_label`).value,
                    price: parseInt(document.getElementById(`motion_tier${i}_price`).value)
                }))
            },
            versioning: {
                name: "Versioning",
                type: "composite",
                description: "Custom versions for different platforms and languages",
                toggle: {
                    label: "Enable Custom Versions"
                },
                subOptions: {
                    portrait: {
                        name: "Portrait Version",
                        type: "toggle",
                        price: parseInt(document.getElementById('versioning_portrait_price').value)
                    },
                    landscape: {
                        name: "Landscape Version",
                        type: "toggle",
                        price: parseInt(document.getElementById('versioning_landscape_price').value)
                    },
                    square: {
                        name: "Square Version",
                        type: "toggle",
                        price: parseInt(document.getElementById('versioning_square_price').value)
                    },
                    languages: {
                        name: "Language Packages",
                        type: "range",
                        pricePerUnit: parseInt(document.getElementById('versioning_languages_price').value),
                        max: parseInt(document.getElementById('versioning_languages_max').value),
                        step: 1,
                        labels: ["0", "2", "4", "6", "8", "10"]
                    }
                }
            }
        }
    };

    // Save to localStorage
    localStorage.setItem('estimatorConfig', JSON.stringify(config, null, 2));
    
    // Show success message
    showToast('Configuration saved successfully!');
}

function exportConfig() {
    const config = JSON.parse(localStorage.getItem('estimatorConfig'));
    
    // Add metadata and comments
    const exportData = {
        _metadata: {
            version: "1.0",
            exportDate: new Date().toISOString(),
            description: "TrailerFarm Estimator Configuration"
        },
        _comments: {
            packages: "Base package configurations with prices in GBP",
            services: "Additional service configurations with various pricing models"
        },
        ...config
    };
    
    // Create formatted JSON with proper indentation
    const formattedJson = JSON.stringify(exportData, null, 2);
    
    // Add a header comment
    const fileContent = `// TrailerFarm Estimator Configuration
// Generated: ${new Date().toLocaleString()}
// Version: 1.0
// Note: All prices are in GBP (British Pounds)

${formattedJson}`;
    
    // Create and download the file
    const blob = new Blob([fileContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estimator-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add configuration schema validation
const configSchema = {
    required: ['packages', 'services'],
    properties: {
        packages: {
            type: 'object',
            required: ['rare', 'epic', 'legendary', 'mythic'],
            additionalProperties: false
        },
        services: {
            type: 'object',
            required: ['capture', 'voiceover', 'music', 'audio', 'motion', 'versioning'],
            additionalProperties: false
        }
    }
};

function validateConfig(config) {
    try {
        // Basic structure validation
        if (!config || typeof config !== 'object') {
            throw new Error('Invalid configuration format');
        }

        // Check required sections
        configSchema.required.forEach(section => {
            if (!(section in config)) {
                throw new Error(`Missing required section: ${section}`);
            }
        });

        // Validate packages
        Object.keys(config.packages).forEach(pkg => {
            if (!config.packages[pkg].price || !config.packages[pkg].description) {
                throw new Error(`Invalid package configuration: ${pkg}`);
            }
        });

        // Validate services
        Object.keys(config.services).forEach(service => {
            if (!config.services[service].type) {
                throw new Error(`Invalid service configuration: ${service}`);
            }
        });

        return true;
    } catch (error) {
        showToast(`Configuration error: ${error.message}`, 'danger');
        return false;
    }
}

// Update import function
function importConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
        try {
            const file = e.target.files[0];
            const content = await file.text();
            const config = JSON.parse(content);
            
            if (!validateConfig(config)) {
                return;
            }

            localStorage.setItem('estimatorConfig', JSON.stringify(config));
            showToast('Configuration imported successfully', 'success');
            setTimeout(() => location.reload(), 1000);
        } catch (error) {
            showToast('Error importing configuration', 'danger');
            console.error('Import error:', error);
        }
    };
    input.click();
}

// Add preview functionality
function previewEstimator() {
    const previewWindow = window.open('index.html', '_blank');
    previewWindow.focus();
} 