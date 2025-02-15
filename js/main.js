// Main JavaScript functionality
// ... all the existing JavaScript functions ... 

// Add this at the top of main.js
const defaultConfig = {
    packages: {
        rare: {
            name: "Rare",
            price: 7500,
            description: "Using your game capture, we'll create a high-quality trailer with motion graphics"
        },
        epic: {
            name: "Epic",
            price: 10000,
            description: "We handle the game capture plus additional edit iterations"
        },
        legendary: {
            name: "Legendary",
            price: 15000,
            description: "Extended collaboration with paper edit and motion graphics feedback"
        },
        mythic: {
            name: "Mythic",
            price: 20000,
            description: "Premium experience with advanced gameplay and intricate storytelling"
        }
    },
    services: {
        capture: {
            name: "Direct Your Capture",
            type: "range",
            pricePerUnit: 360,
            min: 0,
            max: 5,
            step: 1,
            description: "Cost per capture session",
            labels: ["0", "1", "2", "3", "4", "5"]
        },
        voiceover: {
            name: "Voiceover",
            type: "toggle",
            price: 1000,
            description: "Professional voiceover recording"
        },
        music: {
            name: "Music",
            type: "select",
            options: [
                { label: "Using Provided Music", price: 0 },
                { label: "Library Music", price: 575 },
                { label: "Premium Music", price: 2000 }
            ]
        },
        audio: {
            name: "Additional Audio Design and SFX",
            type: "stepped-range",
            min: 0,
            max: 2000,
            step: 500,
            labels: ["Standard", "£500", "£1,000", "£1,500", "£2,000"]
        },
        motion: {
            name: "Premium Motion Graphics",
            type: "tiered",
            tiers: [
                { label: "None", price: 0 },
                { label: "Basic", price: 3000 },
                { label: "Standard", price: 6000 },
                { label: "Premium", price: 9000 },
                { label: "Custom", price: 12000 }
            ]
        },
        versioning: {
            name: "Versioning",
            type: "composite",
            toggle: {
                label: "Enable Custom Versions"
            },
            subOptions: {
                portrait: {
                    name: "Portrait Version",
                    type: "toggle",
                    price: 1000
                },
                landscape: {
                    name: "Landscape Version",
                    type: "toggle",
                    price: 1000
                },
                square: {
                    name: "Square Version",
                    type: "toggle",
                    price: 1000
                },
                languages: {
                    name: "Language Packages",
                    type: "range",
                    pricePerUnit: 500,
                    max: 10,
                    step: 1,
                    labels: ["0", "2", "4", "6", "8", "10"]
                }
            }
        }
    }
};

// Update slider values and calculations in real-time
document.querySelectorAll('input[type="range"], input[type="radio"]').forEach(input => {
    input.addEventListener('input', () => {
        updateSliderValues();
        updateEstimate();
    });
});

// Handle currency selection
document.querySelectorAll('.currency-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.currency-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        updateSliderValues();
        updateEstimate();
        localStorage.setItem('selectedCurrency', this.dataset.currency);
    });
});

// Handle versioning sub-sliders visibility
document.getElementById('versioning')?.addEventListener('input', function() {
    const subSliders = document.getElementById('versioningOptions');
    if (subSliders) {
        if (this.value === '1') {
            subSliders.classList.remove('d-none');
        } else {
            subSliders.classList.add('d-none');
        }
    }
});

// Helper Functions
function updateSliderUI(slider) {
    if (!slider) return;
    const value = parseInt(slider.value);
    const max = parseInt(slider.max);
    const progress = (value / max) * 100;
    
    // Add custom styling for the progress
    slider.style.background = `linear-gradient(to right, var(--tf-accent) ${progress}%, var(--tf-gray) ${progress}%)`;
}

