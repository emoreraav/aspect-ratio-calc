const preset = document.getElementById('preset');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const hzInput = document.getElementById('hz');
const bitsInput = document.getElementById('bits');
const colorspaceInput = document.getElementById('colorspace');
const ratioWInput = document.getElementById('ratioW');
const ratioHInput = document.getElementById('ratioH');
const cableInfo = document.getElementById('cableInfo');
const previewBox = document.getElementById('previewBox');
const previewText = document.getElementById('previewText');

function getGCD(a, b) {
    return b ? getGCD(b, a % b) : a;
}

function updateAll() {
    const w = parseInt(widthInput.value) || 1920;
    const h = parseInt(heightInput.value) || 1080;
    const hz = parseFloat(hzInput.value) || 60;
    const bits = parseInt(bitsInput.value) || 8;
    const colorspace = colorspaceInput.value;

    // 1. Aspect Ratio Calculation
    const common = getGCD(w, h);
    const rW = w / common;
    const rH = h / common;
    
    if (document.activeElement !== ratioWInput && document.activeElement !== ratioHInput) {
        ratioWInput.value = rW;
        ratioHInput.value = rH;
    }

    // 2. Connectivity Logic
    const colorMultiplier = bits / 8;
    const load = w * h * hz * colorMultiplier;

    let cable = "";
    if (load <= 2073600 * 60) {
        cable = "HDMI 1.4 / SDI 3G / DP 1.2";
    } else if (load <= 3840 * 2160 * 60) {
        if (colorspace === 'rec2020' || bits > 8) {
            cable = "HDMI 2.0a/b / SDI 12G / DP 1.4";
        } else {
            cable = "HDMI 2.0 / SDI 12G / DP 1.2";
        }
    } else {
        cable = "HDMI 2.1 / SDI 24G / DP 2.1";
    }
    cableInfo.innerText = cable;

    // 3. Scaled Preview
    const container = document.getElementById('previewContainer');
    const contW = container.clientWidth - 32;
    const contH = container.clientHeight - 32;

    const ratio = w / h;
    const containerRatio = contW / contH;

    if (ratio > containerRatio) {
        previewBox.style.width = `${contW}px`;
        previewBox.style.height = `${contW / ratio}px`;
    } else {
        previewBox.style.height = `${contH}px`;
        previewBox.style.width = `${contH * ratio}px`;
    }

    const csLabel = colorspaceInput.options[colorspaceInput.selectedIndex].text.split(' ')[0];
    previewText.innerText = `${w}x${h} | ${hz}Hz | ${bits}bit | ${csLabel}`;
}

// Preset Handler
preset.addEventListener('change', () => {
    const isCustom = preset.value === 'custom';
    const controls = [widthInput, heightInput, hzInput, bitsInput, colorspaceInput];
    
    controls.forEach(el => {
        el.readOnly = !isCustom;
        el.disabled = !isCustom;
        el.style.opacity = isCustom ? "1" : "0.5";
    });

    if (!isCustom) {
        const [w, h] = preset.value.split('x').map(Number);
        widthInput.value = w;
        heightInput.value = h;
        hzInput.value = "60";
        bitsInput.value = "8";
        colorspaceInput.value = (w >= 3840) ? "rec2020" : "rec709";
    }
    updateAll();
});

// Update Listeners
[widthInput, heightInput, hzInput, bitsInput, colorspaceInput].forEach(input => {
    input.addEventListener('input', updateAll);
    input.addEventListener('change', updateAll);
});

// Inverse Ratio Logic
ratioWInput.addEventListener('input', () => {
    if (preset.value === 'custom' && ratioWInput.value > 0) {
        heightInput.value = Math.round((widthInput.value * ratioHInput.value) / ratioWInput.value);
        updateAll();
    }
});

ratioHInput.addEventListener('input', () => {
    if (preset.value === 'custom' && ratioHInput.value > 0) {
        widthInput.value = Math.round((heightInput.value * ratioWInput.value) / ratioHInput.value);
        updateAll();
    }
});

window.onload = updateAll;
