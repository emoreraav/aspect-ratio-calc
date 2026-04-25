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
const previewContainer = document.getElementById('previewContainer');

function getGCD(a, b) {
    return b ? getGCD(b, a % b) : a;
}

function updateAll() {
    // Tomamos los valores o ponemos 1 por defecto para evitar divisiones por cero
    const w = parseInt(widthInput.value) || 1;
    const h = parseInt(heightInput.value) || 1;
    const hz = parseFloat(hzInput.value) || 60;
    const bits = parseInt(bitsInput.value) || 8;
    const colorspace = colorspaceInput.value;

    // 1. Calcular Aspect Ratio automáticamente
    const common = getGCD(w, h);
    const rW = w / common;
    const rH = h / common;
    
    // Solo actualiza los campos de ratio si el usuario no los está tocando
    if (document.activeElement !== ratioWInput && document.activeElement !== ratioHInput) {
        ratioWInput.value = rW;
        ratioHInput.value = rH;
    }

    // 2. Recomendación de Conexión
    const load = w * h * hz * (bits / 8);
    if (load <= 1920 * 1080 * 60) {
        cableInfo.innerText = "HDMI 1.4 / SDI 3G / DP 1.2";
    } else if (load <= 3840 * 2160 * 60) {
        cableInfo.innerText = (bits > 8 || colorspace === 'rec2020') ? "HDMI 2.0a/b / SDI 12G / DP 1.4" : "HDMI 2.0 / SDI 12G / DP 1.2";
    } else {
        cableInfo.innerText = "HDMI 2.1 / SDI 24G / DP 2.1";
    }

    // 3. Dibujar el Visualizador
    const contW = previewContainer.clientWidth - 40;
    const contH = previewContainer.clientHeight - 40;
    const resRatio = w / h;
    const containerRatio = contW / contH;

    if (resRatio > containerRatio) {
        previewBox.style.width = `${contW}px`;
        previewBox.style.height = `${contW / resRatio}px`;
    } else {
        previewBox.style.height = `${contH}px`;
        previewBox.style.width = `${contH * resRatio}px`;
    }

    previewText.innerText = `${w}x${h} | ${hz}Hz | ${bits}bit`;
}

// Escuchar cambios en todos los inputs
[widthInput, heightInput, hzInput, bitsInput, colorspaceInput].forEach(el => {
    el.addEventListener('input', updateAll);
    el.addEventListener('change', updateAll);
});

// Lógica Inversa: Si cambias el Ratio, se calcula la Resolución
ratioWInput.addEventListener('input', () => {
    if (ratioWInput.value > 0) {
        heightInput.value = Math.round((widthInput.value * ratioHInput.value) / ratioWInput.value);
        updateAll();
    }
});

ratioHInput.addEventListener('input', () => {
    if (ratioHInput.value > 0) {
        widthInput.value = Math.round((heightInput.value * ratioWInput.value) / ratioHInput.value);
        updateAll();
    }
});

// Arrancar al cargar la página
window.addEventListener('load', updateAll);
// También al redimensionar la ventana para que el visualizador no se rompa
window.addEventListener('resize', updateAll);
