// Add imports at the top
import { exchangeRates, currencySymbols, packagePrices, serviceConfigs } from './config.js';

// Load configurations on page load
document.addEventListener('DOMContentLoaded', () => {
    loadServiceConfigs();

    // Load package details
    const savedDetails = JSON.parse(localStorage.getItem('packageDetails')) || packageDetails;
    Object.entries(savedDetails).forEach(([type, content]) => {
        const textarea = document.getElementById(`${type}Details`);
        if (textarea) {
            textarea.value = content;
        }
    });
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
        services: {}
    };

    // Save service configurations
    Object.entries(serviceConfigs).forEach(([id, defaultConfig]) => {
        config.services[id] = {
            ...defaultConfig,
            // Update values from form inputs
            basePrice: parseInt(document.getElementById(`${id}_price`)?.value) || defaultConfig.basePrice,
            min: parseInt(document.getElementById(`${id}_min`)?.value) || defaultConfig.min,
            max: parseInt(document.getElementById(`${id}_max`)?.value) || defaultConfig.max,
            step: parseInt(document.getElementById(`${id}_step`)?.value) || defaultConfig.step,
            description: document.getElementById(`${id}_description`)?.value || defaultConfig.description,
            labels: document.getElementById(`${id}_labels`)?.value.split(',').map(l => l.trim()) || defaultConfig.labels
        };
    });

    localStorage.setItem('estimatorConfig', JSON.stringify(config));
    showToast('Configuration saved successfully', 'success');
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