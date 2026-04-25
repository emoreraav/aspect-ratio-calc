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
    const w = parseInt(widthInput.value) || 0;
    const h = parseInt(heightInput.value) || 0;
    const hz = parseFloat(hzInput.value) || 0;
    const bits = parseInt(bitsInput.value) || 8;
    const colorspace = colorspaceInput.value;

    if (w > 0 && h > 0) {
        // 1. Aspect Ratio Calculation
        const common = getGCD(w, h);
        const rW = w / common;
        const rH = h / common;
        
        // Update ratio boxes only if the user is not manually typing in them
        if (document.activeElement !== ratioWInput && document.activeElement !== ratioHInput) {
            ratioWInput.value = rW;
            ratioHInput.value = rH;
        }

        // 2. Connectivity Logic (Data Load Calculation)
        const colorMultiplier = bits / 8;
        const dataLoad = w * h * hz * colorMultiplier;

        let cable = "";
        if (dataLoad <= 1920 * 1080 * 60) {
            cable = "HDMI 1.4 / SDI 3G / DP 1.2";
        } else if (dataLoad <= 3840 * 2160 * 60) {
            if (colorspace === 'rec2020' || bits > 8) {
                cable = "HDMI 2.0a/b / SDI 12G / DP 1.4";
            } else {
                cable = "HDMI 2.0 / SDI 12G / DP 1.2";
            }
        } else if (dataLoad <= 7680 * 4320 * 60) {
            cable = "HDMI 2.1 / SDI 24G / DP 1.4 (DSC)";
        } else {
            cable = "HDMI 2.1 (Ultra High Speed) / DP 2.1";
        }
        cableInfo.innerText = cable;

        // 3. Scaled Preview Box
        const container = document.getElementById('previewContainer');
        const contW = container.clientWidth - 40;
        const contH = container.clientHeight - 40;

        const ratio = w / h;
        const containerRatio = contW / contH;

        if (ratio > containerRatio) {
            previewBox.style.width = `${contW}px`;
            previewBox.style.height = `${contW / ratio}px`;
        } else {
            previewBox.style.height = `${contH}px`;
            previewBox.style.width = `${contH * ratio}px`;
        }

        // Update Text Info
        const csLabel = colorspaceInput.options[colorspaceInput.selectedIndex].text;
        previewText.innerText = `${w}x${h} | ${hz}Hz | ${bits}bit | ${csLabel}`;
    }
}

// Event Listeners for all inputs
[widthInput, heightInput, hzInput, bitsInput, colorspaceInput].forEach(input => {
    input.addEventListener('input', updateAll);
    input.addEventListener('change', updateAll);
});

// Inverse Ratio Logic: Change Ratio -> Resolution updates
ratioWInput.addEventListener('input', () => {
    if (ratioWInput.value > 0 && ratioHInput.value > 0 && widthInput.value > 0) {
        heightInput.value = Math.round((widthInput.value * ratioHInput.value) / ratioWInput.value);
        updateAll();
    }
});

ratioHInput.addEventListener('input', () => {
    if (ratioHInput.value > 0 && ratioWInput.value > 0 && heightInput.value > 0) {
        widthInput.value = Math.round((heightInput.value * ratioWInput.value) / ratioHInput.value);
        updateAll();
    }
});

// Initial boot
window.onload = updateAll;
