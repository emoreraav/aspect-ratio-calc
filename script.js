// Referencias
const widthIn = document.getElementById('width');
const heightIn = document.getElementById('height');
const hzIn = document.getElementById('hz');
const bitsIn = document.getElementById('bits');
const csIn = document.getElementById('colorspace');
const rWIn = document.getElementById('ratioW');
const rHIn = document.getElementById('ratioH');

const cableText = document.getElementById('cableInfo');
const previewBox = document.getElementById('previewBox');
const previewText = document.getElementById('previewText');
const container = document.getElementById('previewContainer');

// Función de Máximo Común Divisor
function getGCD(a, b) {
    return b ? getGCD(b, a % b) : a;
}

function calculate() {
    // 1. Obtener valores
    const w = parseInt(widthIn.value) || 1920;
    const h = parseInt(heightIn.value) || 1080;
    const hz = parseFloat(hzIn.value);
    const bits = parseInt(bitsIn.value);

    // 2. Aspect Ratio (Simplificación)
    const gcd = getGCD(w, h);
    const aspectW = w / gcd;
    const aspectH = h / gcd;

    // Solo actualizamos si no estamos escribiendo en los ratios
    if (document.activeElement !== rWIn && document.activeElement !== rHIn) {
        rWIn.value = aspectW;
        rHIn.value = aspectH;
    }

    // 3. Visualizador
    const maxW = container.offsetWidth - 40;
    const maxH = container.offsetHeight - 40;
    
    const ratioRes = w / h;
    const ratioCont = maxW / maxH;

    if (ratioRes > ratioCont) {
        previewBox.style.width = maxW + "px";
        previewBox.style.height = (maxW / ratioRes) + "px";
    } else {
        previewBox.style.height = maxH + "px";
        previewBox.style.width = (maxH * ratioRes) + "px";
    }
    
    previewText.innerText = w + "x" + h;

    // 4. Cable
    const load = w * h * hz * (bits / 8);
    if (load <= 2073600 * 60) cableText.innerText = "HDMI 1.4 / SDI 3G";
    else if (load <= 8294400 * 60) cableText.innerText = "HDMI 2.0 / SDI 12G";
    else cableText.innerText = "HDMI 2.1 / DP 2.1";
}

// Listeners manuales para asegurar que se dispare
widthIn.oninput = calculate;
heightIn.oninput = calculate;
hzIn.onchange = calculate;
bitsIn.onchange = calculate;
csIn.onchange = calculate;

// Lógica inversa para los ratios
rWIn.oninput = () => {
    heightIn.value = Math.round((widthIn.value * rHIn.value) / rWIn.value);
    calculate();
};
rHIn.oninput = () => {
    widthIn.value = Math.round((heightIn.value * rWIn.value) / rHIn.value);
    calculate();
};

// Iniciar al cargar
window.onload = calculate;
