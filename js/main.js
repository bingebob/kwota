// Main JavaScript functionality
// ... all the existing JavaScript functions ... 

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
    const value = slider.value;
    const max = slider.max;
    const progress = (value / max) * 100;
    
    // Add custom styling for the progress
    slider.style.background = `linear-gradient(to right, var(--tf-accent) ${progress}%, var(--tf-gray) ${progress}%)`;
}

function updateSliderValues() {
    const currentCurrency = document.querySelector('.currency-option.active')?.dataset.currency;
    if (!currentCurrency) return;
    
    const rate = exchangeRates[currentCurrency];
    const symbol = currencySymbols[currentCurrency];

    // Update each slider value display
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        const value = parseInt(slider.value);
        const display = slider.nextElementSibling;
        if (!display) return; // Skip if no display element found
        
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
    });
}

function updateEstimate() {
    // Get selected package and currency
    const selectedPackage = document.querySelector('input[name="packageType"]:checked');
    const currencyOption = document.querySelector('.currency-option.active');
    
    // Debug logging
    console.log('Selected package:', selectedPackage?.value);
    console.log('Selected currency:', currencyOption?.dataset.currency);

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

    // Enable/disable quote button based on package selection
    const quoteButton = document.querySelector('button[onclick="showQuote()"]');
    if (quoteButton) {
        quoteButton.disabled = !selectedPackage;
    }
}

// Currency selection
function initializeCurrency() {
    document.querySelectorAll('.currency-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            document.querySelectorAll('.currency-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            this.classList.add('active');
            
            // Update all prices on the page
            updateDisplayedPrices();
            updateSliderValues();
            updateEstimate();
        });
    });
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize currency selector
    initializeCurrency();

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

    // Set initial currency if none selected
    if (!document.querySelector('.currency-option.active')) {
        const gbpOption = document.querySelector('[data-currency="GBP"]');
        if (gbpOption) {
            gbpOption.classList.add('active');
            updateDisplayedPrices(); // Update initial prices
        }
    }

    // Initialize displays
    updateSliderValues();
    updateEstimate();

    // Add modal close handler
    const closeButton = document.querySelector('.modal .btn-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeQuote);
    }
});

function showQuote() {
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

    // Create the HTML content
    quoteContent.innerHTML = `
        <div class="quote-section">
            <h3>Selected Package</h3>
            <p>${packageName} Package - ${basePrice}</p>
        </div>
        <div class="quote-section">
            <h3>Additional Services</h3>
            <p>Total Additional Services: ${additionalPrice}</p>
        </div>
        <div class="quote-section">
            <h3>Total</h3>
            <p class="text-danger fw-bold fs-4">${totalPrice}</p>
        </div>
    `;

    // Show the modal using Bootstrap
    const modal = new bootstrap.Modal(quoteOverlay);
    modal.show();
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
    const currentCurrency = document.querySelector('.currency-option.active')?.dataset.currency;
    if (!currentCurrency) return;
    
    const rate = exchangeRates[currentCurrency];
    const symbol = currencySymbols[currentCurrency];

    // Update package prices
    const packages = {
        rare: 7500,
        epic: 10000,
        legendary: 15000,
        mythic: 20000
    };

    Object.entries(packages).forEach(([type, price]) => {
        const priceElement = document.querySelector(`.${type}-content .h5`);
        if (priceElement) {
            const convertedPrice = price * rate;
            priceElement.textContent = `${symbol}${convertedPrice.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            })}`;
        }
    });

    // Update service prices in labels
    const priceLabels = document.querySelectorAll('.text-muted.small span');
    priceLabels.forEach(label => {
        const priceMatch = label.textContent.match(/£(\d+,?\d*)/);
        if (priceMatch) {
            const price = parseInt(priceMatch[1].replace(',', ''));
            const convertedPrice = price * rate;
            label.textContent = label.textContent.replace(
                /£\d+,?\d*/, 
                `${symbol}${convertedPrice.toLocaleString()}`
            );
        }
    });
}

// ... other functions 