function updateSliderValues() {
    const config = JSON.parse(localStorage.getItem('estimatorConfig'));
    if (!config) return;

    const currentCurrency = document.querySelector('.currency-option.active')?.dataset.currency;
    if (!currentCurrency) return;
    
    const rate = exchangeRates[currentCurrency];
    const symbol = currencySymbols[currentCurrency];

    document.querySelectorAll('input[type="range"]').forEach(slider => {
        const value = parseInt(slider.value);
        const display = slider.nextElementSibling;
        const descriptionEl = slider.closest('.mb-4').querySelector('.service-description');
        
        if (display && config.services[slider.id]) {
            const serviceConfig = config.services[slider.id];
            
            // Update description
            if (descriptionEl && serviceLevelDescriptions[slider.id]) {
                descriptionEl.textContent = serviceLevelDescriptions[slider.id][value] || '';
            }
            
            // Update value display based on type
            switch(slider.id) {
                case 'capture':
                    const captureCost = value * 360;
                    display.textContent = captureCost > 0 ? 
                        `${value} Session${value > 1 ? 's' : ''} (${symbol}${(captureCost * rate).toLocaleString()})` : 
                        'No Extra Sessions';
                    break;
                case 'voiceover':
                    display.textContent = value === 1 ? 
                        `Professional VO (${symbol}${(1000 * rate).toLocaleString()})` : 
                        'No Voiceover';
                    break;
                case 'music':
                    const musicCosts = [0, 575, 2000];
                    const musicLabels = ['Using Provided Music', 'Library Music', 'Premium Music'];
                    display.textContent = value === 0 ? 
                        musicLabels[0] : 
                        `${musicLabels[value]} (${symbol}${(musicCosts[value] * rate).toLocaleString()})`;
                    break;
                case 'audio':
                    display.textContent = value > 0 ? 
                        `${symbol}${(value * rate).toLocaleString()}` : 
                        'Standard Mix';
                    break;
                case 'motion':
                    const motionCosts = [0, 3000, 6000, 9000, 12000];
                    const motionLabels = ['No Title Cards', 'Basic', 'Standard', 'Premium', 'Custom'];
                    const motionIndex = Math.floor(value / 3000);
                    display.textContent = value > 0 ? 
                        `${motionLabels[motionIndex]} (${symbol}${(value * rate).toLocaleString()})` : 
                        'No Title Cards';
                    break;
                case 'portrait':
                case 'landscape':
                case 'square':
                    display.textContent = value === 1 ? 
                        `Yes (${symbol}${(1000 * rate).toLocaleString()})` : 
                        'No';
                    break;
                case 'languages':
                    const languageCost = value * 500;
                    display.textContent = value > 0 ? 
                        `${value} Language${value > 1 ? 's' : ''} (${symbol}${(languageCost * rate).toLocaleString()})` : 
                        'None';
                    break;
                case 'versioning':
                    display.textContent = value === 1 ? 'Custom Versions' : 'Standard Version';
                    break;
            }
        }
    });
}

function updateEstimate() {
    try {
        // Get selected package and currency
        const selectedPackage = document.querySelector('input[name="packageType"]:checked');
        const currencyOption = document.querySelector('.currency-option-small.active');
        
        // If no package selected, show default state
        if (!selectedPackage || !currencyOption) {
            document.getElementById('basePrice').textContent = 'Select a package';
            document.getElementById('additionalPrice').textContent = '£0';
            document.getElementById('totalPrice').textContent = 'Select a package';
            return;
        }

        // Get currency info
        const currency = currencyOption.dataset.currency;
        const rate = exchangeRates[currency];
        const symbol = currencySymbols[currency];

        // Calculate base price
        const basePrice = packagePrices[selectedPackage.value];
        let additionalCosts = 0;

        // Calculate additional costs
        if (selectedPackage.value === 'rare') {
            additionalCosts += parseInt(document.getElementById('capture').value) * 360;
        }

        // Add other costs
        if (document.getElementById('voiceover').value === '1') additionalCosts += 1000;
        additionalCosts += [0, 575, 2000][parseInt(document.getElementById('music').value)];
        additionalCosts += parseInt(document.getElementById('audio').value);
        additionalCosts += parseInt(document.getElementById('motion').value);

        // Versioning costs
        if (document.getElementById('versioning').value === '1') {
            if (document.getElementById('portrait').value === '1') additionalCosts += 1000;
            if (document.getElementById('landscape').value === '1') additionalCosts += 1000;
            if (document.getElementById('square').value === '1') additionalCosts += 1000;
            additionalCosts += parseInt(document.getElementById('languages').value) * 500;
        }

        // Convert to selected currency
        const convertedBase = basePrice * rate;
        const convertedAdditional = additionalCosts * rate;
        const total = convertedBase + convertedAdditional;

        // Format numbers
        const formatNumber = (num) => num.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        // Update display
        document.getElementById('basePrice').textContent = `${symbol}${formatNumber(convertedBase)}`;
        document.getElementById('additionalPrice').textContent = `${symbol}${formatNumber(convertedAdditional)}`;
        document.getElementById('totalPrice').textContent = `${symbol}${formatNumber(total)}`;

        // Enable/disable quote button
        const quoteButton = document.querySelector('button[onclick="showQuote()"]');
        if (quoteButton) {
            quoteButton.disabled = !selectedPackage;
        }
    } catch (error) {
        console.error('Error updating estimate:', error);
        showToast('Error calculating estimate. Please try again.', 'danger');
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize config if not exists
    if (!localStorage.getItem('estimatorConfig')) {
        localStorage.setItem('estimatorConfig', JSON.stringify(defaultConfig));
    }

    // Package selection
    document.querySelectorAll('input[name="packageType"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updateSliderValues();
            updateEstimate();
        });
    });

    // Range inputs
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', () => {
            updateSliderUI(slider);
            updateSliderValues();
            updateEstimate();
        });
    });

    // Versioning slider special handling
    const versioningSlider = document.getElementById('versioning');
    if (versioningSlider) {
        versioningSlider.addEventListener('input', function() {
            const subSliders = document.getElementById('versioningOptions');
            if (this.value === '1') {
                subSliders.classList.remove('d-none');
            } else {
                subSliders.classList.add('d-none');
            }
            updateEstimate();
        });
    }

    // Currency selector
    document.querySelectorAll('.currency-option-small').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.currency-option-small').forEach(opt => {
                opt.classList.remove('active');
                opt.setAttribute('aria-pressed', 'false');
            });
            
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            updateDisplayedPrices();
            updateSliderValues();
            updateEstimate();
        });
    });

    // Initialize with GBP
    const gbpButton = document.querySelector('[data-currency="GBP"]');
    if (gbpButton) {
        gbpButton.classList.add('active');
        gbpButton.setAttribute('aria-pressed', 'true');
    }

    // Initialize displays
    updateDisplayedPrices();
    updateSliderValues();
    updateEstimate();
});

