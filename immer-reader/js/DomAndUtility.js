function wrapWordsBetween(startEl, endEl) {
  const parent = startEl.parentNode;
  const nodes = Array.from(parent.childNodes);
  const inRangeNodes = [];

  let inRange = false;

  nodes.forEach(node => {
    if (node === startEl) {
      inRange = true;
      inRangeNodes.push(node);
      return;
    }
    if (node === endEl) {
      inRangeNodes.push(node);
      inRange = false;
      return;
    }
    if (!inRange) return;

    if (node.nodeType === 3) {
      const wordNodes = node.textContent.split(/(\s+)/).map(word => {
        const span = document.createElement("span");
        span.textContent = word;
        return span;
      });
      wordNodes.forEach(span => {
        parent.insertBefore(span, node);
        inRangeNodes.push(span);
      });
      parent.removeChild(node);
    } else {
      inRangeNodes.push(node);
    }
  });

  return inRangeNodes;
}

function countPageBreaks(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const pageBreaks = doc.querySelectorAll('div[data-type="page-break"].page-break');
  return pageBreaks.length;
}

const numPageBreaks = countPageBreaks(content);
console.log('Page breaks:', numPageBreaks);

function splitPages(html) {
  // Replace page breaks with a unique marker
  const marker = '###PAGE_BREAK###';
  const contentWithMarkers = html.replace(/<div[^>]*data-type=["']page-break["'][^>]*><\/div>/gi, marker);

  // Split by marker
  return contentWithMarkers.split(marker);
}

const content = `...`; // your full HTML string
const pages = splitPages(content);
let currentPageIndex = 0;

// Container element where page content will be displayed
const container = document.getElementById('page-container');

// Show page and apply custom logic
function renderPage(index) {
  if (index < 0 || index >= pages.length) return;
  currentPageIndex = index;
  container.innerHTML = pages[index];

  // Example: apply gradient based on page index
  applyGradientBackground(
    [128, 0, 128], // start color
    [0, 0, 255],   // end color
    pages.length,
    currentPageIndex
  );
}

// Navigation handlers
document.getElementById('next').addEventListener('click', () => {
  if (currentPageIndex < pages.length - 1) {
    renderPage(currentPageIndex + 1);
  }
});

document.getElementById('prev').addEventListener('click', () => {
  if (currentPageIndex > 0) {
    renderPage(currentPageIndex - 1);
  }
});

// Initial render
renderPage(0);

function updateURL(index) {
  history.replaceState(null, '', `?page=${index}`);
}

function getPageFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('page')) || 0;
}

// On load:
renderPage(getPageFromURL());

function generateHTMLFromQuery(data) {
  const { title, content } = data;

  // Split content into pages using the page break marker
  const pageChunks = content.split(/<div[^>]*class="page-break"[^>]*><\/div>/i);

  // Create page HTML blocks
  const positions = ['top', 'middle', 'bottom'];
  const pagesHTML = pageChunks.map((chunk, i) => {
    const position = positions[i % positions.length];
    return `
      <div class="page" id="page-${i + 1}" data-fade-duration="3.5" data-position="${position}">
        <div class="text-chunk">
          ${chunk}
          <div class="break-marker"></div>
        </div>
      </div>
    `;
  }).join('\n');

  // Final full HTML output
  const fullHTML = `
<!doctype html>
<html class="no-js" lang="">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="css/style.css">
  <meta name="description" content="">
  <meta property="og:title" content="${title}">
  <meta property="og:type" content="">
  <meta property="og:url" content="">
  <meta property="og:image" content="">
  <meta property="og:image:alt" content="">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="icon.png">
  <link rel="manifest" href="site.webmanifest">
  <meta name="theme-color" content="#fafafa">
</head>
<body>
  <div class="book-container">
    <div class="book-content">
      ${pagesHTML}
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
    </div>
    <script src="js/navigation.js"></script>
  </div>
</body>
</html>
`;

  return fullHTML;
}
