const config = {
    speed: 0.5,           // default 0.5 (lebih lambat)
    scale: 1.0,
    color: '#650d65',
    noiseIntensity: 1.0,
    rotation: 0.0,
    isPlaying: true
};

const canvas = document.getElementById('silkCanvas');
const ctx = canvas.getContext('2d');
let time = 0;

// konversi hex -> rgb
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
}

function noise(x, y) {
    return Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1;
}

function rotate(x, y, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return { x: x * cos - y * sin, y: x * sin + y * cos };
}

function drawSilk() {
    const width = canvas.width;
    const height = canvas.height;

    // render dengan resolusi lebih rendah biar ringan
    const renderW = Math.floor(width / 2);
    const renderH = Math.floor(height / 2);

    const imageData = ctx.createImageData(renderW, renderH);
    const data = imageData.data;
    const rgb = hexToRgb(config.color);

    for (let y = 0; y < renderH; y++) {
        for (let x = 0; x < renderW; x++) {
            const nx = x / renderW;
            const ny = y / renderH;

            const rotated = rotate(nx - 0.5, ny - 0.5, config.rotation);
            const tx = rotated.x + 0.5;
            const ty = rotated.y + 0.5;
            const sx = tx * config.scale;
            const sy = ty * config.scale;

            const tOffset = config.speed * time / 100;

            const waveY = 0.03 * Math.sin(8.0 * sx - tOffset);
            const patternY = sy + waveY;

            let pattern = 0.6 + 0.4 * Math.sin(
                5.0 * (sx + patternY +
                       Math.cos(3.0 * sx + 5.0 * patternY) +
                       0.02 * tOffset) +
                Math.sin(20.0 * (sx + patternY - 0.1 * tOffset))
            );

            const rnd = noise(x, y);
            pattern -= rnd / 15.0 * config.noiseIntensity;

            const idx = (y * renderW + x) * 4;
            data[idx]     = rgb.r * pattern;
            data[idx + 1] = rgb.g * pattern;
            data[idx + 2] = rgb.b * pattern;
            data[idx + 3] = 255;
        }
    }

    // scale up biar tetap isi layar penuh
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = renderW;
    tempCanvas.height = renderH;
    tempCanvas.getContext("2d").putImageData(imageData, 0, 0);

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(tempCanvas, 0, 0, width, height);

    if (config.isPlaying) {
        time += 8; // lebih kecil dari 16 → lebih halus & ringan
    }

    requestAnimationFrame(drawSilk);
}

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();
drawSilk();