function showQuote() {
    const quoteButton = document.querySelector('button[onclick="showQuote()"]');
    quoteButton.disabled = true;
    quoteButton.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Creating Quote...
    `;

    try {
        // Get the modal element
        const quoteOverlay = document.getElementById('quoteOverlay');
        if (!quoteOverlay) return;

        // Create and populate quote content
        const selectedPackage = document.querySelector('input[name="packageType"]:checked');
        if (!selectedPackage) return;

        // Set the date
        const dateElement = quoteOverlay.querySelector('.quote-date');
        if (dateElement) {
            dateElement.textContent = `Date: ${new Date().toLocaleDateString()}`;
        }

        // Get the quote content container
        const quoteContent = quoteOverlay.querySelector('.quote-content');
        if (!quoteContent) return;

        // Build the quote content
        const packageName = selectedPackage.value.charAt(0).toUpperCase() + selectedPackage.value.slice(1);
        const basePrice = document.getElementById('basePrice').textContent;
        const additionalPrice = document.getElementById('additionalPrice').textContent;
        const totalPrice = document.getElementById('totalPrice').textContent;

        // Get all selected services
        const services = [];
        
        // Capture sessions
        const captureSessions = parseInt(document.getElementById('capture').value);
        if (captureSessions > 0) {
            services.push({
                name: 'Direct Your Capture',
                value: `${captureSessions} Session${captureSessions > 1 ? 's' : ''}`,
                price: document.getElementById('capture').nextElementSibling.textContent
            });
        }

        // Voiceover
        if (document.getElementById('voiceover').value === '1') {
            services.push({
                name: 'Professional Voiceover',
                value: 'Yes',
                price: document.getElementById('voiceover').nextElementSibling.textContent
            });
        }

        // Music
        const musicValue = parseInt(document.getElementById('music').value);
        if (musicValue > 0) {
            services.push({
                name: 'Music',
                value: document.getElementById('music').nextElementSibling.textContent
            });
        }

        // Audio Design
        const audioValue = parseInt(document.getElementById('audio').value);
        if (audioValue > 0) {
            services.push({
                name: 'Additional Audio Design',
                value: document.getElementById('audio').nextElementSibling.textContent
            });
        }

        // Motion Graphics
        const motionValue = parseInt(document.getElementById('motion').value);
        if (motionValue > 0) {
            services.push({
                name: 'Motion Graphics',
                value: document.getElementById('motion').nextElementSibling.textContent
            });
        }

        // Versioning
        if (document.getElementById('versioning').value === '1') {
            const versionServices = [];
            ['portrait', 'landscape', 'square'].forEach(type => {
                if (document.getElementById(type).value === '1') {
                    versionServices.push({
                        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Version`,
                        value: document.getElementById(type).nextElementSibling.textContent
                    });
                }
            });

            const languages = parseInt(document.getElementById('languages').value);
            if (languages > 0) {
                versionServices.push({
                    name: 'Language Packages',
                    value: document.getElementById('languages').nextElementSibling.textContent
                });
            }

            if (versionServices.length > 0) {
                services.push({
                    name: 'Custom Versions',
                    subServices: versionServices
                });
            }
        }

        // Create the HTML content
        quoteContent.innerHTML = `
            <div class="quote-section">
                <h3>Selected Package</h3>
                <p class="mb-0">${packageName} Package - ${basePrice}</p>
                <small class="text-muted">${document.querySelector(`.${selectedPackage.value}-content p`).textContent}</small>
            </div>
            ${services.length > 0 ? `
                <div class="quote-section">
                    <h3>Additional Services</h3>
                    ${services.map(service => `
                        <div class="mb-3">
                            <div class="d-flex justify-content-between align-items-start">
                                <strong>${service.name}</strong>
                                ${service.price ? `<span class="ms-3">${service.price}</span>` : ''}
                            </div>
                            ${service.value ? `<div class="text-muted small">${service.value}</div>` : ''}
                            ${service.subServices ? `
                                <div class="ps-3 mt-2 border-start border-danger">
                                    ${service.subServices.map(sub => `
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <span>${sub.name}</span>
                                            <span class="ms-3">${sub.value}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                    <div class="border-top pt-2 mt-3">
                        <div class="d-flex justify-content-between">
                            <strong>Total Additional Services</strong>
                            <span>${additionalPrice}</span>
                        </div>
                    </div>
                </div>
            ` : ''}
            <div class="quote-section">
                <h3>Total</h3>
                <p class="text-danger fw-bold fs-4 mb-0">${totalPrice}</p>
                <small class="text-muted">All prices are in ${currencyOption.querySelector('span').textContent}</small>
            </div>
        `;

        // Show the modal
        const modal = new bootstrap.Modal(quoteOverlay);
        modal.show();
    } catch (error) {
        console.error('Error generating quote:', error);
        showToast('Error generating quote. Please try again.', 'danger');
    } finally {
        quoteButton.disabled = false;
        quoteButton.textContent = 'Create Quote';
    }
}

function closeQuote() {
    const quoteOverlay = document.getElementById('quoteOverlay');
    if (!quoteOverlay) return;

    const modal = bootstrap.Modal.getInstance(quoteOverlay);
    if (modal) {
        modal.hide();
    }
}

function updateDisplayedPrices() {
    const activeButton = document.querySelector('.currency-option-small.active');
    if (!activeButton) {
        console.error('No active currency button found');
        return;
    }

    const currency = activeButton.dataset.currency;
    const rate = exchangeRates[currency];
    const symbol = currencySymbols[currency];

    // Update package prices using packagePrices from config.js
    Object.entries(packagePrices).forEach(([type, price]) => {
        const priceElement = document.querySelector(`.${type}-content .h5`);
        if (priceElement) {
            const convertedPrice = Math.round(price * rate);
            priceElement.textContent = `${symbol}${convertedPrice.toLocaleString()}`;
        }
    });

    // Update service prices in labels
    document.querySelectorAll('.text-muted.small span').forEach(label => {
        const priceMatch = label.textContent.match(/[£$€](\d+,?\d*)/);
        if (priceMatch) {
            const price = parseInt(priceMatch[1].replace(',', ''));
            const convertedPrice = price * rate;
            label.textContent = label.textContent.replace(
                /[£$€]\d+,?\d*/, 
                `${symbol}${convertedPrice.toLocaleString()}`
            );
        }
    });
}

function generateQuotePDF() {
    const quoteContent = document.querySelector('.quote-content');
    const date = document.querySelector('.quote-date').textContent;
    
    // You can use a library like html2pdf.js or jsPDF
    // For now, we'll just prepare the content
    const content = `
        ${date}
        
        ${quoteContent.innerText}
        
        The TrailerFarm - Game Trailer Specialists
        This quote is valid for 30 days from the date shown above.
    `;
    
    // For demonstration, we'll create a text file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trailer-quote.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add to the top of main.js
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">${type === 'success' ? 'Success' : 'Error'}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body bg-dark text-light">
                ${message}
            </div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Add to the top of main.js
function validateCurrencySelection(currency) {
    const validCurrencies = ['GBP', 'USD', 'EUR'];
    if (!validCurrencies.includes(currency)) {
        showToast('Invalid currency selected', 'danger');
        return false;
    }
    return true;
}

// Add header state management
function updateHeaderState(loading = false) {
    const adminLink = document.querySelector('.admin-link');
    const currencyButtons = document.querySelectorAll('.currency-option-small');
    
    if (loading) {
        adminLink.classList.add('disabled');
        currencyButtons.forEach(btn => btn.disabled = true);
    } else {
        adminLink.classList.remove('disabled');
        currencyButtons.forEach(btn => btn.disabled = false);
    }
}

// ... other functions 