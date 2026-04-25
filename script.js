const preset = document.getElementById('preset');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const hzInput = document.getElementById('hz');
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
    const hz = parseInt(hzInput.value) || 60;

    // 1. Calcular Aspect Ratio
    const common = getGCD(w, h);
    const rW = w / common;
    const rH = h / common;
    
    if (document.activeElement !== ratioWInput && document.activeElement !== ratioHInput) {
        ratioWInput.value = rW;
        ratioHInput.value = rH;
    }

    // 2. Lógica de Cable (Corregida)
    const totalPixels = w * h * hz;
    const fhd60 = 1920 * 1080 * 60;
    const uHD60 = 3840 * 2160 * 60;

    if (totalPixels <= fhd60) {
        cableInfo.innerText = "HDMI 1.4 / SDI 3G / DP 1.2";
    } else if (totalPixels <= uHD60) {
        cableInfo.innerText = "HDMI 2.0 / SDI 12G / DP 1.4";
    } else {
        cableInfo.innerText = "HDMI 2.1 / DP 2.1 / SDI 24G";
    }

    // 3. VISTA PREVIA (Lógica de escalado basada en pixeles reales)
    const container = document.getElementById('previewContainer');
    const contW = container.clientWidth - 40; // Margen de seguridad
    const contH = container.clientHeight - 40;

    const ratio = w / h;
    const containerRatio = contW / contH;

    if (ratio > containerRatio) {
        // La resolución es más ancha que el contenedor
        previewBox.style.width = `${contW}px`;
        previewBox.style.height = `${contW / ratio}px`;
    } else {
        // La resolución es más alta que el contenedor
        previewBox.style.height = `${contH}px`;
        previewBox.style.width = `${contH * ratio}px`;
    }

    previewText.innerText = `${w} x ${h} (${rW}:${rH})`;
}

// Control de Presets
preset.addEventListener('change', () => {
    const isCustom = preset.value === 'custom';
    [widthInput, heightInput, hzInput].forEach(el => {
        el.readOnly = !isCustom;
        el.disabled = !isCustom;
        el.style.opacity = isCustom ? "1" : "0.5";
    });

    if (!isCustom) {
        const [w, h] = preset.value.split('x').map(Number);
        widthInput.value = w;
        heightInput.value = h;
        hzInput.value = "60";
    }
    updateAll();
});

// Eventos manuales
widthInput.addEventListener('input', updateAll);
heightInput.addEventListener('input', updateAll);
hzInput.addEventListener('change', updateAll);

// Lógica de Ratio -> Resolución
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

// Forzar renderizado inicial
window.onload = updateAll;
