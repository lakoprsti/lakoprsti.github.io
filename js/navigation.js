// Sample data structure
const sampleDocument = {
    id: 'f31c5848-6b06-4b1d-845d-b92eba7c320f',
    title: 'Crane',
    content: `<div data-chapter-style="modern" data-chapter-title="Crane" data-chapter-header="true" class="chapter-header">Crane</div><h1>Originally written in Dutch by Niels 't Hooft</h1><p>Translated to English by Jenny Watson</p><p>Copyright 2019</p><p><span style="color: rgb(52, 152, 219)" data-colorfade-start="52,152,219" data-colorfade-end="155,89,182" data-colorfade-pages="5">Below it is misty but Kevin peeks out above the cloud. His clean shaven chin gleams in the morning sun. He takes a deep breath, it is still so quiet, and he is about the break the silence.</span></p><p><span data-semantic-type="whisper" data-visual-effect="fade" data-semantic="true" class="semantic-element" data-fade-duration="3">He wraps his hands around the controls</span>, presses the <span data-semantic-type="dramatic" data-visual-effect="fade" data-semantic="true" class="semantic-element" data-fade-duration="2">pedals with his feet,</span> hears the familiar rattle of the winches. A facade element for a future office complex rises up; he allows the jib to come around in the direction of the scaffold where laborers are already waiting to receive his little package. <span data-color="#2c3e50" style="color: #2c3e50" data-delay="0" data-duration="1.5" data-fade-type="regular" data-fade="true" class="semantic-element">They wave to him, grinning.</span></p><p><span data-effect-type="rainbow" data-intensity="1" data-effect-color="#3b82f6" data-duration="2" data-text-effect="true" class="text-effect-element rainbow">Kevin is the best, he knows it</span>, and his boss says so too. He is precise, patient, quick. He is the first on every new tower crane that stretches a little higher and further, can lift more, the first to climb it, to steer it, to break it in. Other crane operators look up to him, literally and figuratively, and he feels good up there. He is fearless when it comes to heights, has impressive stamina. Can go for hours without a bathroom break. His head is empty, he loves that. His element is air and he is in his element.</p><div data-type="page-break" class="page-break"></div><p data-bg-fade-start="255,255,255" data-bg-fade-end="240,248,255" data-bg-fade-pages="3">Around eleven he gets his Thermos and lunch pail from his briefcase. There are colleagues that come down for lunch but he prefers eating up there. There are those that bring binoculars with them so that they can study the ants at ground level more closely, primarily the scantily clad on the balconies and in the backyards, he gets enough from the city itself, the outlines of the buildings, the layout of the streets. The forms, the patterns, the colors. He drinks coffee and eats peanut butter sandwiches and enjoys the overview.</p><p>In his headset he hears his boss clear his throat. 'Kevin,' he says, 'can you come down?'</p><p>Kevin wonders what this is about. His boss is a stickler for time, an announcement during dinner can only mean a couple of things. He takes off his headset, puts his helmet on, gets into the little lift, glides down the yellow mast with the last corner of sandwich in his hand. A new crane pops into his head, a new model must have been announced, and his boss wants to arrange a test drive for him. It must be something like that.</p><div data-type="page-break" class="page-break"></div><p data-bg-fade-start="240,248,255" data-bg-fade-end="255,240,245" data-bg-fade-pages="4">When he walks into the site office he knows immediately that he had it all wrong. His boss is clutching a thick envelope in both hands and eyeing it with suspicion. 'From a lawyer's office,' he says. 'Certified mail.'</p><p>Kevin shrugs.</p><p>'It's for you,' says his boss.</p><p>Kevin takes the envelope, rips it open, lets a pile of documents slide out. The logo of the law firm on the front page. His surname in the subject heading. A couple of measured paragraphs. The name of his wife. The text seems to swim, Kevin grabs the coffee machine for support, breathes through his nose.</p><p>'Do you want me to read it for you?' his boss asks.</p><div data-type="page-break" class="page-break"></div><p data-bg-fade-start="255,240,245" data-bg-fade-end="245,255,240" data-bg-fade-pages="2">The house is empty when he gets home. His wife has taken her things, she is staying with a friend. Their little boy is over there too, of course. Kevin orders Chinese and watches soccer, it is not much different to a normal weekday evening. But as he chases sleep he keeps seeing the little lift going down, himself walking into the site office.</p><p>Even so: once he is asleep he dreams of a sort of super tower crane. Kevin sits high above the city, sorting it. He puts all the churches together. The parks next to the parks. He raises the crane even higher and sorts entire cities. Higher still and he sorts countries. The world is divided up into clearly defined elements in bright colors. It feels good once everything is in its place.</p>`,
    created_at: '2025-07-14T12:11:44.442428+00:00',
    updated_at: '2025-07-17T11:03:57.329909+00:00',
    css: '{"wordSpacing":"normal","letterSpacing":"normal"}'
};

