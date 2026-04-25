const preset = document.getElementById('preset');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const ratioWInput = document.getElementById('ratioW');
const ratioHInput = document.getElementById('ratioH');
const resultDisplay = document.getElementById('resultRatio');
const cableInfo = document.getElementById('cableInfo');

// Función MCD
function getGCD(a, b) {
    return b ? getGCD(b, a % b) : a;
}

// Lógica de Cables (Basada en ancho de banda aproximado)
function recommendCable(w, h) {
    const totalPixels = w * h;

    if (totalPixels <= 921600) { // 720p o menos
        return "HDMI 1.0+ / SDI (3G) / DP 1.0";
    } else if (totalPixels <= 2073600) { // 1080p
        return "HDMI 1.4 / SDI (6G) / DP 1.2";
    } else if (totalPixels <= 3686400) { // 2K
        return "HDMI 2.0 / DP 1.2";
    } else if (totalPixels <= 8294400) { // 4K
        return "HDMI 2.0+ / SDI (12G) / DP 1.4";
    } else { // 8K o más
        return "HDMI 2.1 / DP 2.0 / SDI (24G)";
    }
}

function updateAll() {
    const w = parseInt(widthInput.value);
    const h = parseInt(heightInput.value);

    if (w && h) {
        // Actualizar Ratio
        const common = getGCD(w, h);
        const rW = w / common;
        const rH = h / common;
        resultDisplay.innerText = `Ratio detectado: ${rW}:${rH}`;
        
        // Actualizar Sugerencia de Cable
        cableInfo.innerText = recommendCable(w, h);
    }
}

// Manejo de Presets
preset.addEventListener('change', () => {
    if (preset.value === 'custom') {
        widthInput.readOnly = false;
        heightInput.readOnly = false;
        widthInput.classList.remove('opacity-50');
        heightInput.classList.remove('opacity-50');
    } else {
        const [w, h] = preset.value.split('x');
        widthInput.value = w;
        heightInput.value = h;
        widthInput.readOnly = true;
        heightInput.readOnly = true;
        widthInput.classList.add('opacity-50');
        heightInput.classList.add('opacity-50');
        
        // Actualizar ratios automáticos al elegir preset
        const common = getGCD(w, h);
        ratioWInput.value = w / common;
        ratioHInput.value = h / common;
    }
    updateAll();
});

// Listeners para inputs manuales
widthInput.addEventListener('input', updateAll);
heightInput.addEventListener('input', updateAll);

// Lógica inversa: Si cambias el ratio, se ajusta la resolución (basado en el ancho actual)
ratioWInput.addEventListener('input', () => {
    if(widthInput.value && ratioWInput.value && ratioHInput.value) {
        heightInput.value = Math.round((widthInput.value * ratioHInput.value) / ratioWInput.value);
        updateAll();
    }
});

ratioHInput.addEventListener('input', () => {
    if(widthInput.value && ratioWInput.value && ratioHInput.value) {
        heightInput.value = Math.round((widthInput.value * ratioHInput.value) / ratioWInput.value);
        updateAll();
    }
});

// Inicializar
updateAll();
