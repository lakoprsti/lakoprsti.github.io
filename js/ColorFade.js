
function hexToRgb(hex) {
  const bigint = parseInt(hex.replace('#',''), 16);
  return [ (bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255 ];
}

function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

function interpolateColor(color1, color2, factor) {
  const result = color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
  return result;
}

function applyColorGradient(startId, endId, fromColor = "#ff0000", toColor = "#0000ff") {
  const startEl = document.getElementById(startId);
  const endEl = document.getElementById(endId);
  if (!startEl || !endEl) return;

  const parent = startEl.parentNode;
  const nodes = Array.from(parent.childNodes);

  // Track whether we are between start and end
  let inRange = false;
  let words = [];

  nodes.forEach((node) => {
    if (node === startEl) {
      inRange = true;
      words.push(node);
      return;
    }
    if (node === endEl) {
      words.push(node);
      inRange = false;
      return;
    }

    if (inRange) {
      if (node.nodeType === 3) {
        // Text node — split into words
        const wordNodes = node.textContent.split(/(\s+)/).map(word => {
          const span = document.createElement("span");
          span.textContent = word;
          return span;
        });
        wordNodes.forEach(span => {
          parent.insertBefore(span, node);
          words.push(span);
        });
        parent.removeChild(node);
      } else {
        words.push(node);
      }
    }
  });

  // Colorize each word
  const fromRGB = hexToRgb(fromColor);
  const toRGB = hexToRgb(toColor);

  words.forEach((el, i) => {
    const t = i / (words.length - 1);
    const rgb = interpolateColor(fromRGB, toRGB, t);
    el.style.color = rgbToHex(rgb);
  });
}

/////////////////////////////////////

function hexToRgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

function interpolateColor(fromRGB, toRGB, t) {
  return fromRGB.map((c, i) => Math.round(c + t * (toRGB[i] - c)));
}