// State management
let currentDocument = null;
let currentPage = 1;
let totalPages = 1;
let pages = [];
let colorFadeElements = [];
let backgroundFadeElements = [];
let currentBackgroundColor = [255, 255, 255];

// Initialize
window.addEventListener('load', function() {
    setTimeout(() => {
        loadDocument(sampleDocument);
    }, 500);
});

// Fetch document function
async function fetchDocument() {
    const documentId = document.getElementById('documentId').value;
    const content = document.getElementById('content');
    
    content.innerHTML = '<div class="loading">Fetching document...</div>';
    
    try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (documentId === sampleDocument.id) {
            loadDocument(sampleDocument);
        } else {
            content.innerHTML = '<div class="error">Document not found. Try the sample ID: f31c5848-6b06-4b1d-845d-b92eba7c320f</div>';
        }
    } catch (error) {
        content.innerHTML = '<div class="error">Error fetching document: ' + error.message + '</div>';
    }
}

function loadDocument(doc) {
    currentDocument = doc;
    pages = splitIntoPages(doc.content);
    totalPages = pages.length;
    currentPage = 1;
    
    parseColorFadeElements();
    parseBackgroundFadeElements();
    displayCurrentPage();
    updatePageInfo();
    updateNavigationButtons();
    updateProgressBar();
}

function splitIntoPages(content) {
    const pageBreaks = content.split('<div data-type="page-break" class="page-break"></div>');
    return pageBreaks.filter(page => page.trim().length > 0);
}

function parseColorFadeElements() {
    colorFadeElements = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentDocument.content;
    
    const fadeElements = tempDiv.querySelectorAll('[data-colorfade-start]');
    fadeElements.forEach(element => {
        const startColor = element.getAttribute('data-colorfade-start').split(',').map(Number);
        const endColor = element.getAttribute('data-colorfade-end').split(',').map(Number);
        const pageSpan = parseInt(element.getAttribute('data-colorfade-pages')) || 1;
        
        colorFadeElements.push({
            startColor: startColor,
            endColor: endColor,
            pageSpan: pageSpan,
            startPage: currentPage
        });
    });
}

function parseBackgroundFadeElements() {
    backgroundFadeElements = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentDocument.content;
    
    const bgElements = tempDiv.querySelectorAll('[data-bg-fade-start]');
    bgElements.forEach((element, index) => {
        const startColor = element.getAttribute('data-bg-fade-start').split(',').map(Number);
        const endColor = element.getAttribute('data-bg-fade-end').split(',').map(Number);
        const pageSpan = parseInt(element.getAttribute('data-bg-fade-pages')) || 1;
        
        backgroundFadeElements.push({
            startColor: startColor,
            endColor: endColor,
            pageSpan: pageSpan,
            startPage: findPageOfElement(element)
        });
    });
}

