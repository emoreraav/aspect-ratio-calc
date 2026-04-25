const preset = document.getElementById('preset');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const hzInput = document.getElementById('hz');
const ratioWInput = document.getElementById('ratioW');
const ratioHInput = document.getElementById('ratioH');
const resultDisplay = document.getElementById('resultRatio');
const cableInfo = document.getElementById('cableInfo');
const previewBox = document.getElementById('previewBox');
const previewText = document.getElementById('previewText');

// --- UTILIDADES ---

// Máximo Común Divisor (Para simplificar el ratio)
function getGCD(a, b) {
    return b ? getGCD(b, a % b) : a;
}

// Lógica de recomendación de cables basada en ancho de banda aproximado
function recommendCable(w, h, hz) {
    const pixelsPerSecond = w * h * hz;
    
    // Umbrales aproximados
    const limitHDMI14 = 1920 * 1080 * 120; // 1080p 120Hz o 4K 30Hz
    const limitHDMI20 = 3840 * 2160 * 60;  // 4K 60Hz
    const limitHDMI21 = 7680 * 4320 * 60;  // 8K 60Hz o 4K 120Hz

    if (pixelsPerSecond <= limitHDMI14) {
        return "HDMI 1.4 / DP 1.2 / SDI 3G";
    } else if (pixelsPerSecond <= limitHDMI20) {
        return "HDMI 2.0 / DP 1.4 / SDI 12G";
    } else if (pixelsPerSecond <= limitHDMI21) {
        return "HDMI 2.1 / DP 1.4 (DSC) / SDI 24G";
    } else {
        return "HDMI 2.1 (Ultra High Speed) / DP 2.1";
    }
}

// --- ACTUALIZACIONES DE UI ---

function updateAll() {
    const w = parseInt(widthInput.value) || 0;
    const h = parseInt(heightInput.value) || 0;
    const hz = parseInt(hzInput.value);

    if (w > 0 && h > 0) {
        // 1. Calcular Ratio
        const common = getGCD(w, h);
        const rW = w / common;
        const rH = h / common;
        
        // Solo actualizamos los campos de ratio si no están siendo enfocados por el usuario
        if (document.activeElement !== ratioWInput && document.activeElement !== ratioHInput) {
            ratioWInput.value = rW;
            ratioHInput.value = rH;
        }
        resultDisplay.innerText = `Ratio: ${rW}:${rH}`;

        // 2. Recomendación de Cable
        cableInfo.innerText = recommendCable(w, h, hz);

        // 3. Vista Previa Visual
        const containerSize = 90; // ocupará el 90% del espacio disponible
        if (w >= h) {
            previewBox.style.width = `${containerSize}%`;
            previewBox.style.height = `${(h / w) * containerSize}%`;
        } else {
            previewBox.style.height = `${containerSize}%`;
            previewBox.style.width = `${(w / h) * containerSize}%`;
        }
        previewText.innerText = `${w}x${h} @${hz}Hz`;
    }
}

// --- EVENTOS ---

// Cambio de Presets
preset.addEventListener('change', () => {
    const isCustom = preset.value === 'custom';
    
    widthInput.readOnly = !isCustom;
    heightInput.readOnly = !isCustom;
    hzInput.disabled = !isCustom;

    const inputs = [widthInput, heightInput, hzInput];
    inputs.forEach(el => {
        if (isCustom) el.classList.remove('opacity-50');
        else el.classList.add('opacity-50');
    });

    if (!isCustom) {
        const [w, h] = preset.value.split('x');
        widthInput.value = w;
        heightInput.value = h;
        hzInput.value = "60";
    }
    updateAll();
});

// Input Manual de Resoluciones
widthInput.addEventListener('input', updateAll);
heightInput.addEventListener('input', updateAll);
hzInput.addEventListener('change', updateAll);

// Lógica Inversa (Si el usuario cambia el ratio manualmente en modo Custom)
ratioWInput.addEventListener('input', () => {
    if (preset.value === 'custom' && ratioWInput.value && ratioHInput.value && widthInput.value) {
        heightInput.value = Math.round((widthInput.value * ratioHInput.value) / ratioWInput.value);
        updateAll();
    }
});

ratioHInput.addEventListener('input', () => {
    if (preset.value === 'custom' && ratioWInput.value && ratioHInput.value && heightInput.value) {
        widthInput.value = Math.round((heightInput.value * ratioWInput.value) / ratioHInput.value);
        updateAll();
    }
});

// Inicialización
updateAll();
