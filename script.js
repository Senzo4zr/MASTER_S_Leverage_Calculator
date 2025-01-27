function updateDefaults() {
    const capital = parseFloat(document.getElementById('capital').value);
    const marginInput = document.getElementById('margin');
    const marginSlider = document.getElementById('marginSlider');
    const riskSlider = document.getElementById('riskSlider');
    const stoplossInput = document.getElementById('stoploss');
    const calculateButton = document.getElementById('calculateButton');
    const riskInput = document.getElementById('risk');

    marginSlider.value = 0;
    marginInput.value = '';
    document.getElementById('marginPercentageDisplay').textContent = '0%';
    document.getElementById('error').style.display = 'none';

    if (!isNaN(capital) && capital > 0) {
        marginInput.disabled = false;
        marginSlider.disabled = false;
        stoplossInput.disabled = false;
        calculateButton.disabled = false;
        riskInput.disabled = false;
        riskSlider.disabled = false;
    } else {
        marginInput.disabled = true;
        marginSlider.disabled = true;
        riskInput.disabled = true;
        riskSlider.disabled = true;
        stoplossInput.disabled = true;
        calculateButton.disabled = true;
    }
}

function updateMarginFromSlider() {
    const capital = parseFloat(document.getElementById('capital').value);
    const marginSliderValue = document.getElementById('marginSlider').value;
    const marginInput = document.getElementById('margin');
    const marginPercentageDisplay = document.getElementById('marginPercentageDisplay');
    
    if (!isNaN(capital) && capital > 0) {
        const margin = (capital * (marginSliderValue / 100)).toFixed(2);
        marginInput.value = margin;
        marginPercentageDisplay.textContent = `${marginSliderValue}%`;
        updateRiskDefaultsFromMargin(margin);
    } else {
        marginInput.value = 0;
    }

    enableRisk();
}

function updateMarginSliderFromManual() {
    const capital = parseFloat(document.getElementById('capital').value);
    const marginInputValue = parseFloat(document.getElementById('margin').value);
    const marginSlider = document.getElementById('marginSlider');
    
    if (!isNaN(marginInputValue) && marginInputValue >= 0 && capital > 0) {
        const marginPercentage = Math.min((marginInputValue / capital) * 100, 100).toFixed(2);
        marginSlider.value = marginPercentage;
        document.getElementById('marginPercentageDisplay').textContent = `${marginPercentage}%`;
        updateRiskDefaultsFromMargin(marginInputValue);
    }

    enableRisk();
}

function enableRisk() {
    const margin = parseFloat(document.getElementById('margin').value);
    const riskInput = document.getElementById('risk');
    const riskSlider = document.getElementById('riskSlider');
    if (!isNaN(margin) && margin > 0) {
        riskInput.disabled = false;
        riskSlider.disabled = false;
    } else {
        riskInput.disabled = true;
        riskSlider.disabled = true;
    }
}

function updateRiskDefaultsFromMargin(margin) {
    const riskSlider = document.getElementById('riskSlider');
    const riskInput = document.getElementById('risk');
    const defaultRisk = (margin * 0.5).toFixed(2);
    riskSlider.value = 50;
    riskInput.value = defaultRisk;
    document.getElementById('riskPercentageDisplay').textContent = '50%';
}

function updateRiskFromSlider() {
    const margin = parseFloat(document.getElementById('margin').value);
    const riskSliderValue = document.getElementById('riskSlider').value;
    const riskInput = document.getElementById('risk');
    const riskPercentageDisplay = document.getElementById('riskPercentageDisplay');
    
    if (!isNaN(margin) && margin > 0) {
        const risk = (margin * (riskSliderValue / 100)).toFixed(2);
        riskInput.value = risk;
        riskPercentageDisplay.textContent = `${riskSliderValue}%`;
    } else {
        riskInput.value = 0;
    }
}

function updateRiskSliderFromManual() {
    const margin = parseFloat(document.getElementById('margin').value);
    const riskInputValue = parseFloat(document.getElementById('risk').value);
    const riskSlider = document.getElementById('riskSlider');
    
    if (!isNaN(riskInputValue) && riskInputValue >= 0 && margin > 0) {
        const riskPercentage = Math.min((riskInputValue / margin) * 100, 100).toFixed(2);
        riskSlider.value = riskPercentage;
        document.getElementById('riskPercentageDisplay').textContent = `${riskPercentage}%`;
    }
}

function calculate() {
    const capital = parseFloat(document.getElementById('capital').value);
    let margin = parseFloat(document.getElementById('margin').value);
    let risk = parseFloat(document.getElementById('risk').value);
    const stopLossPercent = parseFloat(document.getElementById('stoploss').value) / 100;

    const errorElement = document.getElementById('error');
    const outputElement = document.getElementById('output');
    const safeLeverageElement = document.getElementById('safe-leverage');
    outputElement.style.color = '';
    outputElement.innerHTML = 'Leverage = ?';
    safeLeverageElement.innerHTML = '';
    safeLeverageElement.style.display = 'none';  // Hide by default

    // Validate inputs
    if (isNaN(capital) || capital <= 0 || isNaN(margin) || margin <= 0 || isNaN(risk) || risk <= 0 || isNaN(stopLossPercent) || stopLossPercent <= 0) {
        errorElement.style.display = 'block';
        return;
    }

    errorElement.style.display = 'none';

    const leverage = Math.floor(risk / (margin * stopLossPercent));

    if (leverage < 1) {
        outputElement.innerHTML = `<strong>Leverage = ${leverage}X</strong><br><small>No leverage is required if the leverage is less than 1X. Consider revising your margin or risk settings.</small>`;
        outputElement.style.color = '#f6ad55';
        return;
    }

    outputElement.innerHTML = `<strong>Leverage = ${leverage}X</strong>`;

    const actualLoss = margin * leverage * stopLossPercent;
    if (actualLoss > capital * 0.05) {
        outputElement.style.color = '#dc2626';
        const dangerSign = document.createElement('span');
        dangerSign.id = 'danger-sign';
        dangerSign.innerHTML = '💥';
        outputElement.appendChild(dangerSign);

        const safeLeverage = Math.floor((capital * 0.05) / (margin * stopLossPercent));
        
        if (safeLeverage <= 1) {
            safeLeverageElement.innerHTML = `Warning: Safe leverage is less than or equal to 1X. Please reduce your margin to keep the trade safe.`;
            safeLeverageElement.style.color = '#dc2626';
            safeLeverageElement.style.display = 'block';  // Show when needed
        } 
    }
}