function findPageOfElement(element) {
    const content = currentDocument.content;
    const elementHTML = element.outerHTML;
    const elementIndex = content.indexOf(elementHTML);
    
    let pageIndex = 0;
    let currentIndex = 0;
    
    for (let i = 0; i < pages.length; i++) {
        if (currentIndex + pages[i].length > elementIndex) {
            return i + 1;
        }
        currentIndex += pages[i].length;
    }
    
    return 1;
}

function displayCurrentPage() {
    const content = document.getElementById('content');
    content.innerHTML = pages[currentPage - 1] || '<div class="error">Page not found</div>';
    
    applyColorFadeEffects();
    applyTextFadeEffects();
    updateBackgroundColor();
}

function applyColorFadeEffects() {
    colorFadeElements.forEach(fadeConfig => {
        const elements = document.querySelectorAll(`[data-colorfade-start="${fadeConfig.startColor.join(',')}"]`);
        elements.forEach(element => {
            const progress = Math.min((currentPage - 1) / (fadeConfig.pageSpan - 1), 1);
            const interpolatedColor = interpolateColor(fadeConfig.startColor, fadeConfig.endColor, progress);
            element.style.color = `rgb(${interpolatedColor.join(',')})`;
        });
    });
}

function applyTextFadeEffects() {
    const fadeElements = document.querySelectorAll('[data-visual-effect="fade"]');
    fadeElements.forEach(element => {
        const duration = parseFloat(element.getAttribute('data-fade-duration')) || 1.5;
        const delay = parseFloat(element.getAttribute('data-delay')) || 0;
        
        element.style.opacity = '1';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transition = `opacity ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`;
            
            setTimeout(() => {
                element.style.opacity = '0.4';
            }, duration * 1000 + 3000);
        }, delay * 1000);
    });
}

function updateBackgroundColor() {
    const activeBgFade = backgroundFadeElements.find(bg => {
        const pageInRange = currentPage >= bg.startPage && currentPage < bg.startPage + bg.pageSpan;
        return pageInRange;
    });

    if (activeBgFade) {
        const progress = (currentPage - activeBgFade.startPage) / (activeBgFade.pageSpan - 1);
        const interpolatedColor = interpolateColor(activeBgFade.startColor, activeBgFade.endColor, progress);
        document.body.style.backgroundColor = `rgb(${interpolatedColor.join(',')})`;
    } else {
        const hue = (currentPage * 15) % 360;
        document.body.style.backgroundColor = `hsl(${hue}, 15%, 98%)`;
    }
}

function interpolateColor(color1, color2, factor) {
    const clampedFactor = Math.max(0, Math.min(1, factor));
    return [
        Math.round(color1[0] + (color2[0] - color1[0]) * clampedFactor),
        Math.round(color1[1] + (color2[1] - color1[1]) * clampedFactor),
        Math.round(color1[2] + (color2[2] - color1[2]) * clampedFactor)
    ];
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        displayCurrentPage();
        updatePageInfo();
        updateNavigationButtons();
        updateProgressBar();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayCurrentPage();
        updatePageInfo();
        updateNavigationButtons();
        updateProgressBar();
    }
}

function updatePageInfo() {
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
}

function updateNavigationButtons() {
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

function updateProgressBar() {
    const progress = (currentPage / totalPages) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

function resetEffects() {
    const fadeElements = document.querySelectorAll('.semantic-element');
    fadeElements.forEach(element => {
        element.style.opacity = '1';
        element.style.transition = 'opacity 0.3s ease';
    });
    
    document.body.style.backgroundColor = '#fafafa';
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'h') prevPage();
    if (e.key === 'ArrowRight' || e.key === 'l') nextPage();
    if (e.key === 'Home') {
        currentPage = 1;
        displayCurrentPage();
        updatePageInfo();
        updateNavigationButtons();
        updateProgressBar();
    }
    if (e.key === 'End') {
        currentPage = totalPages;
        displayCurrentPage();
        updatePageInfo();
        updateNavigationButtons();
        updateProgressBar();
    }
    if (e.key === 'r') resetEffects();
});