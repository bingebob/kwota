// Main JavaScript functionality
// ... all the existing JavaScript functions ... 

// Add this function to handle slider snapping
function snapSliderToIncrement(slider) {
    const step = parseFloat(slider.step) || 1;
    const newValue = Math.round(slider.value / step) * step;
    slider.value = newValue;
    updateSliderUI(slider);
}

// Update the event listeners for sliders
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', () => {
        updateSliderUI(slider);
        updateSliderValues();
        updateEstimate();
    });

    slider.addEventListener('change', () => {
        snapSliderToIncrement(slider);
    });
});

// Update the slider UI function
function updateSliderUI(slider) {
    if (!slider) return;
    const value = parseFloat(slider.value);
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const progress = ((value - min) / (max - min)) * 100;
    
    // Update the background gradient
    slider.style.background = `linear-gradient(to right, 
        var(--tf-accent) ${progress}%, 
        var(--tf-gray) ${progress}%
    )`;
}

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

// Core functions for price calculation and UI updates
function updateSliderValues() {
    const activeButton = document.querySelector('.currency-option-small.active');
    if (!activeButton) return;

    const currency = activeButton.dataset.currency;
    const rate = exchangeRates[currency];
    const symbol = currencySymbols[currency];

    document.querySelectorAll('input[type="range"]').forEach(slider => {
        const value = parseInt(slider.value);
        const display = slider.nextElementSibling;
        const config = serviceConfigs[slider.id];
        
        if (display && config) {
            let description = config.levelDescriptions[value] || '';
            description = description.replace(/£(\d+,?\d*)/g, (match, price) => {
                const convertedPrice = Math.round(parseInt(price.replace(',', '')) * rate);
                return `${symbol}${convertedPrice.toLocaleString()}`;
            });
            display.textContent = description;
        }
    });
}

function updateEstimate() {
    const selectedPackage = document.querySelector('input[name="packageType"]:checked');
    const currencyOption = document.querySelector('.currency-option-small.active');
    
    if (!selectedPackage || !currencyOption) {
        document.getElementById('basePrice').textContent = 'Select a package';
        document.getElementById('additionalPrice').textContent = '£0';
        document.getElementById('totalPrice').textContent = 'Select a package';
        return;
    }

    const currency = currencyOption.dataset.currency;
    const rate = exchangeRates[currency];
    const symbol = currencySymbols[currency];

    const basePrice = packagePrices[selectedPackage.value] * rate;
    let additionalCosts = 0;

    // Calculate additional costs from services
    Object.entries(serviceConfigs).forEach(([id, config]) => {
        const slider = document.getElementById(id);
        if (slider) {
            const value = parseInt(slider.value);
            if (config.basePrice) {
                additionalCosts += value * config.basePrice;
            } else if (config.price) {
                additionalCosts += value * config.price;
            } else if (config.prices) {
                additionalCosts += config.prices[value] || 0;
            }
        }
    });

    additionalCosts *= rate;

    // Update display
    document.getElementById('basePrice').textContent = `${symbol}${Math.round(basePrice).toLocaleString()}`;
    document.getElementById('additionalPrice').textContent = `${symbol}${Math.round(additionalCosts).toLocaleString()}`;
    document.getElementById('totalPrice').textContent = `${symbol}${Math.round(basePrice + additionalCosts).toLocaleString()}`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize config if not exists
    if (!localStorage.getItem('estimatorConfig')) {
        localStorage.setItem('estimatorConfig', JSON.stringify(defaultConfig));
    }

    // Package selection
    document.querySelectorAll('input[name="packageType"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updateServiceVisibility();
            const pixelCanvas = radio.closest('.package-card').querySelector('pixel-canvas');
            if (pixelCanvas) pixelCanvas.handleSelectionChange();
        });
    });

    // Currency selection
    document.querySelectorAll('.currency-option-small').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.currency-option-small').forEach(btn => 
                btn.classList.remove('active')
            );
            this.classList.add('active');
            updateSliderValues();
            updateEstimate();
        });
    });

    // Initialize
    updateServiceVisibility();
    updateSliderValues();
    updateEstimate();

    // Add event listener for info buttons
    const packageInfoModal = document.getElementById('packageInfoModal');
    if (packageInfoModal) {
        packageInfoModal.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget;
            const packageType = button.dataset.package;
            const modalTitle = packageInfoModal.querySelector('.modal-title');
            const modalContent = packageInfoModal.querySelector('.modal-body');

            modalTitle.textContent = `${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Package Details`;
            modalContent.innerHTML = `<pre class="text-light mb-0">${packageDetails[packageType]}</pre>`;
        });
    }

    // Generate sliders from serviceConfigs
    const servicesContainer = document.querySelector('.additional-services-container');
    Object.entries(serviceConfigs).forEach(([id, config]) => {
        servicesContainer.innerHTML += createSlider(config, id);
    });
});

// Quote generation
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

    // Update package prices
    Object.entries(packagePrices).forEach(([type, price]) => {
        const priceElement = document.querySelector(`.package-card.${type} .h5`);
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
            const convertedPrice = Math.round(price * rate);
            label.textContent = label.textContent.replace(
                /[£$€]\d+,?\d*/, 
                `${symbol}${convertedPrice.toLocaleString()}`
            );
        }
    });

    // Update slider values
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        updateSliderUI(slider);
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

// Add the Pixel and PixelCanvas classes here
// ... (paste the provided JavaScript code) ...

// Register the custom element
PixelCanvas.register();

// ... other functions 

function updateServiceVisibility() {
    const selectedPackage = document.querySelector('input[name="packageType"]:checked')?.value;
    if (!selectedPackage) return;

    Object.entries(serviceConfigs).forEach(([serviceId, service]) => {
        const serviceElement = document.getElementById(`${serviceId}Group`);
        if (!serviceElement) return;

        if (service.availableFor && !service.availableFor.includes(selectedPackage)) {
            serviceElement.classList.add('service-included');
            if (service.includedMessage) {
                const messageEl = serviceElement.querySelector('.service-included-message') || 
                    document.createElement('div');
                messageEl.className = 'service-included-message text-muted small mt-2';
                messageEl.textContent = service.includedMessage;
                serviceElement.appendChild(messageEl);
            }
            const inputs = serviceElement.querySelectorAll('input');
            inputs.forEach(input => {
                if (input.type === 'range') input.value = input.min;
            });
        } else {
            serviceElement.classList.remove('service-included');
            const messageEl = serviceElement.querySelector('.service-included-message');
            if (messageEl) messageEl.remove();
        }
    });

    updateSliderValues();
    updateEstimate();
}

function createSlider(config, id) {
    return `
        <div class="service-section mb-4" id="${id}Group">
            <h4 class="h5 fw-semibold mb-3">${config.title}</h4>
            <div class="slider-container">
                <div class="slider-wrapper">
                    <input type="range" 
                           id="${id}" 
                           min="${config.min}" 
                           max="${config.max}" 
                           step="${config.step}" 
                           value="${config.min}"
                           class="form-range">
                    <div class="slider-ticks">
                        ${config.labels.map(label => `<span>${label}</span>`).join('')}
                    </div>
                </div>
                <div class="slider-value">${config.levelDescriptions[0]}</div>
            </div>
            <div class="service-description text-muted small mt-1"></div>
        </div>
    `;
} 