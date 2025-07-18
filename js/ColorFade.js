// function generateRgbGradient(startRGB, endRGB, steps) {
//   const stepFactor = 1 / (steps - 1);
//   const gradient = [];

//   for (let i = 0; i < steps; i++) {
//     const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * (i * stepFactor));
//     const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * (i * stepFactor));
//     const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * (i * stepFactor));
//     gradient.push({ r, g, b });
//   }

//   return gradient;
// }

// // Example usage:
// const startRGB = { r: 128, g: 0, b: 128 }; // Purple
// const endRGB = { r: 0, g: 0, b: 255 };     // Blue

// const RGBgradient = generateRgbGradient(startRGB, endRGB, 10);
// console.log(gradient);


// function interpolateColor(color1, color2, factor) {
//   const result = color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
//   return result;
// }


function interpolateColor(color1, color2, factor) {
  return color1.map((c, i) =>
    Math.round(c + factor * (color2[i] - c))
  );
}

function rgbArrayToString(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function hexToRgb(hex) {
  if (Array.isArray(hex)) return hex; // already rgb
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  const bigint = parseInt(hex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

/**
 * Sets background gradient color based on current page index.
 * @param {number[]} startColor - RGB array, e.g., [128, 0, 128]
 * @param {number[]} endColor - RGB array, e.g., [0, 0, 255]
 * @param {number} totalPages - total steps/pages in the gradient
 * @param {number} currentPage - current page index (0-based)
 */
function applyGradientBackground(startColor, endColor, totalPages, currentPage) {
  if (currentPage < 0 || currentPage >= totalPages) {
    console.warn('Page index out of range');
    return;
  }
  // Accept hex or rgb array
  const rgbStart = hexToRgb(startColor);
  const rgbEnd = hexToRgb(endColor);
  const factor = totalPages <= 1 ? 0 : currentPage / (totalPages - 1);
  const interpolated = interpolateColor(rgbStart, rgbEnd, factor);
  document.body.style.backgroundColor = rgbArrayToString(interpolated);
}


/////////////////////////////////////

// function hexToRgb(hex) {
//   const bigint = parseInt(hex.replace('#', ''), 16);
//   return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
// }

// function rgbToHex([r, g, b]) {
//   return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
// }

// function interpolateColor(fromRGB, toRGB, t) {
//   return fromRGB.map((c, i) => Math.round(c + t * (toRGB[i] - c)));
// }


