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
    const w = parseInt(widthInput.value) || 1;
    const h = parseInt(heightInput.value) || 1;
    const hz = parseInt(hzInput.value) || 60;

    // 1. Calcular y poner Ratio automáticamente
    const common = getGCD(w, h);
    const rW = w / common;
    const rH = h / common;
    
    // Solo actualizamos si el usuario NO está escribiendo en el ratio
    if (document.activeElement !== ratioWInput && document.activeElement !== ratioHInput) {
        ratioWInput.value = rW;
        ratioHInput.value = rH;
    }

    // 2. Cable Sugerido
    const load = w * h * hz;
    if (load <= 2073600 * 60) cableInfo.innerText = "HDMI 1.4 / SDI 3G";
    else if (load <= 8294400 * 60) cableInfo.innerText = "HDMI 2.0 / SDI 12G / DP 1.4";
    else cableInfo.innerText = "HDMI 2.1 / DP 2.1 (8K Ready)";

    // 3. Previsualización (Ajuste de escala)
    const maxPerc = 90; // La caja ocupará máximo el 90% del contenedor
    if (w >= h) {
        previewBox.style.width = `${maxPerc}%`;
        previewBox.style.height = `${(h / w) * maxPerc}%`;
    } else {
        previewBox.style.height = `${maxPerc}%`;
        previewBox.style.width = `${(w / h) * maxPerc}%`;
    }
    previewText.innerText = `${w} x ${h}`;
}

// Evento para los Presets
preset.addEventListener('change', () => {
    const isCustom = preset.value === 'custom';
    
    // Desbloquear/Bloquear
    [widthInput, heightInput, hzInput].forEach(el => {
        el.readOnly = !isCustom;
        el.disabled = !isCustom;
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

// Eventos de cambios manuales
widthInput.addEventListener('input', updateAll);
heightInput.addEventListener('input', updateAll);
hzInput.addEventListener('change', updateAll);

// Lógica para que al cambiar el RATIO cambie la resolución (Solo en Custom)
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

// Ejecutar al cargar para que no aparezca vacío
updateAll();
